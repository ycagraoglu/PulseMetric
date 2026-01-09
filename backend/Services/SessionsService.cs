using Analytics.API.Data.Repositories;
using Analytics.API.Models;
using Analytics.API.Models.Entities;

namespace Analytics.API.Services;

/// <summary>
/// Sessions servisi implementasyonu.
/// Session iş mantığı - repository'den DTO'ya dönüşüm, hesaplamalar.
/// SRP: Sadece session iş mantığı sorumluluğu.
/// </summary>
public class SessionsService : ISessionsService
{
    private readonly IAnalyticsRepository _repository;
    private readonly ILogger<SessionsService> _logger;

    #region Constants

    private const int SessionGapMinutes = 30;
    private const int MillisecondsInSecond = 1000;

    #endregion

    public SessionsService(IAnalyticsRepository repository, ILogger<SessionsService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    #region Public Methods

    public async Task<List<SessionListItemDto>> GetSessionsAsync(string tenantId, int page, int pageSize)
    {
        var sessions = await _repository.GetSessionsAsync(tenantId, page, pageSize);
        return MapToSessionListItems(sessions);
    }

    public async Task<SessionDetailsDto?> GetSessionDetailsAsync(string tenantId, string sessionId)
    {
        var parseResult = ParseSessionId(sessionId);
        if (parseResult == null)
            return null;

        var (visitorId, startTime) = parseResult.Value;
        var endTime = CalculateSessionEndTime(startTime);

        var events = await _repository.GetSessionEventsAsync(tenantId, visitorId, startTime, endTime);

        if (events.Count == 0)
            return null;

        return MapToSessionDetails(sessionId, visitorId, events);
    }

    public async Task<SessionsCountDto> GetSessionsCountAsync(string tenantId)
    {
        var startOfToday = GetStartOfTodayTimestamp();

        // Paralel sorgular - performans optimizasyonu
        var (total, todayCount, avgDuration, avgEvents, bounceRate) = 
            await GetAllSessionMetricsAsync(tenantId, startOfToday);

        return new SessionsCountDto(total, todayCount, avgDuration, avgEvents, bounceRate);
    }

    public async Task<List<SessionsChartPointDto>> GetSessionsChartAsync(string tenantId, int days)
    {
        var startTime = GetTimestampDaysAgo(days);
        var data = await _repository.GetDailySessionsAsync(tenantId, startTime);
        return MapToChartPoints(data);
    }

    public (string VisitorId, long StartTime)? ParseSessionId(string sessionId)
    {
        if (string.IsNullOrEmpty(sessionId))
            return null;

        var parts = sessionId.Split('_');
        if (parts.Length < 2 || !long.TryParse(parts[^1], out var startTime))
            return null;

        var visitorId = string.Join("_", parts[..^1]);
        return (visitorId, startTime);
    }

    #endregion

    #region Private Helpers - Time Calculations

    private static long CalculateSessionEndTime(long startTime)
        => startTime + (SessionGapMinutes * 60 * MillisecondsInSecond);

    private static long GetStartOfTodayTimestamp()
        => new DateTimeOffset(DateTimeOffset.UtcNow.Date, TimeSpan.Zero).ToUnixTimeMilliseconds();

    private static long GetTimestampDaysAgo(int days)
        => DateTimeOffset.UtcNow.AddDays(-days).ToUnixTimeMilliseconds();

    private static int CalculateDurationSeconds(long startTimestamp, long endTimestamp)
        => (int)((endTimestamp - startTimestamp) / MillisecondsInSecond);

    #endregion

    #region Private Helpers - Parallel Queries

    private async Task<(int Total, int Today, double AvgDuration, double AvgEvents, double BounceRate)> 
        GetAllSessionMetricsAsync(string tenantId, long startOfToday)
    {
        // Task.WhenAll ile paralel çalıştır - DRY
        var totalTask = _repository.GetTotalSessionsCountAsync(tenantId);
        var todayTask = _repository.GetSessionsCountSinceAsync(tenantId, startOfToday);
        var durationTask = _repository.GetAverageSessionDurationAsync(tenantId);
        var eventsTask = _repository.GetAverageEventsPerSessionAsync(tenantId);
        var bounceTask = _repository.GetBounceRateAsync(tenantId);

        await Task.WhenAll(totalTask, todayTask, durationTask, eventsTask, bounceTask);

        return (totalTask.Result, todayTask.Result, durationTask.Result, eventsTask.Result, bounceTask.Result);
    }

    #endregion

    #region Private Helpers - Mapping

    private static List<SessionListItemDto> MapToSessionListItems(List<SessionSummary> sessions)
        => sessions.Select(MapToSessionListItem).ToList();

    private static SessionListItemDto MapToSessionListItem(SessionSummary s) => new(
        s.SessionId,
        s.VisitorId,
        s.Device,
        s.Browser,
        s.OS,
        s.Country,
        s.EventCount,
        s.DurationSeconds,
        s.StartTime,
        s.EndTime
    );

    private static SessionDetailsDto MapToSessionDetails(string sessionId, string visitorId, List<AnalyticsEvent> events)
    {
        var firstEvent = events.First();
        var lastEvent = events.Last();

        var sessionEvents = events.Select(MapToSessionEvent).ToList();

        return new SessionDetailsDto(
            sessionId,
            visitorId,
            firstEvent.Device,
            firstEvent.Browser,
            firstEvent.OS,
            firstEvent.Country,
            events.Count,
            CalculateDurationSeconds(firstEvent.Timestamp, lastEvent.Timestamp),
            firstEvent.Timestamp,
            lastEvent.Timestamp,
            sessionEvents
        );
    }

    private static SessionEventDto MapToSessionEvent(AnalyticsEvent e) => new(
        e.Id,
        e.EventName,
        e.UrlPath,
        e.PageTitle,
        e.Timestamp
    );

    private static List<SessionsChartPointDto> MapToChartPoints(List<(DateTime Date, int Count)> data)
        => data.Select(d => new SessionsChartPointDto(d.Date.ToString("yyyy-MM-dd"), d.Count)).ToList();

    #endregion
}
