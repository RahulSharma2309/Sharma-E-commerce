using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var startup = new UserService.Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();

// Ensure DB created (local dev convenience)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

startup.Configure(app, app.Environment as Microsoft.AspNetCore.Hosting.IWebHostEnvironment ?? throw new InvalidOperationException("Missing environment"));

app.Run();

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    // Add DbSets here when implementing user models
}
