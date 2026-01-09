using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// Sessions API.
/// Session listesi, detayları ve istatistikleri için endpoint'ler.
/// SRP: Sadece HTTP request/response yönetimi - iş mantığı SessionsService'de.
/// </summary>
[Route("api/sessions")]
public class SessionsController : ApiBaseController
{
    private readonly ISessionsService _sessionsService;

    public SessionsController(ISessionsService sessionsService, ILogger<SessionsController> logger)
        : base(logger)
    {
        _sessionsService = sessionsService;
    }

    #region List & Details

    /// <summary>
    /// Session listesi
    /// </summary>
    [HttpGet]
    public Task<ActionResult<List<SessionListItemDto>>> GetSessions(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
        => ExecuteAsync(
            () => _sessionsService.GetSessionsAsync(tenantId, page, pageSize),
            "Session listesi alınamadı");

    /// <summary>
    /// Session detayları (eventler dahil)
    /// </summary>
    [HttpGet("{sessionId}")]
    public async Task<ActionResult<SessionDetailsDto>> GetSessionDetails(
        string sessionId,
        [FromQuery] string tenantId = DefaultTenantId)
    {
        // Validate session ID format
        if (_sessionsService.ParseSessionId(sessionId) == null)
            return BadRequest("Geçersiz session ID formatı");

        return await ExecuteWithNotFoundAsync(
            () => _sessionsService.GetSessionDetailsAsync(tenantId, sessionId),
            "Session bulunamadı",
            "Session detayları alınamadı",
            $"Session detay hatası: {sessionId}");
    }

    #endregion

    #region KPI & Charts

    /// <summary>
    /// Session sayıları (KPI)
    /// </summary>
    [HttpGet("count")]
    public Task<ActionResult<SessionsCountDto>> GetSessionsCount([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _sessionsService.GetSessionsCountAsync(tenantId),
            "Session sayıları alınamadı");

    /// <summary>
    /// Session chart verisi
    /// </summary>
    [HttpGet("chart")]
    public Task<ActionResult<List<SessionsChartPointDto>>> GetSessionsChart(
        [FromQuery] string tenantId = DefaultTenantId,
        [FromQuery] int days = 7)
        => ExecuteAsync(
            () => _sessionsService.GetSessionsChartAsync(tenantId, days),
            "Session chart verisi alınamadı");

    #endregion
}
