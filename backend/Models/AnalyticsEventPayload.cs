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
    /// Session kimliği (sessionStorage ile persist edilen).
    /// </summary>
    public string? SessionId { get; set; }

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

    // =============================================
    // Server-Side Enrichment (Client gönderemez)
    // =============================================

    /// <summary>
    /// Kullanıcı IP adresi (Sunucu tarafında doldurulur)
    /// </summary>
    public string? IpAddress { get; set; }

    /// <summary>
    /// Tarayıcı adı (User-Agent'tan parse edilir)
    /// </summary>
    public string? Browser { get; set; }

    /// <summary>
    /// Tarayıcı versiyonu (User-Agent'tan parse edilir)
    /// </summary>
    public string? BrowserVersion { get; set; }

    /// <summary>
    /// İşletim sistemi (User-Agent'tan parse edilir)
    /// </summary>
    public string? OS { get; set; }

    /// <summary>
    /// İşletim sistemi versiyonu (User-Agent'tan parse edilir)
    /// </summary>
    public string? OSVersion { get; set; }

    /// <summary>
    /// Mobil cihaz mı? (User-Agent'tan parse edilir)
    /// </summary>
    public bool? IsMobile { get; set; }

    /// <summary>
    /// Bot/Crawler mı? (User-Agent'tan parse edilir)
    /// </summary>
    public bool? IsBot { get; set; }

    // =============================================
    // GeoIP Enrichment (IP adresinden tespit edilir)
    // =============================================

    /// <summary>
    /// Ülke adı (GeoIP'den tespit edilir)
    /// </summary>
    public string? Country { get; set; }

    /// <summary>
    /// Ülke kodu - ISO 3166-1 alpha-2 (GeoIP'den tespit edilir)
    /// </summary>
    public string? CountryCode { get; set; }

    /// <summary>
    /// Bölge/Eyalet adı (GeoIP'den tespit edilir)
    /// </summary>
    public string? Region { get; set; }

    /// <summary>
    /// Şehir adı (GeoIP'den tespit edilir)
    /// </summary>
    public string? City { get; set; }

    /// <summary>
    /// Enlem (GeoIP'den tespit edilir)
    /// </summary>
    public double? Latitude { get; set; }

    /// <summary>
    /// Boylam (GeoIP'den tespit edilir)
    /// </summary>
    public double? Longitude { get; set; }
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
