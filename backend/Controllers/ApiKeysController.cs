using Analytics.API.Models;
using Analytics.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// API Keys yönetim endpoint'leri.
/// Tenant'ların pulse.js entegrasyonu için API key yönetimi.
/// </summary>
[Route("api/apikeys")]
[Authorize]
public class ApiKeysController : ApiBaseController
{
    private readonly IApiKeyService _apiKeyService;

    public ApiKeysController(IApiKeyService apiKeyService, ILogger<ApiKeysController> logger)
        : base(logger)
    {
        _apiKeyService = apiKeyService;
    }

    #region CRUD Endpoints

    /// <summary>
    /// Tüm API key'leri listele
    /// GET /api/apikeys
    /// </summary>
    [HttpGet]
    public Task<ActionResult<List<ApiKeyListItemDto>>> GetAll([FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _apiKeyService.GetAllAsync(tenantId),
            "API key listesi alınamadı");

    /// <summary>
    /// Tek API key detayı
    /// GET /api/apikeys/{id}
    /// </summary>
    [HttpGet("{id:guid}")]
    public Task<ActionResult<ApiKeyDetailDto>> GetById(Guid id, [FromQuery] string tenantId = DefaultTenantId)
        => ExecuteWithNotFoundAsync(
            () => _apiKeyService.GetByIdAsync(id, tenantId),
            "API key bulunamadı",
            "API key detayı alınamadı");

    /// <summary>
    /// Yeni API key oluştur
    /// POST /api/apikeys
    /// </summary>
    [HttpPost]
    public Task<ActionResult<CreateApiKeyResponse>> Create(
        [FromBody] CreateApiKeyRequest request,
        [FromQuery] string tenantId = DefaultTenantId)
        => ExecuteAsync(
            () => _apiKeyService.CreateAsync(tenantId, GetCurrentUserId(), request),
            "API key oluşturulamadı");

    /// <summary>
    /// API key güncelle
    /// PUT /api/apikeys/{id}
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdateApiKeyRequest request,
        [FromQuery] string tenantId = DefaultTenantId)
    {
        var result = await _apiKeyService.UpdateAsync(id, tenantId, request);
        return result ? NoContent() : NotFound(new { error = "API key bulunamadı" });
    }

    /// <summary>
    /// API key sil
    /// DELETE /api/apikeys/{id}
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, [FromQuery] string tenantId = DefaultTenantId)
    {
        var result = await _apiKeyService.DeleteAsync(id, tenantId);
        return result ? NoContent() : NotFound(new { error = "API key bulunamadı" });
    }

    #endregion

    #region Helpers

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(userIdClaim, out var userId) ? userId : Guid.Empty;
    }

    #endregion
}
