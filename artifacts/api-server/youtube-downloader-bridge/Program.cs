using System.Net;
using System.Text.Json;
using YoutubeDownloader.Core.Downloading;
using YoutubeExplode;
using YoutubeExplode.Videos;
using YoutubeExplode.Videos.Streams;

if (args.Length >= 2 && args[0] == "--formats")
{
    await InspectFormats(args[1]);
    return;
}

if (args.Length < 2)
{
    Console.Error.WriteLine("Usage: YoutubeDownloaderBridge <youtube-url> <output-path> [quality]");
    Environment.ExitCode = 2;
    return;
}

var url = args[0];
var outputPath = args[1];
var quality = args.Length >= 3 ? args[2] : "best";

try
{
    if (VideoId.TryParse(url) is not { } videoId)
        throw new InvalidOperationException("The URL is not a valid YouTube video URL.");

    var cookies = ReadCookies(Environment.GetEnvironmentVariable("YOUTUBE_COOKIES"));
    using var youtube = new YoutubeClient();
    using var downloader = new VideoDownloader(cookies);
    var video = await youtube.Videos.GetAsync(videoId);
    var preference = new VideoDownloadPreference(
        Container.Mp4,
        ParseQuality(quality)
    );
    var option = await downloader.GetBestDownloadOptionAsync(video.Id, preference, includeLanguageSpecificAudioStreams: false);
    await downloader.DownloadVideoAsync(
        outputPath,
        video,
        option,
        includeSubtitles: false,
        ffmpegPath: Environment.GetEnvironmentVariable("FFMPEG_PATH")
    );

    Console.WriteLine(JsonSerializer.Serialize(new
    {
        title = video.Title,
        duration = video.Duration?.ToString(@"hh\:mm\:ss") ?? "00:00",
        quality = option.VideoQuality?.MaxHeight is { } height ? $"{height}p" : quality,
    }));
}
catch (Exception error)
{
    Console.Error.WriteLine(error.ToString());
    Environment.ExitCode = 1;
}

static VideoQualityPreference ParseQuality(string value) =>
    value.ToLowerInvariant() switch
    {
        "2160p" or "1440p" or "1080p" => VideoQualityPreference.Highest,
        "720p" => VideoQualityPreference.UpTo720p,
        "480p" => VideoQualityPreference.UpTo480p,
        "360p" => VideoQualityPreference.UpTo360p,
        "best" => VideoQualityPreference.Highest,
        _ => VideoQualityPreference.Highest,
    };

static IReadOnlyList<Cookie> ReadCookies(string? raw)
{
    if (string.IsNullOrWhiteSpace(raw))
        return [];

    var cookies = new List<Cookie>();
    foreach (var line in raw.Split('\n', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
    {
        if (line.StartsWith('#'))
            continue;

        var parts = line.Split('\t');
        if (parts.Length < 7)
            continue;

        var domain = parts[0].Trim();
        var cookiePath = string.IsNullOrWhiteSpace(parts[2]) ? "/" : parts[2].Trim();
        var name = parts[5].Trim();
        var value = parts[6].Trim();
        if (string.IsNullOrWhiteSpace(domain) || string.IsNullOrWhiteSpace(name))
            continue;

        if (long.TryParse(parts[4], out var expiry) && expiry > 0 && expiry < DateTimeOffset.UtcNow.ToUnixTimeSeconds())
            continue;

        try
        {
            cookies.Add(new Cookie(name, value, cookiePath, domain));
        }
        catch (CookieException)
        {
            // Ignore malformed entries in an uploaded cookie export.
        }
    }

    return cookies;
}

static async Task InspectFormats(string url)
{
    if (VideoId.TryParse(url) is not { } videoId)
        throw new InvalidOperationException("The URL is not a valid YouTube video URL.");

    var cookies = ReadCookies(Environment.GetEnvironmentVariable("YOUTUBE_COOKIES"));
    using var youtube = new YoutubeClient();
    using var downloader = new VideoDownloader(cookies);
    var video = await youtube.Videos.GetAsync(videoId);
    var qualities = (await downloader.GetDownloadOptionsAsync(video.Id, includeLanguageSpecificAudioStreams: false))
        .Select(option => option.VideoQuality?.MaxHeight)
        .Where(height => height is not null)
        .Select(height => height!.Value)
        .Distinct()
        .OrderByDescending(height => height)
        .Where(height => height is 2160 or 1440 or 1080 or 720 or 480 or 360)
        .Select(height => $"{height}p")
        .ToArray();

    Console.WriteLine(JsonSerializer.Serialize(new
    {
        title = video.Title,
        qualities = new[] { "best" }.Concat(qualities).Distinct().ToArray(),
    }));
}