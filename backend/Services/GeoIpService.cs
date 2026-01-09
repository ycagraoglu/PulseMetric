using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace Analytics.API.Services;

/// <summary>
/// GeoIP lookup servisi - ip-api.com kullanır.
/// Free tier: 45 request/dakika (HTTP only)
/// Production için MaxMind GeoLite2 veya premium API önerilir.
/// </summary>
public class GeoIpService : IGeoIpService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GeoIpService> _logger;
    private readonly GeoIpOptions _options;

    #region Constants

    private const string SuccessStatus = "success";

    /// <summary>
    /// Private/local IP prefixes - HashSet for O(1) contains check
    /// </summary>
    private static readonly HashSet<string> LocalIpPrefixes =
    [
        // IPv4 Loopback
        "127.",
        // IPv4 Private ranges
        "10.",
        "192.168.",
        // IPv4 Private range 172.16.0.0 - 172.31.255.255
        "172.16.", "172.17.", "172.18.", "172.19.", "172.20.",
        "172.21.", "172.22.", "172.23.", "172.24.", "172.25.",
        "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31.",
        // IPv6 Loopback & Link-local
        "::1",
        "fe80:"
    ];

    #endregion

    public GeoIpService(HttpClient httpClient, ILogger<GeoIpService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _options = GeoIpOptions.FromConfiguration(configuration);
    }

    #region Public API

    public bool IsEnabled => _options.Enabled;

    public async Task<GeoIpInfo> LookupAsync(string? ipAddress)
    {
        // Early exits
        if (!_options.Enabled || string.IsNullOrWhiteSpace(ipAddress))
            return GeoIpInfo.Unknown;

        // Skip local/private IPs
        if (IsLocalIp(ipAddress))
        {
            _logger.LogDebug("Local IP atlandı: {IpAddress}", ipAddress);
            return GeoIpInfo.Local;
        }

        return await SafeFetchGeoInfoAsync(ipAddress);
    }

    #endregion

    #region Private Methods - API

    private async Task<GeoIpInfo> SafeFetchGeoInfoAsync(string ipAddress)
    {
        try
        {
            var response = await FetchFromApiAsync(ipAddress);
            return response?.Status == SuccessStatus
                ? MapToGeoIpInfo(response)
                : LogAndReturnUnknown(ipAddress, response?.Status);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning(ex, "GeoIP API bağlantı hatası: {IpAddress}", ipAddress);
            return GeoIpInfo.Unknown;
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogWarning(ex, "GeoIP isteği timeout: {IpAddress}", ipAddress);
            return GeoIpInfo.Unknown;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "GeoIP lookup hatası: {IpAddress}", ipAddress);
            return GeoIpInfo.Unknown;
        }
    }

    private async Task<IpApiResponse?> FetchFromApiAsync(string ipAddress)
    {
        var url = BuildApiUrl(ipAddress);
        return await _httpClient.GetFromJsonAsync<IpApiResponse>(url);
    }

    private string BuildApiUrl(string ipAddress)
        => $"{_options.BaseUrl}{ipAddress}?fields={_options.Fields}";

    private GeoIpInfo LogAndReturnUnknown(string ipAddress, string? status)
    {
        _logger.LogDebug("GeoIP başarısız: {IpAddress}, Status: {Status}", ipAddress, status);
        return GeoIpInfo.Unknown;
    }

    #endregion

    #region Private Methods - IP Check

    private static bool IsLocalIp(string ipAddress)
        => LocalIpPrefixes.Any(prefix => ipAddress.StartsWith(prefix, StringComparison.OrdinalIgnoreCase));

    #endregion

    #region Private Methods - Mapping

    private static GeoIpInfo MapToGeoIpInfo(IpApiResponse r) => new(
        Country: r.Country,
        CountryCode: r.CountryCode,
        Region: r.RegionName,
        City: r.City,
        Latitude: r.Lat,
        Longitude: r.Lon,
        Timezone: r.Timezone,
        Isp: r.Isp
    );

    #endregion

    #region Internal Types

    /// <summary>
    /// GeoIP servis konfigürasyonu
    /// </summary>
    private class GeoIpOptions
    {
        public bool Enabled { get; init; } = true;
        public string BaseUrl { get; init; } = "http://ip-api.com/json/";
        public string Fields { get; init; } = "status,country,countryCode,region,regionName,city,lat,lon,timezone,isp";

        public static GeoIpOptions FromConfiguration(IConfiguration configuration)
        {
            var section = configuration.GetSection("GeoIp");
            return new GeoIpOptions
            {
                Enabled = section.GetValue("Enabled", true),
                BaseUrl = section.GetValue("BaseUrl", "http://ip-api.com/json/") ?? "http://ip-api.com/json/",
                Fields = section.GetValue("Fields", "status,country,countryCode,region,regionName,city,lat,lon,timezone,isp") 
                    ?? "status,country,countryCode,region,regionName,city,lat,lon,timezone,isp"
            };
        }
    }

    /// <summary>
    /// ip-api.com API response DTO
    /// </summary>
    private class IpApiResponse
    {
        [JsonPropertyName("status")]
        public string? Status { get; init; }

        [JsonPropertyName("country")]
        public string? Country { get; init; }

        [JsonPropertyName("countryCode")]
        public string? CountryCode { get; init; }

        [JsonPropertyName("region")]
        public string? Region { get; init; }

        [JsonPropertyName("regionName")]
        public string? RegionName { get; init; }

        [JsonPropertyName("city")]
        public string? City { get; init; }

        [JsonPropertyName("lat")]
        public double? Lat { get; init; }

        [JsonPropertyName("lon")]
        public double? Lon { get; init; }

        [JsonPropertyName("timezone")]
        public string? Timezone { get; init; }

        [JsonPropertyName("isp")]
        public string? Isp { get; init; }
    }

    #endregion
}
