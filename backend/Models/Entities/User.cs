using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Analytics.API.Models.Entities;

/// <summary>
/// Kullanıcı entity'si - Authentication için.
/// </summary>
[Table("users")]
public class User : BaseEntity, ISoftDeletable, IUpdatable
{
    #region Identity

    [Required]
    [MaxLength(100)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("first_name")]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("last_name")]
    public string LastName { get; set; } = string.Empty;

    [NotMapped]
    public string FullName => $"{FirstName} {LastName}";

    #endregion

    #region Authorization

    [MaxLength(100)]
    [Column("tenant_id")]
    public string? TenantId { get; set; }

    [MaxLength(50)]
    [Column("role")]
    public string Role { get; set; } = "User";

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    #endregion

    #region Session

    [Column("last_login_at")]
    public long? LastLoginAt { get; set; }

    [MaxLength(500)]
    [Column("refresh_token")]
    public string? RefreshToken { get; set; }

    [Column("refresh_token_expires_at")]
    public long? RefreshTokenExpiresAt { get; set; }

    [Column("updated_at")]
    public long? UpdatedAt { get; set; }

    #endregion
}
