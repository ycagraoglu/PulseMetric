using Analytics.API.Data.Configurations;
using Analytics.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Analytics.API.Data;

/// <summary>
/// PulseMetric Analytics veritabanı context'i.
/// PostgreSQL ile Entity Framework Core kullanır.
/// </summary>
public class AnalyticsDbContext : DbContext
{
    public AnalyticsDbContext(DbContextOptions<AnalyticsDbContext> options) 
        : base(options)
    {
    }

    #region DbSets

    /// <summary>
    /// Analitik eventler tablosu
    /// </summary>
    public DbSet<AnalyticsEvent> AnalyticsEvents => Set<AnalyticsEvent>();

    /// <summary>
    /// Tenantlar (müşteriler) tablosu
    /// </summary>
    public DbSet<Tenant> Tenants => Set<Tenant>();

    /// <summary>
    /// Kullanıcılar tablosu (Authentication)
    /// </summary>
    public DbSet<User> Users => Set<User>();

    /// <summary>
    /// Tenant ayarları tablosu
    /// </summary>
    public DbSet<TenantSettings> TenantSettings => Set<TenantSettings>();

    /// <summary>
    /// API Keys tablosu
    /// </summary>
    public DbSet<ApiKey> ApiKeys => Set<ApiKey>();

    #endregion

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Entity configurations uygula
        modelBuilder.ApplyConfiguration(new AnalyticsEventConfiguration());
        modelBuilder.ApplyConfiguration(new TenantConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
    }

    /// <summary>
    /// SaveChanges öncesi otomatik UpdatedAt güncellemesi
    /// </summary>
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    private void UpdateTimestamps()
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        foreach (var entry in ChangeTracker.Entries<IUpdatable>())
        {
            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }
    }
}
