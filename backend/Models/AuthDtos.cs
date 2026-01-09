namespace Analytics.API.Models;

/// <summary>
/// Login request
/// </summary>
public record LoginRequest(
    string Email,
    string Password
);

/// <summary>
/// Register request
/// </summary>
public record RegisterRequest(
    string Email,
    string Password,
    string FirstName,
    string LastName,
    string? TenantId = null
);

/// <summary>
/// Auth response (login/register sonrası)
/// </summary>
public record AuthResponse(
    string AccessToken,
    string RefreshToken,
    long ExpiresAt,
    UserInfoDto User
);

/// <summary>
/// Kullanıcı bilgisi
/// </summary>
public record UserInfoDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string FullName,
    string Role,
    string? TenantId
);

/// <summary>
/// Token refresh request
/// </summary>
public record RefreshTokenRequest(
    string RefreshToken
);

/// <summary>
/// Şifre değiştirme
/// </summary>
public record ChangePasswordRequest(
    string CurrentPassword,
    string NewPassword
);
