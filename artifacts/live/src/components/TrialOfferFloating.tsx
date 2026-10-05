import { ArrowRight, Gift, Sparkles, X } from "lucide-react";
import "../trial-offer.css";

type TrialOfferFloatingProps = {
  imageSrc: string;
  durationHours: number;
  onClaim: () => void;
  onDismiss: () => void;
};

export default function TrialOfferFloating({ imageSrc, durationHours, onClaim, onDismiss }: TrialOfferFloatingProps) {
  const durationLabel = `${durationHours} hour${durationHours === 1 ? "" : "s"}`;
  return (
    <aside className="trial-offer-float" aria-labelledby="trial-offer-title">
      <button
        className="trial-offer-dismiss"
        type="button"
        aria-label="Dismiss the free trial offer"
        onClick={onDismiss}
      >
        <X size={17} />
      </button>
      <div className="trial-offer-art" aria-hidden="true">
        <span className="trial-offer-art-halo" />
        <img src={imageSrc} alt="" />
        <span className="trial-offer-platform trial-offer-platform-youtube"><img src="/images/loopstream/platforms/youtube.webp" alt="" /></span>
        <span className="trial-offer-platform trial-offer-platform-facebook"><img src="/images/loopstream/platforms/facebook.webp" alt="" /></span>
        <span className="trial-offer-platform trial-offer-platform-twitch"><img src="/images/loopstream/platforms/twitch.webp" alt="" /></span>
        <span className="trial-offer-art-badge"><Gift size={13} /> {durationHours}h</span>
      </div>
      <div className="trial-offer-copy">
        <p className="trial-offer-kicker"><Sparkles size={13} /> A creator gift</p>
        <h2 id="trial-offer-title">{durationLabel} on us.</h2>
        <p>Verify your number in Profile, then claim your free trial. Your time starts when you activate it.</p>
        <button className="trial-offer-claim" type="button" onClick={onClaim}>
          Claim {durationLabel} <ArrowRight size={15} />
        </button>
      </div>
    </aside>
  );
}