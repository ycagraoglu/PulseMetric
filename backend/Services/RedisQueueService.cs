using System.Text.Json;
using StackExchange.Redis;

namespace Analytics.API.Services;

/// <summary>
/// Redis Streams kullanarak fail-safe kuyruk servisi.
/// Bağlantı koptuğunda API çökmez, sadece loglar.
/// </summary>
public class RedisQueueService : IQueueService
{
    private readonly ILogger<RedisQueueService> _logger;
    private readonly IConnectionMultiplexer? _redis;
    private readonly bool _isConnected;

    public RedisQueueService(ILogger<RedisQueueService> logger, IConfiguration configuration)
    {
        _logger = logger;

        var connectionString = configuration.GetConnectionString("Redis") ?? "localhost:6379";

        try
        {
            var options = ConfigurationOptions.Parse(connectionString);
            options.AbortOnConnectFail = false; // Kritik: Bağlantı başarısız olsa da başlat
            options.ConnectTimeout = 5000;
            options.SyncTimeout = 3000;

            _redis = ConnectionMultiplexer.Connect(options);
            _isConnected = _redis.IsConnected;

            if (_isConnected)
            {
                _logger.LogInformation("✅ Redis bağlantısı başarılı: {ConnectionString}", connectionString);
            }
            else
            {
                _logger.LogWarning("⚠️ Redis bağlantısı kurulamadı, Mock modda çalışılacak");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Redis bağlantı hatası, Mock modda devam ediliyor");
            _isConnected = false;
        }
    }

    public async Task EnqueueAsync(string streamName, object data)
    {
        var jsonData = JsonSerializer.Serialize(data);

        if (_isConnected && _redis != null)
        {
            try
            {
                var db = _redis.GetDatabase();
                
                // Redis Streams: Gerçek zamanlı event işleme için ideal
                await db.StreamAddAsync(
                    streamName,
                    new NameValueEntry[]
                    {
                        new("payload", jsonData),
                        new("timestamp", DateTime.UtcNow.ToString("O"))
                    }
                );

                _logger.LogDebug("[REDIS] Stream: {StreamName} | Veri eklendi", streamName);
            }
            catch (RedisConnectionException ex)
            {
                // Fail-safe: API çökmemeli!
                _logger.LogError(ex, "Redis bağlantısı koptu, event kaybedildi: {StreamName}", streamName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Redis yazma hatası: {StreamName}", streamName);
            }
        }
        else
        {
            // Mock mod: Redis yoksa sadece logla
            _logger.LogInformation("[MOCK-QUEUE] Stream: {StreamName} | Data: {Data}", 
                streamName, jsonData.Length > 100 ? jsonData[..100] + "..." : jsonData);
        }
    }
}
