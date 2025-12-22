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
    /// Benzersiz ziyaretçi kimliği (Cookie-less hash).
    /// </summary>
    public string? VisitorId { get; set; }

    /// <summary>
    /// Event adı (örn: page_view, scroll_depth, time_on_page, outbound_click)
    /// </summary>
    public string EventName { get; set; } = string.Empty;

    /// <summary>
    /// Eventin gerçekleştiği sayfa URL'i
    /// </summary>
    public string Url { get; set; } = string.Empty;

    /// <summary>
    /// Sayfa başlığı (document.title)
    /// </summary>
    public string PageTitle { get; set; } = string.Empty;

    /// <summary>
    /// Referrer URL (kullanıcının nereden geldiği)
    /// </summary>
    public string Referrer { get; set; } = string.Empty;

    /// <summary>
    /// Cihaz tipi (Mobile/Desktop/Tablet)
    /// </summary>
    public string Device { get; set; } = string.Empty;

    /// <summary>
    /// Ekran genişliği (responsive analiz için)
    /// </summary>
    public int? ScreenWidth { get; set; }

    /// <summary>
    /// Ekran yüksekliği
    /// </summary>
    public int? ScreenHeight { get; set; }

    /// <summary>
    /// Tarayıcı dili (örn: tr-TR, en-US)
    /// </summary>
    public string? Language { get; set; }

    /// <summary>
    /// Kullanıcı zaman dilimi (örn: Europe/Istanbul)
    /// </summary>
    public string? Timezone { get; set; }

    /// <summary>
    /// Tarayıcı User-Agent bilgisi
    /// </summary>
    public string UserAgent { get; set; } = string.Empty;

    /// <summary>
    /// Session süresi (saniye cinsinden)
    /// </summary>
    public int? SessionDuration { get; set; }

    /// <summary>
    /// UTM parametreleri (campaing tracking)
    /// </summary>
    public UtmParameters? Utm { get; set; }

    /// <summary>
    /// Event'e özel ek veriler (JSON formatında)
    /// </summary>
    public object? Data { get; set; }

    /// <summary>
    /// Event zamanı (Unix epoch milliseconds)
    /// </summary>
    public long Timestamp { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    /// <summary>
    /// Kullanıcı IP adresi (Sunucu tarafında doldurulur, client gönderemez)
    /// </summary>
    public string? IpAddress { get; set; }
}

/// <summary>
/// UTM kampanya parametreleri
/// </summary>
public class UtmParameters
{
    public string? Source { get; set; }
    public string? Medium { get; set; }
    public string? Campaign { get; set; }
    public string? Term { get; set; }
    public string? Content { get; set; }
}
