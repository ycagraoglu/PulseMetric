using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Analytics.API.Models.Entities;

/// <summary>
/// Tüm entity'ler için base class.
/// Ortak özellikler burada tanımlanır.
/// </summary>
public abstract class BaseEntity
{
    [Key]
    [Column("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Column("created_at")]
    public long CreatedAt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
}

/// <summary>
/// Soft delete destekleyen entity'ler için interface.
/// </summary>
public interface ISoftDeletable
{
    bool IsActive { get; set; }
}

/// <summary>
/// Güncellenme zamanı olan entity'ler için interface.
/// </summary>
public interface IUpdatable
{
    long? UpdatedAt { get; set; }
}
