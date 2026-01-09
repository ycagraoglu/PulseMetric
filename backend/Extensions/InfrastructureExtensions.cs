using Analytics.API.Services;
using Analytics.API.Workers;

namespace Analytics.API.Extensions;

/// <summary>
/// Infrastructure DI extension.
/// Queue servisleri, background workers ve diğer altyapı bileşenleri.
/// </summary>
public static class InfrastructureExtensions
{
    /// <summary>
    /// Altyapı servislerini kaydet
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        // Queue Service (Redis)
        services.AddSingleton<IQueueService, RedisQueueService>();

        // GeoIP Service (HTTP Client)
        services.AddHttpClient<IGeoIpService, GeoIpService>();

        // Background Workers
        services.AddHostedService<EventProcessorWorker>();

        return services;
    }
}
