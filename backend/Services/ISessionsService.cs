using Analytics.API.Models;

namespace Analytics.API.Services;

/// <summary>
/// Sessions servisi interface'i.
/// Session iş mantığı sorumluluğu - SRP.
/// </summary>
public interface ISessionsService
{
    /// <summary>
    /// Session listesi (DTO olarak)
    /// </summary>
    Task<List<SessionListItemDto>> GetSessionsAsync(string tenantId, int page, int pageSize);

    /// <summary>
    /// Session detayları (eventler dahil)
    /// </summary>
    Task<SessionDetailsDto?> GetSessionDetailsAsync(string tenantId, string sessionId);

    /// <summary>
    /// Session KPI'ları
    /// </summary>
    Task<SessionsCountDto> GetSessionsCountAsync(string tenantId);

    /// <summary>
    /// Session chart verisi
    /// </summary>
    Task<List<SessionsChartPointDto>> GetSessionsChartAsync(string tenantId, int days);

    /// <summary>
    /// SessionId parse et
    /// </summary>
    (string VisitorId, long StartTime)? ParseSessionId(string sessionId);
}
