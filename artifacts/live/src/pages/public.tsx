import { Fragment, useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  Broadcast,
  ChartLineUp,
  Check,
  CheckCircle,
  Clock,
  CloudArrowUp,
  DotsThree,
  Gauge,
  SquaresFour,
  Lightning,
  ListChecks,
  MagnifyingGlass,
  List,
  MonitorPlay,
  Pause,
  Play,
  Plus,
  Radio,
  Repeat,
  RocketLaunch,
  ShieldCheck,
  Sparkle,
  TrendUp,
  TwitterLogo,
  DiscordLogo,
  UserCircle,
  VideoCamera,
  X,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { Link, useLocation } from "wouter";

const ease = [0.16, 1, 0.3, 1] as const;

type Feature = {
  title: string;
  description: string;
  eyebrow: string;
  Icon: typeof CloudArrowUp;
};

const features: Feature[] = [
  {
    title: "Cloud relay",
    description: "Your channel keeps running from Streamly’s cloud, not from the laptop you left behind.",
    eyebrow: "01 / ALWAYS ON",
    Icon: CloudArrowUp,
  },
  {
    title: "Smart looping",
    description: "Turn a playlist into a continuous broadcast with clean transitions and no manual restarts.",
    eyebrow: "02 / PLAYLIST ENGINE",
    Icon: Repeat,
  },
  {
    title: "Stream analytics",
    description: "See viewers, watch time, and stream health in one quiet control room built for decisions.",
    eyebrow: "03 / SIGNAL DATA",
    Icon: ChartLineUp,
  },
  {
    title: "Recovery built in",
    description: "When a connection wobbles, Streamly notices, reconnects, and gets the signal moving again.",
    eyebrow: "04 / AUTO RECOVERY",
    Icon: ShieldCheck,
  },
  {
    title: "Multi-stream ready",
    description: "Keep your broadcast architecture ready for the destinations your audience already uses.",
    eyebrow: "05 / DESTINATIONS",
    Icon: Broadcast,
  },
  {
    title: "One-click YouTube auth",
    description: "Connect your channel with a secure Google OAuth flow and get on air without friction.",
    eyebrow: "06 / SECURE CONNECT",
    Icon: UserCircle,
  },
];

const pricingPlans = [
  { term: "Free 1 day", price: "FREE", period: "24 hours", detail: "Full access to try the broadcast room", featured: true, bonus: "No payment to start" },
  { term: "1 month", price: "₹799", period: "month", detail: "For a focused launch or campaign", bonus: "10 days extra" },
  { term: "12 months", price: "₹7,999", period: "year", detail: "The clearest runway for a channel", featured: true, bonus: "Annual access" },
];

const accessPlans = [
  { term: "Free 1 day", price: "FREE", period: "24 hours", detail: "Try the complete broadcast room", featured: true, bonus: "No payment to start" },
  { term: "1 month", price: "₹799", period: "month", detail: "A focused launch window", bonus: "10 days extra" },
  { term: "3 months", price: "Contact us", period: "3 months", detail: "Time to build a repeat audience", bonus: "1 month extra" },
  { term: "6 months", price: "Contact us", period: "6 months", detail: "A longer runway for growth", bonus: "2 months extra" },
  { term: "12 months", price: "₹7,999", period: "year", detail: "Keep your channel moving", bonus: "Annual access" },
  { term: "1 year", price: "Contact us", period: "1 year", detail: "Best value for serious channels", featured: true, bonus: "5 months extra" },
];

const planFeatures = ["Unlimited storage", "2 live monitor bots", "24-hour live streams", "YouTube + Facebook + RTMP", "VPS + direct downloads"];

function BrandMark() {
  return <span className="streamly-mark" aria-hidden="true"><img className="streamly-logo-image" src="/images/streamly-mark.png" alt="" /><i /></span>;
}

function Reveal({ children, className = "", id, style }: { children: ReactNode; className?: string; id?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.7, ease }}
    >
      {children}
    </motion.section>
  );
}

function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const go = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#")) document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    else setLocation(href);
  };
  const nav = [
    { label: "How it works", href: "#how-it-works" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Use cases", href: "#use-cases" },
    { label: "Pricing", href: "/pricing" },
  ];
  return (
    <header className={`streamly-nav ${menuOpen ? "is-open" : ""}`}>
      <Link href="/" className="streamly-brand" data-testid="link-public-home"><BrandMark /><span>Streamly</span></Link>
      <nav className="streamly-nav-links" aria-label="Main navigation">
        {nav.map((item) => <button key={item.label} type="button" onClick={() => go(item.href)}>{item.label}</button>)}
      </nav>
      <div className="streamly-nav-actions">
        <Link href="/access" className="streamly-nav-login" data-testid="link-access-workspace">Log in</Link>
        <Link href="/pricing" className="streamly-nav-trial" data-testid="link-start-free-trial">Start free trial <ArrowRight size={15} weight="bold" /></Link>
        <button type="button" className="streamly-menu-button" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={20} /> : <List size={20} />}</button>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="streamly-mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {nav.map((item) => <button type="button" key={item.label} onClick={() => go(item.href)}>{item.label}<ArrowRight size={15} /></button>)}
            <Link href="/access" onClick={() => setMenuOpen(false)}>Log in <ArrowRight size={15} /></Link>
            <Link href="/pricing" onClick={() => setMenuOpen(false)}>Start free trial <ArrowRight size={15} /></Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function SignalBadge({ children, tone = "blue" }: { children: ReactNode; tone?: "blue" | "green" | "violet" }) {
  return <span className={`signal-badge signal-badge-${tone}`}><i />{children}</span>;
}

function DashboardMock() {
  const [tab, setTab] = useState<"overview" | "schedule">("overview");
  return (
    <div className="dashboard-wrap" aria-label="Streamly control room preview">
      <div className="dashboard-glow dashboard-glow-blue" />
      <div className="dashboard-glow dashboard-glow-violet" />
      <div className="dashboard-window">
        <div className="dashboard-topbar">
          <div className="window-dots"><i /><i /><i /></div>
          <span className="window-route"><Radio size={13} weight="fill" /> streamly / control room</span>
          <DotsThree size={19} />
        </div>
        <div className="dashboard-body">
          <aside className="dashboard-sidebar">
            <div className="dashboard-mini-brand"><BrandMark /></div>
            <span className="dash-icon active"><Gauge size={17} /></span>
            <span className="dash-icon"><VideoCamera size={17} /></span>
            <span className="dash-icon"><ChartLineUp size={17} /></span>
            <span className="dash-icon"><ListChecks size={17} /></span>
            <span className="dash-icon dash-icon-bottom"><Sparkle size={17} /></span>
          </aside>
          <div className="dashboard-main">
            <div className="dashboard-heading">
              <div><span className="dashboard-kicker">MONITORING / CHANNEL 01</span><h3>Good morning, Rhea.</h3></div>
              <button type="button" className="dashboard-add"><Plus size={14} /> Add stream</button>
            </div>
            <div className="dashboard-tabs" role="tablist" aria-label="Dashboard preview tabs">
              <button type="button" className={tab === "overview" ? "selected" : ""} onClick={() => setTab("overview")} role="tab" aria-selected={tab === "overview"}>Overview</button>
              <button type="button" className={tab === "schedule" ? "selected" : ""} onClick={() => setTab("schedule")} role="tab" aria-selected={tab === "schedule"}>Schedule</button>
            </div>
            <AnimatePresence mode="wait">
              {tab === "overview" ? (
                <motion.div key="overview" className="dashboard-overview" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                  <div className="dashboard-live-card">
                    <div className="live-card-header"><SignalBadge tone="green">Broadcasting</SignalBadge><span>02:18:44:09</span></div>
                    <div className="live-preview"><div className="preview-noise" /><div className="preview-grid" /><span className="preview-play"><Play size={18} weight="fill" /></span><span className="preview-caption">NIGHT RADIO / LOOP 07</span><span className="preview-resolution">1080p · 60 FPS</span></div>
                    <div className="live-card-foot"><span><YoutubeLogo size={15} weight="fill" /> YouTube</span><span className="live-viewers"><i /> 1,284 watching</span><button type="button" aria-label="Pause stream"><Pause size={14} weight="fill" /></button></div>
                  </div>
                  <div className="dashboard-metrics">
                    <div className="dash-metric"><span>WATCH TIME</span><strong>18.6k <small>hrs</small></strong><em>+12.4%</em></div>
                    <div className="dash-metric"><span>AVG. VIEWERS</span><strong>1,284</strong><em>+8.9%</em></div>
                    <div className="dash-chart"><div className="dash-chart-head"><span>VIEWERS / LAST 24H</span><TrendUp size={14} /></div><div className="chart-bars">{[32, 48, 40, 61, 52, 74, 58, 84, 69, 92, 77, 88].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="chart-axis"><span>00:00</span><span>12:00</span><span>NOW</span></div></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="schedule" className="dashboard-schedule" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                  <div className="schedule-date"><span>UP NEXT</span><strong>Tuesday, 06:30</strong><small>Morning movement · 12 videos</small></div>
                  {["Night radio / Loop 07", "Morning movement", "Focus desk / 2 hours"].map((item, index) => <div className="schedule-row" key={item}><span>0{index + 1}</span><strong>{item}</strong><small>{index === 0 ? "Live now" : index === 1 ? "Tomorrow" : "Wed, 09:00"}</small><CheckCircle size={15} /></div>)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="floating-status floating-status-top"><span className="status-check"><Check size={12} weight="bold" /></span><span><b>Auto-recovery ready</b><small>Last check · 14 sec ago</small></span></div>
      <div className="floating-status floating-status-bottom"><span className="status-spark"><CloudArrowUp size={15} /></span><span><b>Cloud relay active</b><small>Latency · 42 ms</small></span></div>
    </div>
  );
}

function StepCard({ number, Icon, title, copy }: { number: string; Icon: typeof MonitorPlay; title: string; copy: string }) {
  return <article className="step-card"><span className="step-number">{number}</span><div className="step-icon"><Icon size={22} weight="duotone" /></div><h3>{title}</h3><p>{copy}</p><ArrowRight size={17} className="step-arrow" /></article>;
}

export function LandingPage() {
  const [creator, setCreator] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);
  const [compare, setCompare] = useState(50);
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [billing, setBilling] = useState<"Day" | "Month" | "Year">("Day");
  const [duration, setDuration] = useState(1);
  const [heroTilt, setHeroTilt] = useState("none");
  const shouldReduceMotion = useReducedMotion();
  const comparisonRef = useRef<HTMLDivElement>(null);
  const scrollTo = (selector: string) => document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
  const updateComparisonFromPointer = (clientX: number) => {
    const bounds = comparisonRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setCompare(Math.max(0, Math.min(100, ((clientX - bounds.left) / bounds.width) * 100)));
  };
  const updateHeroTilt = (event: ReactPointerEvent<HTMLImageElement>) => {
    if (shouldReduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const rotateX = Math.max(-5, Math.min(5, -y * 10));
    const rotateY = Math.max(-6, Math.min(6, x * 12));
    setHeroTilt(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`);
  };
  const creators = [
    { label: "News", images: ["news-01.png", "news-02.png"], copy: "Stay updated with 24/7 news streaming" },
    { label: "Devotional", images: ["devotional-01.png", "devotional-02.png"], copy: "Share devotion with your community" },
    { label: "Music", images: ["music-01.png", "music-02.png"], copy: "Keep the music going all day" },
    { label: "Cartoons", images: ["cartoons-01.png", "cartoons-02.png"], copy: "Entertainment that never stops" },
    { label: "Educators", images: ["educators-01.png", "educators-02.png"], copy: "Make learning available around the clock" },
    { label: "Affiliates", images: ["affiliates-01.png", "affiliates-02.png"], copy: "Grow your audience while you sleep" },
  ];
  const pricingByBilling = {
    Day: { unit: "day", standard: 35, standardCompare: 50, premium: 51, premiumCompare: 76 },
    Month: { unit: "month", standard: 899, standardCompare: 1199, premium: 1299, premiumCompare: 1699 },
    Year: { unit: "year", standard: 8999, standardCompare: 11999, premium: 12999, premiumCompare: 16999 },
  } as const;
  const selectedPricing = pricingByBilling[billing];
  const durationLimit = billing === "Day" ? 30 : billing === "Month" ? 12 : 5;
  const currencyRate = currency === "INR" ? 1 : 0.012;
  const formatPrice = (value: number) => currency === "INR"
    ? `₹${Math.round(value * currencyRate).toLocaleString("en-IN")}`
    : `$${(value * currencyRate).toFixed(2)}`;
  const selectedDurationLabel = `${duration} ${selectedPricing.unit}${duration === 1 ? "" : "s"}`;
  const faqs = [
    "What is Loop Stream?",
    "Can I stream to multiple platforms at once?",
    "Do I need to share my channel access?",
    "What video formats and resolutions are supported?",
    "Will my videos stay safe?",
    "What happens if my internet disconnects during a stream?",
    "Can I cancel or change my plan anytime?",
    "What if I face issues or need help?",
    "Why choose Loop Stream over others?",
    "Why does Loop Stream review free trial applications?",
    "How do I claim my trial if it's approved?",
    "Why wasn't my Loop Stream trial approved?",
  ];
  const answers = [
    "Loop Stream lets you upload pre-recorded videos and broadcast them live 24/7 without keeping your computer or studio online.",
    "Loop Stream is designed for reliable always-on streaming. Connect the destinations you use and manage your broadcast from one place.",
    "No. You keep control of your channel. Loop Stream only needs the permissions required to publish and manage your live stream.",
    "Upload common video formats and stream in up to 1080p, with 4K output available as the platform expands.",
    "Your videos are stored securely and used only to power the streams you schedule.",
    "The cloud keeps your stream running, so a local internet interruption does not stop an active broadcast.",
    "Yes. You can change your plan or stop whenever you need to.",
    "Reach out through the support links in the footer and the Loop Stream team will help you get moving.",
    "It is built specifically for pre-recorded, always-on streaming: upload once, schedule your playlist, and let it run.",
    "Free trials are reviewed to keep the service stable and make sure every approved channel is a good fit for the platform.",
    "If your application is approved, follow the trial instructions sent to your contact details.",
    "You can apply again with more information about your channel and the kind of content you plan to stream.",
  ];
  const features = [
    ["Loop Control", "Stream videos once, repeat N times, or loop endlessly", "Loop_Control.webp"],
    ["24x7 Streaming", "Stay live around the clock - without staying online", "24x7_streaming.webp"],
    ["Playlist Builder", "Line up multiple videos and go live in sequence", "Playlist_Builder.webp"],
    ["1080p & 4K Output", "Crystal-clear live streams up to 2160p", "1080p_4K_output.webp"],
    ["Advanced Scheduler", "Plan your streams for days, weeks, or months ahead", "advanced_scheduler.webp"],
  ];
  const channelLogos = ["channel1.webp", "channel2.webp", "channel3.webp", "channel4.webp", "channel5.webp", "channel6.webp", "channel7.webp"];
  return (
    <div className="loop-clone">
      <header className="loop-clone-nav">
        <Link href="/" className="loop-clone-logo"><img src="/images/logo/loop-logo.webp" alt="Loop Stream" /></Link>
        <nav className="loop-clone-links" aria-label="Main navigation">
          <button type="button" onClick={() => scrollTo("#loop-home")}>Home</button>
          <button type="button" onClick={() => scrollTo("#loop-pricing")}>Pricing</button>
          <button type="button" onClick={() => scrollTo("#loop-creators")}>Articles</button>
          <button type="button" onClick={() => scrollTo("#loop-steps")}>Tutorials</button>
          <button type="button" onClick={() => scrollTo("#loop-faq")}>Contact us</button>
        </nav>
        <Link href="/access" className="loop-clone-dashboard"><SquaresFour size={14} weight="regular" /> <span>Dashboard</span></Link>
        <button type="button" className="loop-clone-menu" aria-label="Open menu" onClick={() => document.querySelector(".loop-clone-links")?.classList.toggle("is-mobile-open")}><List size={20} /></button>
      </header>

      <main>
        <section id="loop-home" className="loop-clone-hero">
          <div className="loop-clone-platforms" aria-label="Streaming platforms">
            <img src="/images/loopstream/platforms/youtube.webp" alt="YouTube" />
            <img src="/images/loopstream/platforms/facebook.webp" alt="Facebook" />
            <img src="/images/loopstream/platforms/twitch.webp" alt="Twitch" />
            <img src="/images/loopstream/platforms/kick.webp" alt="Kick" />
            <span className="loop-clone-coming"><img src="/images/loopstream/platforms/instagram.webp" alt="" /><b>Coming<br />Soon</b></span>
            <span className="loop-clone-coming loop-clone-coming-dark"><img src="/images/loopstream/platforms/x.webp" alt="" /><b>Coming<br />Soon</b></span>
          </div>
          <div className="loop-clone-wordmark"><span>Stream</span><i /> <span>Loop</span><i /> <span>Grow</span></div>
          <h1>Go live without going live, 24/7 Pre-Recorded Streaming</h1>
          <div className="loop-clone-hero-actions"><Link href="/pricing">Get Started</Link><button type="button" onClick={() => scrollTo("#loop-pricing")}>Start Free Loop</button></div>
          <img className="loop-clone-hero-visual" style={{ transform: heroTilt }} onPointerMove={updateHeroTilt} onPointerLeave={() => setHeroTilt("none")} src="/images/loopstream/landing/Hero_Two_Screen.webp" alt="Loop Stream dashboard showing scheduled 24/7 pre-recorded video loops" />
        </section>

        <section className="loop-clone-trust">
          <div className="loop-clone-section-inner">
            <h2>Trusted by creators of<br /><strong>65M+ global community</strong></h2>
            <p>Empowering 24/7 live streams of music, devotional, kids, education &amp; news channels</p>
            <div className="loop-clone-channel-marquee" aria-label="Examples of 24/7 live streaming channels">
              <div className="loop-clone-channel-row">
                {[0, 1, 2].map((setIndex) => (
                  <div className="loop-clone-channel-set" key={setIndex} aria-hidden={setIndex === 1}>
                    {channelLogos.map((name) => <img key={`${setIndex}-${name}`} src={`/images/appImage/channel-logo/${name}`} alt="" />)}
                  </div>
                ))}
              </div>
            </div>
            <span className="loop-clone-small-label">Examples of 24/7 live streaming channels</span>
          </div>
        </section>

        <section className="loop-clone-compare">
          <div className="loop-clone-section-inner">
            <div className="loop-clone-section-kicker">SEE THE DIFFERENCE</div>
            <h2>Regular Live <span>vs</span> Loop Stream Live</h2>
            <p>Drag the slider to compare</p>
            <div ref={comparisonRef} className="loop-clone-comparison" onMouseMove={(event) => updateComparisonFromPointer(event.clientX)} onTouchStart={(event) => updateComparisonFromPointer(event.touches[0].clientX)} onTouchMove={(event) => updateComparisonFromPointer(event.touches[0].clientX)}>
              <img src="/images/loopstream/landing/after-loop-stream.webp" alt="Loop Stream live broadcast" />
              <div className="loop-clone-comparison-before" style={{ clipPath: `inset(0 ${100 - compare}% 0 0)` }}><img src="/images/loopstream/landing/before-loop-stream.webp" alt="Regular live streaming setup" /></div>
              <input aria-label="Compare regular live and Loop Stream live" type="range" min="0" max="100" value={compare} onChange={(event) => setCompare(Number(event.target.value))} />
              <div className="loop-clone-comparison-handle" style={{ left: `${compare}%` }}><span>↔</span></div>
              <strong className="loop-clone-comparison-label before">Regular Live</strong><strong className="loop-clone-comparison-label after">Loop Stream Live</strong>
            </div>
          </div>
        </section>

        <section id="loop-creators" className="loop-clone-creators">
          <div className="loop-clone-section-inner">
            <div className="loop-clone-section-kicker">MADE FOR EVERY CREATOR</div>
            <h2>Built for Every Type of Creator</h2>
            <p>Select your type — we've got you covered.</p>
            <div className="loop-clone-creator-tabs">{creators.map((item, index) => <button type="button" key={item.label} className={creator === index ? "active" : ""} onClick={() => setCreator(index)}>{item.label}</button>)}</div>
            <div className="loop-clone-creator-showcase">
              <div className="loop-clone-creator-gallery" aria-label={`${creators[creator].label} streaming examples`}>
                {creators[creator].images.map((image, index) => <img key={image} src={`/images/loopstream/creators/${image}`} alt={`${creators[creator].label} streaming example ${index + 1}`} />)}
              </div>
              <div><h3>{creators[creator].label}</h3><p>{creators[creator].copy}</p><Link href="/pricing">Start streaming <ArrowRight size={16} /></Link></div>
            </div>
          </div>
        </section>

        <section id="loop-steps" className="loop-clone-steps">
          <div className="loop-clone-section-inner">
            <div className="loop-clone-section-kicker">SIMPLE SETUP</div>
            <h2>Go Live in 3 Simple Steps</h2>
            <p>No software, no studio. Just upload, schedule, and relax</p>
            <div className="loop-clone-step-grid">
              {[["Upload your video", "Upload_Video.webp", "Add your content in a few clicks"], ["Schedule or stream instantly", "Schedule_Stream.webp", "Choose when you want to go live"], ["Loop & Go Live", "Loop_Go_Live.webp", "Let Loop Stream handle the rest"]].map(([title, image, copy], index) => <Fragment key={title}><article><span>0{index + 1}</span><img src={`/images/appImage/landing-page/${image}`} alt={title} /><h3>{title}</h3><p>{copy}</p></article>{index < 2 && <img className="loop-clone-step-arrow" src="/images/loopstream/step-arrow.png" alt="" aria-hidden="true" />}</Fragment>)}
            </div>
          </div>
        </section>

        <section className="loop-clone-features">
          <div className="loop-clone-section-inner">
            <div className="loop-clone-section-kicker">EVERYTHING INCLUDED</div>
            <h2>Powerful Features. Minimal Effort.</h2>
            <div className="loop-clone-feature-grid">{features.map(([title, copy, image]) => <article key={title}><img src={`/images/appImage/landing-page/${image}`} alt="" /><h3>{title}</h3><p>{copy}</p></article>)}</div>
          </div>
        </section>

        <section id="loop-pricing" className="loop-clone-pricing">
          <div className="loop-clone-section-inner">
            <div className="loop-clone-section-kicker">SIMPLE, TRANSPARENT PRICING</div>
            <h2>Choose the Plan That Fits You</h2>
            <p>Flexible plans for every stage — from free to pro.</p>
            <div className="loop-clone-pricing-controls">
              <div aria-label="Currency">
                {(["INR", "USD"] as const).map((option) => <button type="button" key={option} className={currency === option ? "active" : ""} onClick={() => setCurrency(option)}>{option === "INR" ? "₹ INR" : "$ USD"}</button>)}
              </div>
              <div aria-label="Billing period">
                {(["Day", "Month", "Year"] as const).map((term) => <button type="button" key={term} className={billing === term ? "active" : ""} onClick={() => { setBilling(term); setDuration(1); }}>{term}</button>)}
              </div>
            </div>
            <div className="loop-clone-pricing-stepper" aria-label="Choose plan duration">
              <button type="button" aria-label="Previous duration" disabled={duration === 1} onClick={() => setDuration((value) => Math.max(1, value - 1))}><ArrowLeft size={17} /></button>
              <div className={`loop-clone-pricing-track ${durationLimit > 5 ? "dense" : ""}`} aria-hidden="true">{Array.from({ length: durationLimit }, (_, index) => <i className={duration >= index + 1 ? "active" : ""} key={index} />)}</div>
              <strong>{selectedDurationLabel}</strong>
              <button type="button" aria-label="Next duration" disabled={duration === durationLimit} onClick={() => setDuration((value) => Math.min(durationLimit, value + 1))}><ArrowRight size={17} /></button>
            </div>
            <div className="loop-clone-plan-grid">
              <article className="loop-clone-plan trial"><span className="loop-clone-plan-badge">FREE TO TRY</span><h3>Try 24hrs Trial</h3><p>Explore Loop Stream risk-free</p><strong>{formatPrice(0)} <small>/24 hours</small></strong><div><b>Best For</b>Creators who want to try Loop Stream before choosing a plan</div><span className="loop-clone-plan-note">No card required</span><Link href="/pricing">Apply Free Trial <ArrowRight size={15} /></Link></article>
              <article className="loop-clone-plan"><h3>1080p Standard</h3><p>Simple. Stable. Reliable</p><strong>{formatPrice(selectedPricing.standard * duration)} <del>{formatPrice(selectedPricing.standardCompare * duration)}</del> <small>/{selectedPricing.unit}</small></strong><div><b>Best For</b>Casual creators easing into live before going all-in</div><Link href="/pricing">Choose Plan <ArrowRight size={15} /></Link></article>
              <article className="loop-clone-plan featured"><span className="loop-clone-plan-badge">MOST POPULAR</span><h3>1080p Premium</h3><p>Professional quality. Total control</p><strong>{formatPrice(selectedPricing.premium * duration)} <del>{formatPrice(selectedPricing.premiumCompare * duration)}</del> <small>/{selectedPricing.unit}</small></strong><div><b>Best For</b>Always-on channels like news, devotional, games or lofi</div><Link href="/pricing">Choose Plan <ArrowRight size={15} /></Link></article>
            </div>
            <button type="button" className="loop-clone-waitlist" onClick={() => scrollTo("#loop-faq")}>Join the 4K waitlist <ArrowRight size={15} /></button>
          </div>
        </section>

        <section id="loop-faq" className="loop-clone-faq">
          <div className="loop-clone-section-inner">
            <div className="loop-clone-section-kicker">NEED TO KNOW</div>
            <h2>Frequently Asked Questions</h2>
            <p>Got questions? We've got you covered</p>
            <div className="loop-clone-faq-list">{faqs.map((question, index) => <div className={`loop-clone-faq-item ${faq === index ? "open" : ""}`} key={question}><button type="button" onClick={() => setFaq(faq === index ? null : index)}><span>{question}</span><b>{faq === index ? "−" : "+"}</b></button>{faq === index && <p>{answers[index]}</p>}</div>)}</div>
          </div>
        </section>

        <section className="loop-clone-final-cta">
          <div className="loop-clone-section-inner"><h2>Ready to stream like a pro?</h2><p>Start your free trial today - no card required</p><div><Link href="/pricing">Start Free Trial <ArrowRight size={16} /></Link><Link className="secondary" href="/pricing">Choose Plans <ArrowRight size={16} /></Link></div></div>
        </section>
      </main>
      <footer className="loop-clone-footer"><div className="loop-clone-section-inner"><div className="loop-clone-footer-brand"><img src="/images/logo/loop-logo.webp" alt="Loop Stream" /><p>Go Live Without Going Live</p></div><div><h3>Important Links</h3><a href="#loop-home">Home</a><a href="#loop-pricing">Pricing</a><a href="#loop-faq">Contact us</a></div><div><h3>Company</h3><a href="#loop-creators">Articles</a><a href="#loop-steps">Tutorials</a><a href="/access">Dashboard</a></div><div className="loop-clone-footer-socials"><a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><img src="/images/youtube-logo.webp" alt="YouTube" /></a><a href="https://x.com/" target="_blank" rel="noreferrer"><img src="/images/x-logo.webp" alt="X" /></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><img src="/images/instagram-logo.webp" alt="Instagram" /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><img src="/images/facebook-icon.webp" alt="Facebook" /></a></div><small>© 2026 Loop Stream: All rights reserved • Made with ❤️ for creators around the World</small></div></footer>
    </div>
  );
}

function PublicFooter() {
  return <footer className="streamly-footer" style={{ backgroundImage: "url('/images/footer-texture.webp')" }}><div className="streamly-container footer-inner"><div><Link href="/" className="streamly-brand"><BrandMark /><span>Streamly</span></Link><span className="footer-note">Broadcast continuity for creators.</span></div><div className="footer-links"><span>Product</span><Link href="#capabilities">Capabilities</Link><Link href="/pricing">Pricing</Link></div><div className="footer-links"><span>Access</span><Link href="/access">Log in</Link></div><div className="footer-socials" aria-label="Social links"><a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Streamly on X"><TwitterLogo size={17} /></a><a href="https://discord.com/" target="_blank" rel="noreferrer" aria-label="Streamly on Discord"><DiscordLogo size={17} /></a><a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="Streamly on YouTube"><YoutubeLogo size={17} /></a></div><span className="footer-copyright">© 2026 Streamly</span></div></footer>;
}

function ContactDialog({ plan, onClose }: { plan: { term: string } | null; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => { setSelected(null); }, [plan]);
  if (!plan) return null;
  return <AnimatePresence><motion.div className="streamly-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}><motion.div className="streamly-modal" role="dialog" aria-modal="true" aria-labelledby="contact-dialog-title" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={onClose} aria-label="Close contact dialog"><X size={18} /></button><span className="section-label">TRIAL ACTIVATION</span><h2 id="contact-dialog-title">Activate your <em>{plan.term}</em>.</h2><p>Choose a contact option and we will help you get your first channel moving.</p><div className="contact-options"><button type="button" className={selected === "WhatsApp" ? "selected" : ""} onClick={() => setSelected("WhatsApp")}><span>WA</span><strong>WhatsApp</strong><ArrowRight size={16} /></button><button type="button" className={selected === "Telegram" ? "selected" : ""} onClick={() => setSelected("Telegram")}><span>TE</span><strong>Telegram</strong><ArrowRight size={16} /></button></div>{selected && <div className="contact-confirmation"><CheckCircle size={17} weight="fill" /><span><b>{selected} selected.</b> We will connect you about your {plan.term} access.</span></div>}<button type="button" className="modal-back" onClick={onClose}>Back to plans</button></motion.div></motion.div></AnimatePresence>;
}

export function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<(typeof accessPlans)[number] | null>(null);
  const [, setLocation] = useLocation();
  return <div className="streamly-public"><PublicNav /><main className="pricing-page-main"><div className="streamly-container pricing-page-heading"><span className="section-label">STREAMLY / ACCESS WINDOWS</span><h1>Choose your<br /><em>broadcast runway.</em></h1><p>Start with a free day, then keep your channel live for the window that fits your next season of work. Every plan includes the complete broadcast toolkit.</p></div><div className="streamly-container full-plans">{accessPlans.map((plan, index) => <motion.article key={plan.term} className={`full-plan ${plan.featured ? "featured" : ""}`} whileHover={{ y: -5 }} transition={{ duration: .2 }}>{plan.featured && <img className="popular-badge" src="/images/badge-popular.png" alt="" aria-hidden="true" loading="lazy" />}<div className="full-plan-top"><span>{plan.featured ? "RECOMMENDED" : `0${index + 1} / ACCESS`}</span>{plan.featured && <Sparkle size={15} />}</div><h2>{plan.term}</h2><p>{plan.detail}</p><div className="full-plan-price"><strong>{plan.price}</strong><span>/ {plan.period}</span></div><div className="full-plan-bonus"><span>PLAN BENEFIT</span><b>{plan.bonus}</b></div><div className="plan-feature-list">{planFeatures.map((feature) => <span key={feature}><Check size={14} weight="bold" />{feature}</span>)}</div><button type="button" className="streamly-button streamly-button-primary plan-cta" onClick={() => plan.featured && plan.term === "Free 1 day" ? setSelectedPlan(plan) : setLocation(`/gateway?plan=${encodeURIComponent(plan.term)}`)} data-testid={`button-paywall-plan-${index}`}>{plan.term === "Free 1 day" ? "Choose free access" : "Continue to gateway"}<ArrowRight size={16} weight="bold" /></button></motion.article>)}</div><div className="streamly-container pricing-footnote"><Radio size={17} weight="fill" /> Need help choosing? We can help map your access window to your channel plan.</div></main><ContactDialog plan={selectedPlan} onClose={() => setSelectedPlan(null)} /><PublicFooter /></div>;
}

export function GatewayPage() {
  const [, setLocation] = useLocation();
  const plan = new URLSearchParams(window.location.search).get("plan") || "1 month";
  return <div className="streamly-public"><PublicNav /><main className="gateway-page-main"><div className="gateway-card"><span className="section-label">PAYMENT GATEWAY / READY</span><h1>Continue with<br /><em>{plan}.</em></h1><p>Your selected access window is ready. Connect the payment gateway here when checkout is enabled for your workspace.</p><div className="gateway-selection"><span className="gateway-selection-icon"><Check size={17} weight="bold" /></span><span><b>{plan}</b><small>Selected access window</small></span></div><button type="button" className="streamly-button streamly-button-primary" onClick={() => setLocation("/pricing")}>Back to pricing <ArrowRight size={16} /></button></div></main><PublicFooter /></div>;
}