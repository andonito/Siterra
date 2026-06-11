import React, { useState } from "react";
import { DEMO_SITES } from "../data";
import { Phone, MapPin, Shield, Star, CheckCircle, Zap, Cpu, Award } from "lucide-react";

interface DemoDeviceSimulatorProps {
  initialDemoId?: string;
  onOpenConsultation: (subject: string) => void;
}

export default function DemoDeviceSimulator({
  initialDemoId = "tinting",
  onOpenConsultation,
}: DemoDeviceSimulatorProps) {
  const [activeDemoId, setActiveDemoId] = useState<string>(initialDemoId);
  const activeDemo = DEMO_SITES.find((d) => d.id === activeDemoId) || DEMO_SITES[0];

  // Tinting Interactive State
  const [tintValue, setTintValue] = useState<number>(20); // 5, 20, 35, 50
  // Sprinkler Interactive State
  const [irrigationIssue, setIrrigationIssue] = useState<string>("");
  const [irrigationLeads, setIrrigationLeads] = useState<boolean>(false);
  // Landscaping Interactive State
  const [landscapeTab, setLandscapeTab] = useState<"services" | "gallery" | "estimate">("gallery");
  const [estimateSqFt, setEstimateSqFt] = useState<number>(1500);

  // Simulated Time & Tech online
  const currentTime = "12:35 PM";

  const renderSimulatedMobileApp = () => {
    switch (activeDemoId) {
      case "tinting":
        return (
          <div className="bg-[#0A0D14] text-white h-full overflow-y-auto flex flex-col font-sans select-none scrollbar-none">
            {/* Demo Header */}
            <div className="sticky top-0 bg-[#0E121C] border-b border-emerald-500/20 px-3 py-2 flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-display font-black text-xs tracking-wider uppercase text-emerald-400">SHADEPRO</span>
              </div>
              <a href={`tel:${activeDemo.phonePlaceholder}`} className="bg-emerald-500 text-xs font-bold text-black px-2.5 py-1 rounded-md flex items-center gap-1 hover:bg-emerald-400 transition-all">
                <Phone className="w-3 h-3 fill-current" /> CALL NOW
              </a>
            </div>

            {/* Hero */}
            <div className="p-4 bg-gradient-to-b from-[#111624] to-[#0A0D14] text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
              <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-full mb-2">
                <Star className="w-2.5 h-2.5 fill-current text-emerald-400" /> #1 Tint Shop in Metro
              </div>
              <h3 className="font-display font-semibold text-lg leading-tight mb-1">
                Looks Hot. Feels Cool.
              </h3>
              <p className="text-[11px] text-[#A5ACB8] max-w-xs mx-auto mb-3">
                Lifetime-backed Nanotechnology ceramic window tinting blocks 99% UV rays and 88% solar infrared heat.
              </p>
              <button 
                onClick={() => onOpenConsultation("ASAP Window Tinting Price Plan")}
                className="w-full bg-emerald-500 text-black py-2 rounded font-bold text-xs hover:shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all"
              >
                Get Instant Tint Estimate
              </button>
            </div>

            {/* Interactive Feature: Slide Tint Viewer */}
            <div className="px-4 py-3 bg-[#0E121A] border-y border-[#1F2937] flex-1">
              <h4 className="text-xs font-mono tracking-wider text-emerald-400 uppercase mb-2">
                Interactive Tint Visualizer
              </h4>
              <p className="text-[10px] text-[#A5ACB8] mb-3">
                Drag the slider below to test legal and custom automotive shades.
              </p>

              {/* Dynamic Automotive Graphic with CSS overlays */}
              <div className="relative bg-[#182030] border border-[#374151] rounded-lg p-3 py-6 mb-3 flex flex-col items-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
                
                {/* Visual Representation of Vehicle Side glass */}
                <div className="relative w-48 h-20 mb-2">
                  {/* Car Glass Silhouette Silhouette SVG */}
                  <svg viewBox="0 0 200 80" className="w-full h-full text-zinc-600" fill="none">
                    {/* Car outline */}
                    <path d="M10 50 C20 40, 50 35, 75 35 C110 35, 140 38, 175 42 L185 58 L195 58 L195 72 L5 72 Z" fill="#0A0D15" stroke="#334155" strokeWidth="2" />
                    {/* Rear Glass Overlay with opacity based on slider */}
                    <path 
                      d="M50 42 L105 42 L105 58 L42 58 Z" 
                      fill="#030712" 
                      style={{ opacity: 1 - tintValue / 100 }} 
                      className="transition-opacity duration-200" 
                    />
                    {/* Front Glass Overlay with opacity (capped for safety) */}
                    <path 
                      d="M110 42 L150 44 L164 58 L110 58 Z" 
                      fill="#030712" 
                      style={{ opacity: Math.min(0.9, 1 - (tintValue + 15) / 100) }} 
                      className="transition-opacity duration-200" 
                    />
                    {/* Wheels */}
                    <circle cx="45" cy="70" r="12" fill="#0E121C" stroke="#475569" strokeWidth="2" />
                    <circle cx="155" cy="70" r="12" fill="#0E121C" stroke="#475569" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-1 right-2 font-mono text-[9px] px-1 bg-black/80 rounded border border-white/5">
                    Simulation Overlay
                  </div>
                </div>

                {/* Tint Info Stats */}
                <div className="w-full grid grid-cols-3 gap-2 text-center mt-1">
                  <div className="bg-[#111827] p-1.5 rounded border border-[#1F2937]">
                    <div className="text-[10px] text-zinc-500">Shade Level</div>
                    <div className="font-mono text-xs font-bold text-emerald-400">{tintValue}% VLT</div>
                  </div>
                  <div className="bg-[#111827] p-1.5 rounded border border-[#1F2937]">
                    <div className="text-[10px] text-zinc-500">UV Rejected</div>
                    <div className="font-mono text-xs font-bold text-white">99% Elite</div>
                  </div>
                  <div className="bg-[#111827] p-1.5 rounded border border-[#1F2937]">
                    <div className="text-[10px] text-zinc-500">Infrared Cut</div>
                    <div className="font-mono text-xs font-bold text-emerald-300">
                      {tintValue === 5 ? "92%" : tintValue === 20 ? "88%" : tintValue === 35 ? "82%" : "75%"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider Controller */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-[#A5ACB8] px-1">
                  <span>Light (50% VLT)</span>
                  <span>Limo Dark (5% VLT)</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  step="15" 
                  value={tintValue} 
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setTintValue(val === 50 ? 50 : val === 35 ? 35 : val === 20 ? 20 : 5);
                  }}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500" 
                />
                <div className="flex justify-around text-[9px] font-mono font-bold pt-1.5 text-zinc-400">
                  <button onClick={() => setTintValue(50)} className={`px-1.5 py-0.5 rounded ${tintValue === 50 ? "bg-emerald-500 text-black" : ""}`}>50%</button>
                  <button onClick={() => setTintValue(35)} className={`px-1.5 py-0.5 rounded ${tintValue === 35 ? "bg-emerald-500 text-black" : ""}`}>35% (Legal)</button>
                  <button onClick={() => setTintValue(20)} className={`px-1.5 py-0.5 rounded ${tintValue === 20 ? "bg-emerald-500 text-black" : ""}`}>20% (Match)</button>
                  <button onClick={() => setTintValue(5)} className={`px-1.5 py-0.5 rounded ${tintValue === 5 ? "bg-emerald-500 text-black" : ""}`}>5%</button>
                </div>
              </div>
            </div>

            {/* Quick Benefits Grid */}
            <div className="p-4 grid grid-cols-2 gap-2.5">
              <div className="bg-[#111622] p-2.5 rounded border border-[#1F2937] text-left">
                <Shield className="w-4 w-4 text-emerald-400 mb-1" />
                <div className="text-[10px] font-bold">Lifetime Warranty</div>
                <p className="text-[8.5px] text-[#A5ACB8]">No bubbling, color-change, or peeling ever.</p>
              </div>
              <div className="bg-[#111622] p-2.5 rounded border border-[#1F2937] text-left">
                <Star className="w-4 w-4 text-emerald-400 mb-1" />
                <div className="text-[10px] font-bold">Same-Day Pick Up</div>
                <p className="text-[8.5px] text-[#A5ACB8]">Drop off by 9 AM. Fully ready by 4 PM.</p>
              </div>
            </div>

            {/* Simulated Live Ratings */}
            <div className="p-3 bg-gradient-to-t from-[#0E121E] to-[#0A0D14] border-t border-[#1F2937] mt-auto text-center text-[10px] text-[#A5ACB8]">
              <div className="flex justify-center items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                ))}
                <span className="font-bold text-white ml-1">4.9 / 5.0</span>
              </div>
              <span>Based on 426 reviews in your local service area</span>
            </div>
          </div>
        );

      case "sprinkler":
        return (
          <div className="bg-slate-50 text-slate-900 h-full overflow-y-auto flex flex-col font-sans select-none scrollbar-none">
            {/* Urgent Tag banner */}
            <div className="bg-red-600 text-white text-center py-1 text-[9px] font-bold uppercase tracking-wider animate-pulse">
              🚨 Active Dispatchers in Your Area - Emergency Service Available
            </div>

            {/* Demo Header */}
            <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between sticky top-0 z-10">
              <span className="font-display font-black text-xs tracking-tight text-blue-600">OVERTIME</span>
              <a href={`tel:${activeDemo.phonePlaceholder}`} className="bg-blue-600 text-xs font-bold text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md hover:bg-blue-700 transition-all">
                <Phone className="w-3.5 h-3.5 fill-current" /> Call Dispatch
              </a>
            </div>

            {/* Hero Section */}
            <div className="p-4 bg-gradient-to-br from-blue-900 via-blue-800 to-sky-700 text-white text-center">
              <h3 className="font-display font-extrabold text-lg leading-tight mb-1">
                Broken Sprinklers? We're Already in Your Area.
              </h3>
              <p className="text-[10.5px] text-blue-150 mb-3 max-w-xs mx-auto">
                No dry lawns or high water bills. Count on five-star, fully licensed sprinkler repair & system diagnostics.
              </p>

              {/* Emergency Trust Box */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-md p-2 flex items-center justify-around text-center text-[10px] max-w-xs mx-auto">
                <div>
                  <div className="font-extrabold text-emerald-300">23 Min</div>
                  <div className="text-[9px] text-zinc-200">Avg Response</div>
                </div>
                <div className="w-[1px] h-6 bg-white/20" />
                <div>
                  <div className="font-extrabold text-emerald-300">$0 Down</div>
                  <div className="text-[9px] text-zinc-200">Trip Fee Options</div>
                </div>
                <div className="w-[1px] h-6 bg-white/20" />
                <div>
                  <div className="font-extrabold text-[#FBBF24]">★ 5.0 Rated</div>
                  <div className="text-[9px] text-zinc-200">Local Yard Standard</div>
                </div>
              </div>
            </div>

            {/* Interactive Leak Diagnostic */}
            <div className="p-4 bg-white border-b border-zinc-200 flex-1">
              <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3">
                <h4 className="text-xs font-bold text-blue-900 mb-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-blue-600 fill-current" /> Sprinkler Diagnostic Box
                </h4>
                <p className="text-[9.5px] text-slate-600 mb-3">
                  Check your current lawn symptom to request instant pricing:
                </p>

                {irrigationLeads ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded p-3 text-center my-2 text-slate-800 animate-fadeIn">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                    <div className="text-xs font-bold text-emerald-900">Diagnostic Requested!</div>
                    <p className="text-[9px] text-slate-600 mt-1">Our dispatch has reserved your zone. We will dial your number instantly.</p>
                    <button 
                      onClick={() => {
                        setIrrigationLeads(false);
                        setIrrigationIssue("");
                      }} 
                      className="mt-2 text-[9px] text-blue-600 underline font-mono cursor-pointer"
                    >
                      Reset Symptom Form
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {[
                      { key: "dry", label: "🚫 Brown Lawn Zones (No Water)" },
                      { key: "nozzle", label: "💦 Broken or Spraying Side Nozzle" },
                      { key: "puddle", label: "🌊 Puddle or Constant Water Leak" },
                      { key: "timer", label: "⏰ Master Controller display dead" }
                    ].map((issue) => (
                      <button
                        key={issue.key}
                        onClick={() => setIrrigationIssue(issue.key)}
                        className={`w-full text-left p-2 rounded text-[10px] font-medium border transition-all flex items-center justify-between ${
                          irrigationIssue === issue.key 
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                            : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span>{issue.label}</span>
                        {irrigationIssue === issue.key && <span className="font-bold text-[8px] uppercase tracking-widest bg-white/20 px-1 py-0.5 rounded">Active</span>}
                      </button>
                    ))}

                    <button
                      disabled={!irrigationIssue}
                      onClick={() => setIrrigationLeads(true)}
                      className={`w-full py-2 rounded text-xs font-bold font-mono tracking-wider transition-all mt-2.5 ${
                        irrigationIssue 
                          ? "bg-emerald-500 text-black cursor-pointer hover:bg-emerald-400" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      SUBMIT PRE-DIAGNOSIS
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Map Overlay */}
            <div className="p-3.5 bg-slate-100 flex items-center gap-2.5 border-t border-slate-200">
              <MapPin className="w-5 h-5 text-red-500 shrink-0" />
              <div className="text-left leading-tight">
                <span className="text-[10px] font-bold block">Active Local Coverage</span>
                <span className="text-[9px] text-slate-500 block">Serving downtown, surrounding suburbs, and the local metro area.</span>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="p-3 bg-slate-900 text-white text-center text-[9px] mt-auto">
              <div className="font-bold font-mono tracking-wider text-blue-400 mb-1">OVERTIME NO-CLOG GUARANTEE</div>
              <span className="text-slate-400">Licensed Contractor #C-9021. Insured for $2,000,000.</span>
            </div>
          </div>
        );

      case "landscaping":
        return (
          <div className="bg-[#050B07] text-[#ECFDF5] h-full overflow-y-auto flex flex-col font-sans select-none scrollbar-none">
            {/* Premium Header */}
            <div className="bg-[#0B150F] border-b border-[#047857]/30 px-3 py-2.5 flex items-center justify-between sticky top-0 z-10">
              <span className="font-display font-extrabold text-xs tracking-widest text-[#10B981] uppercase">VERDANT</span>
              <a href={`tel:${activeDemo.phonePlaceholder}`} className="border border-[#10B981]/60 text-[9px] font-mono font-bold text-[#10B981] px-2.5 py-1 rounded hover:bg-[#10B981] hover:text-black transition-all">
                CONSULTATION
              </a>
            </div>

            {/* Immersive Subhead */}
            <div className="p-4 py-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950 via-emerald-950 to-[#050B07] text-center border-b border-[#047857]/20">
              <h3 className="font-display font-bold text-[#F0FDF4] text-lg leading-tight mb-2">
                We design environments that increase estate value.
              </h3>
              <p className="text-[10px] text-[#A7F3D0] max-w-xs mx-auto mb-3">
                Architectural landscaping, zero-stress resort lawns, master hardscaping, and integrated backyard pool environments.
              </p>

              {/* Sub tabs in phone demo app */}
              <div className="flex bg-[#041F10] p-0.5 rounded border border-[#047857]/45 text-[10px] max-w-xs mx-auto">
                {(["gallery", "estimate", "services"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLandscapeTab(tab)}
                    className={`flex-1 py-1 rounded-sm capitalize font-bold text-[9px] tracking-wide transition-all ${
                      landscapeTab === tab 
                        ? "bg-[#10B981] text-black shadow" 
                        : "text-[#A7F3D0] hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Tab Body */}
            <div className="p-3.5 flex-1 flex flex-col">
              {landscapeTab === "gallery" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-wider text-[#10B981] uppercase">Featured Architecture Portfolio</span>
                    <h4 className="text-[11px] font-medium text-white">The Siesta Estate Backyard Oasis</h4>
                  </div>
                  
                  {/* Mock Portfolio Graphic Block */}
                  <div className="relative h-24 rounded-lg bg-[#0E2417] border border-[#047857]/30 overflow-hidden flex flex-col justify-end p-2">
                    {/* Simulated visual represent of premium garden */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    <div className="absolute inset-x-0 top-0 flex justify-between p-1">
                      <span className="text-[8px] bg-[#10B981] text-black px-1.5 py-0.5 font-bold rounded">Completed Recently</span>
                    </div>
                    {/* Simulated foliage using vectors */}
                    <svg viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 inset-x-0 w-full opacity-35 text-[#10B981]">
                      <path d="M0,30 L20,10 L30,22 L55,5 L70,18 L90,12 L100,30 Z" fill="currentColor" />
                    </svg>
                    <div className="relative z-10 text-[9px] font-bold text-white">Premium Architectural Design</div>
                  </div>

                  <p className="text-[9px] text-[#A7F3D0] italic">
                    "Siterra built this web interface containing high-resolution lazy load pictures to impress $50,000 villa design accounts."
                  </p>
                </div>
              )}

              {landscapeTab === "services" && (
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-[#10B981] tracking-wider block">Estates & Trades</span>
                  <div className="space-y-1 text-[10px]">
                    <div className="bg-[#0A2012] p-1.5 rounded border border-[#047857]/20 flex items-center justify-between">
                      <span className="font-bold">🌳 3D Backyard Architecture</span>
                      <span className="font-mono text-[8px] text-[#A7F3D0]">Full CAD Specs</span>
                    </div>
                    <div className="bg-[#0A2012] p-1.5 rounded border border-[#047857]/20 flex items-center justify-between">
                      <span className="font-bold">🪵 Hardscape Travertine Patios</span>
                      <span className="font-mono text-[8px] text-[#A7F3D0]">Turkish Stone</span>
                    </div>
                    <div className="bg-[#0A2012] p-1.5 rounded border border-[#047857]/20 flex items-center justify-between">
                      <span className="font-bold">🪴 Premium Softscapes</span>
                      <span className="font-mono text-[8px] text-[#A7F3D0]">Zoysia & Palms</span>
                    </div>
                  </div>
                </div>
              )}

              {landscapeTab === "estimate" && (
                <div className="space-y-3 bg-[#0A2012] p-3 rounded-lg border border-[#047857]/30 text-left">
                  <h5 className="text-[10px] font-bold text-emerald-400">Dynamic Area Estimator</h5>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-mono text-[#ECFDF5]/80">
                      <span>Property Size</span>
                      <span className="text-[#10B981] font-bold">{estimateSqFt.toLocaleString()} sq. ft</span>
                    </div>
                    <input 
                      type="range" 
                      min="500" 
                      max="10000" 
                      step="500" 
                      value={estimateSqFt} 
                      onChange={(e) => setEstimateSqFt(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]" 
                    />
                    <div className="bg-black/60 p-2 rounded text-center mt-1 border border-emerald-950">
                      <div className="text-[8px] text-zinc-400 font-mono">Suggested Design Investment</div>
                      <div className="font-mono font-bold text-emerald-300 text-xs mt-0.5">
                        ${(estimateSqFt * 2.8).toFixed(0)} - ${(estimateSqFt * 4.5).toFixed(0)}*
                      </div>
                      <div className="text-[7.5px] text-emerald-550 italic leading-none pt-1">*Includes custom flora specs, soil balance + mapping</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onOpenConsultation(`Landscaping Estimate (${estimateSqFt} sq ft)`)}
                    className="w-full bg-[#10B981] text-black font-bold text-[10px] py-1.5 rounded text-center hover:bg-emerald-400 transition-all font-mono"
                  >
                    Submit Scope to Designer
                  </button>
                </div>
              )}
            </div>

            {/* Simulated Live Rating */}
            <div className="p-3 bg-[#08110D] border-t border-[#047857]/20 text-center text-[9.5px]">
              <span className="font-semibold block text-white">⭐⭐⭐⭐⭐ 5-Star Architect Rating</span>
              <span className="text-zinc-400 text-[8.5px]">Ranked elite in landscaping in Florida West Coast</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Selector Strip above the device of target demographics */}
      <div className="flex flex-wrap p-1.5 bg-[#0E1117] border border-white/10 rounded-xl mb-6 gap-1 z-10 w-full max-w-lg">
        {DEMO_SITES.map((demo) => (
          <button
            key={demo.id}
            onClick={() => setActiveDemoId(demo.id)}
            className={`flex-1 py-2 px-3 text-xs rounded-lg transition-all font-display font-medium text-center flex items-center justify-center gap-1.5 ${
              activeDemoId === demo.id
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl scale-100"
                : "text-[#A5ACB8] hover:text-white hover:bg-white/5"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeDemoId === demo.id ? "bg-white animate-ping" : "bg-zinc-500"
              }`}
            />
            {demo.category.split(" ")[0]} Project
          </button>
        ))}
      </div>

      {/* 2. Side-By-Side: Device Frame Layout and explanation panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full max-w-4xl">
        {/* Left Side: Live Phone Mockup Container */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center">
          {/* Siterra Chrome Edge Device frame */}
          <div className="relative mx-auto w-[290px] h-[580px] bg-zinc-900 rounded-[44px] p-2.5 shadow-[0_25px_50px_-12px_rgba(37,99,255,0.25)] border-[4px] border-zinc-700/80 ring-1 ring-white/10 overflow-hidden flex flex-col">
            
            {/* Top Ear Speaker & Camera notch cutout */}
            <div className="absolute top-0 inset-x-0 h-6 bg-transparent flex justify-center z-30 pointer-events-none">
              <div className="w-28 h-4 bg-zinc-900 rounded-b-xl flex items-center justify-center gap-1.5 border-b border-x border-[#1F2937]/50">
                <div className="w-10 h-1 bg-zinc-800 rounded-full" />
                <div className="w-2- h-2 rounded-full bg-zinc-800" />
              </div>
            </div>

            {/* Simulated Phone Status Bar */}
            <div className="h-6 bg-black flex justify-between items-center px-6 text-[9.5px] font-mono text-white/95 relative z-20 pointer-events-none shrink-0 pt-0.5">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1.5">
                {/* Simulated cellular bars */}
                <span className="flex items-end gap-0.5 h-2">
                  <span className="w-[2px] h-[3px] bg-white rounded-2xs" />
                  <span className="w-[2px] h-[5px] bg-white rounded-2xs" />
                  <span className="w-[2px] h-[7px] bg-white rounded-2xs" />
                  <span className="w-[2px] h-[9px] bg-white rounded-2xs" />
                </span>
                <span className="font-bold text-[9px]">5G</span>
                {/* Battery icon */}
                <div className="w-5 h-2.5 bg-zinc-700 rounded-xs p-0.5 flex items-center">
                  <div className="w-3.5 h-1.5 bg-emerald-400 rounded-3xs" />
                  <div className="w-0.5 h-1 bg-zinc-700 rounded-r-xs ml-0.5" />
                </div>
              </div>
            </div>

            {/* Inner App Container (This is where the simulated client app goes) */}
            <div className="flex-1 rounded-[32px] overflow-hidden bg-black border border-white/5 relative shadow-inner flex flex-col">
              {renderSimulatedMobileApp()}
            </div>

            {/* Bottom Virtual Home Bar indicator */}
            <div className="absolute bottom-1 inset-x-0 h-4 bg-transparent flex justify-center items-center pointer-events-none z-30">
              <div className="w-24 h-1 bg-white/40 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Side: Tactical details describing conversion factors of the app */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-5 text-left border-t lg:border-t-0 pt-6 lg:pt-0 border-white/10">
          <div className="space-y-1">
            <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Live Simulator Overview
            </span>
            <h4 className="font-display font-extrabold text-2xl text-white tracking-tight">
              {activeDemo.category}
            </h4>
            <p className="text-[#A5ACB8] text-sm leading-relaxed">
              {activeDemo.description}
            </p>
          </div>

          {/* Key Metrics / Features built-in to the demo app */}
          <div className="grid grid-cols-2 gap-2.5">
            {activeDemo.tags.map((tag, i) => (
              <div
                key={i}
                className="bg-[#0E1117]/80 rounded-lg p-2.5 border border-white/[0.06] flex items-center gap-2"
              >
                <div className="text-blue-500 rounded-full bg-blue-500/10 p-1 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span className="text-[11px] font-mono font-medium text-white/90 truncate">{tag}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-transparent border border-blue-500/15 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <div className="text-xs font-display font-bold uppercase tracking-wider text-white">Why Siterra Projects Win Trust</div>
            </div>
            
            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold font-mono">📍 Localized Strategy:</span>
                <span>The system displays regional phone codes and customized local reviews instantly.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold font-mono">⚡ Interactive Conversion:</span>
                <span>Includes responsive widgets (shade previewers, diagnostic selectors, property estimators) to reduce bounce rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold font-mono">📲 Instant Dispatch Hooks:</span>
                <span>Users dial with 1 tap. Mobile-first design maximizes lead velocity.</span>
              </li>
            </ul>

            <div className="pt-2 text-center">
              <button
                onClick={() => onOpenConsultation(`Get custom ${activeDemo.category} setup`)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs tracking-wide transition-all shadow-md cursor-pointer"
              >
                Build a Site Like This For Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
