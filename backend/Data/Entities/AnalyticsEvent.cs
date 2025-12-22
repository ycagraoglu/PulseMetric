using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Analytics.API.Data.Entities;

/// <summary>
/// Analitik event entity modeli.
/// Redis'ten okunan veriler bu formatta PostgreSQL'e yazılır.
/// </summary>
[Table("analytics_events")]
public class AnalyticsEvent
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Tenant (müşteri) kimliği
    /// </summary>
    [Column("tenant_id")]
    [Required]
    [MaxLength(100)]
    public string TenantId { get; set; } = string.Empty;

    /// <summary>
    /// Ziyaretçi hash'i (cookie-less tracking)
    /// </summary>
    [Column("visitor_id")]
    [MaxLength(50)]
    public string? VisitorId { get; set; }

    /// <summary>
    /// Event adı (page_view, scroll_depth, click, vb.)
    /// </summary>
    [Column("event_name")]
    [Required]
    [MaxLength(50)]
    public string EventName { get; set; } = string.Empty;

    /// <summary>
    /// URL path (/products, /about, vb.)
    /// </summary>
    [Column("url_path")]
    [MaxLength(2000)]
    public string UrlPath { get; set; } = string.Empty;

    /// <summary>
    /// Sayfa başlığı
    /// </summary>
    [Column("page_title")]
    [MaxLength(500)]
    public string? PageTitle { get; set; }

    /// <summary>
    /// Referrer URL
    /// </summary>
    [Column("referrer")]
    [MaxLength(2000)]
    public string? Referrer { get; set; }

    /// <summary>
    /// Cihaz tipi (Desktop, Mobile, Tablet)
    /// </summary>
    [Column("device")]
    [MaxLength(20)]
    public string? Device { get; set; }

    /// <summary>
    /// Tarayıcı adı (Chrome, Firefox, Safari, vb.)
    /// </summary>
    [Column("browser")]
    [MaxLength(50)]
    public string? Browser { get; set; }

    /// <summary>
    /// İşletim sistemi (Windows, macOS, iOS, Android, vb.)
    /// </summary>
    [Column("os")]
    [MaxLength(50)]
    public string? OS { get; set; }

    /// <summary>
    /// Ülke (GeoIP ile doldurulacak)
    /// </summary>
    [Column("country")]
    [MaxLength(2)]
    public string? Country { get; set; }

    /// <summary>
    /// Ekran genişliği
    /// </summary>
    [Column("screen_width")]
    public int? ScreenWidth { get; set; }

    /// <summary>
    /// Ekran yüksekliği
    /// </summary>
    [Column("screen_height")]
    public int? ScreenHeight { get; set; }

    /// <summary>
    /// Tarayıcı dili
    /// </summary>
    [Column("language")]
    [MaxLength(10)]
    public string? Language { get; set; }

    /// <summary>
    /// Session süresi (saniye)
    /// </summary>
    [Column("session_duration")]
    public int? SessionDuration { get; set; }

    /// <summary>
    /// Event zamanı (Unix epoch milliseconds)
    /// </summary>
    [Column("timestamp")]
    public long Timestamp { get; set; }

    /// <summary>
    /// Ek veriler (JSON formatında)
    /// </summary>
    [Column("data", TypeName = "jsonb")]
    public string? Data { get; set; }

    /// <summary>
    /// Kayıt oluşturulma zamanı (Unix epoch ms)
    /// </summary>
    [Column("created_at")]
    public long CreatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
}
