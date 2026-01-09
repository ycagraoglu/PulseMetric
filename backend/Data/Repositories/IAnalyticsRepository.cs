using Analytics.API.Models.Entities;

namespace Analytics.API.Data.Repositories;

/// <summary>
/// Analytics verileri için repository interface.
/// DbContext sadece bu katmanda kullanılır.
/// </summary>
public interface IAnalyticsRepository
{
    // ============================================
    // Users
    // ============================================
    
    /// <summary>
    /// Toplam benzersiz kullanıcı sayısı
    /// </summary>
    Task<int> GetTotalUsersCountAsync(string tenantId);
    
    /// <summary>
    /// Belirli zaman aralığındaki aktif kullanıcı sayısı
    /// </summary>
    Task<int> GetActiveUsersCountAsync(string tenantId, long fromTimestamp);
    
    /// <summary>
    /// Kullanıcı listesi (gruplandırılmış)
    /// </summary>
    Task<List<UserSummary>> GetUsersAsync(string tenantId, int page, int pageSize);
    
    /// <summary>
    /// Platform bazlı kullanıcı dağılımı
    /// </summary>
    Task<List<(string Device, string? VisitorId)>> GetUserDevicesAsync(string tenantId);
    
    /// <summary>
    /// Ülke bazlı kullanıcı dağılımı
    /// </summary>
    Task<List<(string? Country, string? VisitorId)>> GetUserCountriesAsync(string tenantId);
    
    /// <summary>
    /// Günlük kullanıcı chart verisi
    /// </summary>
    Task<List<(DateTime Date, int Count)>> GetDailyUsersAsync(string tenantId, long fromTimestamp);
    
    /// <summary>
    /// Belirli kullanıcının tüm eventleri
    /// </summary>
    Task<List<AnalyticsEvent>> GetUserEventsAsync(string tenantId, string visitorId);

    // ============================================
    // Events
    // ============================================
    
    /// <summary>
    /// Toplam event sayısı
    /// </summary>
    Task<int> GetTotalEventsCountAsync(string tenantId);
    
    /// <summary>
    /// Belirli zamandan sonraki event sayısı
    /// </summary>
    Task<int> GetEventsCountSinceAsync(string tenantId, long fromTimestamp);
    
    /// <summary>
    /// Benzersiz event tipi sayısı
    /// </summary>
    Task<int> GetUniqueEventTypesCountAsync(string tenantId);
    
    /// <summary>
    /// Event listesi
    /// </summary>
    Task<List<AnalyticsEvent>> GetEventsAsync(string tenantId, int page, int pageSize);
    
    /// <summary>
    /// Event aggregations (gruplandırılmış sayılar)
    /// </summary>
    Task<List<(string EventName, int Count)>> GetEventAggregationsAsync(string tenantId, int limit);
    
    /// <summary>
    /// Günlük event chart verisi
    /// </summary>
    Task<List<(DateTime Date, int Count)>> GetDailyEventsAsync(string tenantId, long fromTimestamp);

    /// <summary>
    /// Filtrelenmiş event listesi (sayfalı)
    /// </summary>
    Task<(List<AnalyticsEvent> Items, int TotalCount)> GetEventsFilteredAsync(
        string tenantId,
        int page,
        int pageSize,
        long? startDate = null,
        long? endDate = null,
        string? eventName = null,
        string? visitorId = null,
        string? device = null,
        string? browser = null,
        string? country = null,
        string? urlPath = null,
        string? search = null);

    /// <summary>
    /// Tek event detayı
    /// </summary>
    Task<AnalyticsEvent?> GetEventByIdAsync(Guid eventId);

    /// <summary>
    /// Benzersiz event tiplerini listele
    /// </summary>
    Task<List<string>> GetDistinctEventTypesAsync(string tenantId);

    /// <summary>
    /// Saatlik event dağılımı
    /// </summary>
    Task<List<(int Hour, int Count)>> GetHourlyDistributionAsync(string tenantId, long fromTimestamp);

    // ============================================
    // Realtime
    // ============================================
    
    /// <summary>
    /// Aktif sayfalar (son X dakika)
    /// </summary>
    Task<List<(string UrlPath, int UserCount)>> GetActivePagesAsync(string tenantId, long fromTimestamp);
    
    /// <summary>
    /// Son X dakikadaki page view sayısı
    /// </summary>
    Task<int> GetPageViewsCountAsync(string tenantId, long fromTimestamp);

    // ============================================
    // Stats Overview
    // ============================================
    
    /// <summary>
    /// Toplam page view sayısı
    /// </summary>
    Task<int> GetTotalPageViewsAsync(string tenantId);
    
    /// <summary>
    /// Ortalama session süresi
    /// </summary>
    Task<double> GetAverageSessionDurationAsync(string tenantId);
    
    /// <summary>
    /// Top sayfalar
    /// </summary>
    Task<List<(string Path, int Views)>> GetTopPagesAsync(string tenantId, int limit);
    
    /// <summary>
    /// Cihaz dağılımı
    /// </summary>
    Task<List<(string Device, int Count)>> GetDeviceDistributionAsync(string tenantId);

    // ============================================
    // Sessions
    // ============================================
    
    /// <summary>
    /// Session listesi (visitor bazlı event grupları)
    /// </summary>
    Task<List<SessionSummary>> GetSessionsAsync(string tenantId, int page, int pageSize);
    
    /// <summary>
    /// Belirli bir session'ın eventleri
    /// </summary>
    Task<List<AnalyticsEvent>> GetSessionEventsAsync(string tenantId, string visitorId, long startTime, long endTime);
    
    /// <summary>
    /// Toplam session sayısı
    /// </summary>
    Task<int> GetTotalSessionsCountAsync(string tenantId);
    
    /// <summary>
    /// Belirli zamandan sonraki session sayısı
    /// </summary>
    Task<int> GetSessionsCountSinceAsync(string tenantId, long fromTimestamp);
    
    /// <summary>
    /// Günlük session chart verisi
    /// </summary>
    Task<List<(DateTime Date, int Count)>> GetDailySessionsAsync(string tenantId, long fromTimestamp);
    
    /// <summary>
    /// Session bazlı ortalama event sayısı
    /// </summary>
    Task<double> GetAverageEventsPerSessionAsync(string tenantId);
    
    /// <summary>
    /// Bounce rate (tek eventli session oranı)
    /// </summary>
    Task<double> GetBounceRateAsync(string tenantId);
}

/// <summary>
/// Kullanıcı özeti (repository'den dönen)
/// </summary>
public record UserSummary(
    string VisitorId,
    int SessionCount,
    string? Device,
    string? Browser,
    string? OS,
    long LastSeen
);

/// <summary>
/// Session özeti (repository'den dönen)
/// </summary>
public record SessionSummary(
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

