using Microsoft.AspNetCore.Mvc;

nnamespace PaymentService.Controllers;

n[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new { status = "Healthy", service = "payment-service" });
}
