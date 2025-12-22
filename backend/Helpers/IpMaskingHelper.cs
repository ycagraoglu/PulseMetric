using System.Net;

namespace Analytics.API.Helpers;

/// <summary>
/// GDPR uyumlu IP maskeleme yardımcıları.
/// Loglar ve analizlerde IP adreslerini anonimleştirir.
/// </summary>
public static class IpMaskingHelper
{
    /// <summary>
    /// IP adresinin son iki oktetini maskeler.
    /// Örnek: 192.168.1.100 -> 192.168.x.x
    /// IPv6 için son segmentleri maskeler.
    /// </summary>
    /// <param name="ipAddress">Maskelenecek IP adresi</param>
    /// <returns>Maskelenmiş IP adresi veya "unknown"</returns>
    public static string MaskIp(string? ipAddress)
    {
        if (string.IsNullOrEmpty(ipAddress))
            return "unknown";

        try
        {
            if (IPAddress.TryParse(ipAddress, out var ip))
            {
                if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    // IPv4: 192.168.1.100 -> 192.168.x.x
                    var parts = ipAddress.Split('.');
                    if (parts.Length == 4)
                    {
                        return $"{parts[0]}.{parts[1]}.x.x";
                    }
                }
                else if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetworkV6)
                {
                    // IPv6: Son 4 segmenti maskele
                    var parts = ipAddress.Split(':');
                    if (parts.Length >= 4)
                    {
                        var maskedParts = parts.Take(4).Concat(new[] { "x", "x", "x", "x" });
                        return string.Join(":", maskedParts);
                    }
                }
            }
        }
        catch
        {
            // Parse hatası durumunda güvenli değer döndür
        }

        return "masked";
    }

    /// <summary>
    /// IP adresini tamamen anonimleştirir (hash).
    /// Analitik amaçlı benzersiz fakat geri dönüşümsüz ID oluşturur.
    /// </summary>
    /// <param name="ipAddress">IP adresi</param>
    /// <param name="salt">Güvenlik için tuz değeri</param>
    /// <returns>Hash'lenmiş IP ID'si</returns>
    public static string AnonymizeIp(string? ipAddress, string salt = "pulse-metric-salt")
    {
        if (string.IsNullOrEmpty(ipAddress))
            return "anon-unknown";

        using var sha = System.Security.Cryptography.SHA256.Create();
        var input = $"{ipAddress}:{salt}";
        var hash = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
        
        // İlk 8 byte'ı hex olarak göster (yeterince benzersiz)
        return "anon-" + BitConverter.ToString(hash, 0, 8).Replace("-", "").ToLowerInvariant();
    }
}
