import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
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
  const [activeFeature, setActiveFeature] = useState(0);
  const reducedMotion = useReducedMotion();
  const ActiveFeatureIcon = features[activeFeature].Icon;
  const scrollTo = (selector: string) => document.querySelector(selector)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  return (
    <div className="streamly-public">
      <PublicNav />
      <main>
        <section className="streamly-hero" style={{ backgroundImage: "url('/images/hero-bg-glow.webp')" }}>
          <div className="hero-grid" />
          <div className="hero-orb hero-orb-blue" />
          <div className="hero-orb hero-orb-violet" />
          <div className="streamly-container hero-layout">
            <div className="hero-copy">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease }}><SignalBadge><Lightning size={13} weight="fill" /> POWERED BY 24/7 CLOUD INFRASTRUCTURE</SignalBadge></motion.div>
              <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, duration: .75, ease }}>Stream 24/7 on YouTube,<br /><em>even while you sleep.</em></motion.h1>
              <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .17, duration: .65, ease }}>Keep your channel live continuously without leaving your device on. Upload once, press play, and let cloud infrastructure carry the signal through the night.</motion.p>
              <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .27, duration: .65, ease }}>
                <Link href="/pricing" className="streamly-button streamly-button-primary" data-testid="link-hero-offer">Start streaming <ArrowRight size={17} weight="bold" /></Link>
                <button type="button" className="streamly-button streamly-button-quiet" onClick={() => scrollTo("#how-it-works")} data-testid="button-explore-product"><Play size={15} weight="fill" /> See how it works</button>
              </motion.div>
              <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .42, duration: .6 }}><span><Check size={14} weight="bold" /> 1080p and 4K output</span><span><Check size={14} weight="bold" /> YouTube ready</span><span><Check size={14} weight="bold" /> Automatic recovery</span></motion.div>
            </div>
          </div>
          <button type="button" className="hero-scroll-cue" onClick={() => scrollTo("#how-it-works")}><span>Explore the signal</span><ArrowDown size={15} /></button>
        </section>

        <div className="streamly-ticker" aria-label="Streamly product highlights"><div><span>24 / 7 BROADCAST</span><i /> <span>CLOUD RELAY</span><i /> <span>PLAYLIST LOOPING</span><i /> <span>REAL-TIME ANALYTICS</span><i /> <span>24 / 7 BROADCAST</span><i /> <span>CLOUD RELAY</span></div></div>

        <Reveal id="how-it-works" className="streamly-section how-section" style={{ backgroundImage: "url('/images/steps-bg-pattern.webp')" }}>
          <div className="streamly-container">
            <div className="section-heading section-heading-split"><div><span className="section-label">01 / HOW IT WORKS</span><h2>Set the signal.<br /><em>Leave the room.</em></h2></div><p>Everything you need to turn a folder of videos into a channel people can return to. No encoder to babysit. No laptop left awake.</p></div>
            <div className="steps-grid"><StepCard number="01" Icon={ListChecks} title="Build your playlist" copy="Add your videos, arrange the order, and choose how often the sequence should repeat." /><StepCard number="02" Icon={Broadcast} title="Choose your destination" copy="Connect YouTube and set your stream details. Streamly handles the cloud broadcast layer." /><StepCard number="03" Icon={RocketLaunch} title="Go live, then go live" copy="Your channel keeps its rhythm while you sleep, work, or make the next thing." /></div>
          </div>
        </Reveal>

        <Reveal id="capabilities" className="streamly-section capability-section">
          <div className="streamly-container capability-layout">
            <div className="section-heading"><span className="section-label">02 / CAPABILITIES</span><h2>Less dashboard.<br /><em>More broadcast.</em></h2><p>Streamly is opinionated about the work that should happen automatically, so you can stay focused on what is worth making.</p></div>
            <div className="capability-panel">
              <div className="capability-tabs" role="tablist" aria-label="Streamly capabilities">{features.map((feature, index) => <button type="button" key={feature.title} className={activeFeature === index ? "active" : ""} onClick={() => setActiveFeature(index)} role="tab" aria-selected={activeFeature === index}><span>0{index + 1}</span>{feature.title}<ArrowRight size={15} /></button>)}</div>
              <AnimatePresence mode="wait"><motion.div key={features[activeFeature].title} className="capability-detail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .34, ease }}><div className="capability-detail-icon"><ActiveFeatureIcon size={32} weight="duotone" /></div><span className="section-label">{features[activeFeature].eyebrow}</span><h3>{features[activeFeature].title}</h3><p>{features[activeFeature].description}</p><div className="capability-visual"><div className="visual-line visual-line-a" /><div className="visual-line visual-line-b" /><div className="visual-pulse"><i /><i /><i /></div><span>signal stable</span></div></motion.div></AnimatePresence>
            </div>
          </div>
        </Reveal>

        <Reveal id="use-cases" className="streamly-section use-case-section">
          <div className="streamly-container">
            <div className="section-heading section-heading-split"><div><span className="section-label">03 / MADE FOR MOMENTUM</span><h2>One engine.<br /><em>Many rhythms.</em></h2></div><p>A calm overnight radio station, a daily devotional, a rolling news feed, or an education loop — the format is yours.</p></div>
             <div className="use-case-grid"><div className="use-case-primary"><img className="use-case-live-visual" src="/images/live-signal-visual.webp" alt="Glowing live-stream signal orb" loading="lazy" /><div className="use-case-bars"><i /><i /><i /><i /><i /><i /><i /></div><div className="use-case-primary-copy"><span className="signal-badge signal-badge-violet"><i /> PROGRAMMING MODE</span><h3>Build a channel people can leave on.</h3><p>Give your archive a living schedule. Streamly keeps the handoff smooth from one video to the next.</p></div><div className="use-case-quote">“The best broadcast is the one that keeps its promise.”</div></div><div className="use-case-list"><div><span className="use-case-number">01</span><strong>Ambient & focus</strong><small>Long-form loops for deep work</small><ArrowRight size={16} /></div><div><span className="use-case-number">02</span><strong>News & updates</strong><small>Keep the daily signal moving</small><ArrowRight size={16} /></div><div><span className="use-case-number">03</span><strong>Classes & devotion</strong><small>A dependable rhythm for learners</small><ArrowRight size={16} /></div><div><span className="use-case-number">04</span><strong>Product showcases</strong><small>Let your best work stay visible</small><ArrowRight size={16} /></div></div></div>
          </div>
        </Reveal>

        <Reveal className="streamly-section analytics-section">
          <div className="streamly-container analytics-layout"><div className="analytics-copy"><span className="section-label">04 / SIGNAL INTELLIGENCE</span><h2>Know what keeps<br /><em>people watching.</em></h2><p>Streamly gives you the useful readout without burying the signal in a spreadsheet. Watch the shape of your channel over time and make the next loop smarter.</p><Link href="/access" className="streamly-inline-link">Open the control room <ArrowRight size={16} weight="bold" /></Link></div><div className="analytics-card"><div className="analytics-card-top"><div><span>LIVE CHANNEL / 24 HOURS</span><strong>Audience momentum</strong></div><SignalBadge tone="green">Healthy</SignalBadge></div><div className="analytics-big-number">1,284 <small>average viewers</small></div><div className="analytics-bars">{[42, 57, 49, 68, 61, 76, 71, 84, 78, 91, 88, 96, 85, 92].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="analytics-axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>NOW</span></div><div className="analytics-footer"><span><i className="legend-violet" /> Watch time <b>18.6k hrs</b></span><span><i className="legend-blue" /> Peak <b>2,041</b></span></div></div></div>
        </Reveal>

        <Reveal className="streamly-section pricing-preview">
          <div className="streamly-container"><div className="pricing-preview-head"><div><span className="section-label">05 / SIMPLE ACCESS</span><h2>Start small.<br /><em>Stay live.</em></h2></div><Link href="/pricing" className="streamly-button streamly-button-quiet">See all access windows <ArrowRight size={16} /></Link></div><div className="preview-plans">{pricingPlans.map((plan, index) => <article key={plan.term} className={`preview-plan ${plan.featured ? "featured" : ""}`}><div className="preview-plan-top"><span>{plan.featured ? "RECOMMENDED" : `0${index + 1} / ACCESS`}</span>{plan.featured && <Sparkle size={15} />}</div><h3>{plan.term}</h3><p>{plan.detail}</p><div className="preview-price"><strong>{plan.price}</strong><span>/ {plan.period}</span></div><div className="preview-bonus"><Check size={14} weight="bold" /> {plan.bonus}</div><Link href="/pricing" className="preview-plan-link">Choose this window <ArrowRight size={15} /></Link></article>)}</div></div>
        </Reveal>

        <section className="streamly-cta" style={{ backgroundImage: "url('/images/cta-bg.webp')" }}><div className="cta-grid" /><div className="streamly-container cta-inner"><span className="section-label">THE CHANNEL IS YOURS</span><h2>Make the next<br /><em>broadcast automatic.</em></h2><p>Start with one playlist. Let Streamly handle the hours you cannot.</p><Link href="/pricing" className="streamly-button streamly-button-primary">Start your free day <ArrowRight size={17} weight="bold" /></Link></div></section>
      </main>
      <PublicFooter />
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