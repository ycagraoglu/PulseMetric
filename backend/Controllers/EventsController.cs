using Analytics.API.Data.Repositories;
using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// Events API.
/// Event listesi, detay, filtreler ve aggregation'lar.
/// SRP: Event yönetimi sorumluluğu
/// </summary>
[Route("api/events")]
public class EventsController : ApiBaseController
{
    private readonly IAnalyticsRepository _repository;
    private readonly IStatsService _statsService;

    // Event renkleri - Configuration'a taşınabilir
    private static readonly Dictionary<string, string> EventColors = new()
    {
        { "page_view", "#3b82f6" },
        { "click", "#10b981" },
        { "scroll", "#8b5cf6" },
        { "form_submit", "#f59e0b" },
        { "error", "#ef4444" },
        { "session_end", "#6b7280" }
    };

    private const string DefaultEventColor = "#6366f1";

    public EventsController(
        IAnalyticsRepository repository,
        IStatsService statsService,
        ILogger<EventsController> logger) : base(logger)
    {
        _repository = repository;
        _statsService = statsService;
    }

    #region List & Details

    /// <summary>
    /// Filtrelenmiş event listesi (sayfalı)
    /// </summary>
    [HttpGet]
    public Task<ActionResult<EventsPagedResponse>> GetEvents(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] long? startDate = null,
        [FromQuery] long? endDate = null,
        [FromQuery] string? eventName = null,
        [FromQuery] string? visitorId = null,
        [FromQuery] string? device = null,
        [FromQuery] string? browser = null,
        [FromQuery] string? country = null,
        [FromQuery] string? urlPath = null,
        [FromQuery] string? search = null)
        => ExecuteAsync(async () =>
        {
            var (items, totalCount) = await _repository.GetEventsFilteredAsync(
                tenantId, page, pageSize, startDate, endDate,
                eventName, visitorId, device, browser, country, urlPath, search);

            return new EventsPagedResponse(
                MapToEventListItems(items),
                totalCount,
                page,
                pageSize,
                CalculateTotalPages(totalCount, pageSize)
            );
        }, "Event listesi alınamadı");

    /// <summary>
    /// Tek event detayı
    /// </summary>
    [HttpGet("{eventId}")]
    public Task<ActionResult<EventDetailsDto>> GetEventDetails(Guid eventId)
        => ExecuteWithNotFoundAsync(
            async () => MapToEventDetails(await _repository.GetEventByIdAsync(eventId)),
            "Event bulunamadı",
            "Event detayı alınamadı",
            $"Event detay hatası: {eventId}");

    #endregion

    #region KPI & Counts

    /// <summary>
    /// Event sayıları (KPI dashboard için)
    /// </summary>
    [HttpGet("count")]
    public Task<ActionResult<EventsCountDto>> GetEventsCount([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _statsService.GetEventsCountAsync(tenantId),
            "Event sayıları alınamadı");

    #endregion

    #region Aggregations & Charts

    /// <summary>
    /// Event tipi dağılımı (pie chart için)
    /// </summary>
    [HttpGet("types")]
    public Task<ActionResult<List<EventTypeDistributionDto>>> GetEventTypes(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int limit = 10)
        => ExecuteAsync(async () =>
        {
            var aggregations = await _statsService.GetEventAggregationsAsync(tenantId);
            var total = aggregations.Sum(a => a.Count);
            
            return aggregations.Take(limit).Select(a => new EventTypeDistributionDto(
                a.EventName,
                a.Count,
                CalculatePercentage(a.Count, total),
                GetEventColor(a.EventName)
            )).ToList();
        }, "Event tipleri alınamadı");

    /// <summary>
    /// Günlük event chart verisi
    /// </summary>
    [HttpGet("chart")]
    public Task<ActionResult<List<ChartDataPointDto>>> GetEventsChart(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int days = 7)
        => ExecuteAsync(
            () => _statsService.GetEventsChartAsync(tenantId, days),
            "Event chart alınamadı");

    /// <summary>
    /// Saatlik event dağılımı (bar chart için)
    /// </summary>
    [HttpGet("hourly")]
    public Task<ActionResult<List<HourlyEventDistributionDto>>> GetHourlyDistribution(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int days = 7)
        => ExecuteAsync(async () =>
        {
            var startTime = GetTimestampDaysAgo(days);
            var distribution = await _repository.GetHourlyDistributionAsync(tenantId, startTime);
            return distribution.Select(d => new HourlyEventDistributionDto(d.Hour, d.Count)).ToList();
        }, "Saatlik dağılım alınamadı");

    /// <summary>
    /// Benzersiz event tiplerini listele (dropdown için)
    /// </summary>
    [HttpGet("distinct-types")]
    public Task<ActionResult<List<string>>> GetDistinctTypes([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _repository.GetDistinctEventTypesAsync(tenantId),
            "Event tipleri alınamadı");

    #endregion

    #region Private Helpers

    private static List<EventListItemDto> MapToEventListItems(List<Models.Entities.AnalyticsEvent> items)
        => items.Select(e => new EventListItemDto(
            e.Id,
            e.EventName,
            e.UrlPath,
            e.VisitorId,
            e.Device,
            e.Timestamp
        )).ToList();

    private static EventDetailsDto? MapToEventDetails(Models.Entities.AnalyticsEvent? evt)
    {
        if (evt == null) return null;
        
        return new EventDetailsDto(
            evt.Id,
            evt.EventName,
            evt.UrlPath,
            evt.PageTitle,
            evt.VisitorId,
            evt.Device,
            evt.Browser,
            evt.OS,
            evt.Country,
            evt.Referrer,
            evt.ScreenWidth,
            evt.ScreenHeight,
            evt.Language,
            evt.SessionDuration,
            evt.Data,
            evt.Timestamp,
            evt.CreatedAt
        );
    }

    private static double CalculatePercentage(int count, int total)
        => total > 0 ? Math.Round((double)count / total * 100, 1) : 0;

    private static string GetEventColor(string eventName)
        => EventColors.GetValueOrDefault(eventName.ToLower(), DefaultEventColor);

    #endregion
}
