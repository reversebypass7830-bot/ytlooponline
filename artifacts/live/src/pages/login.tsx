import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle,
  GoogleLogo,
  Key,
  Lightning,
  Phone,
  ShieldCheck,
  WarningCircle,
} from "@phosphor-icons/react";
import { Link } from "wouter";

type LoginMethod = "phone" | "google" | "license";

export type LoginPageProps = {
  expired: boolean;
  error?: string;
  busy: boolean;
  signedIn: boolean;
  onActivate: (key: string) => void | Promise<void>;
  onRenew: () => void | Promise<void>;
  onGoogleLogin: () => void | Promise<void>;
  onSendMobileOtp: (phone: string) => void | Promise<void>;
  onVerifyMobileOtp: (phone: string, otp: string) => boolean | void | Promise<boolean | void>;
  onCompleteProfile: (profile: { displayName: string; email: string }) => void | Promise<void>;
  onOpenRoom?: () => void;
};

const otpLength = 4;

function OtpBoxes({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(otpLength, " ").slice(0, otpLength).split("");

  const updateDigit = (index: number, next: string) => {
    const clean = next.replace(/\D/g, "").slice(-1);
    const nextDigits = digits.map((digit) => (digit === " " ? "" : digit));
    nextDigits[index] = clean;
    onChange(nextDigits.join("").slice(0, otpLength));
    if (clean && index < otpLength - 1) refs.current[index + 1]?.focus();
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
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              refs.current[index - 1]?.focus();
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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseError, setLicenseError] = useState("");
  const [profileNeeded, setProfileNeeded] = useState(false);
  const [profile, setProfile] = useState({ displayName: "", email: "" });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!otpSent || cooldown <= 0) return undefined;
    const timer = window.setInterval(() => setCooldown((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown, otpSent]);

  const shownError = error || localError || licenseError;
  const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);

  const sendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cleanPhone.length !== 10 || busy) return;
    setLocalError("");
    try {
      await onSendMobileOtp(`+91${cleanPhone}`);
      setOtpSent(true);
      setCooldown(30);
      setOtp("");
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "We could not send that code.");
    }
  };

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp.length !== otpLength || busy) return;
    setLocalError("");
    try {
      const needsProfile = await onVerifyMobileOtp(`+91${cleanPhone}`, otp);
      if (needsProfile) setProfileNeeded(true);
    } catch (reason) {
      setLocalError(reason instanceof Error ? reason.message : "That code could not be verified.");
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
        <Link href="/" className="streamly-login-brand"><span className="streamly-mark"><span>S</span><i /></span><span>Streamly</span></Link>
        <main className="streamly-login-main">
          <section className="streamly-login-card" aria-labelledby="profile-title">
            <div className="streamly-login-card-top"><span><i /> ACCESS / 02</span><span>PROFILE</span></div>
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
      <Link href="/" className="streamly-login-brand"><span className="streamly-mark"><span>S</span><i /></span><span>Streamly</span></Link>
      <main className="streamly-login-main">
        <section className="streamly-login-card" aria-labelledby="login-title">
          <div className="streamly-login-card-top"><span><i /> PRIVATE ACCESS</span><span>01 / 01</span></div>
          <div className="streamly-login-heading">
            <div className="streamly-login-icon"><Lightning size={25} weight="duotone" /></div>
            <div><span className="streamly-login-eyebrow">{expired ? "License needs attention" : signedIn ? "Account connected" : "Welcome back"}</span><h1 id="login-title">{expired ? "Renew your room." : "Open your room."}</h1></div>
          </div>
          <p className="streamly-login-copy">{expired ? "Renew your current license to keep your channels, videos, and settings exactly as you left them." : "Sign in to keep your channel moving. Your broadcast room stays private to you."}</p>
          {shownError && <div className="streamly-login-error" role="alert"><WarningCircle size={17} weight="duotone" /><span>{shownError}</span></div>}
          <div className="streamly-login-tabs" role="tablist" aria-label="Sign-in methods">
            {([["phone", Phone, "Phone"], ["google", GoogleLogo, "Google"], ["license", Key, "License key"]] as const).map(([key, Icon, label]) => (
              <button key={key} type="button" role="tab" aria-selected={method === key} className={method === key ? "active" : ""} onClick={() => { setMethod(key); setLocalError(""); setLicenseError(""); }}>
                <Icon size={17} weight="duotone" /> <span>{label}</span>
              </button>
            ))}
          </div>

          {method === "phone" && (
            otpSent ? (
              <form className="streamly-login-form" onSubmit={verifyOtp}>
                <div className="streamly-login-form-heading"><div><label htmlFor="otp-code">Verification code</label><p>Enter the code sent to +91 {cleanPhone}</p></div><Phone size={19} weight="duotone" /></div>
                <OtpBoxes value={otp} onChange={setOtp} />
                <button className="streamly-login-primary" type="submit" disabled={busy || otp.length !== otpLength}>{busy ? "Verifying…" : "Verify & login"} <ArrowRight size={17} weight="bold" /></button>
                <div className="streamly-login-inline-actions"><button type="button" onClick={() => { setOtpSent(false); setOtp(""); }}>Change number</button><button type="button" disabled={cooldown > 0 || busy} onClick={(event) => { void sendOtp(event as unknown as FormEvent<HTMLFormElement>); }}>{cooldown > 0 ? `Resend in 00:${String(cooldown).padStart(2, "0")}` : "Resend code"}</button></div>
              </form>
            ) : (
              <form className="streamly-login-form" onSubmit={sendOtp}>
                <label>Mobile number<div className="streamly-phone-field"><span>+91</span><Phone size={17} weight="duotone" /><input value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="98765 43210" type="tel" inputMode="numeric" autoComplete="tel-national" /></div></label>
                <button className="streamly-login-primary" type="submit" disabled={busy || cleanPhone.length !== 10}>{busy ? "Sending code…" : "Send OTP"} <ArrowRight size={17} weight="bold" /></button>
              </form>
            )
          )}

          {method === "google" && <div className="streamly-google-panel"><button type="button" className="streamly-google-button" onClick={() => { /* TODO: connect to existing Google OAuth flow */ void onGoogleLogin(); }} disabled={busy}><GoogleLogo size={21} weight="bold" /> Continue with Google <ArrowRight size={16} /></button><p><ShieldCheck size={15} weight="duotone" /> We only access your basic profile and YouTube channel info</p></div>}

          {method === "license" && <form className="streamly-login-form" onSubmit={activateLicense}><label>License key<div className={`streamly-key-field ${licenseError ? "has-error" : ""}`}><Key size={17} weight="duotone" /><input value={licenseKey} onChange={(event) => { setLicenseKey(event.target.value.toUpperCase()); setLicenseError(""); }} placeholder="XXXX-XXXX-XXXX-XXXX" autoComplete="off" /></div><small>Find your license key in your purchase confirmation email.</small></label><button className="streamly-login-primary" type="submit" disabled={busy || !licenseKey.trim()}>{busy ? "Activating…" : expired ? "Renew & login" : "Activate & login"} <ArrowRight size={17} weight="bold" /></button></form>}

          <div className="streamly-login-divider"><span>secure broadcast access</span></div>
          <p className="streamly-login-footer">Need an account? <Link href="/pricing">Start your free day</Link></p>
          <div className="streamly-login-trust"><ShieldCheck size={15} weight="duotone" /><span>Private by default · ready in seconds</span></div>
        </section>
      </main>
    </div>
  );
}