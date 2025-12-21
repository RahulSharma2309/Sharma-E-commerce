using UserService.Dtos;
using UserService.Models;
using UserService.Repositories;

namespace UserService.Services
{
    public class UserServiceImpl : IUserService
    {
        private readonly IUserRepository _repo;
        public UserServiceImpl(IUserRepository repo) => _repo = repo;

        public async Task<UserProfileDto?> GetByIdAsync(Guid id)
        {
            var m = await _repo.GetByIdAsync(id);
            return m is null ? null : UserProfileDto.FromModel(m);
        }

        public async Task<UserProfileDto?> GetByUserIdAsync(string userId)
        {
            var m = await _repo.GetByUserIdAsync(userId);
            return m is null ? null : UserProfileDto.FromModel(m);
        }

        public async Task<UserProfileDto> CreateAsync(CreateUserDto dto)
        {
            // If a profile already exists for this UserId, update it instead
            var existing = await _repo.GetByUserIdAsync(dto.UserId);
            if (existing != null)
            {
                existing.FirstName = dto.FirstName;
                existing.LastName = dto.LastName;
                existing.Address = dto.Address;
                existing.PhoneNumber = dto.PhoneNumber;
                var updated = await _repo.UpdateAsync(existing);
                return UserProfileDto.FromModel(updated);
            }

            var model = new UserProfile
            {
                UserId = dto.UserId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Address = dto.Address,
                PhoneNumber = dto.PhoneNumber,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _repo.CreateAsync(model);
            return UserProfileDto.FromModel(created);
        }

        public async Task<UserProfileDto?> UpdateAsync(Guid id, CreateUserDto dto)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null) return null;

            // don't change UserId on update
            existing.FirstName = dto.FirstName;
            existing.LastName = dto.LastName;
            existing.Address = dto.Address;
            existing.PhoneNumber = dto.PhoneNumber;

            var updated = await _repo.UpdateAsync(existing);
            return UserProfileDto.FromModel(updated);
        }

        public async Task<decimal> DebitWalletAsync(Guid id, decimal amount)
        {
            return await _repo.DebitWalletAsync(id, amount);
        }

        public async Task<decimal> CreditWalletAsync(Guid id, decimal amount)
        {
            return await _repo.CreditWalletAsync(id, amount);
        }
    }
}
