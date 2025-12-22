using Analytics.API.Data;
using Analytics.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Analytics.API.Services;

/// <summary>
/// İstatistik hesaplama servisi.
/// PostgreSQL sorgularıyla analitik veriler üretir.
/// </summary>
public class StatsService
{
    private readonly AnalyticsDbContext _context;
    private readonly ILogger<StatsService> _logger;

    public StatsService(AnalyticsDbContext context, ILogger<StatsService> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Genel istatistik özeti
    /// </summary>
    public async Task<StatsOverviewDto> GetOverviewAsync(string tenantId)
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var oneDayAgo = now - (24 * 60 * 60 * 1000);

        var query = _context.AnalyticsEvents.Where(e => e.TenantId == tenantId);

        var totalUsers = await query
            .Select(e => e.VisitorId)
            .Distinct()
            .CountAsync();

        var totalPageViews = await query
            .Where(e => e.EventName == "page_view")
            .CountAsync();

        // Son 5 dakikadaki aktif kullanıcılar
        var fiveMinAgo = now - (5 * 60 * 1000);
        var activeNow = await query
            .Where(e => e.Timestamp >= fiveMinAgo)
            .Select(e => e.VisitorId)
            .Distinct()
            .CountAsync();

        // Ortalama session süresi
        var avgSession = await query
            .Where(e => e.SessionDuration.HasValue && e.SessionDuration > 0)
            .AverageAsync(e => (double?)e.SessionDuration) ?? 0;

        // Bounce rate (sadece 1 event olan sessionlar)
        var bounceRate = 0.0; // TODO: Hesapla

        return new StatsOverviewDto(
            totalUsers,
            activeNow,
            totalPageViews,
            (int)avgSession,
            bounceRate
        );
    }

    /// <summary>
    /// Realtime stats
    /// </summary>
    public async Task<RealtimeStatsDto> GetRealtimeAsync(string tenantId)
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        var fiveMinAgo = now - (5 * 60 * 1000);
        var oneHourAgo = now - (60 * 60 * 1000);

        var query = _context.AnalyticsEvents.Where(e => e.TenantId == tenantId);

        var activeUsers = await query
            .Where(e => e.Timestamp >= fiveMinAgo)
            .Select(e => e.VisitorId)
            .Distinct()
            .CountAsync();

        var pageViewsLastHour = await query
            .Where(e => e.Timestamp >= oneHourAgo && e.EventName == "page_view")
            .CountAsync();

        var eventsLastHour = await query
            .Where(e => e.Timestamp >= oneHourAgo)
            .CountAsync();

        // Client-side evaluation for complex grouping
        var recentPageViews = await query
            .Where(e => e.Timestamp >= fiveMinAgo && e.EventName == "page_view")
            .Select(e => new { e.UrlPath, e.VisitorId })
            .ToListAsync();

        var activePages = recentPageViews
            .GroupBy(e => e.UrlPath)
            .Select(g => new ActivePageDto(g.Key, g.Select(x => x.VisitorId).Distinct().Count()))
            .OrderByDescending(x => x.Users)
            .Take(10)
            .ToList();

        return new RealtimeStatsDto(activeUsers, pageViewsLastHour, eventsLastHour, activePages);
    }

    /// <summary>
    /// En popüler sayfalar
    /// </summary>
    public async Task<List<TopPageDto>> GetTopPagesAsync(string tenantId, int limit = 10)
    {
        var query = _context.AnalyticsEvents
            .Where(e => e.TenantId == tenantId && e.EventName == "page_view");

        var total = await query.CountAsync();
        if (total == 0) return new List<TopPageDto>();

        var pages = await query
            .GroupBy(e => e.UrlPath)
            .Select(g => new { Path = g.Key, Views = g.Count() })
            .OrderByDescending(x => x.Views)
            .Take(limit)
            .ToListAsync();

        return pages.Select(p => new TopPageDto(
            p.Path,
            p.Views,
            Math.Round((double)p.Views / total * 100, 1)
        )).ToList();
    }

    /// <summary>
    /// Cihaz dağılımı
    /// </summary>
    public async Task<List<DeviceStatsDto>> GetDeviceStatsAsync(string tenantId)
    {
        var query = _context.AnalyticsEvents
            .Where(e => e.TenantId == tenantId && e.Device != null);

        var total = await query.CountAsync();
        if (total == 0) return new List<DeviceStatsDto>();

        var devices = await query
            .GroupBy(e => e.Device)
            .Select(g => new { Device = g.Key ?? "Unknown", Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return devices.Select(d => new DeviceStatsDto(
            d.Device,
            d.Count,
            Math.Round((double)d.Count / total * 100, 1)
        )).ToList();
    }

    /// <summary>
    /// Zaman bazlı page view chart
    /// </summary>
    public async Task<List<ChartDataPointDto>> GetPageViewChartAsync(string tenantId, int days = 7)
    {
        var now = DateTimeOffset.UtcNow;
        var startTime = now.AddDays(-days).ToUnixTimeMilliseconds();

        var events = await _context.AnalyticsEvents
            .Where(e => e.TenantId == tenantId && e.EventName == "page_view" && e.Timestamp >= startTime)
            .Select(e => e.Timestamp)
            .ToListAsync();

        // Günlük grupla
        var grouped = events
            .GroupBy(ts => DateTimeOffset.FromUnixTimeMilliseconds(ts).Date)
            .Select(g => new ChartDataPointDto(
                new DateTimeOffset(g.Key, TimeSpan.Zero).ToUnixTimeMilliseconds(),
                g.Count()
            ))
            .OrderBy(x => x.Timestamp)
            .ToList();

        return grouped;
    }

    /// <summary>
    /// Event listesi
    /// </summary>
    public async Task<List<EventListItemDto>> GetEventsAsync(string tenantId, int page = 1, int pageSize = 20)
    {
        var events = await _context.AnalyticsEvents
            .Where(e => e.TenantId == tenantId)
            .OrderByDescending(e => e.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(e => new EventListItemDto(
                e.Id,
                e.EventName,
                e.UrlPath,
                e.VisitorId,
                e.Device,
                e.Timestamp
            ))
            .ToListAsync();

        return events;
    }

    /// <summary>
    /// User listesi
    /// </summary>
    public async Task<List<UserListItemDto>> GetUsersAsync(string tenantId, int page = 1, int pageSize = 20)
    {
        // Client-side evaluation for complex grouping
        var allEvents = await _context.AnalyticsEvents
            .Where(e => e.TenantId == tenantId && e.VisitorId != null)
            .OrderByDescending(e => e.Timestamp)
            .Select(e => new { e.VisitorId, e.Device, e.Browser, e.OS, e.Timestamp })
            .ToListAsync();

        var users = allEvents
            .GroupBy(e => e.VisitorId)
            .Select(g => {
                var lastEvent = g.First();
                return new UserListItemDto(
                    g.Key!,
                    g.Select(e => e.Timestamp / (30 * 60 * 1000)).Distinct().Count(),
                    lastEvent.Device,
                    lastEvent.Browser,
                    lastEvent.OS,
                    lastEvent.Timestamp
                );
            })
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return users;
    }
}
