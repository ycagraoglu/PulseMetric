using Analytics.API.Helpers;
using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// Analitik event toplama endpoint'i.
/// Müşteri sitelerinden gelen tüm eventleri karşılar ve kuyruğa atar.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CollectorController : ControllerBase
{
    private readonly IQueueService _queueService;
    private readonly ILogger<CollectorController> _logger;

    public CollectorController(IQueueService queueService, ILogger<CollectorController> logger)
    {
        _queueService = queueService;
        _logger = logger;
    }

    /// <summary>
    /// Event toplama endpoint'i.
    /// POST /api/collector
    /// </summary>
    /// <param name="payload">Analitik event verisi</param>
    /// <returns>202 Accepted veya hata</returns>
    [HttpPost]
    public async Task<IActionResult> Collect([FromBody] AnalyticsEventPayload payload)
    {
        // --- VALIDASYON ---
        if (string.IsNullOrEmpty(payload.ClientId))
        {
            _logger.LogWarning("ClientId eksik, istek reddedildi");
            return BadRequest(new { error = "ClientId is required" });
        }

        if (string.IsNullOrEmpty(payload.EventName))
        {
            payload.EventName = "page_view"; // Varsayılan event
        }

        // --- IP ADRESI YAKALAMA ---
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString();
        payload.IpAddress = clientIp;

        // --- LOGLAMA (GDPR UYUMLU - MASKELI IP) ---
        var maskedIp = IpMaskingHelper.MaskIp(clientIp);
        
        _logger.LogInformation(
            "[HIT] {Time} | Event: {EventName} | Tenant: {ClientId} | IP: {MaskedIp}",
            DateTime.Now.ToString("HH:mm:ss"),
            payload.EventName,
            payload.ClientId,
            maskedIp
        );

        // --- KUYRUĞA ATMA (Asenkron, veritabanına doğrudan yazma yok) ---
        await _queueService.EnqueueAsync("analytics_events", payload);

        // 202 Accepted: "İsteğin alındı, işlenecek" anlamına gelir
        return Accepted();
    }

    /// <summary>
    /// Health check endpoint'i.
    /// GET /api/collector/health
    /// </summary>
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }
}
