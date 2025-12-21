using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace OrderService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHttpClientFactory _http;

    public OrdersController(AppDbContext db, IHttpClientFactory http)
    {
        _db = db;
        _http = http;
    }

    // POST: api/orders/create
    // Body: { "userId": "...", "items": [ { "productId": "...", "quantity": 1 } ] }
    [HttpPost("create")]
    public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
    {
        if (dto.Items == null || !dto.Items.Any()) return BadRequest(new { error = "Order must contain items" });

        var productClient = _http.CreateClient("product");
        var paymentClient = _http.CreateClient("payment");
        var userClient = _http.CreateClient("user");

        // 1) Validate stock and collect prices
        int total = 0;
        var productInfos = new List<(Guid productId, int quantity, int unitPrice)>();
        foreach (var it in dto.Items)
        {
            var res = await productClient.GetAsync($"/api/products/{it.ProductId}");
            if (res.StatusCode == HttpStatusCode.NotFound) return NotFound(new { error = "Product not found", productId = it.ProductId });
            if (!res.IsSuccessStatusCode) return StatusCode((int)res.StatusCode);

            var prod = await res.Content.ReadFromJsonAsync<ProductDto>();
            if (prod == null) return StatusCode(500, new { error = "Failed to read product info" });
            if (prod.Stock < it.Quantity) return Conflict(new { error = "Insufficient stock", productId = it.ProductId, available = prod.Stock });

            total += prod.Price * it.Quantity;
            productInfos.Add((it.ProductId, it.Quantity, prod.Price));
        }

        // 2) Attempt payment debit
            // 2) Attempt wallet debit (user-service)
            var debitResp = await userClient.PostAsJsonAsync($"/api/users/{dto.UserId}/wallet/debit", new { Amount = total });
        if (debitResp.StatusCode == HttpStatusCode.Conflict)
        {
            var body = await debitResp.Content.ReadFromJsonAsync<object>();
            return Conflict(new { error = "Payment failed", details = body });
        }
        if (!debitResp.IsSuccessStatusCode) return StatusCode((int)debitResp.StatusCode);

        // 3) Reserve stock for each product
        var reserved = new List<(Guid productId, int quantity)>();
        foreach (var p in productInfos)
        {
            var res = await productClient.PostAsJsonAsync($"/api/products/{p.productId}/reserve", new { Quantity = p.quantity });
            if (res.StatusCode == HttpStatusCode.Conflict || res.StatusCode == HttpStatusCode.NotFound)
            {
                // Reservation failed -> refund payment
                    // Reservation failed -> refund wallet
                    await userClient.PostAsJsonAsync($"/api/users/{dto.UserId}/wallet/credit", new { Amount = total });
                var body = await res.Content.ReadFromJsonAsync<object>();
                return Conflict(new { error = "Reservation failed", details = body });
            }
            if (!res.IsSuccessStatusCode)
            {
                    await userClient.PostAsJsonAsync($"/api/users/{dto.UserId}/wallet/credit", new { Amount = total });
                return StatusCode((int)res.StatusCode);
            }
            reserved.Add((p.productId, p.quantity));
        }

        // 4) Create order record
        var order = new Order { UserId = dto.UserId, TotalAmount = total };
        foreach (var r in productInfos)
        {
            order.Items.Add(new OrderItem { ProductId = r.productId, Quantity = r.quantity, UnitPrice = r.unitPrice });
        }

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, new { order.Id, order.UserId, order.TotalAmount });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var order = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == id);
        if (order == null) return NotFound();
        return Ok(order);
    }
}

public record CreateOrderDto(Guid UserId, List<OrderItemDto> Items);
public record OrderItemDto(Guid ProductId, int Quantity);
public record ProductDto(Guid Id, string Name, string? Description, int Price, int Stock);
