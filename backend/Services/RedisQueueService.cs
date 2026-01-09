using System.Text.Json;
using Microsoft.Extensions.Options;
using StackExchange.Redis;

namespace Analytics.API.Services;

/// <summary>
/// Redis bağlantı ayarları
/// </summary>
public class RedisSettings
{
    public const string SectionName = "Redis";
    
    public string ConnectionString { get; set; } = "localhost:6379";
    public int ConnectTimeoutMs { get; set; } = 5000;
    public int SyncTimeoutMs { get; set; } = 3000;
}

/// <summary>
/// Redis kullanarak fail-safe kuyruk servisi.
/// Bağlantı koptuğunda API çökmez, sadece loglar.
/// </summary>
public class RedisQueueService : IQueueService
{
    private readonly ILogger<RedisQueueService> _logger;
    private readonly IConnectionMultiplexer? _redis;

    public RedisQueueService(ILogger<RedisQueueService> logger, IConfiguration configuration)
    {
        _logger = logger;
        
        var connectionString = configuration.GetConnectionString("Redis") ?? "localhost:6379";
        _redis = TryConnect(connectionString);
    }

    public async Task EnqueueAsync(string streamName, object data)
    {
        var jsonData = JsonSerializer.Serialize(data);

        if (!IsConnected())
        {
            LogMockMode(streamName, jsonData.Length);
            return;
        }

        try
        {
            await EnqueueToRedisAsync(streamName, jsonData);
        }
        catch (RedisConnectionException ex)
        {
            _logger.LogError(ex, "Redis bağlantısı koptu, event kaybedildi: {StreamName}", streamName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Redis yazma hatası: {StreamName}", streamName);
        }
    }

    #region Private Methods

    private IConnectionMultiplexer? TryConnect(string connectionString)
    {
        try
        {
            var options = ConfigurationOptions.Parse(connectionString);
            options.AbortOnConnectFail = false;
            options.ConnectTimeout = 5000;
            options.SyncTimeout = 3000;

            var redis = ConnectionMultiplexer.Connect(options);
            _logger.LogInformation("🔌 Redis bağlantısı başlatılıyor: {ConnectionString}", connectionString);
            return redis;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Redis bağlantı hatası, Mock modda devam ediliyor");
            return null;
        }
    }

    private bool IsConnected() => _redis is { IsConnected: true };

    private async Task EnqueueToRedisAsync(string streamName, string jsonData)
    {
        var db = _redis!.GetDatabase();
        await db.ListRightPushAsync(streamName, jsonData);
        _logger.LogInformation("✅ [REDIS] Queue: {StreamName} | Veri eklendi", streamName);
    }

    private void LogMockMode(string streamName, int size)
    {
        _logger.LogWarning("⚠️ [MOCK-QUEUE] Redis bağlı değil | Stream: {StreamName} | Size: {Size} bytes",
            streamName, size);
    }

    #endregion
}
