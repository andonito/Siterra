import React, { useState, useRef } from "react";
import { ExternalLink, Copy, Check, Eye, Sparkles, TrendingUp, Cpu, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PortfolioItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  videoUrl?: string;
  liveUrl: string;
  metrics: {
    label: string;
    value: string;
  }[];
  features: string[];
  accentColor: string;
  isReal: boolean;
}

const PORTFOLIO_SITES: PortfolioItem[] = [
  {
    id: "tinting-site",
    name: "ASAP Window Tinting",
    category: "Window Tinting Platform",
    tagline: "Prestige Nano-Ceramic Window Protection Studio",
    description: "A gorgeous, high-contrast digital darkroom experience engineered specifically for window tinting services. Features click-to-call mobile shortcuts, custom service tiers, and interactive shade simulators that boost contract sizes on auto make selection.",
    videoUrl: "https://res.cloudinary.com/dhf8b2oeg/video/upload/q_auto/f_auto/v1781208073/Recording_2026-06-11_155558_occ3xa.mp4",
    liveUrl: "https://taupe-dusk-bf215b.netlify.app/",
    metrics: [
      { label: "Mobile-first layout", value: "Verified Active" },
      { label: "Click-to-call CTA", value: "Direct Tap" },
      { label: "Quote form ready", value: "Integrated" }
    ],
    features: ["Nano-Ceramic Shade Selector", "Automotive Schema Integration", "Netlify Edge Deployment", "Instant Lead Alerts"],
    accentColor: "#10B981", // Emerald
    isReal: true
  },
  {
    id: "sprinkler-site",
    name: "Overtime Solutions",
    category: "Lawn & Irrigation Site",
    tagline: "High-Performance Emergency Spray Repairs",
    description: "An emergency-optimized local services layout designed to convert stress into booked consultations. Implements multi-step client problem wizards, smart technician dispatch, and interactive coverage map nodes.",
    videoUrl: "https://res.cloudinary.com/dhf8b2oeg/video/upload/q_auto/f_auto/v1781208069/Recording_2026-06-11_155646_zzqivf.mp4",
    liveUrl: "https://overtimesolutions.netlify.app/",
    metrics: [
      { label: "Fast deployment", value: "Edge Hosted" },
      { label: "Service-area structure", value: "Local SEO" },
      { label: "Mobile-first layout", value: "Fully Fluid" }
    ],
    features: ["Pre-Qualified Intake Form", "Localized Map Dispatchers", "Direct CRM Stream", "Click-to-Call Emergency Dialer"],
    accentColor: "#2563FF", // Cobalt Blue
    isReal: true
  }
];

export default function LivePortfolio() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [fullscreenVideoUrl, setFullscreenVideoUrl] = useState<string | null>(null);

  const handleCopyLink = (item: PortfolioItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = item.isReal ? item.liveUrl : window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="w-full space-y-14">
      {/* 2. Portfolio Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto relative">
        <div className="absolute inset-x-0 -top-12 h-px bg-white/5 pointer-events-none" />

        {PORTFOLIO_SITES.map((site) => {
          const isCopied = copiedId === site.id;
          const isHovered = hoveredCardId === site.id;

          return (
            <motion.div
              key={site.id}
              className="bg-[#0E1117]/85 border border-white/6 hover:border-white/12 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-2xl relative group"
              onMouseEnter={() => setHoveredCardId(site.id)}
              onMouseLeave={() => setHoveredCardId(null)}
              layoutId={`card-${site.id}`}
            >
              <div className="space-y-5">
                {/* Visual Media Wrapper */}
                <div className="relative aspect-[16/10] bg-[#05070A] overflow-hidden border-b border-white/5">
                  {/* Fake Browser Chrome */}
                  <div className="absolute top-0 inset-x-0 h-7 bg-[#0E1117] flex items-center justify-between px-3.5 z-20 border-b border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FF5F56]" />
                      <span className="w-2 h-2 rounded-full bg-[#FFBD2E]" />
                      <span className="w-2 h-2 rounded-full bg-[#27C93F]" />
                    </div>
                    <span className="text-[9.5px] text-[#A5ACB8]/70 font-mono tracking-tight select-none">
                      {site.isReal ? site.liveUrl.replace("https://", "") : "siterra.co/verdant"}
                    </span>
                    <span className="w-4 h-4" />
                  </div>

                  {/* HTML5 Video Layer */}
                  {site.videoUrl ? (
                    <div className="w-full h-full pt-7 relative">
                      <video
                        src={site.videoUrl}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                      
                      {/* Playback Darkening Overlay with Controls when Hovered */}
                      <div className="absolute inset-0 pt-7 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <button
                          onClick={() => setFullscreenVideoUrl(site.videoUrl || null)}
                          className="p-2.5 bg-black/80 hover:bg-black border border-white/10 rounded-full text-white transition-all shadow-lg text-xs font-mono font-bold flex items-center gap-1.5"
                          title="Maximize walkthrough video"
                        >
                          <Maximize2 className="w-4 h-4 text-blue-400" />
                          Expand Screen
                        </button>
                      </div>

                      {/* Video Player Floating Indicator */}
                      <span className="absolute bottom-2 left-2 bg-black/85 border border-white/10 px-2 py-0.5 rounded-md font-mono text-[8.5px] text-zinc-400 font-bold flex items-center gap-1 z-15">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                        LIVE OUTCOMES VIDEO
                      </span>
                    </div>
                  ) : (
                    /* Elegant placeholder if no video */
                    <div className="w-full h-full pt-7 relative bg-gradient-to-br from-[#0B150F] via-emerald-950/20 to-[#05070A] flex flex-col justify-center items-center p-6 text-center select-none">
                      {/* Subdued design vector graph */}
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />
                      <Sparkles className="w-8 h-8 text-[#D97706]/40 animate-pulse mb-2" />
                      <span className="text-xs font-mono font-bold text-[#D97706] uppercase tracking-widest block">Client Quality Sandbox</span>
                      <p className="text-[10px] text-zinc-500 max-w-xs mt-1">Design in active review with property estimator algorithms active below.</p>
                      
                      <span className="absolute bottom-2 left-2 bg-black/80 border border-white/5 px-2 py-0.5 rounded-md font-mono text-[8.5px] text-[#D97706]/85 font-bold">
                        DRAFT SIMULATION
                      </span>
                    </div>
                  )}

                  {/* Floating Highlight Category */}
                  <span className="absolute top-10 right-2 bg-black/80 border border-white/10 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase py-0.5 px-2.5 rounded-md shadow z-15">
                    {site.category}
                  </span>
                </div>

                {/* Info block */}
                <div className="px-6 space-y-4 text-left">
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-lg text-white">
                      {site.name}
                    </h3>
                    <p className="text-xs font-bold text-blue-500 font-mono uppercase tracking-wider">
                      {site.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-[#A5ACB8] leading-relaxed">
                    {site.description}
                  </p>

                  {/* Core Metrics strip */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-white/5">
                    {site.metrics.map((metric, i) => (
                      <div key={i} className="text-center">
                        <div className="font-mono text-xs font-bold text-white tracking-tight">
                          {metric.value}
                        </div>
                        <div className="text-[9.5px] font-mono text-zinc-500 uppercase">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Core Technical Highlights */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold block">
                      CORE TECHNOLOGY INTEGRATIONS
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {site.features.slice(0, 3).map((feat, i) => (
                        <span
                          key={i}
                          className="text-[9.5px] font-mono font-medium text-zinc-300 bg-white/[0.03] border border-white/5 py-0.5 px-2 rounded"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-5 flex items-center gap-3">
                {/* View live button */}
                {site.isReal ? (
                  <a
                    href={site.liveUrl}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    className="flex-1 py-2.5 px-4 bg-white hover:bg-zinc-200 text-[#05070A] font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <span>Visit Live Site</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <a
                    href={site.liveUrl}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 hover:border-blue-500/40 text-blue-300 font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.querySelector(site.liveUrl);
                      if (target) target.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span>Test Local Estimate</span>
                    <Cpu className="w-3.5 h-3.5" />
                  </a>
                )}

                {/* Share Link button */}
                <button
                  onClick={(e) => handleCopyLink(site, e)}
                  className="py-2.5 px-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 rounded-xl text-zinc-300 hover:text-white transition-all flex items-center justify-center cursor-pointer min-w-10 relative"
                  title="Copy link to deployment"
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        className="text-emerald-400 shrink-0 flex items-center gap-1 text-[10px] font-mono font-bold"
                      >
                        <Check className="w-4 h-4 shrink-0" />
                        <span>Link Saved!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        className="shrink-0 flex items-center gap-1 text-[10px] font-mono"
                      >
                        <Copy className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>Copy Link</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* walk-through video expansion overlay */}
      <AnimatePresence>
        {fullscreenVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Click to close backdrop */}
            <div className="absolute inset-0" onClick={() => setFullscreenVideoUrl(null)} />
            
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl aspect-video bg-[#0E1117] rounded-3xl border border-white/15 overflow-hidden shadow-2xl flex flex-col justify-between z-10"
            >
              {/* Media Player Header */}
              <div className="bg-[#05070A] h-12 flex items-center justify-between px-6 border-b border-white/5">
                <span className="font-mono text-xs font-bold text-zinc-400 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500 animate-pulse" /> Siterra HD Walkthrough Reader
                </span>
                <button
                  onClick={() => setFullscreenVideoUrl(null)}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-white font-mono text-xs font-bold leading-none cursor-pointer"
                >
                  CLOSE DIALOG
                </button>
              </div>

              {/* Fullscreen HTML5 Video */}
              <div className="flex-1 bg-black">
                <video
                  src={fullscreenVideoUrl}
                  className="w-full h-full"
                  autoPlay
                  muted
                  controls
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
