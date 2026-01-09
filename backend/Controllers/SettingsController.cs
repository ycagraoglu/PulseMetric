using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// Settings API.
/// Tenant ayarlarını yönetir.
/// </summary>
[Route("api/settings")]
public class SettingsController : ApiBaseController
{
    private readonly ISettingsService _settingsService;

    public SettingsController(ISettingsService settingsService, ILogger<SettingsController> logger) 
        : base(logger)
    {
        _settingsService = settingsService;
    }

    /// <summary>
    /// Tenant ayarlarını getir
    /// </summary>
    [HttpGet]
    public Task<ActionResult<TenantSettingsDto>> GetSettings([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _settingsService.GetSettingsAsync(tenantId),
            "Ayarlar alınamadı",
            $"Settings getirme hatası: {tenantId}");

    /// <summary>
    /// Tenant ayarlarını güncelle
    /// </summary>
    [HttpPut]
    public Task<ActionResult<TenantSettingsDto>> UpdateSettings(
        [FromBody] UpdateSettingsRequest request,
        [FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _settingsService.UpdateSettingsAsync(tenantId, request),
            "Ayarlar güncellenemedi",
            $"Settings güncelleme hatası: {tenantId}");

    /// <summary>
    /// pulse.js embed script kodunu getir
    /// </summary>
    [HttpGet("script")]
    public ActionResult<object> GetEmbedScript([FromQuery] string tenantId = DefaultTenantId)
        => Execute(
            () => new { script = _settingsService.GetEmbedScript(tenantId, tenantId) },
            "Script alınamadı",
            $"Script getirme hatası: {tenantId}");
}
