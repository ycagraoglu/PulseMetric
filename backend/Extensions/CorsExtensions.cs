namespace Analytics.API.Extensions;

/// <summary>
/// CORS DI extension.
/// Cross-Origin Resource Sharing konfigürasyonu.
/// </summary>
public static class CorsExtensions
{
    /// <summary>
    /// CORS policy adı
    /// </summary>
    public const string PolicyName = "DynamicOriginPolicy";

    /// <summary>
    /// CORS servislerini kaydet
    /// </summary>
    public static IServiceCollection AddDynamicCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                // Development: Tüm originlere izin
                // Production: Tenant origin doğrulaması yapılabilir
                policy.SetIsOriginAllowed(_ => true)
                      .AllowAnyMethod()
                      .AllowAnyHeader()
                      .AllowCredentials();
            });
        });

        return services;
    }

    /// <summary>
    /// CORS middleware'ini uygula
    /// </summary>
    public static IApplicationBuilder UseDynamicCors(this IApplicationBuilder app)
    {
        return app.UseCors(PolicyName);
    }
}
