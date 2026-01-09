using System.Text;
using Analytics.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Analytics.API.Extensions;

/// <summary>
/// Authentication ve Authorization DI extension.
/// JWT authentication ve authorization konfigürasyonu.
/// </summary>
public static class AuthenticationExtensions
{
    /// <summary>
    /// JWT Authentication servislerini kaydet
    /// </summary>
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection(JwtSettings.SectionName);
        services.Configure<JwtSettings>(jwtSettings);

        var secretKey = jwtSettings["SecretKey"] ?? DefaultSecrets.SecretKey;
        var issuer = jwtSettings["Issuer"] ?? DefaultSecrets.Issuer;
        var audience = jwtSettings["Audience"] ?? DefaultSecrets.Audience;

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ClockSkew = TimeSpan.Zero
                };
            });

        services.AddAuthorization();

        return services;
    }

    /// <summary>
    /// Varsayılan JWT değerleri (Development için)
    /// </summary>
    private static class DefaultSecrets
    {
        public const string SecretKey = "PulseMetricDefaultSecretKey2024VerySecure!";
        public const string Issuer = "PulseMetric";
        public const string Audience = "PulseMetricApp";
    }
}
