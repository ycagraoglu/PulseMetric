namespace Analytics.API.Models;

/// <summary>
/// Kullanıcı detayları (session listesi dahil)
/// </summary>
public record UserDetailsDto(
    string VisitorId,
    string? Device,
    string? Browser,
    string? OS,
    string? Country,
    int TotalSessions,
    int TotalEvents,
    long FirstSeen,
    long LastSeen,
    List<UserSessionDto> RecentSessions
);

/// <summary>
/// Kullanıcının session özeti
/// </summary>
public record UserSessionDto(
    string SessionId,
    int EventCount,
    int DurationSeconds,
    long StartTime
);
