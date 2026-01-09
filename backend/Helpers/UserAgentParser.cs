using System.Text.RegularExpressions;

namespace Analytics.API.Helpers;

/// <summary>
/// User-Agent parsing sonucu.
/// Browser, OS ve Device bilgilerini içerir.
/// </summary>
public record UserAgentInfo(
    string Browser,
    string BrowserVersion,
    string OS,
    string OSVersion,
    string Device,
    bool IsMobile,
    bool IsBot
)
{
    /// <summary>
    /// Bilinmeyen User-Agent için varsayılan değer
    /// </summary>
    public static UserAgentInfo Unknown => new(
        Browser: Constants.Unknown,
        BrowserVersion: Constants.Unknown,
        OS: Constants.Unknown,
        OSVersion: Constants.Unknown,
        Device: Constants.Unknown,
        IsMobile: false,
        IsBot: false
    );

    private static class Constants
    {
        public const string Unknown = "Unknown";
    }
}

/// <summary>
/// User-Agent string parsing helper.
/// Browser, OS ve Device tespiti yapar.
/// </summary>
public static partial class UserAgentParser
{
    #region Constants

    private const string Unknown = "Unknown";

    #endregion

    #region Compiled Regex Patterns (Performance)

    [GeneratedRegex(@"CPU.*?OS (\d+[_\.]\d+(?:[_\.]\d+)?)", RegexOptions.IgnoreCase | RegexOptions.Compiled)]
    private static partial Regex IOSVersionRegex();

    [GeneratedRegex(@"Mac OS X (\d+[_\.]\d+(?:[_\.]\d+)?)", RegexOptions.IgnoreCase | RegexOptions.Compiled)]
    private static partial Regex MacOSVersionRegex();

    #endregion

    #region Browser Patterns (Order matters - specific first)

    private static readonly BrowserPattern[] BrowserPatterns =
    [
        new("Edg/", "Edge", "Edg/"),
        new("Edge/", "Edge", "Edge/"),
        new("OPR/", "Opera", "OPR/"),
        new("Opera", "Opera", "Opera/"),
        new("SamsungBrowser", "Samsung Browser", "SamsungBrowser/"),
        new("Firefox/", "Firefox", "Firefox/"),
        new("MSIE", "Internet Explorer", null),    // Special handling
        new("Trident", "Internet Explorer", null), // Special handling
        // Chrome must come after Edge, Opera, Samsung (they all contain Chrome)
        new("Chrome/", "Chrome", "Chrome/", ExcludePattern: "Chromium"),
        // Safari must come last (Chrome also contains Safari)
        new("Safari/", "Safari", "Version/", ExcludePattern: "Chrome"),
    ];

    private record BrowserPattern(
        string SearchPattern, 
        string Name, 
        string? VersionPrefix, 
        string? ExcludePattern = null);

    #endregion

    #region Windows Version Mapping

    private static readonly Dictionary<string, string> WindowsVersionMap = new()
    {
        ["Windows NT 10.0"] = "10/11",
        ["Windows NT 6.3"] = "8.1",
        ["Windows NT 6.2"] = "8",
        ["Windows NT 6.1"] = "7",
        ["Windows NT 6.0"] = "Vista",
        ["Windows NT 5.1"] = "XP"
    };

    #endregion

    #region Bot Patterns & Names

    private static readonly string[] BotPatterns =
    [
        "bot", "crawler", "spider", "slurp", "mediapartners",
        "googlebot", "bingbot", "yandex", "baidu", "duckduck",
        "facebookexternalhit", "twitterbot", "linkedinbot",
        "whatsapp", "telegrambot", "slackbot", "discordbot",
        "pingdom", "uptimerobot", "headless", "phantom", "selenium"
    ];

    private static readonly Dictionary<string, string> BotNameMap = new()
    {
        ["googlebot"] = "Googlebot",
        ["bingbot"] = "Bingbot",
        ["yandex"] = "YandexBot",
        ["baidu"] = "Baiduspider",
        ["facebookexternalhit"] = "Facebook",
        ["twitterbot"] = "Twitter",
        ["linkedinbot"] = "LinkedIn",
        ["whatsapp"] = "WhatsApp",
        ["telegrambot"] = "Telegram",
        ["slackbot"] = "Slack",
        ["discordbot"] = "Discord"
    };

    #endregion

    #region Device Patterns

    private static readonly DevicePattern[] MobileDevicePatterns =
    [
        new("iphone", "iPhone"),
        new("ipad", "iPad"),
        new("ipod", "iPod"),
        new("windows phone", "Windows Phone"),
    ];

    private static readonly DevicePattern[] DesktopDevicePatterns =
    [
        new("windows", "Desktop"),
        new("macintosh", "Mac"),
        new("mac os", "Mac"),
        new("cros", "Chromebook"),
    ];

    private record DevicePattern(string SearchPattern, string Name);

    #endregion

    #region Public API

    /// <summary>
    /// User-Agent stringini parse et
    /// </summary>
    public static UserAgentInfo Parse(string? userAgent)
    {
        if (string.IsNullOrWhiteSpace(userAgent))
            return UserAgentInfo.Unknown;

        var uaLower = userAgent.ToLowerInvariant();

        // Bot kontrolü (öncelikli)
        if (IsBot(uaLower))
            return CreateBotInfo(uaLower);

        // Parse components
        var (browser, browserVersion) = DetectBrowser(userAgent);
        var (os, osVersion) = DetectOS(userAgent);
        var (device, isMobile) = DetectDevice(uaLower);

        return new UserAgentInfo(browser, browserVersion, os, osVersion, device, isMobile, IsBot: false);
    }

    #endregion

    #region Browser Detection

    private static (string Browser, string Version) DetectBrowser(string userAgent)
    {
        foreach (var pattern in BrowserPatterns)
        {
            if (!userAgent.Contains(pattern.SearchPattern, StringComparison.OrdinalIgnoreCase))
                continue;

            // Exclusion check
            if (pattern.ExcludePattern != null && 
                userAgent.Contains(pattern.ExcludePattern, StringComparison.OrdinalIgnoreCase))
                continue;

            // Special handling for IE
            if (pattern.Name == "Internet Explorer")
                return ("Internet Explorer", ExtractIEVersion(userAgent));

            var version = pattern.VersionPrefix != null 
                ? ExtractVersion(userAgent, pattern.VersionPrefix) ?? Unknown 
                : Unknown;

            return (pattern.Name, version);
        }

        return (Unknown, Unknown);
    }

    private static string? ExtractVersion(string userAgent, string prefix)
    {
        var index = userAgent.IndexOf(prefix, StringComparison.OrdinalIgnoreCase);
        if (index < 0) return null;

        var start = index + prefix.Length;
        var end = start;

        while (end < userAgent.Length && IsVersionChar(userAgent[end]))
            end++;

        var version = userAgent[start..end];
        return string.IsNullOrEmpty(version) ? null : version;
    }

    private static bool IsVersionChar(char c) 
        => char.IsDigit(c) || c == '.';

    private static string ExtractIEVersion(string userAgent)
    {
        if (userAgent.Contains("MSIE ", StringComparison.OrdinalIgnoreCase))
            return ExtractVersion(userAgent, "MSIE ") ?? Unknown;

        if (userAgent.Contains("Trident/7", StringComparison.OrdinalIgnoreCase))
            return "11.0";

        return Unknown;
    }

    #endregion

    #region OS Detection

    private static (string OS, string Version) DetectOS(string userAgent)
    {
        // iOS (iPhone/iPad/iPod)
        if (ContainsAny(userAgent, "iPhone", "iPad", "iPod"))
            return ("iOS", ExtractIOSVersion(userAgent));

        // Android
        if (userAgent.Contains("Android", StringComparison.OrdinalIgnoreCase))
            return ("Android", ExtractVersion(userAgent, "Android ") ?? Unknown);

        // Windows
        if (userAgent.Contains("Windows", StringComparison.OrdinalIgnoreCase))
            return ("Windows", DetectWindowsVersion(userAgent));

        // macOS
        if (ContainsAny(userAgent, "Mac OS X", "Macintosh"))
            return ("macOS", ExtractMacOSVersion(userAgent));

        // Linux (not Android)
        if (userAgent.Contains("Linux", StringComparison.OrdinalIgnoreCase) && 
            !userAgent.Contains("Android", StringComparison.OrdinalIgnoreCase))
            return ("Linux", Unknown);

        // Chrome OS
        if (userAgent.Contains("CrOS", StringComparison.OrdinalIgnoreCase))
            return ("Chrome OS", Unknown);

        return (Unknown, Unknown);
    }

    private static string ExtractIOSVersion(string userAgent)
    {
        var match = IOSVersionRegex().Match(userAgent);
        return match.Success ? match.Groups[1].Value.Replace('_', '.') : Unknown;
    }

    private static string DetectWindowsVersion(string userAgent)
    {
        foreach (var (pattern, version) in WindowsVersionMap)
        {
            if (userAgent.Contains(pattern, StringComparison.OrdinalIgnoreCase))
                return version;
        }
        return Unknown;
    }

    private static string ExtractMacOSVersion(string userAgent)
    {
        var match = MacOSVersionRegex().Match(userAgent);
        return match.Success ? match.Groups[1].Value.Replace('_', '.') : Unknown;
    }

    #endregion

    #region Device Detection

    private static (string Device, bool IsMobile) DetectDevice(string uaLower)
    {
        // Mobile devices first
        foreach (var pattern in MobileDevicePatterns)
        {
            if (uaLower.Contains(pattern.SearchPattern))
                return (pattern.Name, true);
        }

        // Android (check mobile vs tablet)
        if (uaLower.Contains("android"))
        {
            var device = uaLower.Contains("mobile") ? "Android Phone" : "Android Tablet";
            return (device, true);
        }

        // Desktop devices
        foreach (var pattern in DesktopDevicePatterns)
        {
            if (uaLower.Contains(pattern.SearchPattern))
                return (pattern.Name, false);
        }

        // Linux desktop (not Android)
        if (uaLower.Contains("linux") && !uaLower.Contains("android"))
            return ("Linux Desktop", false);

        return (Unknown, false);
    }

    #endregion

    #region Bot Detection

    private static bool IsBot(string uaLower)
        => BotPatterns.Any(uaLower.Contains);

    private static UserAgentInfo CreateBotInfo(string uaLower)
    {
        var botName = DetectBotName(uaLower);
        return new UserAgentInfo(
            Browser: botName,
            BrowserVersion: Unknown,
            OS: "Bot",
            OSVersion: Unknown,
            Device: "Bot",
            IsMobile: false,
            IsBot: true
        );
    }

    private static string DetectBotName(string uaLower)
    {
        foreach (var (pattern, name) in BotNameMap)
        {
            if (uaLower.Contains(pattern))
                return name;
        }
        return "Bot";
    }

    #endregion

    #region Helpers

    private static bool ContainsAny(string text, params string[] patterns)
        => patterns.Any(p => text.Contains(p, StringComparison.OrdinalIgnoreCase));

    #endregion
}
