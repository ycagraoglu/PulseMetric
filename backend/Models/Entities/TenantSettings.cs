using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Analytics.API.Models.Entities;

/// <summary>
/// Tenant ayarları entity'si.
/// Her tenant'a ait notification, security ve data retention ayarları.
/// </summary>
[Table("tenant_settings")]
public class TenantSettings : BaseEntity, IUpdatable
{
    #region Tenant Reference

    /// <summary>
    /// Tenant ID (Foreign Key)
    /// </summary>
    [Column("tenant_id")]
    [Required]
    [MaxLength(100)]
    public string TenantId { get; set; } = string.Empty;

    #endregion

    #region Project Settings

    /// <summary>
    /// Proje adı (görünen ad)
    /// </summary>
    [Column("project_name")]
    [MaxLength(200)]
    public string? ProjectName { get; set; }

    /// <summary>
    /// Proje URL'i
    /// </summary>
    [Column("project_url")]
    [MaxLength(500)]
    public string? ProjectUrl { get; set; }

    /// <summary>
    /// Veri saklama süresi (gün)
    /// </summary>
    [Column("data_retention_days")]
    public int DataRetentionDays { get; set; } = 90;

    /// <summary>
    /// Zaman dilimi (IANA format, örn: Europe/Istanbul)
    /// </summary>
    [Column("timezone")]
    [MaxLength(50)]
    public string Timezone { get; set; } = "UTC";

    #endregion

    #region Notification Settings (JSON)

    /// <summary>
    /// Email bildirimleri aktif mi?
    /// </summary>
    [Column("email_notifications")]
    public bool EmailNotifications { get; set; } = true;

    /// <summary>
    /// Push bildirimleri aktif mi?
    /// </summary>
    [Column("push_notifications")]
    public bool PushNotifications { get; set; } = false;

    /// <summary>
    /// Haftalık rapor gönderilsin mi?
    /// </summary>
    [Column("weekly_reports")]
    public bool WeeklyReports { get; set; } = true;

    /// <summary>
    /// Günlük özet gönderilsin mi?
    /// </summary>
    [Column("daily_digest")]
    public bool DailyDigest { get; set; } = false;

    #endregion

    #region Security Settings

    /// <summary>
    /// İki faktörlü doğrulama aktif mi?
    /// </summary>
    [Column("two_factor_enabled")]
    public bool TwoFactorEnabled { get; set; } = false;

    /// <summary>
    /// Session timeout (dakika)
    /// </summary>
    [Column("session_timeout_minutes")]
    public int SessionTimeoutMinutes { get; set; } = 30;

    /// <summary>
    /// IP whitelist (virgülle ayrılmış)
    /// </summary>
    [Column("ip_whitelist")]
    [MaxLength(2000)]
    public string? IpWhitelist { get; set; }

    #endregion

    #region Timestamps

    [Column("updated_at")]
    public long? UpdatedAt { get; set; }

    #endregion
}
