using Analytics.API.Data.Repositories;
using Analytics.API.Models;

namespace Analytics.API.Services;

/// <summary>
/// İstatistik hesaplama servisi.
/// Repository pattern kullanarak Data katmanına erişir.
/// </summary>
public class StatsService : IStatsService
{
    private readonly IAnalyticsRepository _repository;
    private readonly ILogger<StatsService> _logger;

    // Zaman sabitleri (ms cinsinden)
    private static class TimeConstants
    {
        public const long OneMinute = 60 * 1000;
        public const long FiveMinutes = 5 * OneMinute;
        public const long OneHour = 60 * OneMinute;
        public const long OneDay = 24 * OneHour;
    }

    public StatsService(IAnalyticsRepository repository, ILogger<StatsService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    #region Overview & Realtime

    public async Task<StatsOverviewDto> GetOverviewAsync(string tenantId)
    {
        var now = GetCurrentTimestamp();
        var fiveMinAgo = now - TimeConstants.FiveMinutes;

        var (totalUsers, totalPageViews, activeNow, avgSession) = await (
            _repository.GetTotalUsersCountAsync(tenantId),
            _repository.GetTotalPageViewsAsync(tenantId),
            _repository.GetActiveUsersCountAsync(tenantId, fiveMinAgo),
            _repository.GetAverageSessionDurationAsync(tenantId)
        ).WhenAll();

        return new StatsOverviewDto(totalUsers, activeNow, totalPageViews, (int)avgSession, 0);
    }

    public async Task<RealtimeStatsDto> GetRealtimeAsync(string tenantId)
    {
        var now = GetCurrentTimestamp();
        var fiveMinAgo = now - TimeConstants.FiveMinutes;
        var oneHourAgo = now - TimeConstants.OneHour;

        var (activeUsers, pageViewsLastHour, eventsLastHour, activePages) = await (
            _repository.GetActiveUsersCountAsync(tenantId, fiveMinAgo),
            _repository.GetPageViewsCountAsync(tenantId, oneHourAgo),
            _repository.GetEventsCountSinceAsync(tenantId, oneHourAgo),
            _repository.GetActivePagesAsync(tenantId, fiveMinAgo)
        ).WhenAll();

        var activePagesDto = activePages.Select(p => new ActivePageDto(p.UrlPath, p.UserCount)).ToList();
        return new RealtimeStatsDto(activeUsers, pageViewsLastHour, eventsLastHour, activePagesDto);
    }

    #endregion

    #region Pages & Devices

    public async Task<List<TopPageDto>> GetTopPagesAsync(string tenantId, int limit = 10)
    {
        var totalPageViews = await _repository.GetTotalPageViewsAsync(tenantId);
        if (totalPageViews == 0) return [];

        var pages = await _repository.GetTopPagesAsync(tenantId, limit);
        return pages.Select(p => new TopPageDto(
            p.Path,
            p.Views,
            CalculatePercentage(p.Views, totalPageViews)
        )).ToList();
    }

    public async Task<List<DeviceStatsDto>> GetDeviceStatsAsync(string tenantId)
    {
        var devices = await _repository.GetDeviceDistributionAsync(tenantId);
        var total = devices.Sum(d => d.Count);
        if (total == 0) return [];

        return devices.Select(d => new DeviceStatsDto(
            d.Device,
            d.Count,
            CalculatePercentage(d.Count, total)
        )).ToList();
    }

    #endregion

    #region Charts

    public async Task<List<ChartDataPointDto>> GetPageViewChartAsync(string tenantId, int days = 7)
    {
        var startTime = GetTimestampDaysAgo(days);
        var data = await _repository.GetDailyEventsAsync(tenantId, startTime);
        return data.Select(d => ToChartDataPoint(d.Date, d.Count)).ToList();
    }

    public async Task<List<ChartDataPointDto>> GetEventsChartAsync(string tenantId, int days = 7)
    {
        var startTime = GetTimestampDaysAgo(days);
        var data = await _repository.GetDailyEventsAsync(tenantId, startTime);
        return data.Select(d => ToChartDataPoint(d.Date, d.Count)).ToList();
    }

    public async Task<UsersChartDto> GetUsersChartAsync(string tenantId, int days = 7)
    {
        var startTime = GetTimestampDaysAgo(days);
        var data = await _repository.GetDailyUsersAsync(tenantId, startTime);
        var chartData = data.Select(d => ToChartDataPoint(d.Date, d.Count)).ToList();
        return new UsersChartDto(chartData, chartData);
    }

    #endregion

    #region Events

    public async Task<List<EventListItemDto>> GetEventsAsync(string tenantId, int page = 1, int pageSize = 20)
    {
        var events = await _repository.GetEventsAsync(tenantId, page, pageSize);
        return events.Select(e => new EventListItemDto(
            e.Id,
            e.EventName,
            e.UrlPath,
            e.VisitorId,
            e.Device,
            e.Timestamp
        )).ToList();
    }

    public async Task<EventsCountDto> GetEventsCountAsync(string tenantId)
    {
        var startOfToday = GetStartOfTodayTimestamp();

        var (total, todayCount, uniqueEventTypes) = await (
            _repository.GetTotalEventsCountAsync(tenantId),
            _repository.GetEventsCountSinceAsync(tenantId, startOfToday),
            _repository.GetUniqueEventTypesCountAsync(tenantId)
        ).WhenAll();

        return new EventsCountDto(total, todayCount, uniqueEventTypes, 0);
    }

    public async Task<List<EventAggregationDto>> GetEventAggregationsAsync(string tenantId)
    {
        var aggregations = await _repository.GetEventAggregationsAsync(tenantId, 10);
        return aggregations.Select(a => new EventAggregationDto(a.EventName, a.Count, 0)).ToList();
    }

    #endregion

    #region Users

    public async Task<List<UserListItemDto>> GetUsersAsync(string tenantId, int page = 1, int pageSize = 20)
    {
        var users = await _repository.GetUsersAsync(tenantId, page, pageSize);
        return users.Select(u => new UserListItemDto(
            u.VisitorId,
            u.SessionCount,
            u.Device,
            u.Browser,
            u.OS,
            u.LastSeen
        )).ToList();
    }

    public async Task<UsersCountDto> GetUsersCountAsync(string tenantId)
    {
        var now = GetCurrentTimestamp();
        var oneDayAgo = now - TimeConstants.OneDay;
        var fiveMinAgo = now - TimeConstants.FiveMinutes;

        var (total, dailyActive, online) = await (
            _repository.GetTotalUsersCountAsync(tenantId),
            _repository.GetActiveUsersCountAsync(tenantId, oneDayAgo),
            _repository.GetActiveUsersCountAsync(tenantId, fiveMinAgo)
        ).WhenAll();

        return new UsersCountDto(total, dailyActive, online, total > 0 ? 100 : 0);
    }

    public async Task<List<PlatformDistributionDto>> GetPlatformDistributionAsync(string tenantId)
    {
        var devices = await _repository.GetUserDevicesAsync(tenantId);
        var total = devices.Select(d => d.VisitorId).Distinct().Count();

        if (total == 0) return GetEmptyPlatformDistribution();

        var grouped = devices
            .GroupBy(e => MapDeviceToPlatform(e.Device))
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.VisitorId).Distinct().Count()
            );

        return
        [
            new("iOS", "ios", grouped.GetValueOrDefault("iOS"), CalculatePercentage(grouped.GetValueOrDefault("iOS"), total)),
            new("Android", "android", grouped.GetValueOrDefault("Android"), CalculatePercentage(grouped.GetValueOrDefault("Android"), total)),
            new("Web", "web", grouped.GetValueOrDefault("Web"), CalculatePercentage(grouped.GetValueOrDefault("Web"), total))
        ];
    }

    public async Task<GeoDistributionDto> GetGeoDistributionAsync(string tenantId)
    {
        var countryData = await _repository.GetUserCountriesAsync(tenantId);
        var total = countryData.Select(c => c.VisitorId).Distinct().Count();

        if (total == 0) return new GeoDistributionDto([], []);

        var countries = countryData
            .GroupBy(e => e.Country)
            .Select(g =>
            {
                var count = g.Select(x => x.VisitorId).Distinct().Count();
                return new CountryStatsDto(
                    g.Key ?? "Unknown",
                    GetCountryCode(g.Key),
                    count,
                    CalculatePercentage(count, total)
                );
            })
            .OrderByDescending(c => c.Count)
            .Take(10)
            .ToList();

        return new GeoDistributionDto(countries, []);
    }

    #endregion

    #region Helper Methods

    private static long GetCurrentTimestamp() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    private static long GetTimestampDaysAgo(int days) => DateTimeOffset.UtcNow.AddDays(-days).ToUnixTimeMilliseconds();

    private static long GetStartOfTodayTimestamp() => new DateTimeOffset(DateTimeOffset.UtcNow.Date, TimeSpan.Zero).ToUnixTimeMilliseconds();

    private static double CalculatePercentage(int part, int total) => total > 0 ? Math.Round((double)part / total * 100, 1) : 0;

    private static ChartDataPointDto ToChartDataPoint(DateTime date, int count) =>
        new(new DateTimeOffset(date, TimeSpan.Zero).ToUnixTimeMilliseconds(), count);

    private static string MapDeviceToPlatform(string? device) => device?.ToLower() switch
    {
        "mobile" or "iphone" or "ipad" => "iOS",
        "android" => "Android",
        _ => "Web"
    };

    private static List<PlatformDistributionDto> GetEmptyPlatformDistribution() =>
    [
        new("iOS", "ios", 0, 0),
        new("Android", "android", 0, 0),
        new("Web", "web", 0, 0)
    ];

    private static string GetCountryCode(string? country) => country?.ToLower() switch
    {
        "turkey" or "türkiye" => "TR",
        "united states" or "usa" => "US",
        "germany" => "DE",
        "france" => "FR",
        "united kingdom" or "uk" => "GB",
        "japan" => "JP",
        "china" => "CN",
        "india" => "IN",
        _ => "XX"
    };

    #endregion
}

/// <summary>
/// Parallel task extension methods
/// </summary>
public static class TaskExtensions
{
    public static async Task<(T1, T2, T3, T4)> WhenAll<T1, T2, T3, T4>(
        this (Task<T1>, Task<T2>, Task<T3>, Task<T4>) tasks)
    {
        await Task.WhenAll(tasks.Item1, tasks.Item2, tasks.Item3, tasks.Item4);
        return (tasks.Item1.Result, tasks.Item2.Result, tasks.Item3.Result, tasks.Item4.Result);
    }

    public static async Task<(T1, T2, T3)> WhenAll<T1, T2, T3>(
        this (Task<T1>, Task<T2>, Task<T3>) tasks)
    {
        await Task.WhenAll(tasks.Item1, tasks.Item2, tasks.Item3);
        return (tasks.Item1.Result, tasks.Item2.Result, tasks.Item3.Result);
    }
}
