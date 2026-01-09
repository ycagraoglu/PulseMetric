namespace Analytics.API.Models;

/// <summary>
/// Batch event payload - çoklu event tek request ile gönderim için.
/// pulse.js v3.0 event batching desteği.
/// </summary>
public class BatchEventPayload
{
    /// <summary>
    /// Tenant (Müşteri) kimliği.
    /// </summary>
    public string ClientId { get; set; } = string.Empty;

    /// <summary>
    /// Benzersiz ziyaretçi kimliği (Cookie-less hash).
    /// </summary>
    public string? VisitorId { get; set; }

    /// <summary>
    /// Session kimliği (sessionStorage ile persist edilen).
    /// </summary>
    public string? SessionId { get; set; }

    /// <summary>
    /// Batch içindeki eventler.
    /// </summary>
    public List<BatchEventItem> Events { get; set; } = [];
}

/// <summary>
/// Batch içindeki tek bir event.
/// </summary>
public class BatchEventItem
{
    /// <summary>
    /// Event adı (örn: page_view, scroll_depth, time_on_page)
    /// </summary>
    public string EventName { get; set; } = string.Empty;

    /// <summary>
    /// Sayfa URL'i
    /// </summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>
    /// Sayfa başlığı
    /// </summary>
    public string PageTitle { get; set; } = string.Empty;

    /// <summary>
    /// Referrer URL
    /// </summary>
    public string Referrer { get; set; } = string.Empty;

    /// <summary>
    /// Cihaz tipi (Mobile/Desktop/Tablet)
    /// </summary>
    public string Device { get; set; } = string.Empty;

    /// <summary>
    /// Ekran genişliği
    /// </summary>
    public int? ScreenWidth { get; set; }

    /// <summary>
    /// Ekran yüksekliği
    /// </summary>
    public int? ScreenHeight { get; set; }

    /// <summary>
    /// Tarayıcı dili
    /// </summary>
    public string? Language { get; set; }

    /// <summary>
    /// Kullanıcı zaman dilimi
    /// </summary>
    public string? Timezone { get; set; }

    /// <summary>
    /// Event zamanı (Unix epoch milliseconds)
    /// </summary>
    public long Timestamp { get; set; }

    /// <summary>
    /// Session süresi (saniye)
    /// </summary>
    public int? SessionDuration { get; set; }

    /// <summary>
    /// Event'e özel ek veriler
    /// </summary>
    public object? Data { get; set; }
}
