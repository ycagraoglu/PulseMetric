using Analytics.API.Models;

namespace Analytics.API.Services;

/// <summary>
/// API Key yönetim servisi interface.
/// </summary>
public interface IApiKeyService
{
    #region Read Operations

    /// <summary>
    /// Tenant'a ait tüm API key'leri getir
    /// </summary>
    Task<List<ApiKeyListItemDto>> GetAllAsync(string tenantId);

    /// <summary>
    /// ID ile API key detayı getir
    /// </summary>
    Task<ApiKeyDetailDto?> GetByIdAsync(Guid id, string tenantId);

    #endregion

    #region Write Operations

    /// <summary>
    /// Yeni API key oluştur
    /// </summary>
    Task<CreateApiKeyResponse> CreateAsync(string tenantId, Guid userId, CreateApiKeyRequest request);

    /// <summary>
    /// API key güncelle
    /// </summary>
    Task<bool> UpdateAsync(Guid id, string tenantId, UpdateApiKeyRequest request);

    /// <summary>
    /// API key sil
    /// </summary>
    Task<bool> DeleteAsync(Guid id, string tenantId);

    #endregion

    #region Validation

    /// <summary>
    /// API key geçerliliğini kontrol et
    /// </summary>
    Task<bool> ValidateKeyAsync(string key, string tenantId);

    #endregion
}
