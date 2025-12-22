using System.Text.Json;
using StackExchange.Redis;

namespace Analytics.API.Services;

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

        try
        {
            var options = ConfigurationOptions.Parse(connectionString);
            options.AbortOnConnectFail = false; // Kritik: Bağlantı başarısız olsa da başlat
            options.ConnectTimeout = 5000;
            options.SyncTimeout = 3000;

            _redis = ConnectionMultiplexer.Connect(options);
            
            _logger.LogInformation("🔌 Redis bağlantısı başlatılıyor: {ConnectionString}", connectionString);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Redis bağlantı hatası, Mock modda devam ediliyor");
            _redis = null;
        }
    }

    public async Task EnqueueAsync(string streamName, object data)
    {
        var jsonData = JsonSerializer.Serialize(data);

        // Dinamik bağlantı kontrolü - her istekte kontrol et
        if (_redis != null && _redis.IsConnected)
        {
            try
            {
                var db = _redis.GetDatabase();
                
                // Redis List: Basit ve uyumlu kuyruk yapısı
                // RPUSH ile sağa ekle, LPOP ile soldan al (FIFO)
                await db.ListRightPushAsync(streamName, jsonData);

                _logger.LogInformation("✅ [REDIS] Queue: {StreamName} | Veri eklendi", streamName);
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
            _logger.LogWarning("⚠️ [MOCK-QUEUE] Redis bağlı değil | Stream: {StreamName} | Size: {Size} bytes", 
                streamName, jsonData.Length);
        }
    }
}
