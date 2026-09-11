import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronLeft,
  CircleAlert,
  Gift,
  KeyRound,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import "../access-gate.css";

export type AccessGateProfile = {
  displayName: string;
  email: string;
};

export type AccessGateProps = {
  expired: boolean;
  error?: string;
  busy: boolean;
  signedIn: boolean;
  onActivate: (key: string) => void | Promise<void>;
  onRenew: () => void | Promise<void>;
  onGoogleLogin: () => void | Promise<void>;
  onSendMobileOtp: (phone: string) => void | Promise<void>;
  onVerifyMobileOtp: (phone: string, otp: string) => boolean | void | Promise<boolean | void>;
  onCompleteProfile: (profile: AccessGateProfile) => void | Promise<void>;
  onGiftClaim: () => void | Promise<void>;
  onOpenRoom?: () => void;
  giftKey?: string;
};

type GateStep = "phone" | "otp";

function IndianFlag() {
  return (
    <span className="access-gate-flag" aria-hidden="true">
      <span className="access-gate-flag-saffron" />
      <span className="access-gate-flag-white">
        <span className="access-gate-flag-wheel" />
      </span>
      <span className="access-gate-flag-green" />
    </span>
  );
}

export function AccessGate({
  expired,
  error,
  busy,
  signedIn,
  onActivate,
  onRenew,
  onGoogleLogin,
  onSendMobileOtp,
  onVerifyMobileOtp,
  onCompleteProfile,
  onGiftClaim,
  onOpenRoom,
  giftKey,
}: AccessGateProps) {
  const [step, setStep] = useState<GateStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  const [completedProfile, setCompletedProfile] = useState(false);
  const [giftClaimed, setGiftClaimed] = useState(false);

  const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);
  const cleanOtp = otp.replace(/\D/g, "").slice(0, 4);
  const canSendOtp = cleanPhone.length === 10;
  const canVerifyOtp = cleanOtp.length === 4;
  const canCompleteProfile = displayName.trim().length > 1 && email.includes("@");
  const shownError = error || localError;
  const profileVisible = signedIn || profileOpen || completedProfile;

  useEffect(() => {
    if (!giftOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGiftOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [giftOpen]);

  useEffect(() => {
    if (!giftKey) return;
    setGiftClaimed(false);
    setGiftOpen(true);
  }, [giftKey]);

  const sendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSendOtp || busy) return;
    setLocalError("");
    try {
      await onSendMobileOtp(`+91${cleanPhone}`);
      setStep("otp");
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "We could not send that code.");
    }
  };

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canVerifyOtp || busy) return;
    setLocalError("");
    try {
      const profileRequired = await onVerifyMobileOtp(`+91${cleanPhone}`, cleanOtp);
      if (profileRequired !== false) setProfileOpen(true);
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "That code could not be verified.");
    }
  };

  const activateLicense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!licenseKey.trim() || busy) return;
    setLocalError("");
    try {
      await onActivate(licenseKey.trim());
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "That license key could not be activated.");
    }
  };

  const completeProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canCompleteProfile || busy) return;
    setLocalError("");
    try {
      await onCompleteProfile({ displayName: displayName.trim(), email: email.trim() });
      setCompletedProfile(true);
      setProfileOpen(false);
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "We could not save your profile.");
    }
  };

  const claimGift = async () => {
    setLocalError("");
    try {
      await onGiftClaim();
      setGiftClaimed(true);
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "We could not reveal that license.");
    }
  };

  return (
    <div className="access-gate-shell">
      <div className="access-gate-orb access-gate-orb-one" aria-hidden="true" />
      <div className="access-gate-orb access-gate-orb-two" aria-hidden="true" />

      <header className="access-gate-header">
        <a className="access-gate-brand" href="/" data-testid="link-access-gate-home">
          <span className="access-gate-brand-mark" aria-hidden="true">
            <span>R</span>
            <i />
          </span>
          <span className="access-gate-brand-name">
            R LOOP <strong>BYPASS</strong>
          </span>
        </a>
        <div className="access-gate-header-note">
          <span className="access-gate-status-dot" aria-hidden="true" />
          Private access
        </div>
      </header>

      <main className="access-gate-main">
        <section className="access-gate-intro" aria-labelledby="access-gate-heading">
          <div className="access-gate-overline">
            <span className="access-gate-overline-line" aria-hidden="true" />
            Your room, ready
          </div>
          <h1 id="access-gate-heading">
            Good to see
            <em> you.</em>
          </h1>
          <p className="access-gate-intro-copy">
            Sign in to pick up where your broadcast left off. Your channels,
            videos, and settings stay private to your room.
          </p>

          <div className="access-gate-trust-row" aria-label="Access benefits">
            <span>
              <ShieldCheck size={16} strokeWidth={1.8} />
              Private by default
            </span>
            <span>
              <RefreshCw size={15} strokeWidth={1.8} />
              Ready in seconds
            </span>
          </div>

          <div className="access-gate-signal">
            <span className="access-gate-signal-icon" aria-hidden="true">
              <Sparkles size={17} strokeWidth={1.7} />
            </span>
            <div>
              <strong>One key. One room.</strong>
              <span>Everything in its right place.</span>
            </div>
            <BadgeCheck size={19} className="access-gate-signal-check" />
          </div>
        </section>

        <section className="access-gate-card" aria-label="Access your workspace">
          <div className="access-gate-card-header">
            <div className="access-gate-card-label">
              <span className="access-gate-card-led" aria-hidden="true" />
              Access gate
            </div>
            <span className="access-gate-card-count">01 / 01</span>
          </div>

          <div className="access-gate-card-heading">
            <div className="access-gate-card-icon" aria-hidden="true">
              <LockKeyhole size={21} strokeWidth={1.8} />
            </div>
            <div>
              <p className="access-gate-eyebrow">
                {expired ? "Your license needs attention" : signedIn ? "Account connected" : "Welcome back"}
              </p>
              <h2>{expired ? "Renew your room." : signedIn ? "Finish your profile." : "Open your room."}</h2>
            </div>
          </div>

          <p className="access-gate-card-copy">
            {expired
              ? "Renew this same key to keep your private workspace and settings exactly as you left them."
              : signedIn
                ? "Add a couple of details so your room knows who is on air."
                : "Use your mobile number for the quickest way in, or continue with Google."}
          </p>

          {shownError && (
            <div className="access-gate-alert" role="alert" data-testid="status-access-gate-error">
              <CircleAlert size={17} strokeWidth={1.8} />
              <span>{shownError}</span>
            </div>
          )}

          {!signedIn && !profileVisible && (
            <>
              {step === "phone" ? (
                <form className="access-gate-form" onSubmit={sendOtp} data-testid="form-access-gate-phone">
                  <label className="access-gate-field">
                    <span>Mobile number</span>
                    <span className="access-gate-phone-control">
                      <span className="access-gate-country">
                        <IndianFlag />
                        <strong>+91</strong>
                      </span>
                      <span className="access-gate-phone-divider" aria-hidden="true" />
                      <input
                        id="access-gate-phone"
                        type="tel"
                        value={cleanPhone}
                        onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="98765 43210"
                        autoComplete="tel-national"
                        inputMode="numeric"
                        aria-describedby="access-gate-phone-hint"
                        data-testid="input-access-gate-phone"
                      />
                    </span>
                    <small id="access-gate-phone-hint">We will send a one-time code to this number.</small>
                  </label>
                  <button className="access-gate-button access-gate-button-primary" type="submit" disabled={busy || !canSendOtp} data-testid="button-access-gate-send-otp">
                    <span>{busy ? "Sending code…" : "Continue with mobile"}</span>
                    <ArrowRight size={17} strokeWidth={2} />
                  </button>
                </form>
              ) : (
                <form className="access-gate-form" onSubmit={verifyOtp} data-testid="form-access-gate-otp">
                  <div className="access-gate-otp-topline">
                    <button type="button" className="access-gate-back-button" onClick={() => { setStep("phone"); setOtp(""); setLocalError(""); }} data-testid="button-access-gate-change-number">
                      <ChevronLeft size={16} />
                      Change number
                    </button>
                    <span>Code sent to +91 {cleanPhone}</span>
                  </div>
                  <label className="access-gate-field">
                    <span>4-digit verification code</span>
                    <input
                      className="access-gate-otp-input"
                      id="access-gate-otp"
                      type="text"
                      value={cleanOtp}
                      onChange={(event) => setOtp(event.target.value)}
                      placeholder="0000"
                      autoComplete="one-time-code"
                      inputMode="numeric"
                      maxLength={4}
                      autoFocus
                      data-testid="input-access-gate-otp"
                    />
                  </label>
                  <button className="access-gate-button access-gate-button-primary" type="submit" disabled={busy || !canVerifyOtp} data-testid="button-access-gate-verify-otp">
                    <span>{busy ? "Checking code…" : "Verify and continue"}</span>
                    <Check size={17} strokeWidth={2.1} />
                  </button>
                </form>
              )}

              <div className="access-gate-divider"><span>or</span></div>

              <button className="access-gate-google-button" type="button" onClick={() => void onGoogleLogin()} disabled={busy} data-testid="button-access-gate-google">
                <span className="access-gate-google-mark" aria-hidden="true">G</span>
                <span>Continue with Google</span>
                <ArrowRight size={16} strokeWidth={1.9} />
              </button>

              <button className="access-gate-license-trigger" type="button" onClick={() => setLicenseOpen((open) => !open)} aria-expanded={licenseOpen} data-testid="button-access-gate-license-toggle">
                <span className="access-gate-license-trigger-icon"><KeyRound size={16} strokeWidth={1.8} /></span>
                <span>
                  <strong>Use a license key</strong>
                  <small>Already have access? Enter it here.</small>
                </span>
                <ArrowRight size={16} className={licenseOpen ? "access-gate-rotate" : ""} />
              </button>

              {licenseOpen && (
                <form className="access-gate-license-form" onSubmit={activateLicense} data-testid="form-access-gate-license">
                  <label className="access-gate-field">
                    <span>License key</span>
                    <input
                      id="access-gate-license-key"
                      value={licenseKey}
                      onChange={(event) => setLicenseKey(event.target.value)}
                      placeholder="RL-XXXXXXXXXXXX"
                      autoComplete="off"
                      data-testid="input-access-gate-license-key"
                    />
                  </label>
                  <button className="access-gate-button access-gate-button-secondary" type="submit" disabled={busy || !licenseKey.trim()} data-testid="button-access-gate-activate">
                    <span>{busy ? "Checking key…" : "Open with license key"}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </>
          )}

          {profileVisible && (
            <div className="access-gate-profile-area">
              {completedProfile ? (
                <div className="access-gate-complete-state" data-testid="status-access-gate-profile-complete">
                  <span className="access-gate-complete-icon"><Check size={19} /></span>
                  <div>
                    <strong>You are all set, {displayName}.</strong>
                    <span>Your room is ready for the next signal.</span>
                  </div>
                </div>
              ) : (
                <form className="access-gate-form" onSubmit={completeProfile} data-testid="form-access-gate-profile">
                  <label className="access-gate-field">
                    <span>Display name</span>
                    <span className="access-gate-input-with-icon">
                      <UserRound size={17} />
                      <input id="access-gate-display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="How should we call you?" autoComplete="name" data-testid="input-access-gate-display-name" />
                    </span>
                  </label>
                  <label className="access-gate-field">
                    <span>Email address</span>
                    <span className="access-gate-input-with-icon">
                      <Mail size={17} />
                      <input id="access-gate-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" data-testid="input-access-gate-email" />
                    </span>
                  </label>
                  <button className="access-gate-button access-gate-button-primary" type="submit" disabled={busy || !canCompleteProfile} data-testid="button-access-gate-complete-profile">
                    <span>{busy ? "Saving profile…" : "Save and enter room"}</span>
                    <ArrowRight size={17} />
                  </button>
                </form>
              )}
            </div>
          )}

          {expired && (
            <button className="access-gate-renew-button" type="button" onClick={() => void onRenew()} disabled={busy} data-testid="button-access-gate-renew">
              <RefreshCw size={16} />
              {busy ? "Renewing your key…" : "Renew this key for 30 days"}
            </button>
          )}

          <div className="access-gate-card-footer">
            <ShieldCheck size={15} strokeWidth={1.8} />
            <span>Secure sign-in. Your private room stays yours.</span>
          </div>
        </section>
      </main>

      <section className="access-gate-gift-strip" aria-label="Gift license">
        <div className="access-gate-gift-icon"><Gift size={20} strokeWidth={1.7} /></div>
        <div>
          <strong>Have a gifted room?</strong>
          <span>Reveal the license someone sent your way.</span>
        </div>
        <button type="button" onClick={() => setGiftOpen(true)} data-testid="button-access-gate-open-gift">
          Reveal license
          <ArrowRight size={16} />
        </button>
      </section>

      <footer className="access-gate-footer">
        <span>Broadcast automation for the long signal.</span>
        <span className="access-gate-footer-rule" aria-hidden="true" />
        <span>R Loop Bypass</span>
      </footer>

      {giftOpen && (
        <div className="access-gate-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setGiftOpen(false); }}>
          <section className="access-gate-modal" role="dialog" aria-modal="true" aria-labelledby="access-gate-gift-title">
            <button className="access-gate-modal-close" type="button" onClick={() => setGiftOpen(false)} aria-label="Close gift license" data-testid="button-access-gate-close-gift">
              <X size={18} />
            </button>
            <div className="access-gate-modal-icon"><Gift size={24} strokeWidth={1.7} /></div>
            <p className="access-gate-eyebrow">A room, wrapped for you</p>
            <h2 id="access-gate-gift-title">Your access is waiting.</h2>
            <p>Claim the gifted license to open a private broadcast room. It will be linked to the account you use to sign in.</p>
             <div className={`access-gate-reveal-card ${giftClaimed ? "access-gate-reveal-card-revealed" : ""}`}>
              <span className="access-gate-reveal-card-label">Gift license</span>
               <span className="access-gate-reveal-card-value">{giftClaimed && giftKey ? giftKey : "RL •••• •••• ••••"}</span>
               <BadgeCheck size={18} />
            </div>
             {!giftClaimed ? <button className="access-gate-button access-gate-button-primary" type="button" onClick={() => void claimGift()} disabled={busy} data-testid="button-access-gate-claim-gift">
               <span>{busy ? "Claiming license…" : "Reveal my license"}</span>
               <ArrowRight size={17} />
             </button> : <button className="access-gate-button access-gate-button-primary" type="button" onClick={() => { onOpenRoom?.(); setGiftOpen(false); }} data-testid="button-access-gate-close-revealed-gift">
               <span>Open my room</span>
               <ArrowRight size={17} />
             </button>}
             <p className="access-gate-modal-footnote"><LockKeyhole size={13} /> Your workspace license is generated and linked securely.</p>
          </section>
        </div>
      )}
    </div>
  );
}

export default AccessGate;