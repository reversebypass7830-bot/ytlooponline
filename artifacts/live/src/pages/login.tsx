import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle,
  Key,
  Lightning,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import "./login.css";

type LoginMethod = "phone" | "license";

export type LoginPageProps = {
  expired: boolean;
  error?: string;
  busy: boolean;
  signedIn: boolean;
  onActivate: (key: string) => void | Promise<void>;
  onRenew: () => void | Promise<void>;
  onGoogleLogin: () => void | Promise<void>;
  onSendMobileOtp: (phone: string) => Promise<{ expiresAt: string; expiresInSeconds: number }>;
  onVerifyMobileOtp: (phone: string, otp: string) => boolean | void | Promise<boolean | void>;
  onCompleteProfile: (profile: { displayName: string; email: string }) => void | Promise<void>;
  onOpenRoom?: () => void;
};

const otpLength = 4;

function OtpBoxes({ value, onChange, onComplete }: { value: string; onChange: (value: string) => void; onComplete: (value: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(otpLength, " ").slice(0, otpLength).split("");

  const updateDigit = (index: number, next: string) => {
    const clean = next.replace(/\D/g, "");
    const nextDigits = digits.map((digit) => (digit === " " ? "" : digit));
    clean.slice(0, otpLength - index).split("").forEach((digit, offset) => {
      nextDigits[index + offset] = digit;
    });
    const nextValue = nextDigits.join("").slice(0, otpLength);
    onChange(nextValue);
    if (clean && index < otpLength - 1) refs.current[Math.min(index + clean.length, otpLength - 1)]?.focus();
    if (nextValue.length === otpLength) onComplete(nextValue);
  };

  return (
    <div className="streamly-otp-boxes" aria-label="One-time passcode">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => { refs.current[index] = element; }}
          aria-label={`OTP digit ${index + 1}`}
          inputMode="numeric"
          maxLength={1}
          value={digit === " " ? "" : digit}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" || event.key === "Delete") {
              event.preventDefault();
              const nextDigits = digits.map((current) => (current === " " ? "" : current));
              if (digits[index]) {
                nextDigits[index] = "";
                if (index > 0) refs.current[index - 1]?.focus();
              } else if (index > 0) {
                nextDigits[index - 1] = "";
                refs.current[index - 1]?.focus();
              }
              onChange(nextDigits.join("").slice(0, otpLength));
            }
          }}
        />
      ))}
    </div>
  );
}

export default function LoginPage({
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
  onOpenRoom,
}: LoginPageProps) {
  const [method, setMethod] = useState<LoginMethod>("phone");
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [otpExpiresAt, setOtpExpiresAt] = useState("");
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(0);
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const [profileNeeded, setProfileNeeded] = useState(false);
  const [profile, setProfile] = useState({ displayName: "", email: "" });
  const [localError, setLocalError] = useState("");
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (!otpSent || !otpExpiresAt) return undefined;
    const updateRemaining = () => {
      const expiresAtMs = Date.parse(otpExpiresAt);
      setOtpRemainingSeconds(Number.isFinite(expiresAtMs) ? Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000)) : 0);
    };
    updateRemaining();
    const timer = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(timer);
  }, [otpExpiresAt, otpSent]);

  useEffect(() => {
    if (!otpSent || resendCooldown <= 0) return undefined;
    const timer = window.setInterval(() => setResendCooldown((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown, otpSent]);

  const shownError = error || localError || licenseError;
  const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);
  const phoneError = phoneTouched && cleanPhone.length > 0 && cleanPhone.length !== 10
    ? "Enter a valid 10-digit Indian mobile number."
    : "";

  const sendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPhoneTouched(true);
    if (cleanPhone.length !== 10 || busy) return;
    setLocalError("");
    try {
      const result = await onSendMobileOtp(`+91${cleanPhone}`);
      setOtpSent(true);
      setOtpExpiresAt(result?.expiresAt || "");
      setOtpRemainingSeconds(result?.expiresInSeconds || 0);
      setResendCooldown(30);
      setOtp("");
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "We could not send that code.");
    }
  };

  const verifyOtp = async (eventOrCode?: FormEvent<HTMLFormElement> | string) => {
    if (typeof eventOrCode !== "string") eventOrCode?.preventDefault();
    const code = typeof eventOrCode === "string" ? eventOrCode : otp;
    if (code.length !== otpLength || busy || verifyingRef.current) return;
    verifyingRef.current = true;
    setLocalError("");
    try {
      const needsProfile = await onVerifyMobileOtp(`+91${cleanPhone}`, code);
      if (needsProfile) setProfileNeeded(true);
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "That code could not be verified.");
    } finally {
      verifyingRef.current = false;
    }
  };

  const activateLicense = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!licenseKey.trim() || busy) return;
    setLicenseError("");
    setLocalError("");
    try {
      if (expired) await onRenew();
      else await onActivate(licenseKey.trim());
    } catch (reason) {
      setLicenseError(reason instanceof Error ? reason.message : "That license key could not be activated.");
    }
  };

  const completeProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (profile.displayName.trim().length < 2 || !profile.email.includes("@") || busy) return;
    setLocalError("");
    try {
      await onCompleteProfile({ displayName: profile.displayName.trim(), email: profile.email.trim() });
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "We could not save your profile.");
    }
  };

  if (profileNeeded) {
    return (
      <div className="streamly-login-page">
        <div className="streamly-login-orb streamly-login-orb-one" />
        <div className="streamly-login-orb streamly-login-orb-two" />
        <main className="streamly-login-main">
          <section className="streamly-login-card" aria-labelledby="profile-title">
            <img className="streamly-login-card-logo" src="/images/logo/loop-logo.webp" alt="Loop Stream" />
            <div className="streamly-login-icon"><CheckCircle size={25} weight="duotone" /></div>
            <span className="streamly-login-eyebrow">Phone verified</span>
            <h1 id="profile-title">Finish your<br /><em>workspace.</em></h1>
            <p className="streamly-login-copy">Add two details so your private broadcast room is ready when you are.</p>
            {shownError && <div className="streamly-login-error" role="alert"><WarningCircle size={17} weight="duotone" /><span>{shownError}</span></div>}
            <form className="streamly-login-form" onSubmit={completeProfile}>
              <label>Display name<input value={profile.displayName} onChange={(event) => setProfile({ ...profile, displayName: event.target.value })} placeholder="Your name" autoComplete="name" /></label>
              <label>Email address<input value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} placeholder="you@example.com" type="email" autoComplete="email" /></label>
              <button className="streamly-login-primary" type="submit" disabled={busy || profile.displayName.trim().length < 2 || !profile.email.includes("@")}>{busy ? "Preparing your room…" : "Open my workspace"} <ArrowRight size={17} weight="bold" /></button>
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="streamly-login-page">
      <div className="streamly-login-orb streamly-login-orb-one" />
      <div className="streamly-login-orb streamly-login-orb-two" />
      <main className="streamly-login-main">
        <section className="streamly-login-card" aria-labelledby="login-title">
          <div className="streamly-login-card-brand">
            <img className="streamly-login-card-logo" src="/images/logo/loop-logo.webp" alt="Loop Stream" />
            <span>24/7 broadcast control</span>
          </div>
          <div className="streamly-login-heading">
            <div className="streamly-login-icon"><Lightning size={25} weight="duotone" /></div>
            <div><span className="streamly-login-eyebrow">{expired ? "License needs attention" : "Private access"}</span><h1 id="login-title">{expired ? "Renew your room." : "Welcome back."}</h1></div>
          </div>
          <p className="streamly-login-copy">{expired ? "Renew your current license to keep your channels, videos, and settings exactly as you left them." : "Sign in to your account and start your broadcast."}</p>
          {shownError && <div className="streamly-login-error" role="alert"><WarningCircle size={17} weight="duotone" /><span>{shownError}</span></div>}
          <div id="login-method-panel" className="streamly-login-method-panel" role="region" aria-label={method === "phone" ? "Phone sign-in" : "License key sign-in"}>
            {method === "phone" && (
              otpSent ? (
                <form className="streamly-login-form" onSubmit={verifyOtp}>
                  <div className="streamly-login-form-heading"><div><label htmlFor="otp-code">Verification code</label><p>Enter the code sent to +91 {cleanPhone}</p></div></div>
                  <OtpBoxes value={otp} onChange={(next) => { setOtp(next); setLocalError(""); }} onComplete={(code) => { void verifyOtp(code); }} />
                  <button className="streamly-login-primary" type="submit" disabled={busy || otp.length !== otpLength}>{busy ? "Verifying…" : "Verify & login"} <ArrowRight size={17} weight="bold" /></button>
                  <div className="streamly-login-inline-actions"><button type="button" onClick={() => { setOtpSent(false); setOtp(""); setOtpExpiresAt(""); setOtpRemainingSeconds(0); }}>Change number</button><button type="button" disabled={resendCooldown > 0 || busy} onClick={(event) => { void sendOtp(event as unknown as FormEvent<HTMLFormElement>); }}>{resendCooldown > 0 ? `Resend in 00:${String(resendCooldown).padStart(2, "0")}` : "Resend code"}</button></div>
                  <p className="streamly-login-otp-expiry" role="status">{otpRemainingSeconds > 0 ? `Code expires in ${Math.floor(otpRemainingSeconds / 60)}:${String(otpRemainingSeconds % 60).padStart(2, "0")}` : "This code has expired. Request a new one."}</p>
                </form>
              ) : (
                <form className="streamly-login-form" onSubmit={sendOtp}>
                  <label htmlFor="mobile-number">Mobile number
                    <div className={`streamly-phone-field ${phoneError ? "has-error" : ""}`}>
                      <span aria-hidden="true">+91</span>
                      <input id="mobile-number" value={phone} onChange={(event) => { setPhone(event.target.value.replace(/\D/g, "").slice(0, 10)); setLocalError(""); }} onBlur={() => setPhoneTouched(true)} placeholder="10-digit mobile number" type="tel" inputMode="numeric" autoComplete="tel-national" aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? "mobile-number-error" : undefined} />
                    </div>
                    {phoneError && <span id="mobile-number-error" className="streamly-login-field-error" role="alert">{phoneError}</span>}
                  </label>
                  <button className="streamly-login-primary" type="submit" disabled={busy || cleanPhone.length !== 10}>{busy ? "Sending code…" : "Send OTP"} <ArrowRight size={17} weight="bold" /></button>
                </form>
              )
            )}

            {method === "license" && <form className="streamly-login-form" onSubmit={activateLicense}><label htmlFor="license-key">License key<div className={`streamly-key-field ${licenseError ? "has-error" : ""}`}><Key size={17} weight="duotone" aria-hidden="true" /><input id="license-key" value={licenseKey} onChange={(event) => { setLicenseKey(event.target.value.toUpperCase()); setLicenseError(""); }} placeholder="XXXX-XXXX-XXXX-XXXX" autoComplete="off" aria-invalid={Boolean(licenseError)} /></div><small>Find your license key in your purchase confirmation email.</small></label><button className="streamly-login-primary" type="submit" disabled={busy || !licenseKey.trim()}>{busy ? "Activating…" : expired ? "Renew & login" : "Activate & login"} <ArrowRight size={17} weight="bold" /></button><button className="streamly-login-back" type="button" onClick={() => { setMethod("phone"); setLocalError(""); setLicenseError(""); }}>Back to phone sign-in</button></form>}
          </div>

          {method === "phone" && !otpSent && (
            <div className="streamly-login-alternatives" aria-label="Other sign-in options">
              <div className="streamly-login-alternatives-divider"><span>or continue with</span></div>
              <div className="streamly-login-alternative-grid">
                <button className="streamly-login-alternative-button" type="button" onClick={() => { void onGoogleLogin(); }} disabled={busy}>
                  <img className="streamly-google-logo" src="/images/google-logo.png" alt="" aria-hidden="true" /> Google
                </button>
                <button className="streamly-login-alternative-button" type="button" onClick={() => { setMethod("license"); setLocalError(""); setLicenseError(""); }} disabled={busy}>
                  <Key size={18} weight="duotone" /> License key
                </button>
              </div>
            </div>
          )}

          <div className="streamly-login-trust"><ShieldCheck size={15} weight="duotone" /> Private workspace access, protected by secure sign-in</div>
        </section>
      </main>
    </div>
  );
}