using Analytics.API.Data.Repositories;
using Analytics.API.Models;
using Analytics.API.Models.Entities;

namespace Analytics.API.Services;

/// <summary>
/// Settings servisi implementasyonu.
/// Tenant ayarlarını yönetir.
/// SRP: Settings iş mantığı sorumluluğu.
/// </summary>
public class SettingsService : ISettingsService
{
    private readonly ITenantRepository _tenantRepository;
    private readonly ILogger<SettingsService> _logger;

    #region Constants

    private const string DefaultProjectName = "My Project";
    private const int DefaultDataRetentionDays = 90;
    private const string EmbedScriptTemplate = @"<!-- PulseMetric Analytics -->
<script 
    src=""https://cdn.pulsemetric.io/pulse.js"" 
    data-client-id=""{0}""
    defer>
</script>";

    #endregion

    public SettingsService(ITenantRepository tenantRepository, ILogger<SettingsService> logger)
    {
        _tenantRepository = tenantRepository;
        _logger = logger;
    }

    #region Public Methods

    public async Task<TenantSettingsDto> GetSettingsAsync(string tenantId)
    {
        var settings = await GetOrCreateSettingsAsync(tenantId);
        return MapToDto(settings, tenantId);
    }

    public async Task<TenantSettingsDto> UpdateSettingsAsync(string tenantId, UpdateSettingsRequest request)
    {
        var settings = await GetOrCreateSettingsAsync(tenantId);

        ApplyUpdates(settings, request);
        await _tenantRepository.UpdateSettingsAsync(settings);

        _logger.LogInformation("Tenant {TenantId} ayarları güncellendi", tenantId);

        return MapToDto(settings, tenantId);
    }

    public string GetEmbedScript(string tenantId, string apiKey)
        => string.Format(EmbedScriptTemplate, apiKey);

    #endregion

    #region Private Helpers

    /// <summary>
    /// Ayarları getir veya varsayılan oluştur - GetOrCreate pattern
    /// </summary>
    private async Task<TenantSettings> GetOrCreateSettingsAsync(string tenantId)
        => await _tenantRepository.GetOrCreateSettingsAsync(
            tenantId, 
            () => CreateDefaultSettings(tenantId));

    /// <summary>
    /// Varsayılan ayarlar factory metodu
    /// </summary>
    private static TenantSettings CreateDefaultSettings(string tenantId) => new()
    {
        TenantId = tenantId,
        ProjectName = DefaultProjectName,
        DataRetentionDays = DefaultDataRetentionDays,
        EmailNotifications = true,
        WeeklyReports = true
    };

    /// <summary>
    /// Partial update - sadece gelen değerleri güncelle
    /// </summary>
    private static void ApplyUpdates(TenantSettings settings, UpdateSettingsRequest request)
    {
        // Project settings
        ApplyIfNotNull(request.ProjectName, v => settings.ProjectName = v);
        ApplyIfNotNull(request.ProjectUrl, v => settings.ProjectUrl = v);
        ApplyIfHasValue(request.DataRetentionDays, v => settings.DataRetentionDays = v);
        ApplyIfNotNull(request.Timezone, v => settings.Timezone = v);

        // Notification settings
        ApplyIfHasValue(request.EmailNotifications, v => settings.EmailNotifications = v);
        ApplyIfHasValue(request.PushNotifications, v => settings.PushNotifications = v);
        ApplyIfHasValue(request.WeeklyReports, v => settings.WeeklyReports = v);
        ApplyIfHasValue(request.DailyDigest, v => settings.DailyDigest = v);

        // Security settings
        ApplyIfHasValue(request.TwoFactorEnabled, v => settings.TwoFactorEnabled = v);
        ApplyIfHasValue(request.SessionTimeoutMinutes, v => settings.SessionTimeoutMinutes = v);
        ApplyIfNotNull(request.IpWhitelist, v => settings.IpWhitelist = v);
    }

    /// <summary>
    /// Entity -> DTO mapping
    /// </summary>
    private TenantSettingsDto MapToDto(TenantSettings settings, string tenantId) => new(
        TenantId: tenantId,
        ProjectName: settings.ProjectName ?? DefaultProjectName,
        ProjectUrl: settings.ProjectUrl ?? "",
        DataRetentionDays: settings.DataRetentionDays,
        Timezone: settings.Timezone,
        Notifications: new NotificationSettingsDto(
            settings.EmailNotifications,
            settings.PushNotifications,
            settings.WeeklyReports,
            settings.DailyDigest
        ),
        Security: new SecuritySettingsDto(
            settings.TwoFactorEnabled,
            settings.SessionTimeoutMinutes,
            settings.IpWhitelist
        ),
        EmbedScript: GetEmbedScript(tenantId, tenantId)
    );

    #endregion

    #region Generic Helpers (DRY)

    private static void ApplyIfNotNull<T>(T? value, Action<T> apply) where T : class
    {
        if (value != null) apply(value);
    }

    private static void ApplyIfHasValue<T>(T? value, Action<T> apply) where T : struct
    {
        if (value.HasValue) apply(value.Value);
    }

    #endregion
}
