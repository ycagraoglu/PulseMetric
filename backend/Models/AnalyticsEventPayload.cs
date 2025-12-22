namespace Analytics.API.Models;

/// <summary>
/// Müşteri sitelerinden gelen analitik event verileri için DTO.
/// Collector API bu modeli alır, IP ekler ve kuyruğa atar.
/// </summary>
public class AnalyticsEventPayload
{
    /// <summary>
    /// Tenant (Müşteri) kimliği. JS scripti tarafından gönderilir.
    /// </summary>
    public string ClientId { get; set; } = string.Empty;

    /// <summary>
    /// Event adı (örn: page_view, add_to_cart, session_start)
    /// </summary>
    public string EventName { get; set; } = string.Empty;

    /// <summary>
    /// Eventin gerçekleştiği sayfa URL'i
    /// </summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>
    /// Referrer URL (kullanıcının nereden geldiği)
    /// </summary>
    public string Referrer { get; set; } = string.Empty;

    /// <summary>
    /// Tarayıcı User-Agent bilgisi
    /// </summary>
    public string UserAgent { get; set; } = string.Empty;

    /// <summary>
    /// Event'e özel ek veriler (JSON formatında)
    /// </summary>
    public object? Data { get; set; }

    /// <summary>
    /// Event zamanı (UTC)
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Kullanıcı IP adresi (Sunucu tarafında doldurulur, client gönderemez)
    /// </summary>
    public string? IpAddress { get; set; }
}
