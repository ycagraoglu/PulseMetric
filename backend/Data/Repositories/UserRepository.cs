using Analytics.API.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Analytics.API.Data.Repositories;

/// <summary>
/// User repository implementasyonu.
/// Auth işlemleri için kullanıcı veri erişimi.
/// SRP: Sadece User entity veri erişimi sorumluluğu.
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly AnalyticsDbContext _context;

    public UserRepository(AnalyticsDbContext context)
    {
        _context = context;
    }

    #region Read Operations

    public async Task<User?> GetByIdAsync(Guid id)
        => await _context.Users.FindAsync(id);

    public async Task<User?> GetByEmailAsync(string email)
        => await _context.Users
            .FirstOrDefaultAsync(u => u.Email == NormalizeEmail(email));

    public async Task<User?> GetByRefreshTokenAsync(string refreshToken)
        => await _context.Users
            .FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

    public async Task<bool> ExistsAsync(string email)
        => await _context.Users
            .AnyAsync(u => u.Email == NormalizeEmail(email));

    #endregion

    #region Write Operations

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    #endregion

    #region Helpers

    /// <summary>
    /// Email normalizasyonu - DRY
    /// </summary>
    private static string NormalizeEmail(string email)
        => email.ToLower().Trim();

    #endregion
}
