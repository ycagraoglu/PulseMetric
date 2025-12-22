namespace Analytics.API.Services;

/// <summary>
/// Kuyruk servisi interface'i.
/// Redis veya başka bir queue sistemi ile değiştirilebilir.
/// </summary>
public interface IQueueService
{
    /// <summary>
    /// Veriyi belirtilen stream/queue'ya ekler.
    /// </summary>
    /// <param name="streamName">Hedef stream adı</param>
    /// <param name="data">Kuyruğa eklenecek veri</param>
    Task EnqueueAsync(string streamName, object data);
}
