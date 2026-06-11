import React, { useState, useEffect } from "react";
import * as Lucide from "lucide-react";
import { 
  Menu, 
  X, 
  ArrowRight, 
  PhoneCall, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Smartphone, 
  Search, 
  Zap, 
  Calendar, 
  ShieldCheck, 
  ArrowUpRight,
  TrendingUp,
  ChevronDown,
  Mail,
  Shield,
  Star,
  Activity,
  Award,
  Cpu
} from "lucide-react";

import SiterraLogo from "./components/SiterraLogo";
import DemoDeviceSimulator from "./components/DemoDeviceSimulator";
import LivePortfolio from "./components/LivePortfolio";
import PackageCalculator from "./components/PackageCalculator";
import LeadModal from "./components/LeadModal";
import Magnet from "./components/Magnet";
import AnimatedText from "./components/AnimatedText";
import MarqueeSection from "./components/MarqueeSection";
import Floating3DObject from "./components/Floating3DObject";
import { PROBLEM_CARDS, SERVICES, PACKAGES, CARE_PLANS, FAQS } from "./data";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSubject, setModalSubject] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState("tinting");

  // Track window scroll for glass navbar effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openConsultation = (subject: string) => {
    setModalSubject(subject);
    setIsModalOpen(true);
    setMobileMenuOpen(false);
  };

  // Helper to map icon strings to Lucide elements
  const renderServiceIcon = (iconName: string) => {
    const IconComponent = (Lucide as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5 text-blue-500" />;
    }
    return <Sparkles className="w-5 h-5 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-white selection:bg-blue-600 selection:text-white overflow-hidden font-sans">
      {/* 1. STICKY GLASS HEADER */}
      <header
        id="site-header"
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          scrolled 
            ? "bg-[#05070AD0]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-black/20" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#hero" className="hover:opacity-90 transition-opacity">
            <SiterraLogo />
          </a>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A5ACB8]">
            <a href="#work" className="hover:text-blue-600 transition-colors">Demo Sites</a>
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#process" className="hover:text-blue-600 transition-colors">Process</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          {/* Call-to-action on right */}
          <div className="hidden md:flex items-center gap-4">
            <Magnet padding={100} strength={3}>
              <button
                onClick={() => openConsultation("Header - Book a Call")}
                className="px-6 py-2.5 bg-white text-[#05070A] text-sm font-bold rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-lg cursor-pointer"
              >
                Book a Call
              </button>
            </Magnet>
          </div>

          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#A5ACB8] hover:text-white p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/10"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile slide-out menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[60px] bg-[#0E1117] border-b border-white/8 shadow-2xl p-6.5 space-y-5 flex flex-col z-50 animate-slideDown">
            <div className="grid grid-cols-2 gap-3.5">
              <a 
                href="#work" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-[#05070A] border border-white/5 rounded-xl text-center font-display font-bold text-sm hover:border-blue-500 transition-colors"
              >
                Demo Sites
              </a>
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-[#05070A] border border-white/5 rounded-xl text-center font-display font-bold text-sm hover:border-blue-500 transition-colors"
              >
                Services
              </a>
              <a 
                href="#pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-[#05070A] border border-white/5 rounded-xl text-center font-display font-bold text-sm hover:border-blue-500 transition-colors"
              >
                Pricing
              </a>
              <a 
                href="#process" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-[#05070A] border border-white/5 rounded-xl text-center font-display font-bold text-sm hover:border-blue-500 transition-colors"
              >
                Process
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 bg-[#05070A] border border-white/5 rounded-xl col-span-2 text-center font-display font-bold text-sm hover:border-blue-500 transition-colors"
              >
                FAQ
              </a>
            </div>
            
            <div className="space-y-3 pt-3.5 border-t border-white/5">
              <button
                onClick={() => openConsultation("Mobile Menu Book Direct")}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-center cursor-pointer shadow-md"
              >
                Book Free Strategy Call
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const el = document.getElementById("work");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full bg-transparent text-zinc-400 font-bold py-3 rounded-xl text-xs font-mono uppercase tracking-wider border border-white/10 text-center hover:text-white"
              >
                View Live Mockups
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section
        id="hero"
        className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden flex items-center"
      >
        {/* Soft blue glowing cosmic accents behind hero */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#155BFF]/10 rounded-full blur-[140px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" aria-hidden="true" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#3B82F6]/5 rounded-full blur-[100px] pointer-events-none animate-pulse-glow" aria-hidden="true" />
        
        {/* Absolute Grid overlay backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.015)_1px,_transparent_1px)] bg-[size:48px_48px] mask-radial opacity-60 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12.5 items-center">
            
            {/* Left Column Copy */}
            <div className="lg:col-span-7 text-left space-y-6.5">
              {/* Premium Tech Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-900/15 border border-blue-500/12 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">
                  Premium Web Design Agency
                </span>
              </div>

              {/* Confident, direct-response headline */}
              <h1 className="font-display font-extrabold text-4.5xl sm:text-5.5xl lg:text-6xl tracking-tight leading-[1.05] text-white">
                Websites that make local businesses look like the <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">obvious choice.</span>
              </h1>

              {/* Clear premium sub-headline text */}
              <p className="text-[#A5ACB8] text-base sm:text-lg leading-relaxed max-w-2xl">
                Siterra builds premium, conversion-focused websites for service businesses that want to look more trusted, generate better leads, and stand out from outdated competitors.
              </p>

              {/* Conversion Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Magnet padding={180} strength={4}>
                  <button
                    onClick={() => openConsultation("Hero - Book a Strategy Call")}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-7.5 rounded-xl text-sm font-mono tracking-wider uppercase transition-all shadow-[0_4px_24px_rgba(37,99,255,0.3)] hover:shadow-[0_4px_36px_rgba(37,99,255,0.55)] cursor-pointer flex items-center justify-center gap-2 group hover:scale-[1.01]"
                  >
                    Book a Free Website Strategy Call
                    <ArrowRight className="w-4.5 h-4.5 text-white transition-transform group-hover:translate-x-1" />
                  </button>
                </Magnet>
                
                <Magnet padding={120} strength={3}>
                  <a
                    href="#work"
                    className="bg-transparent border border-white/12 text-zinc-300 hover:text-white hover:bg-white/5 font-bold py-4 px-7 text-center rounded-xl text-sm font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    View Demo Sites
                  </a>
                </Magnet>
              </div>

              {/* Trust badges below buttons */}
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3.5">
                  The Siterra Standard:
                </p>
                <div className="flex flex-wrap gap-x-6.5 gap-y-3.5 text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Live Demo Sites Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Mobile-First Build
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Lead Capture Forms
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Fast Hosting
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-blue-500" /> Local SEO Structure
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column Visual Mockup Stack */}
            <div className="hidden sm:block lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] opacity-20 pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
                
                {/* Floating Lead Card */}
                <div className="absolute -top-10 -right-8 w-48 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl rotate-3 z-20 hidden sm:block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-[10px] uppercase font-bold text-white">New</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#A5ACB8] font-medium uppercase">New Lead Captured</p>
                      <p className="text-xs font-bold text-white font-sans">James Miller</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-600"></div>
                  </div>
                  <p className="text-[9px] mt-2 text-[#A5ACB8]">Project Value: $5,000+</p>
                </div>

                {/* Floating Tags */}
                <div className="absolute top-[20%] -left-12 bg-blue-500 px-4 py-2 rounded-full font-bold text-xs shadow-lg -rotate-6 z-20 hidden sm:block">Conversion Optimized</div>
                <div className="absolute bottom-16 -right-12 bg-[#05070A] border border-white/10 px-4 py-2 rounded-full font-bold text-xs shadow-lg z-20 hidden sm:block">Local SEO Ready</div>

                {/* Primary Mockup Panel (Glass card stack represents client dashboard) */}
                <div className="hidden sm:block bg-[#0E1117] border border-white/10 rounded-2xl p-5 shadow-2xl transform lg:rotate-2 hover:rotate-0 transition-transform duration-500 relative z-15 backdrop-blur-md">
                  {/* Dashboard Header decoration */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4.5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                        <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                        <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">https://tradeportal.siterra.co</span>
                    </div>
                    <span className="text-[9px] font-mono bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-600/15 font-bold">LIVE CORE</span>
                  </div>

                  {/* Dashboard stat counters representing incoming calls/leads */}
                  <div className="space-y-3 text-left">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#05070A] border border-white/5 rounded-xl p-3">
                        <span className="text-[9.5px] font-mono text-zinc-500 tracking-wider font-bold">PREMIUM CALLS</span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="font-mono text-xl font-black text-white">48</span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold">Active</span>
                        </div>
                      </div>
                      <div className="bg-[#05070A] border border-white/5 rounded-xl p-3">
                        <span className="text-[9.5px] font-mono text-zinc-500 tracking-wider font-bold">NEW LEADS</span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="font-mono text-xl font-black text-white">82</span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold">Active</span>
                        </div>
                      </div>
                    </div>

                    {/* New real-time lead alert item simulation */}
                    <div className="bg-[#10B981]/5 border border-[#10B981]/15 rounded-xl p-3 flex items-start gap-3 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 bg-[#10B981] text-black font-mono text-[8.5px] font-bold px-2 py-0.5 rounded-bl">SECURED</div>
                      
                      <div className="bg-[#10B981]/10 text-[#10B981] p-1.5 rounded-lg shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div className="text-xs shrink-0">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-wider block">Sample Lead Dashboard</span>
                        <span className="font-bold text-white block mt-0.5">ASAP Window Tinting</span>
                        <span className="text-zinc-400 text-[10px] block font-mono">Quote Request Ready</span>
                      </div>
                    </div>

                    {/* Secondary lead alert item */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-bold text-white">Overtime Solutions</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">Mobile-First Layout</span>
                    </div>

                    {/* Network performance ticker */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-blue-600" /> Fast Hosting Ready
                      </span>
                      <span className="text-emerald-400 font-bold">Local SEO Structure</span>
                    </div>
                  </div>
                </div>

                {/* Secondary Offset decorative graphics */}
                <div className="absolute -top-6 -left-6 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-6 w-56 bg-[#0E1117] border border-blue-600/30 p-4 rounded-2xl shadow-2xl -rotate-2 z-20 hidden sm:block">
                  <div className="flex justify-between items-end gap-2 h-12 mb-2">
                    <div className="w-4 h-6 bg-white/5 rounded-sm"></div>
                    <div className="w-4 h-8 bg-white/5 rounded-sm"></div>
                    <div className="w-4 h-12 bg-blue-600 rounded-sm shadow-[0_0_10px_rgba(21,91,255,0.5)]"></div>
                    <div className="w-4 h-10 bg-[#10B981] rounded-sm"></div>
                    <div className="w-4 h-4 bg-white/5 rounded-sm"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-[#A5ACB8]">LEAD FLOW</p>
                    <p className="text-xs font-bold text-emerald-400">Optimized</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section
        id="problem"
        className="py-20 lg:py-28 bg-[#0E1117] border-y border-white/5 relative"
      >
        {/* Floating Corner 3D Objects */}
        <Floating3DObject type="glass" className="absolute top-[6%] right-[4%] w-20 sm:w-28 md:w-32 opacity-40 xl:opacity-90 z-10" duration={6.5} delay={0.4} />
        <Floating3DObject type="group" className="absolute bottom-[8%] left-[3%] w-24 sm:w-32 md:w-36 opacity-40 xl:opacity-90 z-10" duration={7.5} delay={1.1} />

        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16.5">
            <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase">The Harsh Reality</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4.2xl text-white tracking-tight">
              Most businesses lose trust before customers ever call.
            </h2>
            <p className="text-[#A5ACB8] text-base leading-relaxed">
              Your website is often the first impression people get of your business. If it looks outdated, slow, confusing, or generic, potential customers may choose a competitor before you ever get the chance to speak with them.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
            {PROBLEM_CARDS.map((card, i) => (
              <div
                key={i}
                className="bg-[#05070A] border border-white/8 rounded-2xl p-6.5 text-left flex flex-col justify-between space-y-6 hover:border-white/15 transition-all hover:scale-[1.015] shadow-xl relative overflow-hidden group"
              >
                {/* Visual number design on backing */}
                <div className="absolute -top-6 -right-2 text-8xl font-mono font-black text-white/[0.02] select-none pointer-events-none transition-all group-hover:text-blue-500/[0.03]">
                  {card.number}
                </div>

                <div className="space-y-4">
                  {/* Metric pill */}
                  <div className="inline-flex py-1 px-2.5 bg-red-950/20 border border-red-500/12 text-red-400 font-mono text-[9.5px] font-bold rounded">
                    {card.metric}
                  </div>

                  <h3 className="font-display font-bold text-lg text-white">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#A5ACB8] leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-3.5 text-[10.5px] font-mono tracking-wide text-red-400/80 font-bold block">
                  {card.impact}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-[#05070A] border border-white/10 rounded-2xl max-w-3xl mx-auto">
              <span className="font-mono text-xs text-blue-400 font-bold uppercase tracking-wider">The Siterra Shield</span>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-xl text-center sm:text-left">
                <strong>Siterra fixes that.</strong> We build websites designed to look premium, load fast, and turn visitors into real conversations. Look trusted before they call.
              </p>
              <button
                onClick={() => openConsultation("Problem Section - Fix My Conversions")}
                className="text-xs font-mono font-bold bg-white text-[#05070A] px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors shrink-0 cursor-pointer"
              >
                Look Trusted Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE GALLERY SECTION */}
      <MarqueeSection />

      {/* 4. PORTFOLIO / DEMO SITES SECTION */}
      <section
        id="work"
        className="py-20 lg:py-28 relative bg-[#05070A]"
      >
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-20">
          
          {/* Subsection 1: Real-World Client Success Stories & Deployments */}
          <div className="space-y-12">
            <div className="max-w-3xl mx-auto space-y-4">
              <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" /> Live Client Showcases
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4.2xl text-white tracking-tight leading-[1.1]">
                Live demo websites built for service businesses.
              </h2>
              <p className="text-[#A5ACB8] text-sm sm:text-base leading-relaxed">
                Explore premium website demos for window tinting, sprinkler repair, landscaping, and other local service businesses. Each demo is designed to look modern, load fast, and make it easy for customers to call or request a quote.
              </p>
            </div>

            {/* Render the incredible LivePortfolio Grid with hover-autoplay showcase videos */}
            <LivePortfolio strokeColor="blue" />
          </div>

          {/* Separation line spacer */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-white/5" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#05070A] px-4 font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                Interactive Engineering Lab
              </span>
            </div>
          </div>

          {/* Subsection 2: Interactive Live Mobile Device Spec Simulators */}
          <div className="space-y-12">
            <div className="max-w-3xl mx-auto space-y-3">
              <span className="font-mono text-xs font-bold text-indigo-400 tracking-widest uppercase flex items-center justify-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-400" /> Interactive Previews
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
                See how a modern service website can guide visitors toward a call or quote request.
              </h3>
              <p className="text-[#A5ACB8] text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
                Test custom interactive elements such as tint match sliders, emergency diagnostic panels, and property area estimators.
              </p>
            </div>

            {/* Embed the majestic interactive device visualizer */}
            <DemoDeviceSimulator 
              initialDemoId={selectedDemoId}
              onOpenConsultation={(subject) => openConsultation(subject)} 
            />
          </div>

        </div>
      </section>

      {/* 5. SERVICES SECTION */}
      <section
        id="services"
        className="py-20 lg:py-28 bg-[#0E1117] border-y border-white/5 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16.5">
            <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase">The Siterra Arsenal</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4.2xl text-white tracking-tight">
              Everything your business website needs to look premium and convert.
            </h2>
            <p className="text-[#A5ACB8] text-base leading-relaxed">
              We do not build generic landing pages. We build complete digital trust systems connected to your customer pipeline.
            </p>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6.5">
            {SERVICES.map((service, i) => (
              <div
                key={i}
                className="bg-[#05070A] border border-white/6 rounded-2xl p-6 text-left flex flex-col justify-between space-y-5 hover:border-blue-500/20 transition-all hover:scale-[1.01] shadow-lg group relative"
              >
                {/* Background glow when parent hovered */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-600/0 to-blue-600/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                <div className="space-y-3.5 relative z-10">
                  {/* Header row */}
                  <div className="flex items-center justify-between">
                    <div className="bg-blue-600/10 border border-blue-500/15 p-2 rounded-xl text-blue-400">
                      {renderServiceIcon(service.icon)}
                    </div>
                    <span className="font-mono text-[9.5px] font-bold text-zinc-500 uppercase tracking-widest bg-white/[0.02] border border-white/5 py-1 px-2.1 rounded">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#A5ACB8] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2 text-right relative z-10">
                  <button
                    onClick={() => openConsultation(`Service Inquiry: ${service.title}`)}
                    className="text-[10.5px] font-mono text-[#A5ACB8] group-hover:text-blue-400 transition-all font-bold flex items-center justify-end gap-1"
                  >
                    Ask About This <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY SITERRA SECTION */}
      <section
        id="why-us"
        className="py-20 lg:py-28 bg-[#05070A] relative"
      >
        {/* Floating Corner 3D Objects */}
        <Floating3DObject type="moon" className="absolute top-[8%] left-[2%] w-24 sm:w-32 md:w-36 opacity-40 xl:opacity-90 z-10" duration={6} delay={0.2} />
        <Floating3DObject type="lego" className="absolute bottom-[10%] right-[3%] w-24 sm:w-32 md:w-36 opacity-40 xl:opacity-90 z-10" duration={7} delay={0.8} />

        <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12.5 items-center">
            
            {/* Left Side big branding statement */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase">The Difference is Architecture</span>
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-[1.08]">
                Built like a premium brand.<br />Structured like a sales tool.
              </h2>
              <AnimatedText 
                text="Most web agencies construct beautiful designs that load slowly, or ugly pages that rank well but generate zero customer actions. Siterra represents the synthesis of elegant visual prestige and tactical, conversion-dense copy. Let's build something incredible together!"
                className="text-[#A5ACB8] text-sm sm:text-base leading-relaxed"
              />

              <div className="bg-gradient-to-r from-blue-950/20 to-[#0E1117] border border-white/5 rounded-2xl p-5.5 relative overflow-hidden flex items-start gap-3.5 max-w-lg">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-xl" />
                <Award className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold font-display uppercase tracking-wider text-white block">Active Service Area Strategy</span>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-normal">We design websites specifically for your service areas and sub-divisions, helping local residents identify your firm as the trusted choice.</p>
                </div>
              </div>
            </div>

            {/* Right Side points list */}
            <div className="lg:col-span-6 space-y-5 text-left">
              {[
                {
                  title: "We make your business look bigger and more trusted.",
                  desc: "We select premium display fonts, modern space alignments, and high-fidelity local photos to ensure your business immediately commands high contract sizes."
                },
                {
                  title: "We design around calls, quote requests, and conversions.",
                  desc: "Every heading and section guides the user's eye to a bold click-to-call dial, calendar integration, or localized maps trigger."
                },
                {
                  title: "We create clear service pages that explain what you do.",
                  desc: "Siterra structures distinct, clean index pages highlighting every trade branch you offer. We structure your pages to give Google clearer information about your services and service areas."
                },
                {
                  title: "We optimize the mobile experience.",
                  desc: "Most local service customers search from mobile devices. We rigorously test your website's buttons and forms on smartphones to make calling or booking effortless."
                },
                {
                  title: "We can connect forms, booking, analytics, and CRM tools.",
                  desc: "Inbound leads sync directly with tools like Jobber, Housecall Pro, Calendly, or standard email routing APIs to alert your cell in real time."
                },
                {
                  title: "We move quickly without making the final result feel rushed.",
                  desc: "By starting from refined layout modules, we deliver fully launched projects on solid schedules, double-checked for bugs."
                }
              ].map((point, index) => (
                <div
                  key={index}
                  className="bg-[#0E1117]/80 hover:bg-[#0E1117] border border-white/6 hover:border-white/12 rounded-xl p-4.5 transition-all text-left flex gap-3.5"
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 text-xs font-mono font-bold mt-1">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-white font-display uppercase tracking-wide">
                      {point.title}
                    </h3>
                    <p className="text-[11px] text-[#A5ACB8] leading-normal mt-1">
                      {point.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section
        id="pricing"
        className="py-20 lg:py-28 bg-[#0E1117] border-y border-white/5 relative"
      >
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16.5">
            <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase">Clean Spec Investment</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4.2xl text-white tracking-tight">
              Website packages built for where your business is going.
            </h2>
            <p className="text-[#A5ACB8] text-base leading-relaxed">
              Start with a simple launch site or build a premium digital presence that positions your business far above local competitors. Confident pricing for exceptional craftsmanship.
            </p>
          </div>

          {/* Pricing cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-14">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`bg-[#05070A] border rounded-2xl p-5.5 flex flex-col justify-between text-left transition-all ${
                  pkg.popular 
                    ? "border-blue-500 ring-2 ring-blue-500/20 relative shadow-[0_15px_40px_rgba(37,99,255,0.15)] scale-[1.01]" 
                    : "border-white/8 hover:border-white/12"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase py-1 px-3.5 rounded-full shadow-md animate-pulse">
                    ★ Best Brand Builder
                  </span>
                )}

                <div className="space-y-4.5">
                  <div className="leading-tight">
                    <span className="text-[10px] font-mono text-[#A5ACB8] font-bold uppercase tracking-wider block">PACK DETAILS</span>
                    <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-tight mt-0.5">
                      {pkg.name.split(" ")[1]}
                    </h3>
                  </div>

                  <p className="text-[10.5px] text-[#A5ACB8] leading-tight min-h-12">
                    {pkg.description}
                  </p>

                  <div className="border-y border-white/5 py-4 my-2 text-left">
                    <span className="text-[9.5px] font-mono text-zinc-500 block leading-none">INVESTMENT RANGE</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="font-mono text-3xl font-black text-white">{pkg.price}</span>
                      <span className="text-[10.5px] text-zinc-400 font-mono">one-time</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 block leading-none mt-1">Delivery: {pkg.deliveryTime}</span>
                  </div>

                  <ul className="space-y-2.5 my-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => openConsultation(`Pricing Pack: ${pkg.name} ($${pkg.price})`)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase text-center block transition-all cursor-pointer ${
                      pkg.popular
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
                        : "bg-white/[0.04] border border-white/10 hover:bg-white/10 text-white"
                    }`}
                  >
                    {pkg.ctaText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mb-14" id="custom-modeler">
            {/* Embed our high-converting Interactive Package Scope Modeler Calculator */}
            <PackageCalculator onOpenConsultation={(subject) => openConsultation(subject)} />
          </div>

          <div className="text-center text-xs text-[#A5ACB8] max-w-sm sm:max-w-md mx-auto leading-normal">
            Custom websites, high-end client portals, member directories, custom dashboards, local e-commerce stores, and specialty AI integrations are available starting from <strong>$20,000+</strong>.
          </div>
        </div>
      </section>

      {/* 8. CARE PLANS SECTION */}
      <section
        id="care-plans"
        className="py-20 lg:py-28 bg-[#05070A] relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16.5">
            <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase">Ongoing Diagnostics</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4.2xl text-white tracking-tight">
              Keep your website updated, protected, and improving.
            </h2>
            <p className="text-[#A5ACB8] text-base leading-relaxed">
              Never worry about hosting bills, domain keys, down-times, or text updates. Our optional monthly care systems keep your business running smoothly on autopilot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5 max-w-5xl mx-auto items-stretch">
            {CARE_PLANS.map((plan, i) => (
              <div
                key={i}
                className={`bg-[#0E1117] border rounded-2xl p-6 flex flex-col justify-between text-left transition-all ${
                  plan.badge 
                    ? "border-blue-500/60 ring-1 ring-blue-500/10 relative shadow-xl scale-[1.01]" 
                    : "border-white/5 hover:border-white/10"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 right-6 bg-blue-600 text-white font-mono text-[8.5px] font-bold tracking-widest uppercase py-0.5 px-3.5 rounded-full select-none">
                    {plan.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-baseline border-b border-white/5 pb-4.5">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-white">
                        {plan.name}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono">MANAGED SYSTEM</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xl font-black text-blue-400 block">{plan.price}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#A5ACB8] leading-normal italic min-h-11">
                    "{plan.description}"
                  </p>

                  <ul className="space-y-2.5 py-2 text-xs">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-zinc-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => openConsultation(`Care Plan: ${plan.name} (${plan.price})`)}
                    className="w-full bg-[#05070A] hover:bg-white/5 text-zinc-300 hover:text-white border border-white/10 py-3.5 rounded-xl text-xs font-mono font-bold tracking-wide uppercase text-center block transition-all"
                  >
                    Subscribe After Launch
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-11 text-center text-[10.5px] text-zinc-500 font-mono">
            *Care Plans are completely optional. Your launch includes 30 days of active diagnostic monitoring.
          </div>
        </div>
      </section>

      {/* 9. PROCESS SECTION - TIMELINE */}
      <section
        id="process"
        className="py-20 lg:py-28 bg-[#0E1117] border-y border-white/5 relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16.5">
            <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase">Velocity & Precision</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4.2xl text-white tracking-tight">
              A simple process from idea to launch.
            </h2>
            <p className="text-[#A5ACB8] text-base leading-relaxed">
              We know you are busy running a business. We structured Siterra to require less than 90 minutes of your total attention while delivering high-end results.
            </p>
          </div>

          {/* Timeline Process representation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start relative max-w-6xl mx-auto">
            {/* Connecting visual horizontal path line, hidden on mobile */}
            <div className="hidden md:block absolute top-[28px] inset-x-12 h-[2px] bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 opacity-20 pointer-events-none" />

            {[
              {
                step: "01",
                title: "Strategy",
                subtitle: "Regional Keyword Mapping",
                desc: "We analyze your top local competitors, mapping high-value keywords to ensure your layout matches specific search volumes."
              },
              {
                step: "02",
                title: "Design Direction",
                subtitle: "Prestige Visual Mockups",
                desc: "We construct original custom wireframes, copy directions, and pre-qualifying funnel layouts based strictly on target trades."
              },
              {
                step: "03",
                title: "Build",
                subtitle: "High-Performance Code",
                desc: "Our senior developers craft responsive components in modern React environments, securing Edge CDN caches and SSL keys."
              },
              {
                step: "04",
                title: "Launch",
                subtitle: "Active CRM Integration",
                desc: "We map your domain, embed localized maps, connect quote webhooks, and trigger testing scripts before turning on leads."
              }
            ].map((node, index) => (
              <div
                key={index}
                className="bg-[#05070A] border border-white/5 hover:border-white/10 rounded-2xl p-5.5 text-left space-y-3 relative z-10 transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between min-h-64"
              >
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-2xl font-black text-blue-500 bg-blue-500/10 px-3 py-1 rounded-lg">
                      {node.step}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-wider">STAGE {index + 1}</span>
                  </div>

                  <h3 className="font-display font-bold text-base text-white mt-1">
                    {node.title}
                  </h3>
                  <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-blue-400">
                    {node.subtitle}
                  </div>
                  <p className="text-xs text-[#A5ACB8] leading-relaxed">
                    {node.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 max-w-xl mx-auto p-4 bg-[#05070A]/80 border border-white/5 rounded-xl text-center text-xs text-[#A5ACB8]">
            ⚠️ <strong>Scope timelines:</strong> Siterra 'Launch' single pages deploy in 3-5 business days. Larger multi-page pipelines require 3-4 weeks. Launch schedule depends heavily on asset delivery.
          </div>
        </div>
      </section>

      {/* 10. COMPARISON SECTION */}
      <section
        id="comparison"
        className="py-20 lg:py-28 bg-[#05070A] relative"
      >
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-blue-900/5 rounded-full blur-[140px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16.5">
            <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase">The Contrast Matrix</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4.2xl text-white tracking-tight">
              Not a basic template. Not a slow old-school agency.
            </h2>
            <p className="text-[#A5ACB8] text-base leading-relaxed">
              Traditional web processes are either cheap and amateurish, or prohibitively costly and plagued by boring, slow-moving administrative overhead. Compare Siterra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Column 1: Cheap DIY builders */}
            <div className="bg-[#05070A]/50 border border-white/5 rounded-2xl p-6.5 flex flex-col justify-between text-left opacity-75">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display font-extrabold text-base text-zinc-400">
                    Cheap Website Builders
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-zinc-500">DIY / Wix / Squarespace</p>
                </div>
                
                <ul className="space-y-3 pt-3 border-t border-white/5 text-xs text-[#A5ACB8]">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Clunky, slow-loading templates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>No professional copywriting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Weak local SEO/schema maps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Limited custom booking APIs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>You write all files yourself</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-6 border-t border-white/5 mt-4 text-[11px] font-mono text-zinc-500 text-center">
                Hidden Cost: Constant missed bookings due to look.
              </div>
            </div>

            {/* Column 2: Siterra (Premium highlighted center) */}
            <div className="bg-gradient-to-b from-[#0E1117] to-black border-2 border-blue-500 rounded-2xl p-6.5 flex flex-col justify-between text-left shadow-[0_20px_45px_rgba(37,99,255,0.18)] scale-[1.015] relative z-10 overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white font-mono text-[8px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-bl">PRO AUTHORITY</div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-white">
                    Siterra Digital
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-blue-400 font-bold">MANAGED STUDIO PIPELINE</p>
                </div>
                
                <ul className="space-y-3 pt-3 border-t border-white/5 text-xs text-zinc-100">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span className="font-bold">Original bespoke layout specs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>High-fidelity sales copywriting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>Mobile-first responsive optimization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>Deep schema local indexing structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>Housecall Pro / CRM lead hooks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span>Lifetime Edge Host scaling protocol</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-6 border-t border-white/5 mt-4 text-[11px] font-mono text-blue-400 text-center font-bold">
                Benefit: Dominant local authority instantly.
              </div>
            </div>

            {/* Column 3: Slow traditional agencies */}
            <div className="bg-[#05070A]/50 border border-white/5 rounded-2xl p-6.5 flex flex-col justify-between text-left opacity-75">
              <div className="space-y-4">
                <div>
                  <h3 className="font-display font-extrabold text-base text-zinc-400">
                    Traditional Agencies
                  </h3>
                  <p className="text-[10px] font-mono tracking-wider text-zinc-500">Old School Firms</p>
                </div>
                
                <ul className="space-y-3 pt-3 border-t border-white/5 text-xs text-[#A5ACB8]">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Often charge $15,000 to $30,000+</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Timelines stretch from 3 to 6 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Excessive meetings about design theory</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Difficult to update code afterward</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Often host on sluggish servers</span>
                  </li>
                </ul>
              </div>
              
              <div className="pt-6 border-t border-white/5 mt-4 text-[11px] font-mono text-zinc-500 text-center">
                Hidden Cost: Months of delay and missed keyword rank.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FAQ SECTION */}
      <section
        id="faq"
        className="py-20 lg:py-28 bg-[#0E1117] border-t border-white/5 relative"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-left">
          <div className="text-center space-y-4 mb-14.5">
            <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase">Answers & Logistics</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4.2xl text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5 max-w-2xl mx-auto">
            {FAQS.map((faq, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div
                  key={index}
                  className="bg-[#05070A] border border-white/6 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                    className="w-full py-4.5 px-5.5 text-left flex items-center justify-between text-white font-display font-medium text-sm sm:text-base focus:outline-none focus:bg-white/[0.01]"
                  >
                    <span className="font-semibold">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180 text-blue-500" : ""
                    }`} />
                  </button>

                  <div className={`transition-all duration-300 origin-top overflow-hidden ${
                    isOpen ? "max-h-[220px] border-t border-white/5" : "max-h-0"
                  }`}>
                    <div className="p-5.5 text-xs sm:text-sm text-[#A5ACB8] leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-[#A5ACB8] mb-3">
              Have a highly specific CRM integration question?
            </p>
            <button
              onClick={() => openConsultation("FAQ Section - Specific Query")}
              className="text-[#3B82F6] hover:text-[#2563FF] text-xs font-mono font-bold uppercase tracking-widest cursor-pointer inline-flex items-center gap-1 hover:underline"
            >
              Ask Our Lead Strategist <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 12. FINAL CLOSING HERO CONTRACT */}
      <section
        id="cta"
        className="py-24 bg-[#05070A] relative overflow-hidden"
      >
        {/* Giant glowing cobalt backdrop */}
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[500px] bg-[#2563FF]/10 rounded-full blur-[140px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
        
        {/* Absolute Grid overlay backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.01)_1px,_transparent_1px)] bg-[size:32px_32px] mask-radial opacity-60 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7 flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9.5px] font-bold rounded-full">
            <PhoneCall className="w-3 h-3 animate-bounce" /> CALL CALENDAR ACTIVE
          </div>

          <h2 className="font-display font-extrabold text-3.5xl sm:text-5xl text-white tracking-tight leading-[1.1] max-w-2xl">
            Ready to make your business look like the obvious choice?
          </h2>
          
          <p className="text-[#A5ACB8] text-sm sm:text-base leading-relaxed max-w-xl">
            Tell Siterra what you do, what you need, and where you want to go. We will help you select the exact layout specs and map local competitor keywords before our call.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4.5 w-full max-w-lg pt-2">
            <Magnet padding={120} strength={3}>
              <button
                onClick={() => openConsultation("Final CTA - Book call")}
                className="w-48 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-xl text-xs font-mono tracking-wider uppercase transition-all shadow-[0_4px_24px_rgba(37,99,255,0.3)] hover:scale-[1.01] hover:shadow-[0_4px_36px_rgba(37,99,255,0.5)] cursor-pointer"
              >
                Book Strategy Call
              </button>
            </Magnet>
            
            <Magnet padding={100} strength={3}>
              <button
                onClick={() => openConsultation("Final CTA - Quote estimate")}
                className="w-48 bg-transparent border border-white/12 text-zinc-300 hover:text-white hover:bg-white/5 font-bold py-4 px-6 rounded-xl text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
              >
                Request Website Quote
              </button>
            </Magnet>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10.5px] text-zinc-500 pt-1.5 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Siterra Studio SLA: Free competitor and website review included with every strategy call.</span>
          </div>
        </div>
      </section>

      {/* 13. PREMIUM FOOTER */}
      <footer className="bg-[#05070A] border-t border-white/8 pt-18 pb-12 relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-12">
          
          {/* Main columns */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Logo and tag line */}
            <div className="md:col-span-4 space-y-4">
              <SiterraLogo />
              <p className="text-xs text-[#A5ACB8] leading-relaxed max-w-xs">
                Premium, conversion-focused websites for service businesses that want to look trusted, modern, and ready to grow.
              </p>
              
              <div className="space-y-1 pt-1 text-xs">
                <span className="text-zinc-500 font-mono tracking-wider text-[9px] block">DIRECT BRIEFINGS</span>
                <a 
                  href="mailto:hello@siterrastudio.com"
                  className="text-[#A5ACB8] hover:text-white transition-colors font-mono font-bold block hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-500" /> hello@siterrastudio.com
                </a>
              </div>
            </div>

            {/* Quick links sitemaps */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block">Architecture</span>
              <ul className="space-y-2 text-xs text-[#A5ACB8]">
                <li><a href="#work" className="hover:text-white transition-colors">Our Work</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Studio Services</a></li>
                <li><a href="#why-us" className="hover:text-white transition-colors">Design Values</a></li>
                <li><a href="#comparison" className="hover:text-white transition-colors">The Contrast Matrix</a></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block">System Specs</span>
              <ul className="space-y-2 text-xs text-[#A5ACB8]">
                <li><a href="#pricing" className="hover:text-white transition-colors">Packages</a></li>
                <li><a href="#custom-modeler" className="hover:text-white transition-colors">Scope Modeler</a></li>
                <li><a href="#care-plans" className="hover:text-white transition-colors">Managed Protection</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">SEO FAQs</a></li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-4">
              <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest block">Connect With Siterra</span>
              <p className="text-[11px] text-zinc-400 max-w-xs leading-normal">
                Follow our design audits and local lead generation case studies on trade networks.
              </p>
              
              <div className="flex gap-4">
                <a href="#instagram" className="text-zinc-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1 hover:underline">
                  Instagram
                </a>
                <a href="#facebook" className="text-zinc-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1 hover:underline">
                  Facebook
                </a>
                <a href="#linkedin" className="text-zinc-400 hover:text-white text-xs font-mono font-bold flex items-center gap-1 hover:underline">
                  LinkedIn
                </a>
              </div>
            </div>

          </div>

          {/* Copyright line */}
          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <span>© 2026 Siterra. All rights reserved. Based in Florida. Serving local service businesses nationwide.</span>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
              <span className="font-mono text-[10px] text-zinc-600">v1.2.4 Production</span>
            </div>
          </div>

        </div>
      </footer>

      {/* 14. CLIENT INTAKE DIALOG */}
      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultSubject={modalSubject}
      />
    </div>
  );
}
