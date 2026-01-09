using Analytics.API.Models;

namespace Analytics.API.Services;

/// <summary>
/// Users servisi interface'i.
/// Kullanıcı iş mantığı sorumluluğu - SRP.
/// </summary>
public interface IUsersService
{
    /// <summary>
    /// Kullanıcı listesi
    /// </summary>
    Task<List<UserListItemDto>> GetUsersAsync(string tenantId, int page, int pageSize);

    /// <summary>
    /// Kullanıcı detayları (sessionlar dahil)
    /// </summary>
    Task<UserDetailsDto?> GetUserDetailsAsync(string tenantId, string visitorId);

    /// <summary>
    /// Kullanıcı KPI'ları
    /// </summary>
    Task<UsersCountDto> GetUsersCountAsync(string tenantId);

    /// <summary>
    /// Platform dağılımı
    /// </summary>
    Task<List<PlatformDistributionDto>> GetPlatformDistributionAsync(string tenantId);

    /// <summary>
    /// Coğrafi dağılım
    /// </summary>
    Task<GeoDistributionDto> GetGeoDistributionAsync(string tenantId);

    /// <summary>
    /// Kullanıcı chart verisi
    /// </summary>
    Task<UsersChartDto> GetUsersChartAsync(string tenantId, int days);
}
