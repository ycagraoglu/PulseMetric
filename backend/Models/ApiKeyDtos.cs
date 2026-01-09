namespace Analytics.API.Models;

// ============================================
// API Keys DTOs
// ============================================

/// <summary>
/// API Key listesi için DTO
/// </summary>
public record ApiKeyListItemDto(
    Guid Id,
    string Name,
    string MaskedKey,
    string Prefix,
    bool IsActive,
    long CreatedAt,
    long? LastUsedAt,
    int UsageCount
);

/// <summary>
/// API Key detay DTO (key görünür)
/// </summary>
public record ApiKeyDetailDto(
    Guid Id,
    string Name,
    string Key,
    string Prefix,
    bool IsActive,
    long CreatedAt,
    long? LastUsedAt,
    long? ExpiresAt,
    int UsageCount
);

/// <summary>
/// API Key oluşturma isteği
/// </summary>
public record CreateApiKeyRequest(
    string Name,
    bool IsLive = true
);

/// <summary>
/// API Key güncelleme isteği
/// </summary>
public record UpdateApiKeyRequest(
    string? Name,
    bool? IsActive
);

/// <summary>
/// API Key oluşturma yanıtı (key sadece bir kez gösterilir!)
/// </summary>
public record CreateApiKeyResponse(
    Guid Id,
    string Name,
    string Key,
    string Prefix,
    string Message
);
