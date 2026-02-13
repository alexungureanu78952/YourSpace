
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using YourSpace.ApiService.Services;
using YourSpace.Data;
using YourSpace.Data.Repositories;


var builder = WebApplication.CreateBuilder(args);

// Setează explicit environment-ul ca Development dacă nu e setat
Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Development");

// Rebuild configuration pentru a asigura că appsettings.Development.json este citit
var configBuilder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables();

var builtConfig = configBuilder.Build();

// Debug: arată toate cheile de configurare
Console.WriteLine("🔑 All configuration keys:");
foreach (var kvp in builtConfig.AsEnumerable().Where(k => k.Key.Contains("OpenAI")))
{
    Console.WriteLine($"  Key: '{kvp.Key}' = '{kvp.Value}'");
}

// IMPORTANT: Clear și rebuild configurația builder-ului
var sources = builder.Configuration.Sources.ToList();
sources.Clear();
builder.Configuration.Sources.Clear();

// Adaugă sursele în ordinea corectă
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true);
builder.Configuration.AddEnvironmentVariables();

Console.WriteLine($"🌍 Environment: {builder.Environment.EnvironmentName}");
Console.WriteLine($"📁 Current directory: {Directory.GetCurrentDirectory()}");
Console.WriteLine($"📄 appsettings.Development.json exists: {File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.Development.json"))}");

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
        ValidateLifetime = false, // DEZACTIVAT pentru debugging - NU verifica expirarea
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtConfig["Issuer"],
        ValidAudience = jwtConfig["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig["Secret"]!)),
        ClockSkew = TimeSpan.Zero // Zero pentru debugging exact
    };

    // Citește JWT din Authorization header (prioritate) SAU din cookie "token" (fallback)
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();

            // Log pentru debugging
            logger.LogInformation("=== JWT Authentication Debug ===");
            logger.LogInformation($"Authorization Header: {context.Request.Headers["Authorization"]}");
            logger.LogInformation($"Cookie 'token': {context.Request.Cookies["token"]}");

            // Prioritate 1: Token din Authorization header (pentru client-side requests)
            var authHeader = context.Request.Headers["Authorization"].ToString();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                context.Token = authHeader.Substring("Bearer ".Length).Trim();
                logger.LogInformation("✓ Token loaded from Authorization header");
            }
            // Prioritate 2: Token din cookie (pentru SSR requests)
            else if (context.Request.Cookies.ContainsKey("token"))
            {
                context.Token = context.Request.Cookies["token"];
                logger.LogInformation("✓ Token loaded from cookie");
            }
            else
            {
                logger.LogWarning("✗ No token found in header or cookie!");
            }

            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
            logger.LogError($"❌ JWT Authentication FAILED: {context.Exception.GetType().Name} - {context.Exception.Message}");

            if (context.Exception is SecurityTokenExpiredException)
            {
                logger.LogError("Token has expired!");
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


// AI Assistant Service (Ollama integration)
builder.Services.AddHttpClient<OllamaAiAssistantService>();
builder.Services.AddScoped<IAiAssistantService, OllamaAiAssistantService>();

// SignalR pentru real-time messaging
builder.Services.AddSignalR();

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

// SignalR Hub pentru messaging real-time
app.MapHub<YourSpace.ApiService.Hubs.ChatHub>("/hubs/chat");

// Endpoint de test pentru a verifica că API-ul funcționează
app.MapGet("/api/health", () => new { status = "healthy", timestamp = DateTime.UtcNow })
    .WithName("HealthCheck");

app.Run();
