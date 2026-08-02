import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUp,
  Sparkles,
  Compass,
  ShieldCheck,
  ChevronRight,
  Bell,
  Cpu,
  AlertTriangle,
  Camera,
  Radio,
  Volume2,
} from "lucide-react";
import MagicRings from "../components/MagicRings";
import { DashboardSection } from "../components/DashboardSection";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriShield AI — Intelligent Crop Protection & Animal Intrusion Detection" },
      {
        name: "description",
        content:
          "AI-powered crop protection platform: spot wildlife, trigger smart deterrent systems, and create a collaborative village safety network in real time.",
      },
      { property: "og:title", content: "AgriShield AI — Intelligent Crop Protection Platform" },
      {
        property: "og:description",
        content:
          "Monitor animal intrusions on your farm with AI edge detection, acoustic deterrents, and village safety warnings.",
      },
    ],
  }),
  component: AgriShieldLandingPage,
});

function AgriShieldLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Overview", to: "#overview" },
    { label: "AI Modules", to: "#modules" },
    { label: "Village Network", to: "#community" },
  ];

  return (
    <div className="bg-[#0a0608] min-h-screen text-white font-inter overflow-x-hidden relative scrollbar-hide">
      {/* Floating Pill Glass Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-6xl transition-all duration-500">
        <div className="liquid-glass backdrop-blur-xl rounded-full px-6 md:px-10 py-3.5 flex items-center justify-between border border-white/10 shadow-xl shadow-black/30">
          {/* Brand Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
              <ShieldCheck className="size-4" />
            </span>
            <span className="font-['Space_Grotesk'] font-bold text-base md:text-lg tracking-tight text-white hover:text-white/80 transition-all duration-300">
              AgriShield <span className="text-primary font-normal">AI</span>
            </span>
          </Link>

          {/* Desktop Center Links */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="text-white/70 hover:text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:block">
            <Button
              asChild
              className="px-6 py-2.5 rounded-full font-semibold text-xs uppercase tracking-widest inline-flex"
            >
              <Link to="/auth">
                Get Started
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
              </Link>
            </Button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 justify-center items-center w-8 h-8 z-50 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <span
              className={`w-6 h-0.5 bg-white rounded transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMenuOpen ? "rotate-45 translate-y-[8px]" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white rounded transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMenuOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white rounded transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isMenuOpen ? "-rotate-45 -translate-y-[8px]" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Slide-in Menu Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-40 w-[85%] max-w-[340px] bg-[#0a0608]/98 backdrop-blur-2xl border-l border-white/10 p-8 pt-28 flex flex-col justify-between shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.to}
              onClick={() => setIsMenuOpen(false)}
              style={{
                transitionDelay: `${150 + i * 75}ms`,
              }}
              className={`text-xl font-light tracking-wide hover:text-white/80 transition-all duration-500 transform ${
                isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <Button
          asChild
          className={`w-full py-4 rounded-full font-semibold text-xs uppercase tracking-widest ${
            isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
          style={{ transitionDelay: "375ms" }}
        >
          <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
            Get Started
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
          </Link>
        </Button>
      </div>

      {/* SECTION 1: Hero */}
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none" />

        {/* Hero Central Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 max-w-5xl -mt-[100px] md:-mt-[120px]">
          {/* Subtitle/Brand Tag */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in duration-700">
            <span className="h-[1px] w-6 bg-primary/60" />
            <span className="uppercase text-[9px] md:text-xs tracking-[0.35em] font-bold text-primary text-center">
              Intelligent Animal Intrusion Detection & Smart Crop Protection Platform
            </span>
            <span className="h-[1px] w-6 bg-primary/60" />
          </div>

          {/* Heading */}
          <h1 className="font-inter font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-tight tracking-tight text-center text-glow select-text">
            Your fields.
            <br />
            Secured around the clock.
          </h1>

          {/* Elegant Description */}
          <p className="text-white/90 text-sm md:text-base font-light text-center mt-6 md:mt-8 max-w-2xl leading-relaxed select-text font-inter">
            AgriShield AI detects wild boar, nilgai, and stray cattle approaching farmland,
            activates dynamic acoustic deterrents, and alerts village communities in sub-3 seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10">
            <Button
              asChild
              className="px-10 py-6 rounded-full font-semibold text-xs uppercase tracking-widest button-glow"
            >
              <Link to="/auth">
                Get Started
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
              </Link>
            </Button>
            <button
              onClick={() => {
                const element = document.getElementById("overview");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-full font-semibold text-xs uppercase tracking-widest hover:bg-white/20 transition-all duration-300 hover:scale-[1.05] active:scale-[0.98]"
            >
              Explore Platform
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 z-30 hidden md:flex items-center gap-2 select-none text-white/40 hover:text-white/70 transition-colors">
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold font-inter">
            Scroll to explore
          </span>
          <ArrowRight className="size-3.5 rotate-90" />
        </div>
      </section>

      {/* SECTION: Scroll Stack Dashboard Console Showcase */}
      <DashboardSection />

      {/* SECTION: Core Magic Rings Interceptor Scan */}
      <section className="relative w-full bg-[#0a0608] py-28 border-t border-white/5 overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center items-center gap-2 mb-3">
            <Radio className="size-4 text-primary animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-bold text-primary font-inter">
              Core Surveillance Terminal
            </span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white mb-6 uppercase">
            Active Scanning Matrix
          </h2>
          <p className="text-white/60 text-sm md:text-base font-light max-w-xl mx-auto mb-16 leading-relaxed font-inter">
            The integrated diagnostic scanner overlays real-time species wave triggers onto the edge
            node radar field. Click the scanner zone to fire a laser pulse.
          </p>

          {/* Centerpiece MagicRings Scan */}
          <div className="flex justify-center w-full">
            <div className="relative w-full min-h-[480px] md:min-h-[580px] flex items-center justify-center overflow-hidden group cursor-pointer">
              {/* WebGL MagicRings - expanded coordinates for a larger sweep animation */}
              <div className="absolute inset-0 z-0 flex items-center justify-center">
                <div className="w-full h-full max-w-4xl aspect-video relative">
                  <MagicRings
                    color="#10b981"
                    colorTwo="#047857"
                    ringCount={8}
                    speed={1.0}
                    attenuation={5}
                    lineThickness={2.5}
                    baseRadius={0.42}
                    radiusStep={0.09}
                    scaleRate={0.05}
                    opacity={0.9}
                    noiseAmount={0.06}
                    followMouse={true}
                    mouseInfluence={0.2}
                    hoverScale={1.1}
                    clickBurst={true}
                  />
                </div>
              </div>

              {/* Sweeping laser scanner bar */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/40 shadow-[0_0_15px_#10b981] scan-line pointer-events-none z-10" />

              {/* Centered System Alert Overlay (No Card Frame) */}
              <div className="relative z-20 flex flex-col items-center gap-4 text-center select-none group-hover:scale-105 transition-transform duration-500 pointer-events-none">
                {/* Flashing Siren Base */}
                <div className="relative flex items-center justify-center">
                  <span className="absolute inline-flex h-14 w-14 rounded-full bg-red-500/20 animate-ping" />
                  <div className="w-9 h-9 rounded-full bg-red-500 border-2 border-white flex items-center justify-center shadow-[0_0_20px_#ef4444] animate-pulse">
                    <Bell className="size-4.5 text-white animate-bounce" />
                  </div>
                </div>

                {/* CCTV Camera and system alert labels */}
                <div className="flex flex-col items-center">
                  <Camera className="size-9 text-primary animate-pulse" />
                  <span className="text-[12px] text-white/90 tracking-[0.25em] font-extrabold uppercase mt-2.5 font-inter">
                    SYSTEM ALERT
                  </span>
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1.5 animate-pulse bg-red-500/10 border border-red-500/20 px-3.5 py-0.5 rounded-full font-mono">
                    INTRUSION DETECTED
                  </span>
                  <span className="text-[9px] text-white/40 font-mono mt-2 block">
                    Node: AGS-03 (East)
                  </span>
                </div>
              </div>

              {/* Bottom Specs Tags */}
              <div className="absolute bottom-6 left-6 z-20 hidden md:block text-[9px] font-mono text-white/30 tracking-wider">
                NODE_LAT: 22.3094° N / LNG: 72.1362° E
              </div>
              <div className="absolute bottom-6 right-6 z-20 text-[9px] font-mono text-primary tracking-wider animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                ACTIVE SCANNING
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1.5: Apple & Stripe Agriculture Cards */}
      <section id="overview" className="relative w-full py-24 px-6 md:px-12 bg-[#090507]">
        {/* Subtle radial background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.02] blur-[150px] pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
            id="modules"
          >
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-4 text-primary" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-primary font-inter">
                  Integrated Architecture
                </span>
              </div>
              <h2 className="font-instrument text-4xl sm:text-5xl md:text-6xl italic font-light tracking-tight leading-none text-white select-text">
                Crop protection at the edge.
              </h2>
            </div>
            <p className="text-white/60 text-sm md:text-base font-light max-w-sm leading-relaxed select-text font-inter">
              AgriShield AI bridges intelligent optical detection and coordinated deterrents to
              shield rural livelihoods from devastating crop intrusions.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Card 1: Apple-style Card (Intrusion Detection) */}
            <div className="liquid-glass border border-white/10 overflow-hidden rounded-[2rem] aspect-[4/5] relative group cursor-pointer shadow-xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/[0.01]">
              <img
                src="/agrishield_boar.png"
                alt="AI Edge Wild Boar Intrusion Detection"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300" />

              <div className="absolute inset-0 p-8 flex flex-col justify-between text-left">
                <div className="flex justify-between items-start">
                  <span className="bg-white/10 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-primary px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1 font-inter">
                    <Cpu className="size-3" />
                    AI Detection Loop
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ChevronRight className="size-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-instrument text-2xl md:text-3xl italic text-white leading-tight">
                    Intrusion Intelligence
                  </h3>
                  <p className="text-white/80 text-xs mt-2.5 leading-relaxed font-light font-inter">
                    Spots Wild Boar, Nilgai, Cows, Buffalos, Monkeys, and Stray Cattle under sub-3s
                    latencies. Features digital bounding boxes and high confidence logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Stripe-style Targets & Platform Card */}
            <div className="liquid-glass border border-white/10 rounded-[2rem] aspect-[4/5] relative p-8 md:p-10 flex flex-col justify-between hover:border-white/20 transition-all duration-500 bg-gradient-to-br from-white/[0.02] to-transparent shadow-xl text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                  <Compass className="size-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-white/80 font-inter">
                    Target Users & Devices
                  </h4>
                  <span className="text-[10px] text-white/40 font-inter">Agricultural Scope</span>
                </div>
              </div>

              <div className="my-auto py-4">
                <p className="font-instrument text-xl sm:text-2xl italic leading-snug text-white/95">
                  “Built for Farmers, Farm Owners, Village Communities, and Agricultural
                  Cooperatives.”
                </p>
                <div className="h-[1px] w-full bg-white/10 my-4" />
                <ul className="space-y-4 text-xs text-white/80 font-light font-inter text-left mt-2">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Web Console</strong>
                      <span className="text-white/60 text-[11px] block mt-0.5">
                        Primary react dashboard for live monitoring and system control.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Mobile App</strong>
                      <span className="text-white/60 text-[11px] block mt-0.5">
                        Flutter notifications, detection history logs, and background voice alerts.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white font-medium block">Voice Alerts</strong>
                      <span className="text-white/60 text-[11px] block mt-0.5">
                        Simulates alarm warnings locally in Gujarati, Hindi, and English.
                      </span>
                    </div>
                  </li>
                </ul>
              </div>

              <Link
                to="/auth"
                className="flex items-center justify-between group cursor-pointer text-xs font-semibold uppercase tracking-widest text-primary/95 hover:text-primary transition-colors duration-300"
              >
                <span>Launch farmer portal</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>

            {/* Card 3: Apple-style Card (Edge Camera Hardware) */}
            <div className="liquid-glass border border-white/10 overflow-hidden rounded-[2rem] aspect-[4/5] relative group cursor-pointer shadow-xl transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-primary/[0.01]">
              <img
                src="/agrishield_camera.png"
                alt="AgriShield Edge Thermal Security Camera"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300" />

              <div className="absolute inset-0 p-8 flex flex-col justify-between text-left">
                <div className="flex justify-between items-start">
                  <span className="bg-white/10 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-primary px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1 font-inter">
                    <AlertTriangle className="size-3" />
                    Continuous CCTV Feed
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                    <ChevronRight className="size-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-instrument text-2xl md:text-3xl italic text-white leading-tight">
                    Smart Edge Nodes
                  </h3>
                  <p className="text-white/80 text-xs mt-2.5 leading-relaxed font-light font-inter">
                    Edge computing camera nodes run local vision model cycles, optimizing detection
                    pipelines without relying on active cloud latency.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub showcase: village network & smart recommendations strip */}
          <div
            className="mt-8 liquid-glass border border-white/10 rounded-[2rem] overflow-hidden flex flex-col md:flex-row hover:border-white/20 transition-all duration-500 shadow-xl group"
            id="community"
          >
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between text-left">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary block mb-2 font-inter">
                  Collaborative Safety Network
                </span>
                <h3 className="font-instrument text-3xl sm:text-4xl md:text-5xl italic text-white leading-tight">
                  Village Safety Network
                </h3>
                <p className="text-white/80 text-xs md:text-sm font-light mt-4 leading-relaxed font-inter">
                  Protecting fields requires community alignment. When an intrusion is captured at
                  Farm A, AgriShield AI logs the incident and broadcasts nearby warnings instantly.
                  Farmers are informed of movements, arrival directions, and estimated arrival times
                  (e.g. 700 meters away, arriving in 12 minutes).
                </p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-inter font-light text-white/80">
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 transition-colors hover:bg-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-destructive pulse-dot flex-shrink-0" />
                      <strong className="text-white font-semibold uppercase text-[10px] tracking-wider">
                        Wild Boar / Monkey
                      </strong>
                    </div>
                    Activates loud acoustic sirens and high-intensity strobe lights.
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 transition-colors hover:bg-white/[0.05]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 flex-shrink-0" />
                      <strong className="text-white font-semibold uppercase text-[10px] tracking-wider">
                        Cow / Buffalo
                      </strong>
                    </div>
                    Activates soft acoustic voice warnings to clear cattle harmlessly.
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-10 flex flex-wrap gap-4 items-center">
                <Button
                  asChild
                  className="px-8 py-6 rounded-full text-xs font-semibold uppercase tracking-widest inline-flex"
                >
                  <Link to="/community">
                    Join Safety Network
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-[6px]" />
                  </Link>
                </Button>
                <Link
                  to="/detection"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors duration-300"
                >
                  <span>Deterrent Sourcing Guide</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 min-h-[350px] relative overflow-hidden flex flex-col">
              <img
                src="/agrishield_village.png"
                alt="Gujarat Farmers Community Network"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />

              {/* Overlay with a simulated floating alarm card */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-20 flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 px-3.5 py-2.5 rounded-xl backdrop-blur-md self-start text-xs font-bold text-red-300 shadow-lg shadow-black/25">
                  <Bell className="size-4 animate-bounce" />
                  <span>ALERT BROADCASTED: Farm A (Gujarat)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub showcase 2: deterrent hardware */}
          <div className="mt-8 grid md:grid-cols-[1.5fr_2fr] gap-6 text-left">
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] md:aspect-auto min-h-[280px] border border-white/10 group shadow-xl">
              <img
                src="/agrishield_siren.png"
                alt="Active deterrent siren in field"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 font-inter text-xs text-white/90 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 pulse-dot" />
                Active Strobe Deterrent System
              </div>
            </div>

            <div className="liquid-glass border border-white/10 rounded-[2rem] p-8 md:p-12 flex flex-col justify-between hover:border-white/20 transition-all duration-500 bg-gradient-to-br from-white/[0.01] to-transparent shadow-xl">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary block mb-2 font-inter">
                  System Control Logic
                </span>
                <h3 className="font-instrument text-3xl sm:text-4xl italic text-white leading-tight">
                  Dynamic Deterrent Responses
                </h3>
                <p className="text-white/70 text-xs md:text-sm font-light mt-4 leading-relaxed font-inter">
                  Deterrents are controlled directly from the security engine switch. When enabled,
                  detection feeds command siren decibels and light toggles based on the identified
                  species.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-inter font-light text-white/80">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                    <span className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-bold font-inter">
                      Idle Reminder
                    </span>
                    If disabled over 4 hrs, alerts notify operators to reactivate monitoring loops.
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5">
                    <span className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-bold font-inter">
                      Deterrent Log
                    </span>
                    Suggested configurations: Sirens, Flash Lights, or acoustic warnings.
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white cursor-pointer transition-colors duration-300">
                <span>View control module specs</span>
                <ArrowRight className="size-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER & BRAND SHOWCASE */}
      <footer className="bg-[#050304] border-t border-white/5 pt-20 pb-0 relative z-30 font-inter text-left">
        <div className="max-w-[90%] md:max-w-7xl mx-auto px-4 md:px-8">
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 md:gap-8 mb-16">
            {/* Column 1: Brand Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary border border-primary/20">
                  <ShieldCheck className="size-4" />
                </span>
                <span className="font-['Space_Grotesk'] font-bold text-base tracking-tight text-white">
                  AgriShield <span className="text-primary font-normal">AI</span>
                </span>
              </div>
              <p className="text-white/60 text-xs md:text-sm font-light max-w-sm leading-relaxed">
                The premium crop protection network for the modern era. We build intelligent edge
                systems and high-performance networks that empower farmers worldwide.
              </p>
              <div className="text-[10px] text-white/40 tracking-wider uppercase mt-4">
                © {new Date().getFullYear()} AGRISHIELD AI. Crafted in Surat, India.
              </div>
            </div>

            {/* Column 2: Modules */}
            <div className="flex flex-col gap-4">
              <h6 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Services</h6>
              <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/60 font-light">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Animal Detection
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="hover:text-primary transition-colors duration-300">
                    Detection History
                  </Link>
                </li>
                <li>
                  <Link to="/heatmap" className="hover:text-primary transition-colors duration-300">
                    Heatmap Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/community"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Community Feed
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform */}
            <div className="flex flex-col gap-4">
              <h6 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Company</h6>
              <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/60 font-light">
                <li>
                  <a href="#overview" className="hover:text-primary transition-colors duration-300">
                    Our Vision
                  </a>
                </li>
                <li>
                  <a href="#modules" className="hover:text-primary transition-colors duration-300">
                    Hardware Specs
                  </a>
                </li>
                <li>
                  <a
                    href="#community"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Gujarat Pilot
                  </a>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Policies */}
            <div className="flex flex-col gap-4">
              <h6 className="text-xs uppercase tracking-[0.25em] font-bold text-white">Policies</h6>
              <ul className="flex flex-col gap-3 text-xs md:text-sm text-white/60 font-light">
                <li>
                  <a href="#privacy" className="hover:text-primary transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-primary transition-colors duration-300">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Giant Text Banner - Spanning full viewport width with increased visibility */}
        <div className="w-full overflow-hidden select-none pointer-events-none mt-4 text-center pb-[35px] md:pb-[50px] lg:pb-[80px]">
          <h1 className="font-['Space_Grotesk'] font-black tracking-tighter leading-none text-center select-none uppercase text-[15vw] bg-gradient-to-t from-primary via-primary/70 to-primary/10 bg-clip-text text-transparent opacity-95">
            AGRISHIELD AI
          </h1>
        </div>
      </footer>

      {/* Floating Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed z-50 bottom-5 right-5 md:bottom-6 md:right-6 lg:bottom-8 lg:right-8 w-14 h-14 rounded-full bg-[#A3E635] text-[#07111F] flex items-center justify-center shadow-[0_8px_30px_rgba(163,230,53,0.3)] hover:shadow-[0_8px_35px_rgba(163,230,53,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0608] focus-visible:ring-[#A3E635] group"
            whileHover={{ y: -4, scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Scroll to top"
          >
            <ArrowUp className="size-6 transition-transform duration-300 group-hover:-translate-y-1" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
