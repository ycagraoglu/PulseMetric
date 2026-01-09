using Analytics.API.Data.Repositories;
using Analytics.API.Models;
using Analytics.API.Models.Entities;

namespace Analytics.API.Services;

/// <summary>
/// API Key yönetim servisi.
/// CRUD operasyonları ve key validation.
/// </summary>
public class ApiKeyService : IApiKeyService
{
    private readonly IApiKeyRepository _repository;
    private readonly ILogger<ApiKeyService> _logger;

    #region Constants

    private const string CreateSuccessMessage = 
        "API key başarıyla oluşturuldu. Bu key'i güvenli bir yerde saklayın - tekrar gösterilmeyecek!";

    #endregion

    public ApiKeyService(IApiKeyRepository repository, ILogger<ApiKeyService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    #region Read Operations

    public async Task<List<ApiKeyListItemDto>> GetAllAsync(string tenantId)
        => (await _repository.GetAllByTenantAsync(tenantId))
            .Select(MapToListItem)
            .ToList();

    public async Task<ApiKeyDetailDto?> GetByIdAsync(Guid id, string tenantId)
    {
        var key = await GetAndValidateTenantAsync(id, tenantId);
        return key != null ? MapToDetail(key) : null;
    }

    #endregion

    #region Write Operations

    public async Task<CreateApiKeyResponse> CreateAsync(string tenantId, Guid userId, CreateApiKeyRequest request)
    {
        var apiKey = CreateApiKeyEntity(request, tenantId, userId);
        await _repository.CreateAsync(apiKey);

        LogOperation("oluşturuldu", apiKey.Name, apiKey.Prefix, tenantId);

        return new CreateApiKeyResponse(
            apiKey.Id,
            apiKey.Name,
            apiKey.Key,  // Key sadece oluşturulurken gösterilir!
            apiKey.Prefix,
            CreateSuccessMessage
        );
    }

    public async Task<bool> UpdateAsync(Guid id, string tenantId, UpdateApiKeyRequest request)
    {
        var key = await GetAndValidateTenantAsync(id, tenantId);
        if (key == null) return false;

        ApplyUpdates(key, request);
        await _repository.UpdateAsync(key);

        LogOperation("güncellendi", key.Id, tenantId);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, string tenantId)
    {
        var key = await GetAndValidateTenantAsync(id, tenantId);
        if (key == null) return false;

        await _repository.DeleteAsync(key);

        LogOperation("silindi", key.Id, tenantId);
        return true;
    }

    #endregion

    #region Validation

    public Task<bool> ValidateKeyAsync(string key, string tenantId)
        => _repository.ValidateKeyAsync(key, tenantId);

    #endregion

    #region Private Helpers - Entity Operations

    private async Task<ApiKey?> GetAndValidateTenantAsync(Guid id, string tenantId)
    {
        var key = await _repository.GetByIdAsync(id);
        return key?.TenantId == tenantId ? key : null;
    }

    private static ApiKey CreateApiKeyEntity(CreateApiKeyRequest request, string tenantId, Guid userId)
        => request.IsLive
            ? ApiKey.CreateLive(request.Name, tenantId, userId)
            : ApiKey.CreateTest(request.Name, tenantId, userId);

    private static void ApplyUpdates(ApiKey key, UpdateApiKeyRequest request)
    {
        if (request.Name != null)
            key.Name = request.Name;

        if (request.IsActive.HasValue)
        {
            if (request.IsActive.Value)
                key.Activate();
            else
                key.Deactivate();
        }
    }

    #endregion

    #region Private Helpers - Mapping

    private static ApiKeyListItemDto MapToListItem(ApiKey key) => new(
        key.Id,
        key.Name,
        key.MaskedKey,
        key.Prefix,
        key.IsActive,
        key.CreatedAt,
        key.LastUsedAt,
        key.UsageCount
    );

    private static ApiKeyDetailDto MapToDetail(ApiKey key) => new(
        key.Id,
        key.Name,
        key.MaskedKey,  // Güvenlik için her zaman maskeli
        key.Prefix,
        key.IsActive,
        key.CreatedAt,
        key.LastUsedAt,
        key.ExpiresAt,
        key.UsageCount
    );

    #endregion

    #region Private Helpers - Logging

    private void LogOperation(string operation, string name, string prefix, string tenantId)
        => _logger.LogInformation("API Key {Operation}: {Name} ({Prefix}) - Tenant: {TenantId}",
            operation, name, prefix, tenantId);

    private void LogOperation(string operation, Guid id, string tenantId)
        => _logger.LogInformation("API Key {Operation}: {Id} - Tenant: {TenantId}",
            operation, id, tenantId);

    #endregion
}
