using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Analytics.API.Models.Entities;

/// <summary>
/// Tenant (müşteri) entity modeli.
/// Her müşteri için benzersiz ApiKey ile tanımlanır.
/// </summary>
[Table("tenants")]
public class Tenant : BaseEntity, ISoftDeletable, IUpdatable
{
    /// <summary>
    /// Müşteri/Şirket adı
    /// </summary>
    [Column("name")]
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Müşteri domain'i (örn: example.com)
    /// </summary>
    [Column("domain")]
    [MaxLength(500)]
    public string? Domain { get; set; }

    /// <summary>
    /// API Key (script'e eklenen data-client-id değeri)
    /// </summary>
    [Column("api_key")]
    [Required]
    [MaxLength(100)]
    public string ApiKey { get; set; } = string.Empty;

    /// <summary>
    /// Tenant aktif mi?
    /// </summary>
    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Güncellenme zamanı (Unix epoch ms)
    /// </summary>
    [Column("updated_at")]
    public long? UpdatedAt { get; set; }
}
