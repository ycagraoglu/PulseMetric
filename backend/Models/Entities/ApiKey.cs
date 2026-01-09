using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;

namespace Analytics.API.Models.Entities;

/// <summary>
/// API Key entity.
/// Tenant'ların pulse.js entegrasyonu için kullandığı anahtarlar.
/// </summary>
public class ApiKey : BaseEntity
{
    #region Properties

    /// <summary>
    /// Anahtar adı (örn: Production, Development, Staging)
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// API Key değeri (pk_live_... veya pk_test_...)
    /// </summary>
    [Required]
    [MaxLength(64)]
    public string Key { get; set; } = string.Empty;

    /// <summary>
    /// Key prefix (live veya test)
    /// </summary>
    [Required]
    [MaxLength(10)]
    public string Prefix { get; set; } = Prefixes.Live;

    /// <summary>
    /// Ait olduğu tenant
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string TenantId { get; set; } = string.Empty;

    /// <summary>
    /// Oluşturan kullanıcı ID
    /// </summary>
    public Guid CreatedByUserId { get; set; }

    /// <summary>
    /// Aktif mi?
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Son kullanım zamanı (Unix timestamp ms)
    /// </summary>
    public long? LastUsedAt { get; set; }

    /// <summary>
    /// Toplam kullanım sayısı
    /// </summary>
    public int UsageCount { get; set; }

    /// <summary>
    /// Sona erme tarihi (opsiyonel, null = sonsuz)
    /// </summary>
    public long? ExpiresAt { get; set; }

    #endregion

    #region Constants

    public static class Prefixes
    {
        public const string Live = "live";
        public const string Test = "test";
    }

    private const string LiveKeyPrefix = "pk_live_";
    private const string TestKeyPrefix = "pk_test_";
    private const int RandomKeyLength = 32;
    private const int MaskStartLength = 8;
    private const int MaskEndLength = 4;
    private const int MaskMiddleLength = 20;

    #endregion

    #region Computed Properties

    /// <summary>
    /// Maskeli key gösterimi (pk_live_****...1234)
    /// </summary>
    public string MaskedKey => Key.Length > MaskStartLength + MaskEndLength
        ? $"{Key[..MaskStartLength]}{new string('*', MaskMiddleLength)}{Key[^MaskEndLength..]}"
        : Key;

    /// <summary>
    /// Live key mi?
    /// </summary>
    public bool IsLive => Prefix == Prefixes.Live;

    /// <summary>
    /// Süresi dolmuş mu?
    /// </summary>
    public bool IsExpired => ExpiresAt.HasValue &&
        ExpiresAt.Value < DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    /// <summary>
    /// Geçerli mi? (aktif ve süresi dolmamış)
    /// </summary>
    public bool IsValid => IsActive && !IsExpired;

    #endregion

    #region Factory Methods

    /// <summary>
    /// Yeni bir production API key oluştur
    /// </summary>
    public static ApiKey CreateLive(string name, string tenantId, Guid userId)
        => Create(name, tenantId, userId, isLive: true);

    /// <summary>
    /// Yeni bir test API key oluştur
    /// </summary>
    public static ApiKey CreateTest(string name, string tenantId, Guid userId)
        => Create(name, tenantId, userId, isLive: false);

    /// <summary>
    /// Generic factory method - DRY
    /// </summary>
    private static ApiKey Create(string name, string tenantId, Guid userId, bool isLive) => new()
    {
        Name = name,
        Key = (isLive ? LiveKeyPrefix : TestKeyPrefix) + GenerateSecureRandomKey(),
        Prefix = isLive ? Prefixes.Live : Prefixes.Test,
        TenantId = tenantId,
        CreatedByUserId = userId,
        IsActive = true
    };

    #endregion

    #region Key Generation

    /// <summary>
    /// Güvenli random key oluştur (Base64, URL-safe)
    /// </summary>
    private static string GenerateSecureRandomKey()
    {
        Span<byte> bytes = stackalloc byte[RandomKeyLength];
        RandomNumberGenerator.Fill(bytes);

        return Convert.ToBase64String(bytes)
            .Replace('+', 'A')  // URL-safe
            .Replace('/', 'B')  // URL-safe
            .Replace("=", "")   // Remove padding
            [..RandomKeyLength];
    }

    #endregion

    #region Domain Methods

    /// <summary>
    /// Kullanımı kaydet
    /// </summary>
    public void RecordUsage()
    {
        LastUsedAt = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        UsageCount++;
    }

    /// <summary>
    /// Key'i devre dışı bırak
    /// </summary>
    public void Deactivate() => IsActive = false;

    /// <summary>
    /// Key'i aktifleştir
    /// </summary>
    public void Activate() => IsActive = true;

    #endregion
}
