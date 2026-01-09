namespace Analytics.API.Services;

/// <summary>
/// GeoIP lookup sonucu.
/// IP adresinden elde edilen coğrafi bilgiler.
/// </summary>
public record GeoIpInfo(
    string? Country,
    string? CountryCode,
    string? Region,
    string? City,
    double? Latitude,
    double? Longitude,
    string? Timezone,
    string? Isp
)
{
    /// <summary>
    /// Bilinmeyen/bulunamayan konum için varsayılan değer
    /// </summary>
    public static GeoIpInfo Unknown => new(
        Country: null,
        CountryCode: null,
        Region: null,
        City: null,
        Latitude: null,
        Longitude: null,
        Timezone: null,
        Isp: null
    );

    /// <summary>
    /// Local/private IP için varsayılan değer
    /// </summary>
    public static GeoIpInfo Local => new(
        Country: "Local",
        CountryCode: "XX",
        Region: null,
        City: null,
        Latitude: null,
        Longitude: null,
        Timezone: null,
        Isp: "Local Network"
    );

    /// <summary>
    /// Geçerli konum bilgisi var mı?
    /// </summary>
    public bool IsValid => !string.IsNullOrEmpty(Country) && Country != "Local";
}

/// <summary>
/// GeoIP lookup servisi interface'i.
/// IP adresinden konum bilgisi çözümler.
/// </summary>
public interface IGeoIpService
{
    /// <summary>
    /// IP adresinden konum bilgisi al
    /// </summary>
    Task<GeoIpInfo> LookupAsync(string? ipAddress);

    /// <summary>
    /// Servis aktif mi?
    /// </summary>
    bool IsEnabled { get; }
}
