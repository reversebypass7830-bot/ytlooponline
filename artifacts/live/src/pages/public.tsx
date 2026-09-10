import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowLeftRight, ArrowRight, Check, Menu, Play, Radio, Signal, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import GetOfferButton from "@/components/GetOfferButton";
import logoImage from "@assets/image_1788788255512.png";
import planOneMonthPoster from "@assets/generated_images/rloop-plan-1-month-poster.png";
import planThreeMonthsPoster from "@assets/generated_images/rloop-plan-3-months-poster.png";
import planSixMonthsPoster from "@assets/generated_images/rloop-plan-6-months-poster.png";
import planOneYearPoster from "@assets/generated_images/rloop-plan-1-year-poster.png";
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
    term: "1 month",
    bonus: "10 days extra",
    totalAccess: "1 month + 10 days",
    image: planOneMonthPoster,
  },
  {
    term: "3 months",
    bonus: "1 month extra",
    totalAccess: "3 months + 1 month",
    image: planThreeMonthsPoster,
  },
  {
    term: "6 months",
    bonus: "2 months extra",
    totalAccess: "6 months + 2 months",
    image: planSixMonthsPoster,
  },
  {
    term: "1 year",
    bonus: "5 months extra",
    totalAccess: "1 year + 5 months",
    image: planOneYearPoster,
  },
];

function PlanOfferSlider() {
  return <MarketingSection className="plan-offer-section">
    <div className="plan-offer-heading">
      <span className="section-index">05 / PREMIUM ACCESS</span>
      <p>Choose the access window that fits your channel. Every plan stays visible so the value is easy to compare.</p>
    </div>
    <div className="plan-offer-shell">
      <div className="plan-offer-status"><span className="monitor-led" /> ACCESS WINDOWS / 04 PLANS <span className="plan-offer-status-line" /></div>
      <div className="plan-offer-grid" aria-label="All access plans">
        {accessPlans.map((plan, index) => <article className={`plan-offer-card ${index === accessPlans.length - 1 ? "is-featured" : ""}`} key={plan.term}>
          <Link href="/pricing" className="plan-offer-poster-link" data-testid={`link-plan-offer-${index}`}>
            <img className="plan-offer-poster" src={plan.image} alt={`${plan.term} premium access offer poster with ${plan.bonus} and ${plan.totalAccess} total access`} />
            <span className="plan-offer-card-cta">Choose {plan.term} <ArrowRight size={13} /></span>
          </Link>
        </article>)}
      </div>
      <p className="plan-offer-hint"><Check size={13} /> Compare all four access windows together</p>
    </div>
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

export function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const plans = annual ? { price: "₹7,999", crossed: "₹10,000", label: "12 months", offer: "20% annual offer" } : { price: "₹799", crossed: "₹1,000", label: "1 month", offer: "20% offer" };
  return <div className="marketing-page pricing-page"><PublicNav /><main className="pricing-main"><div className="pricing-intro"><span className="section-index">R LOOP BYPASS / ACCESS</span><h1>A clear signal<br /><em>starts here.</em></h1><p>One focused plan for creators and small media teams building reliable live channels.</p></div><div className="pricing-toggle" role="group" aria-label="Billing period"><button className={!annual ? "active" : ""} onClick={() => setAnnual(false)} data-testid="button-monthly-plan">1 month</button><button className={annual ? "active" : ""} onClick={() => setAnnual(true)} data-testid="button-annual-plan">12 months <span>save 20%</span></button></div><motion.div className="price-card" layout><div className="price-card-glow" /><div className="price-card-top"><span className="signal-tag"><span className="signal-tag-dot" /> FOCUSED ACCESS</span><span className="price-card-badge">Most direct route</span></div><h2>Broadcast plan</h2><p className="price-description">Everything needed to turn a library into a channel that keeps its place on air.</p><div className="price-line"><span className="price-crossed">{plans.crossed}</span><strong>{plans.price}</strong><span className="price-period">/ {plans.label}</span></div><div className="offer-line"><Zap size={14} /> {plans.offer} included</div>{!annual && <MonthlyOfferCountdown />}<Link href="/access" className="signal-button price-button" data-testid="link-pricing-access"><span>Access / activate a key</span><ArrowRight size={16} /></Link><div className="price-features">{["Loop videos into 24-hour channels", "Playlist builder and scheduled broadcasts", "YouTube and Facebook destinations", "4K / 1080p stream output", "Automatic reconnect and restart"].map((feature) => <span key={feature}><Check size={14} /> {feature}</span>)}</div></motion.div><div className="pricing-note"><Radio size={16} /><span>Already have a key? <Link href="/access" data-testid="link-pricing-existing-key">Enter it in the access room.</Link></span></div></main><footer className="marketing-footer"><Link href="/" className="marketing-brand" data-testid="link-pricing-footer-home"><BrandMark /><span>R LOOP <b>BYPASS</b></span></Link><span>Simple access. Serious signal.</span><Link href="/" data-testid="link-pricing-back">Back to overview <ArrowRight size={13} /></Link></footer></div>;
}