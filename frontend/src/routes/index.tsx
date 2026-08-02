import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowUp,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
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
