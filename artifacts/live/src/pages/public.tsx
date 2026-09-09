import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, ChevronDown, Menu, Play, Radio, Signal, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import GetOfferButton from "@/components/GetOfferButton";
import heroImage from "@assets/generated_images/rloop-hero.jpg";
import kidsImage from "@assets/generated_images/rloop-kids.jpg";
import yogaImage from "@assets/generated_images/rloop-yoga.jpg";
import sleepImage from "@assets/generated_images/rloop-sleep.jpg";
import musicImage from "@assets/generated_images/rloop-music.jpg";
import newsImage from "@assets/generated_images/rloop-news.jpg";
import dramaImage from "@assets/generated_images/rloop-drama.jpg";
import logoImage from "@assets/image_1788788255512.png";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const useCases = [
  { title: "Kids & cartoons", note: "A familiar channel, always ready", image: kidsImage },
  { title: "Yoga & movement", note: "A calm class on a reliable loop", image: yogaImage },
  { title: "Sleep & ambience", note: "Clouds, night skies, quiet rooms", image: sleepImage },
  { title: "Music & radio", note: "A visual stream that never drops", image: musicImage },
  { title: "News & live updates", note: "Keep the daily signal moving", image: newsImage },
  { title: "Drama & traditions", note: "Stories with a steady stage", image: dramaImage },
];

const navItems = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Pricing", href: "/pricing" },
];

function BrandMark() {
  return <span className="marketing-mark"><img src={logoImage} alt="" /></span>;
}

function RollLabel({ children }: { children: string }) {
  return <span className="roll-label"><span>{children}</span><span aria-hidden="true">{children}</span></span>;
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
    { label: "Signal locked", sub: "Broadcasting continuously", color: "lime" },
    { label: "Offline ready", sub: "Playlist standing by", color: "amber" },
    { label: "Reconnecting", sub: "Automatic recovery engaged", color: "coral" },
  ];
  useEffect(() => {
    const timer = window.setInterval(() => setState((value) => (value + 1) % statuses.length), 4200);
    return () => window.clearInterval(timer);
  }, [statuses.length]);
  const current = statuses[state];
  return <div className={`signal-monitor signal-${current.color}`} data-testid="status-broadcast-signal">
    <div className="monitor-head"><span className="monitor-title"><span className="monitor-led" /> Broadcast monitor</span><span className="monitor-time">00:24:08:17</span></div>
    <div className="monitor-stage">
      <img src={heroImage} alt="Creator directing a live stream from a control room" />
      <div className="stage-wash" />
      <div className="scan-lines" />
      <div className="monitor-center"><AnimatePresence mode="wait"><motion.div key={current.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .35 }}><div className="monitor-state"><span className="monitor-state-dot" />{current.label}</div><p>{current.sub}</p></motion.div></AnimatePresence></div>
      <div className="monitor-corner monitor-corner-left">RLB / CH.01</div><div className="monitor-corner monitor-corner-right">4K · 60 FPS</div>
    </div>
    <div className="monitor-wave"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
    <div className="monitor-foot"><span><Signal size={13} /> YouTube</span><span><Signal size={13} /> Facebook</span><strong>Auto-restart <i /></strong></div>
  </div>;
}

function MarketingSection({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return <motion.section ref={ref} id={id} className={`marketing-section ${className}`} initial="hidden" animate={inView ? "visible" : "hidden"} variants={reveal}>{children}</motion.section>;
}

export function LandingPage() {
  const [intro, setIntro] = useState(true);
  const [activeCase, setActiveCase] = useState(0);
  const [, setLocation] = useLocation();
  const reducedMotion = useReducedMotion();
  const completeIntro = () => setIntro(false);
  return <div className="marketing-page">
    <AnimatePresence>{intro && !reducedMotion && <IntroReveal onComplete={completeIntro} />}</AnimatePresence>
    <PublicNav />
    <main>
      <section className="marketing-hero" data-testid="section-marketing-hero">
        <div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" />
        <div className="hero-copy">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .7, ease }} className="signal-tag"><span className="signal-tag-dot" /> YOUR CHANNEL, ON LOOP</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .8, ease }}>Make the long<br /><em>signal feel alive.</em></motion.h1>
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
        <motion.div className="hero-monitor-wrap" initial={{ opacity: 0, x: 25 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .35, duration: .9, ease }}><SignalMonitor /></motion.div>
        <button className="hero-scroll" onClick={() => document.querySelector("#capabilities")?.scrollIntoView({ behavior: "smooth" })} data-testid="button-scroll-capabilities"><span>Scroll to tune in</span><ArrowDown size={15} /></button>
      </section>

      <MarketingSection className="signal-strip"><div className="strip-label">Built for the channel that keeps going</div><div className="strip-lines"><span /><span /><span /><span /><span /><span /><span /></div><div className="strip-stats"><strong>24<span>h</span></strong><small>broadcast window</small></div><div className="strip-stats"><strong>4K</strong><small>output ceiling</small></div><div className="strip-stats"><strong>02</strong><small>platform destinations</small></div><div className="strip-platforms"><span>YouTube</span><span>Facebook</span><span>Apps <b>coming soon</b></span></div></MarketingSection>

      <MarketingSection id="capabilities" className="capabilities-section"><div className="section-intro"><span className="section-index">01 / THE CONTROL ROOM</span><h2>From playlist<br /><em>to transmission.</em></h2><p>Every part of the broadcast is deliberate. R Loop Bypass gives a small team the calm, precise controls of a real channel room.</p></div><div className="capability-list"><div className="capability-item"><span>01</span><div><h3>Loop without babysitting</h3><p>Keep a selected library in motion, with playback that comes back on its own when a connection gets noisy.</p></div><Zap size={18} /></div><div className="capability-item"><span>02</span><div><h3>Schedule the handoff</h3><p>Shape a playlist, set the duration, and send the next broadcast out when your audience expects it.</p></div><Zap size={18} /></div><div className="capability-item"><span>03</span><div><h3>Meet the platform</h3><p>Stream to YouTube and Facebook with crisp 4K or 1080p output, depending on the room and the moment.</p></div><Zap size={18} /></div></div></MarketingSection>

      <MarketingSection id="use-cases" className="use-cases-section"><div className="use-case-head"><div><span className="section-index">02 / PROGRAMMING</span><h2>A channel for<br /><em>every rhythm.</em></h2></div><p>From early morning movement to a quiet night sky, build the loop your audience returns to.</p></div><div className="use-case-feature"><div className="use-case-image"><AnimatePresence mode="wait"><motion.img key={useCases[activeCase].title} src={useCases[activeCase].image} alt={useCases[activeCase].title} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .6 }} /></AnimatePresence><div className="image-caption"><span>Now programming</span><strong>{useCases[activeCase].title}</strong></div></div><div className="use-case-rail">{useCases.map((item, index) => <button key={item.title} className={`use-case-tab ${activeCase === index ? "active" : ""}`} onClick={() => setActiveCase(index)} data-testid={`button-use-case-${index}`}><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.note}</small><ArrowRight size={15} /></button>)}</div></div></MarketingSection>

      <MarketingSection className="workflow-section"><div className="workflow-art"><div className="workflow-card workflow-card-back"><span>playlist / night-sky</span><b>18 videos</b></div><div className="workflow-card workflow-card-front"><div className="workflow-card-top"><span className="monitor-led" /> LIVE CHANNEL</div><strong>Sleep / Cloud ambience</strong><div className="workflow-track"><i /><i /><i /><i /><i /><i /><i /></div><small>Now looping · 08:42:19</small></div></div><div className="workflow-copy"><span className="section-index">03 / THE HANDOFF</span><h2>Quiet systems<br /><em>make good TV.</em></h2><p>Set the playlist, choose where it goes, and let the room do the repetitive work. The product stays visible when it matters and disappears when it does not.</p><Link href="/access" className="inline-arrow" data-testid="link-workflow-access">Open the control room <ArrowRight size={15} /></Link></div></MarketingSection>

      <MarketingSection className="final-cta"><div className="final-cta-grid" /><span className="section-index">READY WHEN YOU ARE</span><h2>Give your next loop<br /><em>a proper signal.</em></h2><p>Start with one channel. Build the library around it. Keep the room on air.</p><Link href="/pricing" className="signal-button" data-testid="link-final-pricing"><span>View access options</span><ArrowRight size={16} /></Link></MarketingSection>
    </main>
    <footer className="marketing-footer"><Link href="/" className="marketing-brand" data-testid="link-footer-home"><BrandMark /><span>R LOOP <b>BYPASS</b></span></Link><span>Broadcast automation for the long signal.</span><Link href="/access" data-testid="link-footer-access">Access workspace <ArrowRight size={13} /></Link></footer>
  </div>;
}

export function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const plans = annual ? { price: "₹7,999", crossed: "₹10,000", label: "12 months", offer: "20% annual offer" } : { price: "₹799", crossed: "₹1,000", label: "1 month", offer: "20% offer" };
  return <div className="marketing-page pricing-page"><PublicNav /><main className="pricing-main"><div className="pricing-intro"><span className="section-index">R LOOP BYPASS / ACCESS</span><h1>A clear signal<br /><em>starts here.</em></h1><p>One focused plan for creators and small media teams building reliable live channels.</p></div><div className="pricing-toggle" role="group" aria-label="Billing period"><button className={!annual ? "active" : ""} onClick={() => setAnnual(false)} data-testid="button-monthly-plan">1 month</button><button className={annual ? "active" : ""} onClick={() => setAnnual(true)} data-testid="button-annual-plan">12 months <span>save 20%</span></button></div><motion.div className="price-card" layout><div className="price-card-glow" /><div className="price-card-top"><span className="signal-tag"><span className="signal-tag-dot" /> FOCUSED ACCESS</span><span className="price-card-badge">Most direct route</span></div><h2>Broadcast plan</h2><p className="price-description">Everything needed to turn a library into a channel that keeps its place on air.</p><div className="price-line"><span className="price-crossed">{plans.crossed}</span><strong>{plans.price}</strong><span className="price-period">/ {plans.label}</span></div><div className="offer-line"><Zap size={14} /> {plans.offer} included</div><Link href="/access" className="signal-button price-button" data-testid="link-pricing-access"><span>Access / activate a key</span><ArrowRight size={16} /></Link><div className="price-features">{["Loop videos into 24-hour channels", "Playlist builder and scheduled broadcasts", "YouTube and Facebook destinations", "4K / 1080p stream output", "Automatic reconnect and restart"].map((feature) => <span key={feature}><Check size={14} /> {feature}</span>)}</div></motion.div><div className="pricing-note"><Radio size={16} /><span>Already have a key? <Link href="/access" data-testid="link-pricing-existing-key">Enter it in the access room.</Link></span></div></main><footer className="marketing-footer"><Link href="/" className="marketing-brand" data-testid="link-pricing-footer-home"><BrandMark /><span>R LOOP <b>BYPASS</b></span></Link><span>Simple access. Serious signal.</span><Link href="/" data-testid="link-pricing-back">Back to overview <ArrowRight size={13} /></Link></footer></div>;
}