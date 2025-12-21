using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    // POST: api/payments/wallet
    // Body: { "userId": "...", "initialBalance": 1000 }
    [HttpPost("wallet")]
    public async Task<IActionResult> CreateWallet(CreateWalletDto dto)
    {
        if (dto.InitialBalance < 0) return BadRequest(new { error = "Initial balance must be >= 0" });
        var existing = await _db.Wallets.FirstOrDefaultAsync(w => w.UserId == dto.UserId);
        if (existing != null) return Conflict(new { error = "Wallet already exists" });

        var wallet = new Wallet { UserId = dto.UserId, Balance = dto.InitialBalance };
        _db.Wallets.Add(wallet);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetWallet), new { userId = wallet.UserId }, new { wallet.UserId, wallet.Balance });
    }

    // GET: api/payments/wallet/{userId}
    [HttpGet("wallet/{userId}")]
    public async Task<IActionResult> GetWallet(Guid userId)
    {
        var wallet = await _db.Wallets.FirstOrDefaultAsync(w => w.UserId == userId);
        if (wallet == null) return NotFound();
        return Ok(new { wallet.UserId, wallet.Balance });
    }

    // POST: api/payments/debit
    // Body: { "userId": "...", "amount": 100 }
    [HttpPost("debit")]
    public async Task<IActionResult> Debit(DebitDto dto)
    {
        if (dto.Amount <= 0) return BadRequest(new { error = "Amount must be > 0" });

        using var tx = await _db.Database.BeginTransactionAsync();
        var wallet = await _db.Wallets.FirstOrDefaultAsync(w => w.UserId == dto.UserId);
        if (wallet == null) return NotFound(new { error = "Wallet not found" });
        if (wallet.Balance < dto.Amount) return Conflict(new { error = "Insufficient funds", balance = wallet.Balance });

        wallet.Balance -= dto.Amount;
        await _db.SaveChangesAsync();
        await tx.CommitAsync();

        return Ok(new { wallet.UserId, wallet.Balance });
    }

    // POST: api/payments/credit
    // Body: { "userId": "...", "amount": 100 }
    [HttpPost("credit")]
    public async Task<IActionResult> Credit(CreditDto dto)
    {
        if (dto.Amount <= 0) return BadRequest(new { error = "Amount must be > 0" });

        var wallet = await _db.Wallets.FirstOrDefaultAsync(w => w.UserId == dto.UserId);
        if (wallet == null) return NotFound(new { error = "Wallet not found" });

        wallet.Balance += dto.Amount;
        await _db.SaveChangesAsync();

        return Ok(new { wallet.UserId, wallet.Balance });
    }
}

public record CreateWalletDto(Guid UserId, int InitialBalance);
public record DebitDto(Guid UserId, int Amount);
public record CreditDto(Guid UserId, int Amount);
