using Analytics.API.Data.Entities;
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

    /// <summary>
    /// Analitik eventler tablosu
    /// </summary>
    public DbSet<AnalyticsEvent> AnalyticsEvents => Set<AnalyticsEvent>();

    /// <summary>
    /// Tenantlar (müşteriler) tablosu
    /// </summary>
    public DbSet<Tenant> Tenants => Set<Tenant>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // AnalyticsEvent indeksleri
        modelBuilder.Entity<AnalyticsEvent>(entity =>
        {
            // Tenant + Timestamp composite index (en sık kullanılan sorgu)
            entity.HasIndex(e => new { e.TenantId, e.Timestamp })
                  .HasDatabaseName("ix_events_tenant_timestamp");

            // Event name index (event tipi bazlı sorgular)
            entity.HasIndex(e => e.EventName)
                  .HasDatabaseName("ix_events_event_name");

            // Visitor index (kullanıcı bazlı sorgular)
            entity.HasIndex(e => e.VisitorId)
                  .HasDatabaseName("ix_events_visitor_id");

            // Timestamp index (zaman bazlı sorgular)
            entity.HasIndex(e => e.Timestamp)
                  .HasDatabaseName("ix_events_timestamp");
        });

        // Tenant indeksleri
        modelBuilder.Entity<Tenant>(entity =>
        {
            // ApiKey unique index
            entity.HasIndex(e => e.ApiKey)
                  .IsUnique()
                  .HasDatabaseName("ix_tenants_api_key");

            // Domain index
            entity.HasIndex(e => e.Domain)
                  .HasDatabaseName("ix_tenants_domain");
        });
    }
}
