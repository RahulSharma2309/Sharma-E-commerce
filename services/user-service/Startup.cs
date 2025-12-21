using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace UserService;

public class Startup
{
    private readonly IConfiguration _config;
    public Startup(IConfiguration config) => _config = config;

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c => c.SwaggerDoc("v1", new OpenApiInfo { Title = "User Service", Version = "v1" }));

        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(_config.GetConnectionString("DefaultConnection")));

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserService, UserServiceImpl>();
    }

    public void Configure(WebApplication app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseRouting();
        app.UseAuthorization();
        app.MapControllers();
    }
}

public interface IUserRepository { }
public class UserRepository : IUserRepository { }
public interface IUserService { }
public class UserServiceImpl : IUserService { }
