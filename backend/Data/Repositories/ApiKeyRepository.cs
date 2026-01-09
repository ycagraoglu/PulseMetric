using Analytics.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Analytics.API.Data.Repositories;

/// <summary>
/// API Key repository implementasyonu.
/// </summary>
public class ApiKeyRepository : IApiKeyRepository
{
    private readonly AnalyticsDbContext _context;

    public ApiKeyRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    #region Read Operations

    public async Task<List<ApiKey>> GetAllByTenantAsync(string tenantId)
        => await _context.ApiKeys
            .Where(k => k.TenantId == tenantId)
            .OrderByDescending(k => k.CreatedAt)
            .ToListAsync();

    public async Task<ApiKey?> GetByIdAsync(Guid id)
        => await _context.ApiKeys.FindAsync(id);

    public async Task<ApiKey?> GetByKeyAsync(string key)
        => await _context.ApiKeys
            .FirstOrDefaultAsync(k => k.Key == key);

    #endregion

    #region Write Operations

    public async Task<ApiKey> CreateAsync(ApiKey apiKey)
    {
        _context.ApiKeys.Add(apiKey);
        await _context.SaveChangesAsync();
        return apiKey;
    }

    public async Task UpdateAsync(ApiKey apiKey)
    {
        _context.ApiKeys.Update(apiKey);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(ApiKey apiKey)
    {
        _context.ApiKeys.Remove(apiKey);
        await _context.SaveChangesAsync();
    }

    #endregion

    #region Validation & Usage

    public async Task RecordUsageAsync(string key)
    {
        var apiKey = await GetByKeyAsync(key);
        if (apiKey != null)
        {
            apiKey.LastUsedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            apiKey.UsageCount++;
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ValidateKeyAsync(string key, string tenantId)
    {
        var apiKey = await _context.ApiKeys
            .FirstOrDefaultAsync(k => k.Key == key && k.TenantId == tenantId && k.IsActive);

        if (apiKey == null)
            return false;

        // Check expiration
        if (apiKey.ExpiresAt.HasValue && 
            apiKey.ExpiresAt.Value < DateTimeOffset.UtcNow.ToUnixTimeMilliseconds())
            return false;

        return true;
    }

    #endregion
}
