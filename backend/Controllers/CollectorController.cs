using Analytics.API.Helpers;
using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// Analitik event toplama endpoint'i.
/// Müşteri sitelerinden gelen tüm eventleri karşılar ve kuyruğa atar.
/// SRP: Event collection sorumluluğu - yüksek performans, minimal işlem.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CollectorController : ControllerBase
{
    private readonly IQueueService _queueService;
    private readonly IGeoIpService _geoIpService;
    private readonly ILogger<CollectorController> _logger;

    #region Constants

    private const string DefaultEventName = "page_view";
    private const string QueueName = "analytics_events";
    private const string LogTemplate = "[HIT] {Time} | Event: {EventName} | Tenant: {ClientId} | Browser: {Browser} | OS: {OS} | Country: {Country} | IP: {MaskedIp}";
    private const string UserAgentHeader = "User-Agent";

    #endregion

    public CollectorController(
        IQueueService queueService, 
        IGeoIpService geoIpService,
        ILogger<CollectorController> logger)
    {
        _queueService = queueService;
        _geoIpService = geoIpService;
        _logger = logger;
    }

    #region Endpoints

    /// <summary>
    /// Event toplama endpoint'i.
    /// POST /api/collector
    /// </summary>
    /// <param name="payload">Analitik event verisi</param>
    /// <returns>202 Accepted veya hata</returns>
    [HttpPost]
    public async Task<IActionResult> Collect([FromBody] AnalyticsEventPayload payload)
    {
        // Validate
        if (!TryValidatePayload(payload, out var error))
            return BadRequest(new { error });

        // Enrich with server-side data
        await EnrichPayloadAsync(payload);

        // Bot kontrolü - opsiyonel olarak reddedilebilir
        // if (payload.IsBot == true) return Ok(); // Bot'ları sessizce kabul et ama kaydetme

        // Log (GDPR compliant - masked IP)
        LogEvent(payload);

        // Enqueue (async, no direct DB write)
        await _queueService.EnqueueAsync(QueueName, payload);

        // 202 Accepted: "Request received, will be processed"
        return Accepted();
    }

    /// <summary>
    /// Health check endpoint'i.
    /// GET /api/collector/health
    /// </summary>
    [HttpGet("health")]
    public IActionResult Health() => Ok(new
    {
        status = "healthy",
        timestamp = DateTime.UtcNow,
        geoIpEnabled = _geoIpService.IsEnabled
    });

    /// <summary>
    /// Batch event toplama endpoint'i.
    /// POST /api/collector/batch
    /// Çoklu event'i tek request ile toplar - pulse.js v3.0 event batching.
    /// </summary>
    /// <param name="batchPayload">Batch event verisi</param>
    /// <returns>202 Accepted veya hata</returns>
    [HttpPost("batch")]
    public async Task<IActionResult> BatchCollect([FromBody] BatchEventPayload batchPayload)
    {
        // Validate client ID
        if (string.IsNullOrEmpty(batchPayload.ClientId))
        {
            _logger.LogWarning("Batch: ClientId eksik, istek reddedildi");
            return BadRequest(new { error = "ClientId is required" });
        }

        if (batchPayload.Events == null || batchPayload.Events.Count == 0)
        {
            return Accepted(); // Empty batch is OK
        }

        _logger.LogInformation(
            "[BATCH] {Time} | Events: {Count} | Tenant: {ClientId} | Session: {SessionId}",
            DateTime.Now.ToString("HH:mm:ss"),
            batchPayload.Events.Count,
            batchPayload.ClientId,
            batchPayload.SessionId ?? "N/A");

        // Process each event in the batch
        foreach (var eventItem in batchPayload.Events)
        {
            var payload = new AnalyticsEventPayload
            {
                ClientId = batchPayload.ClientId,
                VisitorId = batchPayload.VisitorId,
                SessionId = batchPayload.SessionId,
                EventName = eventItem.EventName,
                Url = eventItem.Url,
                PageTitle = eventItem.PageTitle,
                Referrer = eventItem.Referrer,
                Device = eventItem.Device,
                ScreenWidth = eventItem.ScreenWidth,
                ScreenHeight = eventItem.ScreenHeight,
                Language = eventItem.Language,
                Timezone = eventItem.Timezone,
                Timestamp = eventItem.Timestamp,
                SessionDuration = eventItem.SessionDuration,
                Data = eventItem.Data
            };

            // Enrich with server-side data
            await EnrichPayloadAsync(payload);

            // Enqueue
            await _queueService.EnqueueAsync(QueueName, payload);
        }

        return Accepted(new { processed = batchPayload.Events.Count });
    }

    #endregion

    #region Private Helpers - Validation

    /// <summary>
    /// Payload'ı validate et
    /// </summary>
    private bool TryValidatePayload(AnalyticsEventPayload payload, out string? error)
    {
        error = null;

        if (string.IsNullOrEmpty(payload.ClientId))
        {
            _logger.LogWarning("ClientId eksik, istek reddedildi");
            error = "ClientId is required";
            return false;
        }

        return true;
    }

    #endregion

    #region Private Helpers - Enrichment

    /// <summary>
    /// Payload'ı server-side verilerle zenginleştir
    /// </summary>
    private async Task EnrichPayloadAsync(AnalyticsEventPayload payload)
    {
        // Default event name
        if (string.IsNullOrEmpty(payload.EventName))
            payload.EventName = DefaultEventName;

        // IP address capture
        payload.IpAddress = GetClientIpAddress();

        // User-Agent parsing
        EnrichWithUserAgent(payload);

        // GeoIP lookup (async)
        await EnrichWithGeoIpAsync(payload);
    }

    /// <summary>
    /// User-Agent header'ını parse edip payload'a ekle
    /// </summary>
    private void EnrichWithUserAgent(AnalyticsEventPayload payload)
    {
        var userAgent = GetUserAgentHeader();
        var uaToparse = !string.IsNullOrEmpty(payload.UserAgent) ? payload.UserAgent : userAgent;
        payload.UserAgent = uaToparse ?? string.Empty;

        var uaInfo = UserAgentParser.Parse(uaToparse);

        payload.Browser = uaInfo.Browser;
        payload.BrowserVersion = uaInfo.BrowserVersion;
        payload.OS = uaInfo.OS;
        payload.OSVersion = uaInfo.OSVersion;
        payload.IsMobile = uaInfo.IsMobile;
        payload.IsBot = uaInfo.IsBot;

        if (string.IsNullOrEmpty(payload.Device))
            payload.Device = uaInfo.Device;
    }

    /// <summary>
    /// IP adresinden GeoIP bilgisi al ve payload'a ekle
    /// </summary>
    private async Task EnrichWithGeoIpAsync(AnalyticsEventPayload payload)
    {
        var geoInfo = await _geoIpService.LookupAsync(payload.IpAddress);

        if (geoInfo.IsValid)
        {
            payload.Country = geoInfo.Country;
            payload.CountryCode = geoInfo.CountryCode;
            payload.Region = geoInfo.Region;
            payload.City = geoInfo.City;
            payload.Latitude = geoInfo.Latitude;
            payload.Longitude = geoInfo.Longitude;

            // Timezone override (if not provided by client)
            if (string.IsNullOrEmpty(payload.Timezone) && !string.IsNullOrEmpty(geoInfo.Timezone))
                payload.Timezone = geoInfo.Timezone;
        }
    }

    #endregion

    #region Private Helpers - HTTP Context

    private string? GetClientIpAddress()
    {
        // Check for forwarded IP (reverse proxy)
        var forwardedFor = Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            // X-Forwarded-For can contain multiple IPs, take the first one
            return forwardedFor.Split(',')[0].Trim();
        }

        return HttpContext.Connection.RemoteIpAddress?.ToString();
    }

    private string? GetUserAgentHeader()
        => Request.Headers.TryGetValue(UserAgentHeader, out var ua) ? ua.ToString() : null;

    #endregion

    #region Private Helpers - Logging

    /// <summary>
    /// Event'i logla (GDPR uyumlu - maskeli IP)
    /// </summary>
    private void LogEvent(AnalyticsEventPayload payload)
    {
        var maskedIp = IpMaskingHelper.MaskIp(payload.IpAddress);

        _logger.LogInformation(
            LogTemplate,
            DateTime.Now.ToString("HH:mm:ss"),
            payload.EventName,
            payload.ClientId,
            payload.Browser,
            payload.OS,
            payload.Country ?? "Unknown",
            maskedIp);
    }

    #endregion
}
