namespace Analytics.API.Models;

/// <summary>
/// JWT ayarları - appsettings.json'dan bind edilir.
/// </summary>
public class JwtSettings
{
    public const string SectionName = "Jwt";
    
    public string SecretKey { get; set; } = "PulseMetricDefaultSecretKey2024VerySecure!";
    public string Issuer { get; set; } = "PulseMetric";
    public string Audience { get; set; } = "PulseMetricApp";
    public int AccessTokenExpirationMinutes { get; set; } = 60;
    public int RefreshTokenExpirationDays { get; set; } = 7;
}
