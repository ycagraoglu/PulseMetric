namespace Analytics.API.Models;

/// <summary>
/// Genel istatistik özeti
/// </summary>
public record StatsOverviewDto(
    long TotalUsers,
    int ActiveNow,
    long TotalPageViews,
    int AvgSessionSeconds,
    double BounceRate
);

/// <summary>
/// En popüler sayfalar
/// </summary>
public record TopPageDto(
    string Path,
    long Views,
    double Percentage
);

/// <summary>
/// Cihaz dağılımı
/// </summary>
public record DeviceStatsDto(
    string Device,
    long Count,
    double Percentage
);

/// <summary>
/// Zaman serisi veri noktası
/// </summary>
public record ChartDataPointDto(
    long Timestamp,
    long Value
);

/// <summary>
/// Realtime stats
/// </summary>
public record RealtimeStatsDto(
    int ActiveUsers,
    int PageViewsLastHour,
    int EventsLastHour,
    List<ActivePageDto> ActivePages
);

/// <summary>
/// Aktif sayfa
/// </summary>
public record ActivePageDto(
    string Path,
    int Users
);

/// <summary>
/// Event listesi için
/// </summary>
public record EventListItemDto(
    Guid Id,
    string EventName,
    string UrlPath,
    string? VisitorId,
    string? Device,
    long Timestamp
);

/// <summary>
/// User listesi için
/// </summary>
public record UserListItemDto(
    string VisitorId,
    int SessionCount,
    string? Device,
    string? Browser,
    string? OS,
    long LastSeen
);
