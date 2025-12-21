using UserService.Dtos;

namespace UserService.Services;

public interface IUserService
{
    Task<UserProfileDto?> GetByIdAsync(Guid id);
    Task<UserProfileDto?> GetByUserIdAsync(string userId);
    Task<UserProfileDto> CreateAsync(CreateUserDto dto);
    Task<UserProfileDto?> UpdateAsync(Guid id, CreateUserDto dto);
}
