using Analytics.API.Models;

namespace Analytics.API.Services;

/// <summary>
/// Settings servisi interface'i
/// </summary>
public interface ISettingsService
{
    Task<TenantSettingsDto> GetSettingsAsync(string tenantId);
    Task<TenantSettingsDto> UpdateSettingsAsync(string tenantId, UpdateSettingsRequest request);
    string GetEmbedScript(string tenantId, string apiKey);
}
