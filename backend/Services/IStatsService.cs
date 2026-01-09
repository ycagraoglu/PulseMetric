using Analytics.API.Models;

namespace Analytics.API.Services;

/// <summary>
/// İstatistik servisi interface'i.
/// Testability ve dependency inversion için.
/// </summary>
public interface IStatsService
{
    // Overview
    Task<StatsOverviewDto> GetOverviewAsync(string tenantId);
    
    // Realtime
    Task<RealtimeStatsDto> GetRealtimeAsync(string tenantId);
    
    // Pages
    Task<List<TopPageDto>> GetTopPagesAsync(string tenantId, int limit = 10);
    
    // Devices
    Task<List<DeviceStatsDto>> GetDeviceStatsAsync(string tenantId);
    
    // Charts
    Task<List<ChartDataPointDto>> GetPageViewChartAsync(string tenantId, int days = 7);
    Task<List<ChartDataPointDto>> GetEventsChartAsync(string tenantId, int days = 7);
    Task<UsersChartDto> GetUsersChartAsync(string tenantId, int days = 7);
    
    // Events
    Task<List<EventListItemDto>> GetEventsAsync(string tenantId, int page = 1, int pageSize = 20);
    Task<EventsCountDto> GetEventsCountAsync(string tenantId);
    Task<List<EventAggregationDto>> GetEventAggregationsAsync(string tenantId);
    
    // Users
    Task<List<UserListItemDto>> GetUsersAsync(string tenantId, int page = 1, int pageSize = 20);
    Task<UsersCountDto> GetUsersCountAsync(string tenantId);
    Task<List<PlatformDistributionDto>> GetPlatformDistributionAsync(string tenantId);
    Task<GeoDistributionDto> GetGeoDistributionAsync(string tenantId);
}
