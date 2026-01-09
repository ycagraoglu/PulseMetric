using Analytics.API.Services;

namespace Analytics.API.Extensions;

/// <summary>
/// Service layer DI extension.
/// Business logic katmanı için tüm servis kayıtları.
/// </summary>
public static class ServiceExtensions
{
    /// <summary>
    /// Business logic servislerini kaydet
    /// </summary>
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Core Services
        services.AddScoped<IStatsService, StatsService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ISettingsService, SettingsService>();

        // Domain Services
        services.AddScoped<ISessionsService, SessionsService>();
        services.AddScoped<IUsersService, UsersService>();
        services.AddScoped<IApiKeyService, ApiKeyService>();

        return services;
    }
}
