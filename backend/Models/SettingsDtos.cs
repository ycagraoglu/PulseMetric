namespace Analytics.API.Models;

/// <summary>
/// Tenant ayarları response DTO
/// </summary>
public record TenantSettingsDto(
    // Project
    string TenantId,
    string ProjectName,
    string ProjectUrl,
    int DataRetentionDays,
    string Timezone,
    
    // Notifications
    NotificationSettingsDto Notifications,
    
    // Security
    SecuritySettingsDto Security,
    
    // Embed Script
    string EmbedScript
);

/// <summary>
/// Notification ayarları
/// </summary>
public record NotificationSettingsDto(
    bool EmailNotifications,
    bool PushNotifications,
    bool WeeklyReports,
    bool DailyDigest
);

/// <summary>
/// Security ayarları
/// </summary>
public record SecuritySettingsDto(
    bool TwoFactorEnabled,
    int SessionTimeoutMinutes,
    string? IpWhitelist
);

/// <summary>
/// Ayarları güncelleme request
/// </summary>
public record UpdateSettingsRequest(
    // Project
    string? ProjectName,
    string? ProjectUrl,
    int? DataRetentionDays,
    string? Timezone,
    
    // Notifications
    bool? EmailNotifications,
    bool? PushNotifications,
    bool? WeeklyReports,
    bool? DailyDigest,
    
    // Security
    bool? TwoFactorEnabled,
    int? SessionTimeoutMinutes,
    string? IpWhitelist
);
