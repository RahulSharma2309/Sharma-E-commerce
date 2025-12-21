using Microsoft.EntityFrameworkCore;
using UserService.Data;
using UserService.Models;

namespace UserService.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public async Task<UserProfile?> GetByIdAsync(Guid id)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<UserProfile?> GetByUserIdAsync(string userId)
    {
        return await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId);
    }

    public async Task<UserProfile> CreateAsync(UserProfile profile)
    {
        _db.Users.Add(profile);
        await _db.SaveChangesAsync();
        return profile;
    }

    public async Task<UserProfile> UpdateAsync(UserProfile profile)
    {
        profile.UpdatedAt = DateTime.UtcNow;
        _db.Users.Update(profile);
        await _db.SaveChangesAsync();
        return profile;
    }
}
