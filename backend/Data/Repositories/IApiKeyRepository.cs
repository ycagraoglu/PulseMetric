using Analytics.API.Models.Entities;

namespace Analytics.API.Data.Repositories;

/// <summary>
/// API Key repository interface.
/// </summary>
public interface IApiKeyRepository
{
    /// <summary>
    /// Tenant'a ait tüm API key'leri getir
    /// </summary>
    Task<List<ApiKey>> GetAllByTenantAsync(string tenantId);

    /// <summary>
    /// ID ile API key getir
    /// </summary>
    Task<ApiKey?> GetByIdAsync(Guid id);

    /// <summary>
    /// Key değeri ile API key getir (validation için)
    /// </summary>
    Task<ApiKey?> GetByKeyAsync(string key);

    /// <summary>
    /// Yeni API key oluştur
    /// </summary>
    Task<ApiKey> CreateAsync(ApiKey apiKey);

    /// <summary>
    /// API key güncelle
    /// </summary>
    Task UpdateAsync(ApiKey apiKey);

    /// <summary>
    /// API key sil
    /// </summary>
    Task DeleteAsync(ApiKey apiKey);

    /// <summary>
    /// Key kullanımını kaydet
    /// </summary>
    Task RecordUsageAsync(string key);

    /// <summary>
    /// Key geçerli mi kontrol et
    /// </summary>
    Task<bool> ValidateKeyAsync(string key, string tenantId);
}
