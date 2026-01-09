using Analytics.API.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Analytics.API.Data.Configurations;

/// <summary>
/// AnalyticsEvent entity configuration
/// </summary>
public class AnalyticsEventConfiguration : IEntityTypeConfiguration<AnalyticsEvent>
{
    public void Configure(EntityTypeBuilder<AnalyticsEvent> builder)
    {
        // Table
        builder.ToTable("analytics_events");
        
        // Primary Key
        builder.HasKey(e => e.Id);

        // Indexes
        builder.HasIndex(e => new { e.TenantId, e.Timestamp })
               .HasDatabaseName("ix_events_tenant_timestamp");
        
        builder.HasIndex(e => e.EventName)
               .HasDatabaseName("ix_events_event_name");
        
        builder.HasIndex(e => e.VisitorId)
               .HasDatabaseName("ix_events_visitor_id");
        
        builder.HasIndex(e => e.Timestamp)
               .HasDatabaseName("ix_events_timestamp");
    }
}

/// <summary>
/// Tenant entity configuration
/// </summary>
public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        // Table
        builder.ToTable("tenants");
        
        // Primary Key
        builder.HasKey(e => e.Id);

        // Indexes
        builder.HasIndex(e => e.ApiKey)
               .IsUnique()
               .HasDatabaseName("ix_tenants_api_key");
        
        builder.HasIndex(e => e.Domain)
               .HasDatabaseName("ix_tenants_domain");
    }
}

/// <summary>
/// User entity configuration
/// </summary>
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Table
        builder.ToTable("users");
        
        // Primary Key
        builder.HasKey(e => e.Id);

        // Indexes
        builder.HasIndex(e => e.Email)
               .IsUnique()
               .HasDatabaseName("ix_users_email");
        
        builder.HasIndex(e => e.TenantId)
               .HasDatabaseName("ix_users_tenant_id");

        // Ignore computed properties
        builder.Ignore(e => e.FullName);
    }
}
