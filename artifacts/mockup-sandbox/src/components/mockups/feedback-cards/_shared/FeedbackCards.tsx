export type FeedbackEntry = {
  id: string;
  title: string;
  channelName: string;
  channelUrl: string;
  imageUrl: string;
  imageUrls: string[];
  avatarUrl: string;
  channelStats: {
    views: string;
    joined: string;
  };
};

const imageRoot = "/__mockup/images/feedback-demo";

export const feedbackEntries: FeedbackEntry[] = [
  {
    id: "demo-kai-asmr",
    title: "Live stream and channel page",
    channelName: "Kai ASMR",
    channelUrl: "https://youtube.com/@kaiasmr4real",
    imageUrl: `${imageRoot}/kai-asmr-live.webp`,
    imageUrls: [`${imageRoot}/kai-asmr-live.webp`, `${imageRoot}/kai-asmr-about.webp`],
    avatarUrl: `${imageRoot}/kai-asmr-avatar.webp`,
    channelStats: { views: "871,184,265 views", joined: "Joined 18 Sept 2018" },
  },
  {
    id: "demo-dambiesyt",
    title: "WWE 2K live channel",
    channelName: "Dambiesyt",
    channelUrl: "https://youtube.com/@dambiesyt",
    imageUrl: `${imageRoot}/dambiesyt-live.webp`,
    imageUrls: [`${imageRoot}/dambiesyt-live.webp`, `${imageRoot}/dambiesyt-about.webp`],
    avatarUrl: `${imageRoot}/dambiesyt-avatar.webp`,
    channelStats: { views: "350,244,301 views", joined: "Joined 2 Oct 2018" },
  },
  {
    id: "demo-tang-tien",
    title: "Raw egg peeling ASMR live",
    channelName: "Tăng Tiến Official",
    channelUrl: "https://youtube.com/@tangtienofficial2050",
    imageUrl: `${imageRoot}/tang-tien-live.webp`,
    imageUrls: [`${imageRoot}/tang-tien-live.webp`, `${imageRoot}/tang-tien-about.webp`],
    avatarUrl: `${imageRoot}/tang-tien-avatar.webp`,
    channelStats: { views: "285,397,416 views", joined: "Joined 9 Nov 2014" },
  },
  {
    id: "demo-candy-talks",
    title: "Satisfying candy ASMR live",
    channelName: "CANDY TALKS",
    channelUrl: "https://youtube.com/@candytalks-z9b",
    imageUrl: `${imageRoot}/candy-talks-live.webp`,
    imageUrls: [`${imageRoot}/candy-talks-live.webp`, `${imageRoot}/candy-talks-about.webp`],
    avatarUrl: `${imageRoot}/candy-talks-avatar.webp`,
    channelStats: { views: "8,609,866 views", joined: "Joined 25 Oct 2025" },
  },
];

function getChannelInitials(channelName: string): string {
  return channelName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function FeedbackCard({
  entry,
  showStats = false,
}: {
  entry: FeedbackEntry;
  showStats?: boolean;
}) {
  const imageCount = entry.imageUrls.length || 1;

  return (
    <article className="feedback-card" data-testid={`card-feedback-${entry.id}`}>
      <a
        className="feedback-card-channel-link"
        href={entry.channelUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${entry.channelName} on YouTube`}
      >
        {entry.avatarUrl ? (
          <img className="feedback-card-avatar" src={entry.avatarUrl} alt="" loading="lazy" />
        ) : (
          <span className="feedback-card-avatar feedback-avatar-fallback" aria-hidden="true">
            {getChannelInitials(entry.channelName)}
          </span>
        )}
        <span className="feedback-card-channel">{entry.channelName}</span>
        <span className="feedback-card-channel-arrow" aria-hidden="true">↗</span>
      </a>
      <button
        className="feedback-card-preview"
        type="button"
        onClick={() => undefined}
        aria-label={`View ${imageCount} feedback ${imageCount === 1 ? "image" : "images"} from ${entry.channelName}`}
      >
        <span className="feedback-card-image">
          <img src={entry.imageUrl} alt={`Channel preview for ${entry.channelName}`} loading="lazy" />
          <span className="feedback-card-open" aria-hidden="true">
            {imageCount} {imageCount === 1 ? "image" : "images"} ↗
          </span>
        </span>
        <span className="feedback-card-copy">
          <span className="feedback-card-title">{entry.title}</span>
          {showStats && (
            <span className="feedback-card-details">
              <span className="feedback-card-view-count">
                <span>{entry.channelStats.views}</span>
              </span>
              <span className="feedback-card-joined">{entry.channelStats.joined}</span>
            </span>
          )}
        </span>
      </button>
    </article>
  );
}

export function FeedbackCardRow({ showStats = false }: { showStats?: boolean }) {
  return (
    <div className="feedback-page">
      <div className="feedback-page-inner">
        <section className="feedback-landing-section" aria-labelledby="feedback-landing-title">
          <div className="feedback-landing-heading">
            <div>
              <p className="feedback-eyebrow">CREATOR FEEDBACK</p>
              <h3 id="feedback-landing-title">Channel feedback</h3>
              <p>Browse channel snapshots and open each creator’s YouTube page.</p>
            </div>
          </div>
          <div className="feedback-landing-grid" aria-label="Featured creator channels">
            {feedbackEntries.map((entry) => (
              <FeedbackCard key={entry.id} entry={entry} showStats={showStats} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}