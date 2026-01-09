namespace Analytics.API.Models;

// EventListItemDto, EventsCountDto, EventAggregationDto -> StatsDtos.cs'de tanımlı

/// <summary>
/// Event detay DTO
/// </summary>
public record EventDetailsDto(
    Guid Id,
    string EventName,
    string UrlPath,
    string? PageTitle,
    string? VisitorId,
    string? Device,
    string? Browser,
    string? OS,
    string? Country,
    string? Referrer,
    int? ScreenWidth,
    int? ScreenHeight,
    string? Language,
    int? SessionDuration,
    string? Data,
    long Timestamp,
    long CreatedAt
);

/// <summary>
/// Event filtre request
/// </summary>
public record EventFilterRequest
{
    // Pagination
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    
    // Date range (Unix epoch ms)
    public long? StartDate { get; init; }
    public long? EndDate { get; init; }
    
    // Filters
    public string? EventName { get; init; }
    public string? VisitorId { get; init; }
    public string? Device { get; init; }
    public string? Browser { get; init; }
    public string? Country { get; init; }
    public string? UrlPath { get; init; }
    
    // Search
    public string? Search { get; init; }
    
    // Sort
    public string SortBy { get; init; } = "timestamp";
    public bool SortDesc { get; init; } = true;
}

/// <summary>
/// Event listesi pagineli response
/// </summary>
public record EventsPagedResponse(
    List<EventListItemDto> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
);

/// <summary>
/// Event tipi dağılımı
/// </summary>
public record EventTypeDistributionDto(
    string EventName,
    int Count,
    double Percentage,
    string Color
);

/// <summary>
/// Hourly event distribution
/// </summary>
public record HourlyEventDistributionDto(
    int Hour,
    int Count
);
