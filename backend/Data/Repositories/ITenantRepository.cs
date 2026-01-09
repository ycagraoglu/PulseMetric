using Analytics.API.Models.Entities;

namespace Analytics.API.Data.Repositories;

/// <summary>
/// Tenant repository interface.
/// SRP: Tenant ve TenantSettings veri erişimi sorumluluğu.
/// </summary>
public interface ITenantRepository
{
    #region Tenant

    /// <summary>
    /// ID ile tenant getir
    /// </summary>
    Task<Tenant?> GetByIdAsync(Guid id);

    /// <summary>
    /// API key ile tenant getir
    /// </summary>
    Task<Tenant?> GetByApiKeyAsync(string apiKey);

    /// <summary>
    /// Tenant aktif mi kontrol et
    /// </summary>
    Task<bool> IsActiveAsync(string apiKey);

    /// <summary>
    /// Tüm tenantları listele
    /// </summary>
    Task<List<Tenant>> GetAllAsync();

    /// <summary>
    /// Yeni tenant oluştur
    /// </summary>
    Task<Tenant> CreateAsync(Tenant tenant);

    /// <summary>
    /// Tenant güncelle
    /// </summary>
    Task UpdateAsync(Tenant tenant);

    #endregion

    #region TenantSettings

    /// <summary>
    /// Tenant ayarlarını getir
    /// </summary>
    Task<TenantSettings?> GetSettingsAsync(string tenantId);

    /// <summary>
    /// Ayar varsa getir, yoksa oluştur (GetOrCreate pattern)
    /// </summary>
    Task<TenantSettings> GetOrCreateSettingsAsync(string tenantId, Func<TenantSettings> defaultFactory);

    /// <summary>
    /// Ayarları oluştur
    /// </summary>
    Task<TenantSettings> CreateSettingsAsync(TenantSettings settings);

    /// <summary>
    /// Ayarları güncelle
    /// </summary>
    Task UpdateSettingsAsync(TenantSettings settings);

    #endregion
}
