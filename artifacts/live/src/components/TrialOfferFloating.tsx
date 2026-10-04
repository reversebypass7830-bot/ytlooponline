import { ArrowRight, Gift, Sparkles, X } from "lucide-react";
import "../trial-offer.css";

type TrialOfferFloatingProps = {
  imageSrc: string;
  onClaim: () => void;
  onDismiss: () => void;
};

export default function TrialOfferFloating({ imageSrc, onClaim, onDismiss }: TrialOfferFloatingProps) {
  return (
    <aside className="trial-offer-float" aria-labelledby="trial-offer-title">
      <button
        className="trial-offer-dismiss"
        type="button"
        aria-label="Dismiss the 24-hour offer"
        onClick={onDismiss}
      >
        <X size={17} />
      </button>
      <div className="trial-offer-art" aria-hidden="true">
        <span className="trial-offer-art-halo" />
        <img src={imageSrc} alt="" />
        <span className="trial-offer-art-badge"><Gift size={13} /> 24h</span>
      </div>
      <div className="trial-offer-copy">
        <p className="trial-offer-kicker"><Sparkles size={13} /> A creator gift</p>
        <h2 id="trial-offer-title">24 hours on us.</h2>
        <p>Verify your mobile number in Profile. Your time starts when you claim.</p>
        <button className="trial-offer-claim" type="button" onClick={onClaim}>
          Open Profile <ArrowRight size={15} />
        </button>
      </div>
    </aside>
  );
}