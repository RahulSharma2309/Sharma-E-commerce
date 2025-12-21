using Microsoft.AspNetCore.Mvc;

nnamespace UserService.Controllers;

n[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "Healthy", service = "user-service" });
}
