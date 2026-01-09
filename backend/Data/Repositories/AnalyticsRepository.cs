using Analytics.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Analytics.API.Data.Repositories;

/// <summary>
/// Analytics repository implementasyonu.
/// Tüm analitik veri erişimi burada merkezileştirilmiştir.
/// SRP: Analytics data access sorumluluğu.
/// </summary>
public class AnalyticsRepository : IAnalyticsRepository
{
    private readonly AnalyticsDbContext _context;

    #region Constants

    /// <summary>
    /// Session gap süresi (30 dakika) - ms cinsinden
    /// </summary>
    private const long SessionGapMs = 30 * 60 * 1000;

    private const string PageViewEvent = "page_view";

    #endregion

    public AnalyticsRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    #region Users

    public async Task<int> GetTotalUsersCountAsync(string tenantId)
        => await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null)
            .Select(e => e.VisitorId)
            .Distinct()
            .CountAsync();

    public async Task<int> GetActiveUsersCountAsync(string tenantId, long fromTimestamp)
        => await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null && e.Timestamp >= fromTimestamp)
            .Select(e => e.VisitorId)
            .Distinct()
            .CountAsync();

    public async Task<List<UserSummary>> GetUsersAsync(string tenantId, int page, int pageSize)
    {
        var allEvents = await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null)
            .OrderByDescending(e => e.Timestamp)
            .Select(e => new { e.VisitorId, e.Device, e.Browser, e.OS, e.Timestamp })
            .ToListAsync();

        return allEvents
            .GroupBy(e => e.VisitorId)
            .Select(g =>
            {
                var lastEvent = g.First();
                return new UserSummary(
                    g.Key!,
                    CountSessions(g.Select(e => e.Timestamp)),
                    lastEvent.Device,
                    lastEvent.Browser,
                    lastEvent.OS,
                    lastEvent.Timestamp
                );
            })
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    public async Task<List<(string Device, string? VisitorId)>> GetUserDevicesAsync(string tenantId)
        => await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null)
            .Select(e => new { e.Device, e.VisitorId })
            .Distinct()
            .Select(e => new ValueTuple<string, string?>(e.Device ?? "Unknown", e.VisitorId))
            .ToListAsync();

    public async Task<List<(string? Country, string? VisitorId)>> GetUserCountriesAsync(string tenantId)
        => await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null && e.Country != null)
            .Select(e => new { e.Country, e.VisitorId })
            .Distinct()
            .Select(e => new ValueTuple<string?, string?>(e.Country, e.VisitorId))
            .ToListAsync();

    public async Task<List<(DateTime Date, int Count)>> GetDailyUsersAsync(string tenantId, long fromTimestamp)
    {
        var events = await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null && e.Timestamp >= fromTimestamp)
            .Select(e => new { e.VisitorId, e.Timestamp })
            .ToListAsync();

        return events
            .GroupBy(e => TimestampToDate(e.Timestamp))
            .Select(g => (g.Key, g.Select(x => x.VisitorId).Distinct().Count()))
            .OrderBy(x => x.Key)
            .ToList();
    }

    public async Task<List<AnalyticsEvent>> GetUserEventsAsync(string tenantId, string visitorId)
        => await QueryTenant(tenantId)
            .Where(e => e.VisitorId == visitorId)
            .OrderByDescending(e => e.Timestamp)
            .ToListAsync();

    #endregion

    #region Events - Basic

    public async Task<int> GetTotalEventsCountAsync(string tenantId)
        => await QueryTenant(tenantId).CountAsync();

    public async Task<int> GetEventsCountSinceAsync(string tenantId, long fromTimestamp)
        => await QueryTenant(tenantId)
            .Where(e => e.Timestamp >= fromTimestamp)
            .CountAsync();

    public async Task<int> GetUniqueEventTypesCountAsync(string tenantId)
        => await QueryTenant(tenantId)
            .Select(e => e.EventName)
            .Distinct()
            .CountAsync();

    public async Task<List<AnalyticsEvent>> GetEventsAsync(string tenantId, int page, int pageSize)
        => await QueryTenant(tenantId)
            .OrderByDescending(e => e.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

    public async Task<List<(string EventName, int Count)>> GetEventAggregationsAsync(string tenantId, int limit)
    {
        var aggregations = await QueryTenant(tenantId)
            .GroupBy(e => e.EventName)
            .Select(g => new { EventName = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .Take(limit)
            .ToListAsync();

        return aggregations.Select(a => (a.EventName, a.Count)).ToList();
    }

    public async Task<List<(DateTime Date, int Count)>> GetDailyEventsAsync(string tenantId, long fromTimestamp)
    {
        var events = await QueryTenant(tenantId)
            .Where(e => e.Timestamp >= fromTimestamp)
            .Select(e => e.Timestamp)
            .ToListAsync();

        return events
            .GroupBy(TimestampToDate)
            .Select(g => (g.Key, g.Count()))
            .OrderBy(x => x.Key)
            .ToList();
    }

    #endregion

    #region Events - Filtered

    public async Task<(List<AnalyticsEvent> Items, int TotalCount)> GetEventsFilteredAsync(
        string tenantId, int page, int pageSize,
        long? startDate = null, long? endDate = null,
        string? eventName = null, string? visitorId = null,
        string? device = null, string? browser = null,
        string? country = null, string? urlPath = null, string? search = null)
    {
        var query = QueryTenant(tenantId);

        // Apply filters
        query = ApplyDateFilters(query, startDate, endDate);
        query = ApplyPropertyFilters(query, eventName, visitorId, device, browser, country, urlPath);
        query = ApplySearchFilter(query, search);

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(e => e.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<AnalyticsEvent?> GetEventByIdAsync(Guid eventId)
        => await _context.AnalyticsEvents.FindAsync(eventId);

    public async Task<List<string>> GetDistinctEventTypesAsync(string tenantId)
        => await QueryTenant(tenantId)
            .Select(e => e.EventName)
            .Distinct()
            .OrderBy(n => n)
            .ToListAsync();

    public async Task<List<(int Hour, int Count)>> GetHourlyDistributionAsync(string tenantId, long fromTimestamp)
    {
        var events = await QueryTenant(tenantId)
            .Where(e => e.Timestamp >= fromTimestamp)
            .Select(e => e.Timestamp)
            .ToListAsync();

        return events
            .GroupBy(ts => DateTimeOffset.FromUnixTimeMilliseconds(ts).Hour)
            .Select(g => (g.Key, g.Count()))
            .OrderBy(x => x.Item1)
            .ToList();
    }

    #endregion

    #region Realtime

    public async Task<List<(string UrlPath, int UserCount)>> GetActivePagesAsync(string tenantId, long fromTimestamp)
    {
        var recentPageViews = await QueryTenant(tenantId)
            .Where(e => e.Timestamp >= fromTimestamp && e.EventName == PageViewEvent)
            .Select(e => new { e.UrlPath, e.VisitorId })
            .ToListAsync();

        return recentPageViews
            .GroupBy(e => e.UrlPath)
            .Select(g => (g.Key, g.Select(x => x.VisitorId).Distinct().Count()))
            .OrderByDescending(x => x.Item2)
            .Take(10)
            .ToList();
    }

    public async Task<int> GetPageViewsCountAsync(string tenantId, long fromTimestamp)
        => await QueryTenant(tenantId)
            .Where(e => e.Timestamp >= fromTimestamp && e.EventName == PageViewEvent)
            .CountAsync();

    #endregion

    #region Stats Overview

    public async Task<int> GetTotalPageViewsAsync(string tenantId)
        => await QueryTenant(tenantId)
            .Where(e => e.EventName == PageViewEvent)
            .CountAsync();

    public async Task<double> GetAverageSessionDurationAsync(string tenantId)
        => await QueryTenant(tenantId)
            .Where(e => e.SessionDuration.HasValue && e.SessionDuration > 0)
            .AverageAsync(e => (double?)e.SessionDuration) ?? 0;

    public async Task<List<(string Path, int Views)>> GetTopPagesAsync(string tenantId, int limit)
    {
        var pages = await QueryTenant(tenantId)
            .Where(e => e.EventName == PageViewEvent)
            .GroupBy(e => e.UrlPath)
            .Select(g => new { Path = g.Key, Views = g.Count() })
            .OrderByDescending(x => x.Views)
            .Take(limit)
            .ToListAsync();

        return pages.Select(p => (p.Path, p.Views)).ToList();
    }

    public async Task<List<(string Device, int Count)>> GetDeviceDistributionAsync(string tenantId)
    {
        var devices = await QueryTenant(tenantId)
            .Where(e => e.Device != null)
            .GroupBy(e => e.Device)
            .Select(g => new { Device = g.Key ?? "Unknown", Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return devices.Select(d => (d.Device, d.Count)).ToList();
    }

    #endregion

    #region Sessions

    public async Task<List<SessionSummary>> GetSessionsAsync(string tenantId, int page, int pageSize)
    {
        var allEvents = await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null)
            .OrderBy(e => e.VisitorId)
            .ThenBy(e => e.Timestamp)
            .Select(e => new EventSnapshot(e.VisitorId!, e.Device, e.Browser, e.OS, e.Country, e.Timestamp))
            .ToListAsync();

        var sessions = BuildSessionsFromEvents(allEvents);

        return sessions
            .OrderByDescending(s => s.StartTime)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    public async Task<List<AnalyticsEvent>> GetSessionEventsAsync(string tenantId, string visitorId, long startTime, long endTime)
        => await QueryTenant(tenantId)
            .Where(e => e.VisitorId == visitorId && e.Timestamp >= startTime && e.Timestamp <= endTime)
            .OrderBy(e => e.Timestamp)
            .ToListAsync();

    public async Task<int> GetTotalSessionsCountAsync(string tenantId)
    {
        var sessions = await GetSessionsAsync(tenantId, 1, int.MaxValue);
        return sessions.Count;
    }

    public async Task<int> GetSessionsCountSinceAsync(string tenantId, long fromTimestamp)
    {
        var allEvents = await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null && e.Timestamp >= fromTimestamp)
            .OrderBy(e => e.VisitorId)
            .ThenBy(e => e.Timestamp)
            .Select(e => new { e.VisitorId, e.Timestamp })
            .ToListAsync();

        return CountSessionsFromEvents(allEvents.Select(e => (e.VisitorId!, e.Timestamp)));
    }

    public async Task<List<(DateTime Date, int Count)>> GetDailySessionsAsync(string tenantId, long fromTimestamp)
    {
        var allEvents = await QueryTenant(tenantId)
            .Where(e => e.VisitorId != null && e.Timestamp >= fromTimestamp)
            .OrderBy(e => e.Timestamp)
            .Select(e => new { e.VisitorId, e.Timestamp })
            .ToListAsync();

        var dailySessions = new Dictionary<DateTime, HashSet<string>>();
        var lastEventByVisitor = new Dictionary<string, long>();

        foreach (var e in allEvents)
        {
            var date = TimestampToDate(e.Timestamp);
            var visitorId = e.VisitorId!;

            if (!dailySessions.ContainsKey(date))
                dailySessions[date] = [];

            if (!lastEventByVisitor.TryGetValue(visitorId, out var lastTs) ||
                e.Timestamp - lastTs > SessionGapMs)
            {
                dailySessions[date].Add($"{visitorId}_{e.Timestamp}");
            }

            lastEventByVisitor[visitorId] = e.Timestamp;
        }

        return dailySessions
            .Select(kv => (kv.Key, kv.Value.Count))
            .OrderBy(x => x.Key)
            .ToList();
    }

    public async Task<double> GetAverageEventsPerSessionAsync(string tenantId)
    {
        var sessions = await GetSessionsAsync(tenantId, 1, int.MaxValue);
        return sessions.Count == 0 ? 0 : sessions.Average(s => s.EventCount);
    }

    public async Task<double> GetBounceRateAsync(string tenantId)
    {
        var sessions = await GetSessionsAsync(tenantId, 1, int.MaxValue);
        if (sessions.Count == 0) return 0;
        var bounces = sessions.Count(s => s.EventCount == 1);
        return Math.Round((double)bounces / sessions.Count * 100, 1);
    }

    #endregion

    #region Private Query Helpers (DRY)

    /// <summary>
    /// Tenant bazlı base query
    /// </summary>
    private IQueryable<AnalyticsEvent> QueryTenant(string tenantId)
        => _context.AnalyticsEvents.Where(e => e.TenantId == tenantId);

    /// <summary>
    /// Tarih filtrelerini uygula
    /// </summary>
    private static IQueryable<AnalyticsEvent> ApplyDateFilters(
        IQueryable<AnalyticsEvent> query, long? startDate, long? endDate)
    {
        if (startDate.HasValue)
            query = query.Where(e => e.Timestamp >= startDate.Value);
        if (endDate.HasValue)
            query = query.Where(e => e.Timestamp <= endDate.Value);
        return query;
    }

    /// <summary>
    /// Property filtrelerini uygula
    /// </summary>
    private static IQueryable<AnalyticsEvent> ApplyPropertyFilters(
        IQueryable<AnalyticsEvent> query,
        string? eventName, string? visitorId,
        string? device, string? browser,
        string? country, string? urlPath)
    {
        if (!string.IsNullOrEmpty(eventName))
            query = query.Where(e => e.EventName == eventName);
        if (!string.IsNullOrEmpty(visitorId))
            query = query.Where(e => e.VisitorId == visitorId);
        if (!string.IsNullOrEmpty(device))
            query = query.Where(e => e.Device == device);
        if (!string.IsNullOrEmpty(browser))
            query = query.Where(e => e.Browser == browser);
        if (!string.IsNullOrEmpty(country))
            query = query.Where(e => e.Country == country);
        if (!string.IsNullOrEmpty(urlPath))
            query = query.Where(e => e.UrlPath.Contains(urlPath));
        return query;
    }

    /// <summary>
    /// Search filtresini uygula
    /// </summary>
    private static IQueryable<AnalyticsEvent> ApplySearchFilter(
        IQueryable<AnalyticsEvent> query, string? search)
    {
        if (string.IsNullOrEmpty(search)) return query;

        return query.Where(e =>
            e.EventName.Contains(search) ||
            e.UrlPath.Contains(search) ||
            (e.VisitorId != null && e.VisitorId.Contains(search)));
    }

    #endregion

    #region Private Session Helpers (DRY)

    /// <summary>
    /// Timestamp listesinden session sayısını hesapla
    /// </summary>
    private static int CountSessions(IEnumerable<long> timestamps)
    {
        var list = timestamps.OrderBy(t => t).ToList();
        if (list.Count == 0) return 0;

        int count = 1;
        for (int i = 1; i < list.Count; i++)
        {
            if (list[i] - list[i - 1] > SessionGapMs)
                count++;
        }
        return count;
    }

    /// <summary>
    /// Event listesinden session sayısını hesapla
    /// </summary>
    private static int CountSessionsFromEvents(IEnumerable<(string VisitorId, long Timestamp)> events)
    {
        var grouped = events.GroupBy(e => e.VisitorId);
        return grouped.Sum(g => CountSessions(g.Select(e => e.Timestamp)));
    }

    /// <summary>
    /// Event snapshot'larından session listesi oluştur
    /// </summary>
    private static List<SessionSummary> BuildSessionsFromEvents(List<EventSnapshot> allEvents)
    {
        var sessions = new List<SessionSummary>();
        var groupedByVisitor = allEvents.GroupBy(e => e.VisitorId);

        foreach (var visitorGroup in groupedByVisitor)
        {
            var events = visitorGroup.OrderBy(e => e.Timestamp).ToList();
            sessions.AddRange(ExtractSessionsFromVisitorEvents(visitorGroup.Key, events));
        }

        return sessions;
    }

    /// <summary>
    /// Tek visitor'ın eventlerinden session'ları çıkar
    /// </summary>
    private static IEnumerable<SessionSummary> ExtractSessionsFromVisitorEvents(
        string visitorId, List<EventSnapshot> events)
    {
        if (events.Count == 0) yield break;

        var sessionStart = events[0].Timestamp;
        var sessionEvents = new List<EventSnapshot> { events[0] };

        for (int i = 1; i < events.Count; i++)
        {
            if (events[i].Timestamp - events[i - 1].Timestamp > SessionGapMs)
            {
                yield return CreateSessionSummary(visitorId, sessionStart, sessionEvents);
                sessionStart = events[i].Timestamp;
                sessionEvents.Clear();
            }
            sessionEvents.Add(events[i]);
        }

        if (sessionEvents.Count > 0)
            yield return CreateSessionSummary(visitorId, sessionStart, sessionEvents);
    }

    /// <summary>
    /// SessionSummary oluştur
    /// </summary>
    private static SessionSummary CreateSessionSummary(
        string visitorId, long sessionStart, List<EventSnapshot> events)
    {
        var first = events[0];
        var last = events[^1];
        return new SessionSummary(
            $"{visitorId}_{sessionStart}",
            visitorId,
            first.Device,
            first.Browser,
            first.OS,
            first.Country,
            events.Count,
            (int)((last.Timestamp - first.Timestamp) / 1000),
            first.Timestamp,
            last.Timestamp
        );
    }

    /// <summary>
    /// Timestamp -> DateTime dönüşümü
    /// </summary>
    private static DateTime TimestampToDate(long timestamp)
        => DateTimeOffset.FromUnixTimeMilliseconds(timestamp).Date;

    #endregion

    #region Internal Types

    /// <summary>
    /// Event snapshot for session calculation - memory efficient
    /// </summary>
    private record EventSnapshot(
        string VisitorId,
        string? Device,
        string? Browser,
        string? OS,
        string? Country,
        long Timestamp);

    #endregion
}
