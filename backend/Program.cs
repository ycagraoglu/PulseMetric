using Analytics.API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// =============================================
// SERVIS KAYITLARI (DI Extensions)
// =============================================

// Controller desteği
builder.Services.AddControllers();

// OpenAPI/Swagger (Development için)
builder.Services.AddEndpointsApiExplorer();

// Data Access Layer - DbContext & Repositories
builder.Services.AddRepositories(builder.Configuration);

// Business Logic Layer - Services
builder.Services.AddApplicationServices();

// Infrastructure - Queue & Background Workers
builder.Services.AddInfrastructure();

// Authentication & Authorization - JWT
builder.Services.AddJwtAuthentication(builder.Configuration);

// CORS Policy - Dynamic Origin
builder.Services.AddDynamicCors();

var app = builder.Build();

// =============================================
// MIDDLEWARE PIPELINE
// =============================================
// Sıra önemli: Static Files → CORS → Auth → Controllers

app.UseStaticFiles();
app.UseDynamicCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Health check endpoint
app.MapGet("/", () => new
{
    name = "PulseMetric Collector API",
    version = "1.0.0",
    status = "running",
    timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
});

// =============================================
// UYGULAMA BAŞLATMA
// =============================================
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("🚀 PulseMetric Collector API başlatılıyor...");

app.Run();
