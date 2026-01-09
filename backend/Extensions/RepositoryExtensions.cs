using Analytics.API.Data;
using Analytics.API.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Analytics.API.Extensions;

/// <summary>
/// Repository layer DI extension.
/// Data access katmanı için tüm repository kayıtları.
/// </summary>
public static class RepositoryExtensions
{
    /// <summary>
    /// Repository servislerini kaydet
    /// </summary>
    public static IServiceCollection AddRepositories(this IServiceCollection services, IConfiguration configuration)
    {
        // PostgreSQL DbContext
        services.AddDbContext<AnalyticsDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("PostgreSQL")));

        // Repositories
        services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITenantRepository, TenantRepository>();
        services.AddScoped<IApiKeyRepository, ApiKeyRepository>();

        return services;
    }
}
