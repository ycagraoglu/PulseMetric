using Analytics.API.Data;
using Analytics.API.Services;
using Analytics.API.Workers;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// =============================================
// SERVIS KAYITLARI (Dependency Injection)
// =============================================

// Controller desteği
builder.Services.AddControllers();

// OpenAPI/Swagger (Development için)
builder.Services.AddEndpointsApiExplorer();

// PostgreSQL DbContext
builder.Services.AddDbContext<AnalyticsDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgreSQL")));

// Queue Servisi (Redis veya Mock)
builder.Services.AddSingleton<IQueueService, RedisQueueService>();

// Stats Servisi
builder.Services.AddScoped<StatsService>();

// Background Worker - Redis'ten DB'ye veri aktarımı
builder.Services.AddHostedService<EventProcessorWorker>();

// =============================================
// CORS POLİTİKASI (KRİTİK - SaaS için dinamik)
// =============================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("DynamicOriginPolicy", policy =>
    {
        // NEDEN SetIsOriginAllowed?
        // ---------------------------
        // 1. SaaS'ta müşteri domainleri önceden bilinmez (abc.com, xyz.com, vb.)
        // 2. AllowAnyOrigin() + AllowCredentials() = Tarayıcı hatası!
        // 3. SetIsOriginAllowed dinamik kontrol sağlar
        //
        // ÖNEMLİ: Production'da burası tenant DB'den kontrol edilebilir
        // Örnek: origin => tenantService.IsValidOrigin(origin)
        
        policy.SetIsOriginAllowed(origin =>
        {
            // Development: Tüm originlere izin
            // Production: Tenant origin doğrulaması yapılabilir
            return true;
        })
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials(); // Cookie/token göndermek için gerekli
    });
});

var app = builder.Build();

// =============================================
// MIDDLEWARE SIRASI (ÖNEMLİ!)
// =============================================
// 1. Static files (pulse.js için)
// 2. CORS (her istek için)
// 3. Routing
// 4. Controllers

app.UseStaticFiles();

// CORS: Tüm cross-origin istekleri için
app.UseCors("DynamicOriginPolicy");

// Controller routing
app.MapControllers();

// Kök endpoint (Health check / Info)
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

