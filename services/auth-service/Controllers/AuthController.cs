using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IJwtService _jwt;

    public AuthController(AppDbContext db, IJwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Email and password required" });

        var exists = await _db.Users.AnyAsync(u => u.Email == dto.Email);
        if (exists) return Conflict(new { error = "Email already registered" });

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FullName = dto.FullName
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(Me), new { id = user.Id }, new { user.Id, user.Email, user.FullName });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Email and password required" });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null) return Unauthorized(new { error = "Invalid credentials" });

        var valid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
        if (!valid) return Unauthorized(new { error = "Invalid credentials" });

        var token = _jwt.GenerateToken(user);
        return Ok(new AuthResponseDto { Token = token, ExpiresIn = 6 * 60 * 60, UserId = user.Id, Email = user.Email });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.NewPassword))
            return BadRequest(new { error = "Email and new password required" });

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null) return NotFound(new { error = "User not found" });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _db.SaveChangesAsync();

        return Ok(new { status = "password reset" });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var id = User.FindFirst(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (id == null) return Unauthorized();
        if (!Guid.TryParse(id, out var guid)) return Unauthorized();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Id == guid);
        if (user == null) return NotFound();

        return Ok(new { user.Id, user.Email, user.FullName, user.CreatedAt });
    }
}

public record RegisterDto(string Email, string Password, string? FullName);
public record LoginDto(string Email, string Password);
public record ResetPasswordDto(string Email, string NewPassword);
public class AuthResponseDto
{
    public string Token { get; set; } = null!;
    public int ExpiresIn { get; set; }
    public Guid UserId { get; set; }
    public string Email { get; set; } = null!;
}
