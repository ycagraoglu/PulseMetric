namespace Analytics.API.Helpers;

/// <summary>
/// Unix timestamp dönüşüm ve yardımcı metodları.
/// Tüm zamanlar milliseconds (ms) cinsinden saklanır.
/// </summary>
public static class UnixTimeHelper
{
    /// <summary>
    /// Şu anki zamanı Unix timestamp (ms) olarak döndürür.
    /// </summary>
    public static long Now() => DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

    /// <summary>
    /// Unix timestamp'ı DateTimeOffset'e çevirir.
    /// </summary>
    public static DateTimeOffset ToDateTimeOffset(long unixMs) 
        => DateTimeOffset.FromUnixTimeMilliseconds(unixMs);

    /// <summary>
    /// Unix timestamp'ı DateTime (UTC) olarak döndürür.
    /// </summary>
    public static DateTime ToDateTime(long unixMs) 
        => DateTimeOffset.FromUnixTimeMilliseconds(unixMs).UtcDateTime;

    /// <summary>
    /// DateTime'ı Unix timestamp'a çevirir.
    /// </summary>
    public static long FromDateTime(DateTime dateTime) 
        => new DateTimeOffset(dateTime.ToUniversalTime()).ToUnixTimeMilliseconds();

    /// <summary>
    /// Bugünün başlangıcını (00:00 UTC) Unix timestamp olarak döndürür.
    /// </summary>
    public static long TodayStart() 
        => new DateTimeOffset(DateTime.UtcNow.Date).ToUnixTimeMilliseconds();

    /// <summary>
    /// N gün öncesini Unix timestamp olarak döndürür.
    /// </summary>
    public static long DaysAgo(int days) 
        => DateTimeOffset.UtcNow.AddDays(-days).ToUnixTimeMilliseconds();

    /// <summary>
    /// İki timestamp arasındaki farkı saniye cinsinden hesaplar.
    /// </summary>
    public static double DiffSeconds(long start, long end) 
        => (end - start) / 1000.0;

    /// <summary>
    /// Timestamp'ın bugün olup olmadığını kontrol eder.
    /// </summary>
    public static bool IsToday(long unixMs)
    {
        var date = ToDateTime(unixMs).Date;
        return date == DateTime.UtcNow.Date;
    }

    /// <summary>
    /// Timestamp'ı okunabilir formata çevirir (debug için).
    /// </summary>
    public static string ToReadable(long unixMs, string format = "yyyy-MM-dd HH:mm:ss")
        => ToDateTime(unixMs).ToString(format);
}
