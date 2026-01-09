namespace Analytics.API.Models;

/// <summary>
/// Session listesi için DTO
/// </summary>
public record SessionListItemDto(
    string SessionId,
    string VisitorId,
    string? Device,
    string? Browser,
    string? OS,
    string? Country,
    int EventCount,
    int DurationSeconds,
    long StartTime,
    long EndTime
);

/// <summary>
/// Session detayları (eventler dahil)
/// </summary>
public record SessionDetailsDto(
    string SessionId,
    string VisitorId,
    string? Device,
    string? Browser,
    string? OS,
    string? Country,
    int EventCount,
    int DurationSeconds,
    long StartTime,
    long EndTime,
    List<SessionEventDto> Events
);

/// <summary>
/// Session içindeki event
/// </summary>
public record SessionEventDto(
    Guid Id,
    string EventName,
    string UrlPath,
    string? PageTitle,
    long Timestamp
);

/// <summary>
/// Session sayıları (KPI)
/// </summary>
public record SessionsCountDto(
    int Total,
    int TodayCount,
    double AvgDuration,
    double AvgEventsPerSession,
    double BounceRate
);

/// <summary>
/// Session chart verisi
/// </summary>
public record SessionsChartPointDto(
    string Date,
    int Value
);
