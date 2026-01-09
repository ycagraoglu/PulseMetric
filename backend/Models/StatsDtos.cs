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

/// <summary>
/// Kullanıcı sayıları (KPI)
/// </summary>
public record UsersCountDto(
    int Total,
    int DailyActive,
    int Online,
    double ChangePercent
);

/// <summary>
/// Platform dağılımı
/// </summary>
public record PlatformDistributionDto(
    string Name,
    string Icon,
    int Count,
    double Percentage
);

/// <summary>
/// Coğrafi dağılım
/// </summary>
public record GeoDistributionDto(
    List<CountryStatsDto> Countries,
    List<CityStatsDto> Cities
);

/// <summary>
/// Ülke istatistiği
/// </summary>
public record CountryStatsDto(
    string Name,
    string CountryCode,
    int Count,
    double Percentage
);

/// <summary>
/// Şehir istatistiği
/// </summary>
public record CityStatsDto(
    string Name,
    string Country,
    string CountryCode,
    int Count,
    double Percentage
);

/// <summary>
/// Kullanıcı chart verisi
/// </summary>
public record UsersChartDto(
    List<ChartDataPointDto> TotalUsers,
    List<ChartDataPointDto> DailyActive
);

/// <summary>
/// Event sayıları (KPI)
/// </summary>
public record EventsCountDto(
    int Total,
    int TodayCount,
    int UniqueEventTypes,
    double AvgPerSession
);

/// <summary>
/// Event aggregation
/// </summary>
public record EventAggregationDto(
    string EventName,
    int Count,
    int UniqueUsers
);

