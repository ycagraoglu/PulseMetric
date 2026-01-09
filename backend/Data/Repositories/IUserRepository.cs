using Analytics.API.Models.Entities;

namespace Analytics.API.Data.Repositories;

/// <summary>
/// User repository interface - AuthService için.
/// DbContext sadece bu katmanda kullanılır.
/// </summary>
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByRefreshTokenAsync(string refreshToken);
    Task<User> CreateAsync(User user);
    Task UpdateAsync(User user);
    Task<bool> ExistsAsync(string email);
}
