using Microsoft.AspNetCore.Mvc;
using UserService.Dtos;
using UserService.Services;

namespace UserService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService service, ILogger<UsersController> logger)
    {
        _service = service;
        _logger = logger;
    }

    // GET api/users/{id}
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var res = await _service.GetByIdAsync(id);
        if (res == null) return NotFound();
        return Ok(res);
    }

    // GET api/users/by-userid/{userId}
    [HttpGet("by-userid/{userId}")]
    public async Task<IActionResult> GetByUserId(string userId)
    {
        var res = await _service.GetByUserIdAsync(userId);
        if (res == null) return NotFound();
        return Ok(res);
    }

    // POST api/users
    [HttpPost]
    public async Task<IActionResult> Create(CreateUserDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserId)) return BadRequest("UserId is required to create a profile.");
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // PUT api/users/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, CreateUserDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        if (updated == null) return NotFound();
        return Ok(updated);
    }
}
