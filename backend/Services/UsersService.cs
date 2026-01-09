using Analytics.API.Data.Repositories;
using Analytics.API.Models;
using Analytics.API.Models.Entities;

namespace Analytics.API.Services;

/// <summary>
/// Users servisi implementasyonu.
/// Kullanıcı iş mantığı - session hesaplama, DTO dönüşümleri.
/// SRP: Sadece kullanıcı iş mantığı sorumluluğu.
/// </summary>
public class UsersService : IUsersService
{
    private readonly IAnalyticsRepository _repository;
    private readonly IStatsService _statsService;
    private readonly ILogger<UsersService> _logger;

    #region Constants

    private const long SessionGapMs = 30 * 60 * 1000; // 30 dakika
    private const int MaxSessionsToReturn = 10;
    private const int MillisecondsInSecond = 1000;

    #endregion

    public UsersService(
        IAnalyticsRepository repository, 
        IStatsService statsService,
        ILogger<UsersService> logger)
    {
        _repository = repository;
        _statsService = statsService;
        _logger = logger;
    }

    #region Public Methods

    public Task<List<UserListItemDto>> GetUsersAsync(string tenantId, int page, int pageSize)
        => _statsService.GetUsersAsync(tenantId, page, pageSize);

    public async Task<UserDetailsDto?> GetUserDetailsAsync(string tenantId, string visitorId)
    {
        var events = await _repository.GetUserEventsAsync(tenantId, visitorId);

        if (events.Count == 0)
            return null;

        return MapToUserDetails(visitorId, events);
    }

    public Task<UsersCountDto> GetUsersCountAsync(string tenantId)
        => _statsService.GetUsersCountAsync(tenantId);

    public Task<List<PlatformDistributionDto>> GetPlatformDistributionAsync(string tenantId)
        => _statsService.GetPlatformDistributionAsync(tenantId);

    public Task<GeoDistributionDto> GetGeoDistributionAsync(string tenantId)
        => _statsService.GetGeoDistributionAsync(tenantId);

    public Task<UsersChartDto> GetUsersChartAsync(string tenantId, int days)
        => _statsService.GetUsersChartAsync(tenantId, days);

    #endregion

    #region Private Helpers - Mapping

    private UserDetailsDto MapToUserDetails(string visitorId, List<AnalyticsEvent> events)
    {
        // Events sıralı gelmiyor olabilir
        var orderedEvents = events.OrderBy(e => e.Timestamp).ToList();
        var firstEvent = orderedEvents.First();
        var lastEvent = orderedEvents.Last();

        var sessions = CalculateSessions(orderedEvents);

        return new UserDetailsDto(
            visitorId,
            firstEvent.Device,
            firstEvent.Browser,
            firstEvent.OS,
            firstEvent.Country,
            sessions.Count,
            events.Count,
            firstEvent.Timestamp,
            lastEvent.Timestamp,
            sessions.Take(MaxSessionsToReturn).ToList()
        );
    }

    #endregion

    #region Private Helpers - Session Calculation

    /// <summary>
    /// Eventlerden session'ları hesapla (30 dakika gap ile).
    /// DRY: Bu mantık tek yerde tutulur, başka yerlerde tekrar edilmez.
    /// </summary>
    private List<UserSessionDto> CalculateSessions(List<AnalyticsEvent> orderedEvents)
    {
        var sessions = new List<UserSessionDto>();

        if (orderedEvents.Count == 0)
            return sessions;

        var sessionBuilder = new SessionBuilder(orderedEvents[0]);

        for (int i = 1; i < orderedEvents.Count; i++)
        {
            var currentEvent = orderedEvents[i];
            var previousEvent = orderedEvents[i - 1];

            if (IsNewSession(currentEvent.Timestamp, previousEvent.Timestamp))
            {
                // Mevcut session'ı kaydet
                sessions.Add(sessionBuilder.Build(previousEvent.Timestamp));

                // Yeni session başlat
                sessionBuilder = new SessionBuilder(currentEvent);
            }
            else
            {
                sessionBuilder.IncrementEventCount();
            }
        }

        // Son session'ı ekle
        sessions.Add(sessionBuilder.Build(orderedEvents.Last().Timestamp));

        return sessions.OrderByDescending(s => s.StartTime).ToList();
    }

    private static bool IsNewSession(long currentTimestamp, long previousTimestamp)
        => currentTimestamp - previousTimestamp > SessionGapMs;

    #endregion

    #region Session Builder (Internal)

    /// <summary>
    /// Session oluşturma helper sınıfı - Builder pattern.
    /// </summary>
    private class SessionBuilder
    {
        private readonly string _visitorId;
        private readonly long _startTime;
        private int _eventCount;

        public SessionBuilder(AnalyticsEvent firstEvent)
        {
            _visitorId = firstEvent.VisitorId ?? "unknown";
            _startTime = firstEvent.Timestamp;
            _eventCount = 1;
        }

        public void IncrementEventCount() => _eventCount++;

        public UserSessionDto Build(long endTimestamp) => new(
            $"{_visitorId}_{_startTime}",
            _eventCount,
            (int)((endTimestamp - _startTime) / MillisecondsInSecond),
            _startTime
        );
    }

    #endregion
}
