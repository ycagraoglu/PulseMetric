using Microsoft.AspNetCore.Mvc;

namespace Analytics.API.Controllers;

/// <summary>
/// Base controller sınıfı.
/// Ortak hata yönetimi, tenant yönetimi ve helper metodlar.
/// DRY prensibi - tekrarlanan try/catch kodları burada merkezileştirildi.
/// </summary>
[ApiController]
public abstract class ApiBaseController : ControllerBase
{
    protected const string DefaultTenantId = "DEMO_TENANT";
    
    protected readonly ILogger _logger;

    protected ApiBaseController(ILogger logger)
    {
        _logger = logger;
    }

    #region Protected Helper Methods

    /// <summary>
    /// Asenkron işlemi çalıştırır ve hata yönetimini sağlar.
    /// DRY - Tüm controller'lardaki try/catch yapısını merkezi yönetir.
    /// </summary>
    protected async Task<ActionResult<T>> ExecuteAsync<T>(
        Func<Task<T>> operation,
        string errorMessage,
        string? logMessage = null)
    {
        try
        {
            var result = await operation();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, logMessage ?? errorMessage);
            return StatusCode(500, errorMessage);
        }
    }

    /// <summary>
    /// Nullable sonuç döndüren işlemi çalıştırır, NotFound kontrolü yapar.
    /// </summary>
    protected async Task<ActionResult<T>> ExecuteWithNotFoundAsync<T>(
        Func<Task<T?>> operation,
        string notFoundMessage,
        string errorMessage,
        string? logMessage = null) where T : class
    {
        try
        {
            var result = await operation();
            
            if (result == null)
                return NotFound(notFoundMessage);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, logMessage ?? errorMessage);
            return StatusCode(500, errorMessage);
        }
    }

    /// <summary>
    /// Senkron işlemi çalıştırır ve hata yönetimini sağlar.
    /// </summary>
    protected ActionResult<T> Execute<T>(
        Func<T> operation,
        string errorMessage,
        string? logMessage = null)
    {
        try
        {
            var result = operation();
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, logMessage ?? errorMessage);
            return StatusCode(500, errorMessage);
        }
    }

    /// <summary>
    /// TenantId'nin geçerli olup olmadığını kontrol eder.
    /// </summary>
    protected bool IsValidTenantId(string? tenantId)
    {
        return !string.IsNullOrWhiteSpace(tenantId);
    }

    /// <summary>
    /// Sayfalama hesaplaması
    /// </summary>
    protected int CalculateTotalPages(int totalCount, int pageSize)
    {
        return (int)Math.Ceiling(totalCount / (double)pageSize);
    }

    /// <summary>
    /// Timestamp hesaplayıcı - gün bazlı
    /// </summary>
    protected long GetTimestampDaysAgo(int days)
    {
        return DateTimeOffset.UtcNow.AddDays(-days).ToUnixTimeMilliseconds();
    }

    /// <summary>
    /// Bugünün başlangıç timestamp'i
    /// </summary>
    protected long GetStartOfTodayTimestamp()
    {
        return new DateTimeOffset(DateTimeOffset.UtcNow.Date, TimeSpan.Zero).ToUnixTimeMilliseconds();
    }

    #endregion
}
