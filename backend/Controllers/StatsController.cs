using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// İstatistik API'leri.
/// Dashboard ve analitik sayfaları için veri sağlar.
/// </summary>
[ApiController]
[Route("api/stats")]
public class StatsController : ControllerBase
{
    private readonly StatsService _statsService;
    private readonly ILogger<StatsController> _logger;

    public StatsController(StatsService statsService, ILogger<StatsController> logger)
    {
        _statsService = statsService;
        _logger = logger;
    }

    /// <summary>
    /// Genel istatistik özeti
    /// </summary>
    [HttpGet("overview")]
    public async Task<ActionResult<StatsOverviewDto>> GetOverview([FromQuery] string tenantId = "DEMO_TENANT")
    {
        try
        {
            var stats = await _statsService.GetOverviewAsync(tenantId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Overview stats hatası");
            return StatusCode(500, "İstatistik alınamadı");
        }
    }

    /// <summary>
    /// Realtime stats
    /// </summary>
    [HttpGet("realtime")]
    public async Task<ActionResult<RealtimeStatsDto>> GetRealtime([FromQuery] string tenantId = "DEMO_TENANT")
    {
        try
        {
            var stats = await _statsService.GetRealtimeAsync(tenantId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Realtime stats hatası");
            return StatusCode(500, "Realtime istatistik alınamadı");
        }
    }

    /// <summary>
    /// En popüler sayfalar
    /// </summary>
    [HttpGet("top-pages")]
    public async Task<ActionResult<List<TopPageDto>>> GetTopPages(
        [FromQuery] string tenantId = "DEMO_TENANT",
        [FromQuery] int limit = 10)
    {
        try
        {
            var pages = await _statsService.GetTopPagesAsync(tenantId, limit);
            return Ok(pages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Top pages hatası");
            return StatusCode(500, "Sayfa istatistikleri alınamadı");
        }
    }

    /// <summary>
    /// Cihaz dağılımı
    /// </summary>
    [HttpGet("devices")]
    public async Task<ActionResult<List<DeviceStatsDto>>> GetDevices([FromQuery] string tenantId = "DEMO_TENANT")
    {
        try
        {
            var devices = await _statsService.GetDeviceStatsAsync(tenantId);
            return Ok(devices);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Device stats hatası");
            return StatusCode(500, "Cihaz istatistikleri alınamadı");
        }
    }

    /// <summary>
    /// Zaman bazlı page view chart
    /// </summary>
    [HttpGet("chart/pageviews")]
    public async Task<ActionResult<List<ChartDataPointDto>>> GetPageViewChart(
        [FromQuery] string tenantId = "DEMO_TENANT",
        [FromQuery] int days = 7)
    {
        try
        {
            var data = await _statsService.GetPageViewChartAsync(tenantId, days);
            return Ok(data);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Page view chart hatası");
            return StatusCode(500, "Chart verisi alınamadı");
        }
    }

    /// <summary>
    /// Event listesi
    /// </summary>
    [HttpGet("events")]
    public async Task<ActionResult<List<EventListItemDto>>> GetEvents(
        [FromQuery] string tenantId = "DEMO_TENANT",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var events = await _statsService.GetEventsAsync(tenantId, page, pageSize);
            return Ok(events);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Events hatası");
            return StatusCode(500, "Event listesi alınamadı");
        }
    }

    /// <summary>
    /// User listesi
    /// </summary>
    [HttpGet("users")]
    public async Task<ActionResult<List<UserListItemDto>>> GetUsers(
        [FromQuery] string tenantId = "DEMO_TENANT",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var users = await _statsService.GetUsersAsync(tenantId, page, pageSize);
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Users hatası");
            return StatusCode(500, "User listesi alınamadı");
        }
    }
}
