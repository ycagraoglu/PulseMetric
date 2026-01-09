using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Analytics.API.Data.Repositories;
using Analytics.API.Models;
using Analytics.API.Models.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Analytics.API.Services;

/// <summary>
/// Authentication servisi.
/// JWT token oluşturma, doğrulama ve kullanıcı yönetimi.
/// SRP: Authentication iş mantığı sorumluluğu.
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtSettings _jwtSettings;
    private readonly ILogger<AuthService> _logger;

    #region Constants

    // Production'da bu değer configuration'dan alınmalı
    private const string PasswordSalt = "PulseMetricSecureSalt2024!";
    private const string DefaultRole = "Admin";
    private const int TenantIdLength = 16;
    private const int RefreshTokenBytes = 64;

    #endregion

    public AuthService(
        IUserRepository userRepository,
        IOptions<JwtSettings> jwtSettings,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _jwtSettings = jwtSettings.Value;
        _logger = logger;
    }

    #region Public Methods - Authentication

    public async Task<(bool Success, string Message, AuthResponse? Response)> RegisterAsync(RegisterRequest request)
    {
        // Email kontrolü
        if (await _userRepository.ExistsAsync(request.Email))
            return Failure("Bu email adresi zaten kayıtlı");

        // Yeni kullanıcı oluştur
        var user = CreateUser(request);
        await _userRepository.CreateAsync(user);

        _logger.LogInformation("Yeni kullanıcı kaydedildi: {Email}", user.Email);

        var response = await GenerateAuthResponseAsync(user);
        return Success("Kayıt başarılı", response);
    }

    public async Task<(bool Success, string Message, AuthResponse? Response)> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);

        // Validasyonlar
        if (user == null)
            return Failure("Email veya şifre hatalı");

        if (!user.IsActive)
            return Failure("Hesabınız devre dışı bırakılmış");

        if (!VerifyPassword(request.Password, user.PasswordHash))
            return Failure("Email veya şifre hatalı");

        // Son giriş zamanını güncelle
        await UpdateLastLoginAsync(user);

        _logger.LogInformation("Kullanıcı giriş yaptı: {Email}", user.Email);

        var response = await GenerateAuthResponseAsync(user);
        return Success("Giriş başarılı", response);
    }

    public async Task<(bool Success, string Message, AuthResponse? Response)> RefreshTokenAsync(string refreshToken)
    {
        var user = await _userRepository.GetByRefreshTokenAsync(refreshToken);

        if (user == null)
            return Failure("Geçersiz refresh token");

        if (IsRefreshTokenExpired(user))
            return Failure("Refresh token süresi dolmuş");

        if (!user.IsActive)
            return Failure("Hesap devre dışı");

        var response = await GenerateAuthResponseAsync(user);
        return Success("Token yenilendi", response);
    }

    public async Task<bool> LogoutAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return false;

        await InvalidateRefreshTokenAsync(user);
        return true;
    }

    public async Task<UserInfoDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user == null ? null : MapToUserInfo(user);
    }

    #endregion

    #region Private Helpers - Response

    private static (bool Success, string Message, AuthResponse? Response) Success(string message, AuthResponse response)
        => (true, message, response);

    private static (bool Success, string Message, AuthResponse? Response) Failure(string message)
        => (false, message, null);

    #endregion

    #region Private Helpers - User

    private static User CreateUser(RegisterRequest request) => new()
    {
        Email = NormalizeEmail(request.Email),
        PasswordHash = HashPassword(request.Password),
        FirstName = request.FirstName.Trim(),
        LastName = request.LastName.Trim(),
        TenantId = request.TenantId ?? GenerateTenantId(),
        Role = DefaultRole
    };

    private async Task UpdateLastLoginAsync(User user)
    {
        user.LastLoginAt = GetCurrentTimestamp();
        await _userRepository.UpdateAsync(user);
    }

    private async Task InvalidateRefreshTokenAsync(User user)
    {
        user.RefreshToken = null;
        user.RefreshTokenExpiresAt = null;
        await _userRepository.UpdateAsync(user);
    }

    private static bool IsRefreshTokenExpired(User user)
        => user.RefreshTokenExpiresAt < GetCurrentTimestamp();

    private static string NormalizeEmail(string email)
        => email.ToLower().Trim();

    private static long GetCurrentTimestamp()
        => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    #endregion

    #region Private Helpers - Token Generation

    private async Task<AuthResponse> GenerateAuthResponseAsync(User user)
    {
        var accessToken = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();
        var expiresAt = DateTimeOffset.UtcNow
            .AddMinutes(_jwtSettings.AccessTokenExpirationMinutes)
            .ToUnixTimeMilliseconds();

        await UpdateUserRefreshTokenAsync(user, refreshToken);

        return new AuthResponse(
            accessToken,
            refreshToken,
            expiresAt,
            MapToUserInfo(user)
        );
    }

    private async Task UpdateUserRefreshTokenAsync(User user, string refreshToken)
    {
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiresAt = DateTimeOffset.UtcNow
            .AddDays(_jwtSettings.RefreshTokenExpirationDays)
            .ToUnixTimeMilliseconds();
        await _userRepository.UpdateAsync(user);
    }

    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = CreateClaims(user);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static Claim[] CreateClaims(User user) =>
    [
        new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new(JwtRegisteredClaimNames.Email, user.Email),
        new(ClaimTypes.Name, user.FullName),
        new(ClaimTypes.Role, user.Role),
        new("tenantId", user.TenantId ?? ""),
        new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    ];

    private static string GenerateRefreshToken()
    {
        var randomBytes = new byte[RefreshTokenBytes];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    #endregion

    #region Private Helpers - Password & Tenant

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password + PasswordSalt));
        return Convert.ToBase64String(bytes);
    }

    private static bool VerifyPassword(string password, string hash)
        => HashPassword(password) == hash;

    private static string GenerateTenantId()
        => $"T{Guid.NewGuid():N}"[..TenantIdLength].ToUpper();

    #endregion

    #region Private Helpers - Mapping

    private static UserInfoDto MapToUserInfo(User user) => new(
        user.Id,
        user.Email,
        user.FirstName,
        user.LastName,
        user.FullName,
        user.Role,
        user.TenantId
    );

    #endregion
}
