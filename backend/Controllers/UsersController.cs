using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// Users API.
/// Kullanıcı listesi, detayları ve istatistikleri için endpoint'ler.
/// SRP: Sadece HTTP request/response yönetimi - iş mantığı UsersService'de.
/// </summary>
[Route("api/users")]
public class UsersController : ApiBaseController
{
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService, ILogger<UsersController> logger)
        : base(logger)
    {
        _usersService = usersService;
    }

    #region List & Details

    /// <summary>
    /// Kullanıcı listesi
    /// </summary>
    [HttpGet]
    public Task<ActionResult<List<UserListItemDto>>> GetUsers(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
        => ExecuteAsync(
            () => _usersService.GetUsersAsync(tenantId, page, pageSize),
            "Kullanıcı listesi alınamadı");

    /// <summary>
    /// Kullanıcı detayları
    /// </summary>
    [HttpGet("{visitorId}")]
    public Task<ActionResult<UserDetailsDto>> GetUserDetails(
        string visitorId,
        [FromQuery] string tenantId = DefaultTenantId)
        => ExecuteWithNotFoundAsync(
            () => _usersService.GetUserDetailsAsync(tenantId, visitorId),
            "Kullanıcı bulunamadı",
            "Kullanıcı detayları alınamadı",
            $"User detay hatası: {visitorId}");

    #endregion

    #region KPI & Charts

    /// <summary>
    /// Kullanıcı sayıları (KPI)
    /// </summary>
    [HttpGet("count")]
    public Task<ActionResult<UsersCountDto>> GetUsersCount([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _usersService.GetUsersCountAsync(tenantId),
            "Kullanıcı sayıları alınamadı");

    /// <summary>
    /// Platform dağılımı
    /// </summary>
    [HttpGet("platforms")]
    public Task<ActionResult<List<PlatformDistributionDto>>> GetPlatformDistribution([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _usersService.GetPlatformDistributionAsync(tenantId),
            "Platform dağılımı alınamadı");

    /// <summary>
    /// Coğrafi dağılım
    /// </summary>
    [HttpGet("geo")]
    public Task<ActionResult<GeoDistributionDto>> GetGeoDistribution([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _usersService.GetGeoDistributionAsync(tenantId),
            "Coğrafi dağılım alınamadı");

    /// <summary>
    /// Kullanıcı chart verisi
    /// </summary>
    [HttpGet("chart")]
    public Task<ActionResult<UsersChartDto>> GetUsersChart(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int days = 7)
        => ExecuteAsync(
            () => _usersService.GetUsersChartAsync(tenantId, days),
            "Kullanıcı chart verisi alınamadı");

    #endregion
}
