using Analytics.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Analytics.API.Data.Repositories;

/// <summary>
/// Tenant repository implementasyonu.
/// SRP: Tenant ve TenantSettings veri erişimi.
/// </summary>
public class TenantRepository : ITenantRepository
{
    private readonly AnalyticsDbContext _context;

    public TenantRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    #region Tenant

    public async Task<Tenant?> GetByIdAsync(Guid id)
        => await _context.Tenants.FindAsync(id);

    public async Task<Tenant?> GetByApiKeyAsync(string apiKey)
        => await _context.Tenants.FirstOrDefaultAsync(t => t.ApiKey == apiKey);

    public async Task<bool> IsActiveAsync(string apiKey)
        => await _context.Tenants.AnyAsync(t => t.ApiKey == apiKey && t.IsActive);

    public async Task<List<Tenant>> GetAllAsync()
        => await _context.Tenants
            .Where(t => t.IsActive)
            .OrderBy(t => t.Name)
            .ToListAsync();

    public async Task<Tenant> CreateAsync(Tenant tenant)
    {
        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();
        return tenant;
    }

    public async Task UpdateAsync(Tenant tenant)
    {
        _context.Tenants.Update(tenant);
        await _context.SaveChangesAsync();
    }

    #endregion

    #region TenantSettings

    public async Task<TenantSettings?> GetSettingsAsync(string tenantId)
        => await _context.TenantSettings.FirstOrDefaultAsync(s => s.TenantId == tenantId);

    public async Task<TenantSettings> GetOrCreateSettingsAsync(string tenantId, Func<TenantSettings> defaultFactory)
    {
        var settings = await GetSettingsAsync(tenantId);
        
        if (settings != null)
            return settings;

        // Varsayılan ayarları oluştur
        settings = defaultFactory();
        return await CreateSettingsAsync(settings);
    }

    public async Task<TenantSettings> CreateSettingsAsync(TenantSettings settings)
    {
        _context.TenantSettings.Add(settings);
        await _context.SaveChangesAsync();
        return settings;
    }

    public async Task UpdateSettingsAsync(TenantSettings settings)
    {
        _context.TenantSettings.Update(settings);
        await _context.SaveChangesAsync();
    }

    #endregion
}
