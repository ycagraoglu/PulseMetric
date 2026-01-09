using Analytics.API.Models;

namespace Analytics.API.Services;

/// <summary>
/// Authentication servisi interface'i.
/// Testability ve dependency inversion için.
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Kullanıcı kayıt
    /// </summary>
    Task<(bool Success, string Message, AuthResponse? Response)> RegisterAsync(RegisterRequest request);

    /// <summary>
    /// Kullanıcı giriş
    /// </summary>
    Task<(bool Success, string Message, AuthResponse? Response)> LoginAsync(LoginRequest request);

    /// <summary>
    /// Token yenileme
    /// </summary>
    Task<(bool Success, string Message, AuthResponse? Response)> RefreshTokenAsync(string refreshToken);

    /// <summary>
    /// Çıkış
    /// </summary>
    Task<bool> LogoutAsync(Guid userId);

    /// <summary>
    /// Kullanıcı bilgilerini getir
    /// </summary>
    Task<UserInfoDto?> GetUserByIdAsync(Guid userId);
}
