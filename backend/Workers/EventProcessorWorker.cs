using System.Text.Json;
using Analytics.API.Data;
using Analytics.API.Data.Entities;
using Analytics.API.Models;
using StackExchange.Redis;

namespace Analytics.API.Workers;

/// <summary>
/// Redis'ten analitik eventleri okuyup PostgreSQL'e yazan background worker.
/// FIFO (First-In-First-Out) sırasıyla çalışır.
/// </summary>
public class EventProcessorWorker : BackgroundService
{
    private readonly ILogger<EventProcessorWorker> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConnectionMultiplexer? _redis;
    private readonly string _queueName = "analytics_events";
    private readonly int _batchSize = 50;
    private readonly int _pollIntervalMs = 1000;

    public EventProcessorWorker(
        ILogger<EventProcessorWorker> logger,
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;

        // Redis bağlantısı
        var redisConnection = configuration.GetConnectionString("Redis") ?? "localhost:6379";
        try
        {
            var options = ConfigurationOptions.Parse(redisConnection);
            options.AbortOnConnectFail = false;
            _redis = ConnectionMultiplexer.Connect(options);
            _logger.LogInformation("🔌 Worker: Redis bağlantısı kuruldu");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Worker: Redis bağlantısı kurulamadı");
        }
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🚀 EventProcessorWorker başlatıldı");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                if (_redis == null || !_redis.IsConnected)
                {
                    _logger.LogWarning("⚠️ Redis bağlantısı yok, bekleniyor...");
                    await Task.Delay(5000, stoppingToken);
                    continue;
                }

                var processedCount = await ProcessBatchAsync(stoppingToken);
                
                if (processedCount > 0)
                {
                    _logger.LogInformation("✅ {Count} event işlendi", processedCount);
                }
                else
                {
                    // Kuyruk boşsa bekle
                    await Task.Delay(_pollIntervalMs, stoppingToken);
                }
            }
            catch (OperationCanceledException)
            {
                // Normal kapatma
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Worker hatası");
                await Task.Delay(5000, stoppingToken);
            }
        }

        _logger.LogInformation("🛑 EventProcessorWorker durduruldu");
    }

    private async Task<int> ProcessBatchAsync(CancellationToken cancellationToken)
    {
        var db = _redis!.GetDatabase();
        var events = new List<AnalyticsEvent>();

        // Batch olarak eventleri al
        for (int i = 0; i < _batchSize; i++)
        {
            var json = await db.ListLeftPopAsync(_queueName);
            if (json.IsNullOrEmpty)
                break;

            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                
                var payload = JsonSerializer.Deserialize<AnalyticsEventPayload>(json!, options);
                if (payload != null && !string.IsNullOrEmpty(payload.ClientId))
                {
                    var entity = MapToEntity(payload);
                    events.Add(entity);
                }
            }
            catch (JsonException ex)
            {
                _logger.LogWarning("⚠️ JSON parse hatası (atlanıyor): {Error}", ex.Message);
            }
        }

        if (events.Count == 0)
            return 0;

        // PostgreSQL'e yaz
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AnalyticsDbContext>();

        await dbContext.AnalyticsEvents.AddRangeAsync(events, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        return events.Count;
    }

    private static AnalyticsEvent MapToEntity(AnalyticsEventPayload payload)
    {
        // UserAgent'tan browser ve OS çıkar
        var (browser, os) = ParseUserAgent(payload.UserAgent);

        return new AnalyticsEvent
        {
            TenantId = payload.ClientId,
            VisitorId = payload.VisitorId,
            EventName = payload.EventName,
            UrlPath = ExtractPath(payload.Url),
            PageTitle = payload.PageTitle,
            Referrer = payload.Referrer,
            Device = payload.Device,
            Browser = browser,
            OS = os,
            ScreenWidth = payload.ScreenWidth,
            ScreenHeight = payload.ScreenHeight,
            Language = payload.Language,
            SessionDuration = payload.SessionDuration,
            Timestamp = payload.Timestamp,
            Data = payload.Data != null ? JsonSerializer.Serialize(payload.Data) : null
        };
    }

    private static string ExtractPath(string url)
    {
        try
        {
            var uri = new Uri(url);
            return uri.AbsolutePath;
        }
        catch
        {
            return url;
        }
    }

    private static (string? browser, string? os) ParseUserAgent(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent))
            return (null, null);

        string? browser = null;
        string? os = null;

        // Basit browser detection
        if (userAgent.Contains("Chrome") && !userAgent.Contains("Edg"))
            browser = "Chrome";
        else if (userAgent.Contains("Firefox"))
            browser = "Firefox";
        else if (userAgent.Contains("Safari") && !userAgent.Contains("Chrome"))
            browser = "Safari";
        else if (userAgent.Contains("Edg"))
            browser = "Edge";
        else if (userAgent.Contains("Opera") || userAgent.Contains("OPR"))
            browser = "Opera";

        // Basit OS detection
        if (userAgent.Contains("Windows"))
            os = "Windows";
        else if (userAgent.Contains("Mac OS"))
            os = "macOS";
        else if (userAgent.Contains("iPhone") || userAgent.Contains("iPad"))
            os = "iOS";
        else if (userAgent.Contains("Android"))
            os = "Android";
        else if (userAgent.Contains("Linux"))
            os = "Linux";

        return (browser, os);
    }
}
