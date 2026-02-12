
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using YourSpace.ApiService.Services;
using YourSpace.Data;
using YourSpace.Data.Repositories;


var builder = WebApplication.CreateBuilder(args);

// JWT Authentication
var jwtConfig = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtConfig["Issuer"],
        ValidAudience = jwtConfig["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Secret"]!))
    };

    // Citește JWT din cookie "token" pentru autentificare
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Caută token în cookie "token"
            if (context.Request.Cookies.ContainsKey("token"))
            {
                context.Token = context.Request.Cookies["token"];
            }
            return Task.CompletedTask;
        }
    };
});

// Configurare servicii
builder.Services.AddOpenApi();

// Adăugare CORS pentru a permite frontend-ul să comunice cu API-ul
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // URL-ul frontend-ului Next.js
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Necesar pentru JWT cookies
    });
});

// Configurare bază de date PostgreSQL
// Connection string-ul îl vom lua din configurare (appsettings.json sau variabile de mediu)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Host=localhost;Database=yourspace;Username=postgres;Password=postgres";

builder.Services.AddDbContext<YourSpaceDbContext>(options =>
    options.UseNpgsql(connectionString));

// Dependency Injection - Repositories (Data Access Layer)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();


// Dependency Injection - Services (Business Logic Layer)
builder.Services.AddSingleton<JwtTokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IMessageService, MessageService>();

// Adăugare controllere pentru API
builder.Services.AddControllers();

var app = builder.Build();

// Configurare pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Endpoint de test pentru a verifica că API-ul funcționează
app.MapGet("/api/health", () => new { status = "healthy", timestamp = DateTime.UtcNow })
    .WithName("HealthCheck");

app.Run();
