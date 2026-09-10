import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeftRight, ArrowRight, Check, Menu, MessageCircle, Play, Radio, Send, Signal, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import GetOfferButton from "@/components/GetOfferButton";
import logoImage from "@assets/image_1788788255512.png";
import loopControlArtwork from "@assets/loopstream_reference/feature-loop-control.jpeg";
import streamingArtwork from "@assets/loopstream_reference/feature-24x7-streaming.jpeg";
import playlistArtwork from "@assets/loopstream_reference/feature-playlist-builder.jpeg";
import qualityArtwork from "@assets/loopstream_reference/feature-1080p-4k.jpeg";
import schedulerArtwork from "@assets/loopstream_reference/feature-advanced-scheduler.jpeg";
import scheduleStreamArtwork from "@assets/loopstream_reference/schedule-stream.jpeg";
import heroTwoScreenImage from "@assets/loopstream_reference/hero-two-screen.webp";
import connectionLostImage from "@assets/loopstream_reference/comparison-connection-lost.png";
import loopRunningImage from "@assets/loopstream_reference/comparison-loop-running.png";
import newsReferenceImage from "@assets/loopstream_reference/news.webp";
import devotionalReferenceImage from "@assets/generated_images/use-case-devotional-broadcast.jpg";
import musicReferenceImage from "@assets/generated_images/use-case-music-live.jpg";
import cartoonsReferenceImage from "@assets/generated_images/use-case-kids-entertainment_2.jpg";
import educationReferenceImage from "@assets/generated_images/use-case-education_2.jpg";
import affiliateReferenceImage from "@assets/generated_images/use-case-product-showcase.jpg";
import youtubeReferenceIcon from "@assets/loopstream_reference/youtube.webp";
import facebookReferenceIcon from "@assets/loopstream_reference/facebook.webp";
import twitchReferenceIcon from "@assets/loopstream_reference/twitch.webp";
import kickReferenceIcon from "@assets/loopstream_reference/kick.webp";
import instagramReferenceIcon from "@assets/loopstream_reference/instagram.webp";
import xReferenceIcon from "@assets/loopstream_reference/x.webp";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const useCases = [
  { title: "News & live updates", note: "Keep the daily signal moving", image: newsReferenceImage },
  { title: "Devotional programming", note: "Broadcast a calm daily rhythm", image: devotionalReferenceImage },
  { title: "Music & live sessions", note: "Put every performance on air", image: musicReferenceImage },
  { title: "Kids & entertainment", note: "Give every show a colorful channel", image: cartoonsReferenceImage },
  { title: "Education & classes", note: "Turn lessons into a live classroom", image: educationReferenceImage },
  { title: "Product showcases", note: "Keep product stories in motion", image: affiliateReferenceImage },
];

const platformIcons = [
  { label: "YouTube", image: youtubeReferenceIcon },
  { label: "Facebook", image: facebookReferenceIcon },
  { label: "Twitch", image: twitchReferenceIcon },
  { label: "Kick", image: kickReferenceIcon },
  { label: "Instagram", image: instagramReferenceIcon, comingSoon: true },
  { label: "X", image: xReferenceIcon, comingSoon: true },
];

const powerfulFeatures = [
  { title: "Loop Control", description: "Stream videos once, repeat N times, or loop endlessly", artwork: loopControlArtwork },
  { title: "24x7 Streaming", description: "Stay live around the clock - without staying online", artwork: streamingArtwork },
  { title: "Playlist Builder", description: "Line up multiple videos and go live in sequence", artwork: playlistArtwork },
  { title: "1080p & 4K Output", description: "Crystal-clear live streams up to 2160p", artwork: qualityArtwork },
  { title: "Advanced Scheduler", description: "Plan your streams for days, weeks, or months ahead", artwork: schedulerArtwork },
];

const navItems = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Pricing", href: "/pricing" },
];

const MONTHLY_OFFER_DURATION = 3 * 60 * 60 * 1000;
const MONTHLY_OFFER_DEADLINE_KEY = "r-loop-bypass-monthly-offer-deadline";

function BrandMark() {
  return <span className="marketing-mark"><img src={logoImage} alt="" /></span>;
}

function RollLabel({ children }: { children: string }) {
  return <span className="roll-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}

function HeroRollText({ children }: { children: string }) {
  return <span className="hero-roll-line"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
}

function PublicNav({ onAccess }: { onAccess?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const go = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    else setLocation(href);
  };
  return <header className={`marketing-nav ${menuOpen ? "is-open" : ""}`}>
    <Link href="/" className="marketing-brand" data-testid="link-public-home"><BrandMark /><span>R LOOP <b>BYPASS</b></span></Link>
    <nav className="marketing-links" aria-label="Main navigation">
      {navItems.map((item) => <button key={item.label} className="marketing-link" onClick={() => go(item.href)} data-testid={`link-${item.label.toLowerCase().replace(" ", "-")}`}><RollLabel>{item.label}</RollLabel></button>)}
    </nav>
    <div className="marketing-nav-actions">
      <Link href="/access" className="nav-access" onClick={onAccess} data-testid="link-access-workspace"><RollLabel>Access workspace</RollLabel><ArrowRight size={14} /></Link>
      <Link href="/access" className="mobile-nav-access" onClick={onAccess} data-testid="mobile-button-access-workspace">Access workspace<ArrowRight size={13} /></Link>
      <button className="marketing-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} data-testid="button-mobile-menu">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
    </div>
    {menuOpen && <div className="mobile-marketing-menu">
      {navItems.map((item) => <button key={item.label} onClick={() => go(item.href)} data-testid={`mobile-link-${item.label.toLowerCase().replace(" ", "-")}`}>{item.label}<ArrowRight size={14} /></button>)}
      <Link href="/access" onClick={() => setMenuOpen(false)} data-testid="mobile-link-access">Access workspace<ArrowRight size={14} /></Link>
    </div>}
  </header>;
}

function IntroReveal({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const greetings = ["Hello.", "नमस्ते.", "Bonjour.", "Ciao.", "R Loop Bypass."];
  useEffect(() => {
    const timer = window.setInterval(() => setIndex((current) => Math.min(current + 1, greetings.length - 1)), 470);
    const done = window.setTimeout(onComplete, 2250);
    return () => { window.clearInterval(timer); window.clearTimeout(done); };
  }, [onComplete, greetings.length]);
  return <motion.div className="intro-reveal" initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.65, ease } }}>
    <div className="intro-grid" />
    <div className="intro-top"><span className="intro-kicker">Signal / 001</span><span>24:00:00</span></div>
    <AnimatePresence mode="wait">
      <motion.div key={greetings[index]} className="intro-word" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -22 }} transition={{ duration: 0.34, ease }}>{greetings[index]}</motion.div>
    </AnimatePresence>
    <button className="intro-skip" onClick={onComplete} data-testid="button-skip-intro">Skip intro <ArrowRight size={13} /></button>
    <div className="intro-bottom"><span>Broadcast control for the long signal</span><span className="intro-dot" /></div>
  </motion.div>;
}

function SignalMonitor() {
  const [state, setState] = useState(0);
  const statuses = [
    { label: "Signal locked", sub: "Broadcasting continuously", color: "lime", image: heroTwoScreenImage, alt: "Loop Stream dashboard and YouTube live screen" },
    { label: "Offline / connection lost", sub: "Automatic recovery is standing by", color: "amber", image: connectionLostImage, alt: "Creator facing a connection lost screen" },
    { label: "Reconnecting", sub: "Automatic recovery engaged", color: "coral", image: loopRunningImage, alt: "Loop Stream running continuously while the creator rests" },
  ];
  useEffect(() => {
    const timer = window.setInterval(() => setState((value) => (value + 1) % statuses.length), 4200);
    return () => window.clearInterval(timer);
  }, [statuses.length]);
  const current = statuses[state];
  return <div className={`signal-monitor signal-${current.color}`} data-testid="status-broadcast-signal">
    <div className="monitor-head"><span className="monitor-title"><span className="monitor-led" /> Broadcast monitor</span><span className="monitor-time">00:24:08:17</span></div>
      <div className="monitor-stage">
        <img key={current.image} className="monitor-slide-image" src={current.image} alt={current.alt} />
      <div className="stage-wash" />
      <div className="scan-lines" />
      <div className="monitor-center"><AnimatePresence mode="wait"><motion.div key={current.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .35 }}><div className="monitor-state"><span className="monitor-state-dot" />{current.label}</div><p>{current.sub}</p></motion.div></AnimatePresence></div>
      <div className="monitor-corner monitor-corner-left">RLB / CH.01</div><div className="monitor-corner monitor-corner-right">4K · 60 FPS</div>
    </div>
    <div className="monitor-wave"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
    <div className="monitor-foot"><span><Signal size={13} /> YouTube</span><span><Signal size={13} /> Facebook</span><strong>Auto-restart <i /></strong></div>
  </div>;
}

function ComparisonSlider() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const autoDirectionRef = useRef(1);
  const resumeTimerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const updatePosition = (clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const bounds = frame.getBoundingClientRect();
    const next = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  };

  useEffect(() => {
    if (reducedMotion) return;

    let frameId = 0;
    let previousTime = 0;
    const moveHandle = (time: number) => {
      if (!previousTime) previousTime = time;
      const delta = Math.min(time - previousTime, 64);
      previousTime = time;

      if (!autoPaused && !dragging) {
        setPosition((value) => {
          const next = value + autoDirectionRef.current * delta * 0.009;
          if (next >= 76) {
            autoDirectionRef.current = -1;
            return 76;
          }
          if (next <= 24) {
            autoDirectionRef.current = 1;
            return 24;
          }
          return next;
        });
      }

      frameId = window.requestAnimationFrame(moveHandle);
    };

    frameId = window.requestAnimationFrame(moveHandle);
    return () => window.cancelAnimationFrame(frameId);
  }, [autoPaused, dragging, reducedMotion]);

  useEffect(() => () => {
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
  }, []);

  const pauseAuto = () => {
    setAutoPaused(true);
    if (resumeTimerRef.current !== null) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      setAutoPaused(false);
      resumeTimerRef.current = null;
    }, 2200);
  };

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    pauseAuto();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (dragging) updatePosition(event.clientX);
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    pauseAuto();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 10 : 5;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      pauseAuto();
      setPosition((value) => Math.max(0, value - step));
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      pauseAuto();
      setPosition((value) => Math.min(100, value + step));
    }
    if (event.key === "Home") {
      event.preventDefault();
      pauseAuto();
      setPosition(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      pauseAuto();
      setPosition(100);
    }
  };

  return <MarketingSection className="comparison-section">
    <div className="comparison-copy">
      <span className="section-index">04 / THE DIFFERENCE</span>
      <h2>Don’t let your<br /><em>channel go dark.</em></h2>
      <p>Drag the signal across the frame. See the difference between waiting for viewers and keeping a 24-hour stream earning for you.</p>
       <div className="comparison-hint"><ArrowLeftRight size={15} /><span>It keeps moving — grab the handle anytime</span></div>
    </div>
    <div
      ref={frameRef}
      className={`comparison-frame ${dragging ? "is-dragging" : ""}`}
      onPointerDown={(event) => updatePosition(event.clientX)}
      data-testid="comparison-slider"
    >
        <img className="comparison-image comparison-image-live" src={loopRunningImage} alt="Loop Stream 24-hour live broadcast running while the creator rests" />
      <div className="comparison-offline" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
         <img className="comparison-image comparison-image-offline" src={connectionLostImage} alt="Connection lost screen stopping a regular live stream" />
      </div>
      <div className="comparison-tint comparison-tint-offline" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }} />
      <div className="comparison-label comparison-label-offline"><span className="comparison-label-dot" /> STREAM OFFLINE <strong>₹0 earned</strong></div>
      <div className="comparison-label comparison-label-live"><span className="comparison-label-dot" /> 24H STREAM LIVE <strong>Profit growing</strong></div>
      <div className="comparison-stat comparison-stat-offline"><span>CONNECTION LOST</span><strong>No viewers. No momentum.</strong></div>
      <div className="comparison-stat comparison-stat-live"><span>NOW BROADCASTING</span><strong>Audience stays. Revenue moves.</strong></div>
      <button
        type="button"
        className="comparison-handle"
        style={{ left: `${position}%` }}
        aria-label="Compare offline and live stream states"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-valuetext={`${Math.round(position)}% offline view, ${Math.round(100 - position)}% live view`}
        role="slider"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        data-testid="comparison-slider-handle"
      >
        <span><ArrowLeftRight size={17} /></span>
      </button>
    </div>
  </MarketingSection>;
}

function MarketingSection({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return <motion.section ref={ref} id={id} className={`marketing-section ${className}`} initial="hidden" animate={inView ? "visible" : "hidden"} variants={reveal}>{children}</motion.section>;
}

function AnimatedCountdownUnit({ value }: { value: string }) {
  return <span className="monthly-countdown-slot" aria-hidden="true">
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={value}
        className="monthly-countdown-value"
        initial={{ opacity: 0, filter: "blur(11px)", y: 13, scale: 0.94 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
        exit={{ opacity: 0, filter: "blur(11px)", y: -13, scale: 1.04 }}
        transition={{ duration: 0.38, ease }}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </span>;
}

function MonthlyOfferCountdown() {
  const [remaining, setRemaining] = useState(MONTHLY_OFFER_DURATION);

  useEffect(() => {
    const now = Date.now();
    const savedDeadline = Number(window.localStorage.getItem(MONTHLY_OFFER_DEADLINE_KEY));
    const deadline = savedDeadline > now ? savedDeadline : now + MONTHLY_OFFER_DURATION;

    window.localStorage.setItem(MONTHLY_OFFER_DEADLINE_KEY, String(deadline));
    const update = () => setRemaining(Math.max(0, deadline - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const clock = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0"));
  const expired = totalSeconds === 0;

  return <div className={`monthly-countdown ${expired ? "is-expired" : ""}`} aria-live="polite">
    <div className="monthly-countdown-heading">
      <span className="monthly-countdown-dot" />
      <span>{expired ? "Monthly offer ended" : "Monthly offer ends in"}</span>
    </div>
    <div className="monthly-countdown-clock" aria-label={expired ? "Monthly offer ended" : `${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`}>
      <AnimatedCountdownUnit value={clock[0]} /><span>:</span><AnimatedCountdownUnit value={clock[1]} /><span>:</span><AnimatedCountdownUnit value={clock[2]} />
    </div>
    <div className="monthly-countdown-labels"><span>hours</span><span>minutes</span><span>seconds</span></div>
  </div>;
}

const accessPlans = [
  {
    term: "Free 1 day",
    label: "Try it free",
    bonus: "24 hours free",
    totalAccess: "1 day access",
    isFeatured: true,
    isFree: true,
  },
  {
    term: "1 month",
    label: "Quick start",
    bonus: "10 days extra",
    totalAccess: "1 month + 10 days",
  },
  {
    term: "3 months",
    label: "Creator pace",
    bonus: "1 month extra",
    totalAccess: "3 months + 1 month",
  },
  {
    term: "6 months",
    label: "Growth window",
    bonus: "2 months extra",
    totalAccess: "6 months + 2 months",
  },
  {
    term: "1 year",
    label: "Best value",
    bonus: "5 months extra",
    totalAccess: "1 year + 5 months",
    isFeatured: true,
  },
];

const planFeatures = [
  ["Unlimited storage", "Keep your full media library ready to stream."],
  ["2 live monitor bots", "Two bots keep watching your stream health continuously."],
  ["Unlimited live streams", "Run as many concurrent streams as your plan needs."],
  ["Unlimited account streams", "Use streams from unlimited connected accounts."],
  ["YouTube + Facebook Live", "Go live directly to YouTube and Facebook."],
  ["Twitch, Kick + RTMP", "Connect more platforms with standard stream keys."],
  ["24-hour live streaming", "Keep channels running around the clock."],
  ["VPS access", "Use a dedicated remote streaming environment."],
  ["Direct downloads", "Download your videos and media directly."],
  ["Playlist + auto scheduler", "Build loops, schedule broadcasts, and restart automatically."],
];

const contactChannels = [
  { label: "WhatsApp", Icon: MessageCircle },
  { label: "Telegram", Icon: Send },
] as const;

const paywallPlans = [
  { term: "Free 1 day", price: "FREE", crossed: "", label: "24 hours", offer: "Try the full broadcast room", bonus: "No payment to start", featured: true },
  { term: "1 month", price: "₹799", crossed: "₹1,000", label: "1 month", offer: "20% offer included", bonus: "10 days extra" },
  { term: "3 months", price: "Contact us", crossed: "", label: "3 months", offer: "Creator access window", bonus: "1 month extra" },
  { term: "6 months", price: "Contact us", crossed: "", label: "6 months", offer: "Growth access window", bonus: "2 months extra" },
  { term: "12 months", price: "₹7,999", crossed: "₹10,000", label: "12 months", offer: "20% annual offer", bonus: "Annual access" },
  { term: "1 year", price: "Contact us", crossed: "", label: "1 year", offer: "Best value access", bonus: "5 months extra", featured: true },
];

function PlanOfferSlider() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof accessPlans)[number] | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const closeContact = () => {
    setSelectedPlan(null);
    setSelectedChannel(null);
  };
  const choosePlan = (plan: (typeof accessPlans)[number]) => {
    if (!plan.isFree) {
      setLocation(`/gateway?plan=${encodeURIComponent(plan.term)}`);
      return;
    }
    setSelectedPlan(plan);
    setSelectedChannel(null);
  };

  return <MarketingSection className="plan-offer-section">
    <div className="plan-offer-heading">
      <div><span className="section-index">05 / PREMIUM ACCESS</span><h2>Choose your <em>access window.</em></h2></div>
      <p>Pick your access window and get the full broadcast toolkit: storage, monitoring bots, unlimited streams, VPS access, and multi-platform delivery.</p>
    </div>
    <div className="plan-offer-shell">
      <div className="plan-offer-status"><span className="monitor-led" /> ACCESS WINDOWS / 06 PLANS <span className="plan-offer-status-line" /></div>
      <div className="plan-offer-grid" aria-label="All access plans">
        {accessPlans.map((plan, index) => <article className={`plan-offer-card ${plan.isFeatured ? "is-featured" : ""}`} key={plan.term}>
          <div className="plan-offer-card-header">
            <div>
              <span className="plan-offer-card-kicker">R LOOP BYPASS / {plan.label}</span>
              <h3>{plan.term}</h3>
            </div>
            {plan.isFree ? <span className="plan-offer-best-value">FREE</span> : plan.isFeatured && <span className="plan-offer-best-value">BEST VALUE</span>}
          </div>
          <div className="plan-offer-bonus">
            <span>OFFER</span>
            <strong>+ {plan.bonus}</strong>
            <small>{plan.totalAccess} total access</small>
          </div>
          <div className="plan-offer-features">
            {planFeatures.map(([title, detail]) => <div className="plan-offer-feature" key={title}>
              <Check size={14} />
              <div><strong>{title}</strong><span>{detail}</span></div>
            </div>)}
          </div>
          <button type="button" className="plan-offer-card-cta" onClick={() => choosePlan(plan)} data-testid={`button-plan-offer-${index}`}>
             Choose {plan.term} <ArrowRight size={13} />
          </button>
        </article>)}
      </div>
      <p className="plan-offer-hint"><Check size={13} /> Every plan includes the complete feature set shown above</p>
    </div>
    <AnimatePresence>
      {selectedPlan && <motion.div className="plan-contact-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeContact}>
        <motion.div className="plan-contact-dialog" role="dialog" aria-modal="true" aria-labelledby="plan-contact-title" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} onClick={(event) => event.stopPropagation()}>
          <button type="button" className="plan-contact-close" onClick={closeContact} aria-label="Close contact options"><X size={16} /></button>
          <span className="section-index">06 / CONTACT TO CONTINUE</span>
          <h3 id="plan-contact-title">Choose how to activate <em>{selectedPlan.term}</em></h3>
          <p>First choose a contact option. We will help you with access, payment, and setup for this plan.</p>
          <div className="plan-contact-options" aria-label="Contact options">
            {contactChannels.map(({ label, Icon }) => <button type="button" className={`plan-contact-option ${selectedChannel === label ? "is-selected" : ""}`} key={label} onClick={() => setSelectedChannel(label)}>
              <span className="plan-contact-option-mark"><Icon size={17} strokeWidth={2.3} /></span><span><strong>{label}</strong><small>Contact us about {selectedPlan.term}</small></span><ArrowRight size={14} />
            </button>)}
          </div>
          {selectedChannel && <div className="plan-contact-confirmation"><span className="monitor-led" /><strong>{selectedChannel} selected</strong><span>We’ll connect you about your {selectedPlan.term} access.</span></div>}
          <button type="button" className="plan-contact-back" onClick={closeContact}>Back to plans</button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </MarketingSection>;
}

export function LandingPage() {
  const [intro, setIntro] = useState(true);
  const [activeCase, setActiveCase] = useState(0);
  const [heroTransform, setHeroTransform] = useState("perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)");
  const [, setLocation] = useLocation();
  const reducedMotion = useReducedMotion();
  const completeIntro = () => setIntro(false);
  const moveHero = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setHeroTransform(`perspective(1200px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translate3d(${(x * 8).toFixed(2)}px, ${(y * 8).toFixed(2)}px, 0)`);
  };
  const resetHero = () => setHeroTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)");
  return <div className="marketing-page">
    {intro && !reducedMotion && <IntroReveal onComplete={completeIntro} />}
    <PublicNav />
    <main>
      <section className="marketing-hero" data-testid="section-marketing-hero">
        <div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" />
        <div className="hero-copy">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .7, ease }} className="signal-tag"><span className="signal-tag-dot" /> YOUR CHANNEL, ON LOOP</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .8, ease }}><HeroRollText>Make the long</HeroRollText><br /><em><HeroRollText>signal feel alive.</HeroRollText></em></motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .48, duration: .7, ease }}>R Loop Bypass turns a playlist into a dependable 24-hour live channel. Build once, broadcast with confidence.</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .6, duration: .7, ease }}>
             <div
               onClick={() => setLocation("/pricing")}
               onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setLocation("/pricing"); }}
               role="link"
               tabIndex={0}
               aria-label="Get offer"
               data-testid="link-hero-offer"
             >
                <GetOfferButton />
             </div>
            <button className="text-button" onClick={() => document.querySelector("#capabilities")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-explore-product"><Play size={14} /><span>See how it works</span></button>
          </motion.div>
          <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8, duration: .6 }}><span><Check size={13} /> 4K / 1080p output</span><span><Check size={13} /> YouTube + Facebook</span><span><Check size={13} /> Automatic recovery</span></motion.div>
        </div>
        <motion.div className="hero-monitor-wrap" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .35, duration: .9, ease }}><div className="hero-tilt-surface" style={{ transform: heroTransform }} onPointerMove={moveHero} onPointerLeave={resetHero}><SignalMonitor /></div></motion.div>
        <button className="hero-scroll" onClick={() => document.querySelector("#capabilities")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-scroll-capabilities"><span>Scroll to tune in</span><ArrowDown size={15} /></button>
      </section>

       <ComparisonSlider />

      <MarketingSection className="signal-strip"><div className="strip-label">Built for the channel that keeps going</div><div className="strip-lines"><span /><span /><span /><span /><span /><span /><span /></div><div className="strip-stats"><strong>24<span>h</span></strong><small>broadcast window</small></div><div className="strip-stats"><strong>4K</strong><small>output ceiling</small></div><div className="strip-stats"><strong>02</strong><small>platform destinations</small></div><div className="strip-platforms"><span>YouTube</span><span>Facebook</span><span>Apps <b>coming soon</b></span></div></MarketingSection>

       <MarketingSection id="capabilities" className="capabilities-section"><div className="section-intro"><span className="section-index">01 / THE CONTROL ROOM</span><h2>From playlist<br /><em>to transmission.</em></h2><p>Every part of the broadcast is deliberate. R Loop Bypass gives a small team the calm, precise controls of a real channel room.</p></div><div className="capability-list"><div className="capability-item"><span>01</span><div><h3>Loop without babysitting</h3><p>Keep a selected library in motion, with playback that comes back on its own when a connection gets noisy.</p></div><Zap size={18} /></div><div className="capability-item"><span>02</span><div><h3>Schedule the handoff</h3><p>Shape a playlist, set the duration, and send the next broadcast out when your audience expects it.</p></div><Zap size={18} /></div><div className="capability-item"><span>03</span><div><h3>Meet the platform</h3><p>Stream to YouTube and Facebook with crisp 4K or 1080p output, depending on the room and the moment.</p></div><Zap size={18} /></div></div></MarketingSection>

       <MarketingSection className="power-features-section">
         <div className="power-features-head">
           <div>
             <span className="section-index">POWERFUL FEATURES</span>
             <h2>Minimal <em>effort.</em></h2>
           </div>
           <div className="power-features-platforms" aria-label="Supported streaming platforms">
             {platformIcons.map((platform) => <div className={`power-platform-icon ${platform.comingSoon ? "is-coming-soon" : ""}`} key={platform.label}><img src={platform.image} alt="" /><span>{platform.label}</span>{platform.comingSoon && <small>soon</small>}</div>)}
           </div>
         </div>
         <div className="power-features-grid">
            {powerfulFeatures.map(({ title, description, artwork }) => <article className="power-feature-card" key={title}>
              <div className="power-feature-art"><img src={artwork} alt={`${title} feature`} /></div>
             <h3>{title}</h3>
             <p>{description}</p>
           </article>)}
         </div>
       </MarketingSection>

      <MarketingSection id="use-cases" className="use-cases-section"><div className="use-case-head"><div><span className="section-index">02 / PROGRAMMING</span><h2>A channel for<br /><em>every rhythm.</em></h2></div><p>From early morning movement to a quiet night sky, build the loop your audience returns to.</p></div><div className="use-case-feature"><div className="use-case-image"><AnimatePresence mode="wait"><motion.img key={useCases[activeCase].title} src={useCases[activeCase].image} alt={useCases[activeCase].title} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .6 }} /></AnimatePresence><div className="image-caption"><span>Now programming</span><strong>{useCases[activeCase].title}</strong></div></div><div className="use-case-rail">{useCases.map((item, index) => <button key={item.title} className={`use-case-tab ${activeCase === index ? "active" : ""}`} onClick={() => setActiveCase(index)} data-testid={`button-use-case-${index}`}><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.note}</small><ArrowRight size={15} /></button>)}</div></div></MarketingSection>

       <MarketingSection className="workflow-section"><div className="workflow-art"><img className="workflow-artwork" src={scheduleStreamArtwork} alt="" /><div className="workflow-card workflow-card-back"><span>playlist / night-sky</span><b>18 videos</b></div><div className="workflow-card workflow-card-front"><div className="workflow-card-top"><span className="monitor-led" /> LIVE CHANNEL</div><strong>Sleep / Cloud ambience</strong><div className="workflow-track"><i /><i /><i /><i /><i /><i /><i /></div><small>Now looping · 08:42:19</small></div><div className="workflow-schedule"><div><span className="schedule-dot" /> SCHEDULED NEXT</div><strong>Morning movement</strong><small>Tomorrow · 06:30 · YouTube + Facebook</small></div></div><div className="workflow-copy"><span className="section-index">03 / THE HANDOFF</span><h2>Quiet systems<br /><em>make good TV.</em></h2><p>Set the playlist, choose where it goes, and let the room do the repetitive work. The product stays visible when it matters and disappears when it does not.</p><Link href="/access" className="inline-arrow" data-testid="link-workflow-access">Open the control room <ArrowRight size={15} /></Link></div></MarketingSection>

      <MarketingSection className="final-cta"><div className="final-cta-grid" /><span className="section-index">READY WHEN YOU ARE</span><h2>Give your next loop<br /><em>a proper signal.</em></h2><p>Start with one channel. Build the library around it. Keep the room on air.</p><Link href="/pricing" className="signal-button" data-testid="link-final-pricing"><span>View access options</span><ArrowRight size={16} /></Link></MarketingSection>
       <PlanOfferSlider />
    </main>
    <footer className="marketing-footer"><Link href="/" className="marketing-brand" data-testid="link-footer-home"><BrandMark /><span>R LOOP <b>BYPASS</b></span></Link><span>Broadcast automation for the long signal.</span><Link href="/access" data-testid="link-footer-access">Access workspace <ArrowRight size={13} /></Link></footer>
  </div>;
}

export function GatewayPage() {
  const [, setLocation] = useLocation();
  const plan = new URLSearchParams(window.location.search).get("plan") || "1 month";

  return <div className="marketing-page pricing-page">
    <PublicNav />
    <main className="gateway-main">
      <div className="gateway-card">
        <span className="section-index">PAYMENT GATEWAY / READY</span>
        <h1>Continue with<br /><em>{plan}.</em></h1>
        <p className="gateway-copy">Your selected plan is ready for the payment gateway. Add the gateway details here when you are ready to connect checkout.</p>
        <div className="gateway-selection"><span className="monitor-led" /><strong>{plan}</strong><span>Selected access window</span></div>
        <button type="button" className="signal-button" onClick={() => setLocation("/pricing")}><span>Back to pricing</span><ArrowRight size={16} /></button>
      </div>
    </main>
    <footer className="marketing-footer"><Link href="/" className="marketing-brand" data-testid="link-gateway-footer-home"><BrandMark /><span>R LOOP <b>BYPASS</b></span></Link><span>Secure access setup.</span><Link href="/pricing" data-testid="link-gateway-pricing">Back to pricing <ArrowRight size={13} /></Link></footer>
  </div>;
}

export function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof paywallPlans)[number] | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const closeContact = () => {
    setSelectedPlan(null);
    setSelectedChannel(null);
  };
  const choosePlan = (plan: (typeof paywallPlans)[number]) => {
    if (!plan.featured || plan.term !== "Free 1 day") {
      setLocation(`/gateway?plan=${encodeURIComponent(plan.term)}`);
      return;
    }
    setSelectedPlan(plan);
    setSelectedChannel(null);
  };

  return <div className="marketing-page pricing-page">
    <PublicNav />
    <main className="pricing-main">
      <div className="pricing-intro">
        <span className="section-index">R LOOP BYPASS / PAYWALL</span>
        <h1>Choose your <em>access.</em></h1>
        <p>Start free for one day, then choose the access window that fits your live channel. Every plan includes the full broadcast toolkit.</p>
      </div>
      <div className="paywall-plan-grid" aria-label="Pricing plans">
        {paywallPlans.map((plan, index) => <motion.article className={`paywall-plan-card ${plan.featured ? "is-featured" : ""}`} key={plan.term} layout>
          <div className="paywall-plan-top">
            <span className="signal-tag"><span className="signal-tag-dot" /> {plan.term === "Free 1 day" ? "TRIAL ACCESS" : "FULL ACCESS"}</span>
            {plan.featured && <span className="price-card-badge">{plan.term === "Free 1 day" ? "Start here" : "Best value"}</span>}
          </div>
          <h2>{plan.term}</h2>
          <p className="paywall-plan-description">Unlimited storage, live monitor bots, 24-hour streaming, multi-platform delivery, VPS access, and direct downloads.</p>
          <div className="paywall-plan-price">
            {plan.crossed && <span className="price-crossed">{plan.crossed}</span>}
            <strong>{plan.price}</strong>
            <span className="price-period">/ {plan.label}</span>
          </div>
          <div className="offer-line"><Zap size={14} /> {plan.offer}</div>
          {plan.term === "1 month" && <MonthlyOfferCountdown />}
          <div className="paywall-plan-bonus"><span>PLAN BENEFIT</span><strong>{plan.bonus}</strong></div>
          <button type="button" className="signal-button paywall-plan-button" onClick={() => choosePlan(plan)} data-testid={`button-paywall-plan-${index}`}><span>{plan.term === "Free 1 day" ? "Choose free access" : `Continue to gateway`}</span><ArrowRight size={16} /></button>
          <div className="paywall-plan-features">{["Unlimited storage", "2 live monitor bots", "24-hour live streams", "YouTube + Facebook + RTMP", "VPS + direct downloads"].map((feature) => <span key={feature}><Check size={13} /> {feature}</span>)}</div>
        </motion.article>)}
      </div>
      <div className="pricing-note"><Radio size={16} /><span>Need help first? Choose a plan and contact us on WhatsApp, Facebook, or Telegram.</span></div>
      <AnimatePresence>
        {selectedPlan && <motion.div className="plan-contact-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeContact}>
          <motion.div className="plan-contact-dialog" role="dialog" aria-modal="true" aria-labelledby="paywall-contact-title" initial={{ opacity: 0, y: 18, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="plan-contact-close" onClick={closeContact} aria-label="Close contact options"><X size={16} /></button>
            <span className="section-index">CONTACT TO CONTINUE</span>
            <h3 id="paywall-contact-title">Activate <em>{selectedPlan.term}</em></h3>
            <p>First choose a contact option. We will help you with access, payment, and setup for this plan.</p>
            <div className="plan-contact-options" aria-label="Contact options">
              {contactChannels.map(({ label, Icon }) => <button type="button" className={`plan-contact-option ${selectedChannel === label ? "is-selected" : ""}`} key={label} onClick={() => setSelectedChannel(label)}>
                <span className="plan-contact-option-mark"><Icon size={17} strokeWidth={2.3} /></span><span><strong>{label}</strong><small>Contact us about {selectedPlan.term}</small></span><ArrowRight size={14} />
              </button>)}
            </div>
            {selectedChannel && <div className="plan-contact-confirmation"><span className="monitor-led" /><strong>{selectedChannel} selected</strong><span>We’ll connect you about your {selectedPlan.term} access.</span></div>}
            <button type="button" className="plan-contact-back" onClick={closeContact}>Back to pricing</button>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </main>
    <footer className="marketing-footer"><Link href="/" className="marketing-brand" data-testid="link-pricing-footer-home"><BrandMark /><span>R LOOP <b>BYPASS</b></span></Link><span>Simple access. Serious signal.</span><Link href="/" data-testid="link-pricing-back">Back to overview <ArrowRight size={13} /></Link></footer>
  </div>;
}