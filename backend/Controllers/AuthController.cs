using System.Security.Claims;
using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// Authentication API.
/// Login, register, token yenileme ve kullanıcı bilgileri.
/// SRP: HTTP request/response yönetimi - iş mantığı AuthService'de.
/// </summary>
[Route("api/auth")]
public class AuthController : ApiBaseController
{
    private readonly IAuthService _authService;

    #region Constants

    private const int MinPasswordLength = 6;

    #endregion

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
        : base(logger)
    {
        _authService = authService;
    }

    #region Public Endpoints

    /// <summary>
    /// Kullanıcı kaydı
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        if (!TryValidateRegisterRequest(request, out var error))
            return BadRequest(error);

        return await ExecuteAuthOperationAsync(
            () => _authService.RegisterAsync(request),
            "Kayıt işlemi başarısız");
    }

    /// <summary>
    /// Kullanıcı girişi
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        if (!TryValidateLoginRequest(request, out var error))
            return BadRequest(error);

        return await ExecuteAuthOperationAsync(
            () => _authService.LoginAsync(request),
            "Giriş işlemi başarısız",
            unauthorizedOnFailure: true);
    }

    /// <summary>
    /// Token yenileme
    /// </summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            return BadRequest("Refresh token zorunludur");

        return await ExecuteAuthOperationAsync(
            () => _authService.RefreshTokenAsync(request.RefreshToken),
            "Token yenileme başarısız",
            unauthorizedOnFailure: true);
    }

    #endregion

    #region Protected Endpoints

    /// <summary>
    /// Çıkış
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return BadRequest("Geçersiz kullanıcı");

        try
        {
            await _authService.LogoutAsync(userId.Value);
            return Ok(new { message = "Çıkış başarılı" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Logout hatası");
            return StatusCode(500, "Çıkış işlemi başarısız");
        }
    }

    /// <summary>
    /// Mevcut kullanıcı bilgileri
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserInfoDto>> GetCurrentUser()
    {
        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized("Geçersiz token");

        return await ExecuteWithNotFoundAsync(
            () => _authService.GetUserByIdAsync(userId.Value),
            "Kullanıcı bulunamadı",
            "Kullanıcı bilgileri alınamadı");
    }

    #endregion

    #region Private Helpers - User ID

    private Guid? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    #endregion

    #region Private Helpers - Validation (DRY)

    private static bool TryValidateLoginRequest(LoginRequest request, out string? error)
    {
        error = null;
        
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            error = "Email ve şifre zorunludur";
            return false;
        }
        
        return true;
    }

    private static bool TryValidateRegisterRequest(RegisterRequest request, out string? error)
    {
        error = null;
        
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            error = "Email ve şifre zorunludur";
            return false;
        }
        
        if (request.Password.Length < MinPasswordLength)
        {
            error = $"Şifre en az {MinPasswordLength} karakter olmalıdır";
            return false;
        }
        
        return true;
    }

    #endregion

    #region Private Helpers - Auth Operation Executor

    /// <summary>
    /// Auth operasyonu çalıştırır - başarı/hata durumuna göre response döner.
    /// DRY: Tüm auth endpoint'lerindeki ortak try/catch ve response yapısı.
    /// </summary>
    private async Task<ActionResult<AuthResponse>> ExecuteAuthOperationAsync(
        Func<Task<(bool Success, string Message, AuthResponse? Response)>> operation,
        string userErrorMessage,
        bool unauthorizedOnFailure = false)
    {
        try
        {
            var (success, message, response) = await operation();

            if (!success)
            {
                return unauthorizedOnFailure
                    ? Unauthorized(new { message })
                    : BadRequest(new { message });
            }

            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, userErrorMessage);
            return StatusCode(500, userErrorMessage);
        }
    }

    #endregion
}
