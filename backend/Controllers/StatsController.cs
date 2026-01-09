using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// İstatistik API'leri.
/// Dashboard ve analitik sayfaları için veri sağlar.
/// SRP: HTTP request/response yönetimi - iş mantığı StatsService'de.
/// </summary>
[Route("api/stats")]
public class StatsController : ApiBaseController
{
    private readonly IStatsService _statsService;

    public StatsController(IStatsService statsService, ILogger<StatsController> logger)
        : base(logger)
    {
        _statsService = statsService;
    }

    #region Overview & Realtime

    /// <summary>
    /// Genel istatistik özeti
    /// </summary>
    [HttpGet("overview")]
    public Task<ActionResult<StatsOverviewDto>> GetOverview([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetOverviewAsync(tenantId),
            "İstatistik alınamadı");

    /// <summary>
    /// Realtime stats
    /// </summary>
    [HttpGet("realtime")]
    public Task<ActionResult<RealtimeStatsDto>> GetRealtime([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetRealtimeAsync(tenantId),
            "Realtime istatistik alınamadı");

    #endregion

    #region Pages & Devices

    /// <summary>
    /// En popüler sayfalar
    /// </summary>
    [HttpGet("top-pages")]
    public Task<ActionResult<List<TopPageDto>>> GetTopPages(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int limit = 10)
        => ExecuteAsync(
            () => _statsService.GetTopPagesAsync(tenantId, limit),
            "Sayfa istatistikleri alınamadı");

    /// <summary>
    /// Cihaz dağılımı
    /// </summary>
    [HttpGet("devices")]
    public Task<ActionResult<List<DeviceStatsDto>>> GetDevices([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetDeviceStatsAsync(tenantId),
            "Cihaz istatistikleri alınamadı");

    /// <summary>
    /// Zaman bazlı page view chart
    /// </summary>
    [HttpGet("chart/pageviews")]
    public Task<ActionResult<List<ChartDataPointDto>>> GetPageViewChart(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int days = 7)
        => ExecuteAsync(
            () => _statsService.GetPageViewChartAsync(tenantId, days),
            "Chart verisi alınamadı");

    #endregion

    #region Events

    /// <summary>
    /// Event listesi
    /// </summary>
    [HttpGet("events")]
    public Task<ActionResult<List<EventListItemDto>>> GetEvents(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
        => ExecuteAsync(
            () => _statsService.GetEventsAsync(tenantId, page, pageSize),
            "Event listesi alınamadı");

    /// <summary>
    /// Event sayıları (KPI)
    /// </summary>
    [HttpGet("events/count")]
    public Task<ActionResult<EventsCountDto>> GetEventsCount([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetEventsCountAsync(tenantId),
            "Event sayıları alınamadı");

    /// <summary>
    /// Event chart verisi
    /// </summary>
    [HttpGet("events/chart")]
    public Task<ActionResult<List<ChartDataPointDto>>> GetEventsChart(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int days = 7)
        => ExecuteAsync(
            () => _statsService.GetEventsChartAsync(tenantId, days),
            "Event chart verisi alınamadı");

    /// <summary>
    /// Event aggregations
    /// </summary>
    [HttpGet("events/aggregations")]
    public Task<ActionResult<List<EventAggregationDto>>> GetEventAggregations([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetEventAggregationsAsync(tenantId),
            "Event aggregations alınamadı");

    #endregion

    #region Users

    /// <summary>
    /// User listesi
    /// </summary>
    [HttpGet("users")]
    public Task<ActionResult<List<UserListItemDto>>> GetUsers(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
        => ExecuteAsync(
            () => _statsService.GetUsersAsync(tenantId, page, pageSize),
            "User listesi alınamadı");

    /// <summary>
    /// Kullanıcı sayıları (KPI)
    /// </summary>
    [HttpGet("users/count")]
    public Task<ActionResult<UsersCountDto>> GetUsersCount([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetUsersCountAsync(tenantId),
            "Kullanıcı sayıları alınamadı");

    /// <summary>
    /// Platform dağılımı
    /// </summary>
    [HttpGet("users/platforms")]
    public Task<ActionResult<List<PlatformDistributionDto>>> GetPlatformDistribution([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetPlatformDistributionAsync(tenantId),
            "Platform dağılımı alınamadı");

    /// <summary>
    /// Coğrafi dağılım (detaylı - ülke + şehir)
    /// </summary>
    [HttpGet("users/geo")]
    public Task<ActionResult<GeoDistributionDto>> GetGeoDistribution([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetGeoDistributionAsync(tenantId),
            "Coğrafi dağılım alınamadı");

    /// <summary>
    /// Ülke dağılımı (sadece ülkeler - frontend uyumluluğu için)
    /// </summary>
    [HttpGet("countries")]
    public Task<ActionResult<List<CountryStatsDto>>> GetCountries([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            async () => (await _statsService.GetGeoDistributionAsync(tenantId)).Countries,
            "Ülke dağılımı alınamadı");

    /// <summary>
    /// Kullanıcı chart verisi
    /// </summary>
    [HttpGet("users/chart")]
    public Task<ActionResult<UsersChartDto>> GetUsersChart(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int days = 7)
        => ExecuteAsync(
            () => _statsService.GetUsersChartAsync(tenantId, days),
            "Kullanıcı chart verisi alınamadı");

    #endregion
}
