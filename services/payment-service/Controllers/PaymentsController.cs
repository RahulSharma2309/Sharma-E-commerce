using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PaymentService.Dtos;
using PaymentService.Models;

namespace PaymentService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public PaymentsController(AppDbContext db)
    {
        _db = db;
    }


    // POST: api/payments/record
    // Body: { "orderId": "...", "userId": "...", "amount": 100, "status": "Paid" }
    [HttpPost("record")]
    public async Task<IActionResult> RecordPayment(RecordPaymentDto dto)
    {
        // Simulate recording a payment for an order
        var payment = new PaymentRecord
        {
            OrderId = dto.OrderId,
            UserId = dto.UserId,
            Amount = dto.Amount,
            Status = dto.Status,
            Timestamp = DateTime.UtcNow
        };
        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();
        return Ok(new { payment.OrderId, payment.UserId, payment.Amount, payment.Status, payment.Timestamp });
    }

    // GET: api/payments/status/{orderId}
    [HttpGet("status/{orderId}")]
    public async Task<IActionResult> GetPaymentStatus(Guid orderId)
    {
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.OrderId == orderId);
        if (payment == null) return NotFound();
        return Ok(new { payment.OrderId, payment.Status, payment.Timestamp });
    }
}

public record CreateWalletDto(Guid UserId, int InitialBalance);
public record DebitDto(Guid UserId, int Amount);
public record CreditDto(Guid UserId, int Amount);
