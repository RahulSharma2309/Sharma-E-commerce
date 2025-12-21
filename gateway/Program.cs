using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Delegate to Startup to configure services and middleware
var startup = new Gateway.Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();

startup.Configure(app, app.Environment as Microsoft.AspNetCore.Hosting.IWebHostEnvironment ?? throw new InvalidOperationException("Missing environment"));

app.MapReverseProxy();

app.Run();
