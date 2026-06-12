import React, { useState, useEffect } from "react";
import { PACKAGES } from "../data";
import { Calculator, Plus, Check, Calendar, ArrowRight, Info, Zap } from "lucide-react";

interface PackageCalculatorProps {
  onOpenConsultation: (subject: string) => void;
}

export default function PackageCalculator({ onOpenConsultation }: PackageCalculatorProps) {
  const [selectedBasePackage, setSelectedBasePackage] = useState<string>("pro");
  const [pageCount, setPageCount] = useState<number>(8);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  const addonsList = [
    {
      id: "crm",
      name: "Smart CRM Sync (Jobber/Calendly)",
      price: 450,
      description: "Auto-synced bookings, client notifications, and calendar logs."
    },
    {
      id: "seo",
      name: "Locational Keyword Schema (SEO)",
      price: 550,
      description: "Optimized city pages to help search engines understand your service areas."
    },
    {
      id: "multistep",
      name: "Pre-Qualifying Multi-Step Wizard",
      price: 350,
      description: "Sleek card-based client filtering by budget, size, and timing constraints."
    },
    {
      id: "speed",
      name: "High-Speed Server Tuning",
      price: 250,
      description: "Complete asset lazy-loads, clean minification, and global edge-cache deployment for strong performance scores."
    }
  ];

  const handleToggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Base costs mapping
  const getBasePackagePriceNumeric = (): number => {
    switch (selectedBasePackage) {
      case "launch":
        return 997;
      case "local":
        return 2500;
      case "pro":
        return 5000;
      case "authority":
        return 10000;
      default:
        return 2500;
    }
  };

  const getSuggestedPageRangeDefault = (): number => {
    switch (selectedBasePackage) {
      case "launch":
        return 1;
      case "local":
        return 5;
      case "pro":
        return 8;
      case "authority":
        return 15;
      default:
        return 5;
    }
  };

  // Auto-tune page count when package changes roughly
  useEffect(() => {
    setPageCount(getSuggestedPageRangeDefault());
  }, [selectedBasePackage]);

  // Total estimate formulation
  const calculateTotal = (): number => {
    const baseCost = getBasePackagePriceNumeric();
    
    // Add page count adjustment (Launch is locked to 1, others vary)
    let pageCostAdjustment = 0;
    const defaultPages = getSuggestedPageRangeDefault();
    if (selectedBasePackage !== "launch") {
      const extraPages = Math.max(0, pageCount - defaultPages);
      pageCostAdjustment = extraPages * 150; // $150 per extra page
    }

    // Addons cost calculation
    const addonsCost = selectedAddons.reduce((sum, addonId) => {
      const add = addonsList.find((a) => a.id === addonId);
      return sum + (add ? add.price : 0);
    }, 0);

    return baseCost + pageCostAdjustment + addonsCost;
  };

  const currentTotal = calculateTotal();

  return (
    <div className="bg-[#0E1117] border border-white/10 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]" />
      
      {/* Block Header */}
      <div className="flex items-start gap-3.5 mb-6.5">
        <div className="bg-blue-600/15 border border-blue-500/20 text-blue-400 p-2.5 rounded-xl">
          <Calculator className="w-5 h-5" />
        </div>
        <div className="text-left">
          <span className="text-[10px] font-mono text-blue-400 font-bold tracking-wider uppercase">Website Price Estimator</span>
          <h4 className="font-display font-black text-xl text-white tracking-tight">Project Cost Planner</h4>
          <p className="text-xs text-[#A5ACB8]">Tailor your Siterra platform and preview estimated design investments instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Specification Form */}
        <div className="md:col-span-7 space-y-6 text-left">
          {/* Step 1: Base Platform */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-[#A5ACB8] uppercase tracking-wider block">
              1. Choose Your Starting Package
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedBasePackage(pkg.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 cursor-pointer ${
                    selectedBasePackage === pkg.id
                      ? "bg-blue-600/10 border-blue-600 text-white shadow-lg shadow-blue-500/5"
                      : "bg-[#05070A] border-white/5 text-zinc-400 hover:border-white/10"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-xs font-bold font-display uppercase tracking-wider block">{pkg.name.split(" ")[1]}</span>
                    {selectedBasePackage === pkg.id && (
                      <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white stroke-[4px]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A5ACB8] block">Starting at</span>
                    <span className="font-mono text-sm font-bold text-white">{pkg.price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Page count adjustments, if not launch */}
          {selectedBasePackage !== "launch" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-bold text-[#A5ACB8] uppercase tracking-wider block">
                  2. How Many Pages Do You Need?
                </label>
                <span className="font-mono text-xs font-bold bg-[#05070A] border border-white/5 py-0.5 px-2 rounded-md text-blue-400">
                  {pageCount} Pages Selected
                </span>
              </div>
              
              <div className="space-y-1.5 bg-[#05070A] p-4 rounded-xl border border-white/5">
                <input
                  type="range"
                  min="3"
                  max="20"
                  value={pageCount}
                  onChange={(e) => setPageCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                
                <div className="flex justify-between font-mono text-[9px] text-zinc-500 pt-1">
                  <span>3 Pages (Minimalist)</span>
                  <span>10 Pages (Standard)</span>
                  <span>20 Pages (Locational Heavy)</span>
                </div>
                
                <div className="text-[10px] text-[#A5ACB8] mt-1.5 bg-white/[0.02] p-1.5 rounded border border-white/[0.04]">
                  *Base plan includes {getSuggestedPageRangeDefault()} pages. Additional pages add specialized copy & locational schema mapping at $150/page.
                </div>
              </div>
            </div>
          )}

          {/* Step 3: High Conversion Addons */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-[#A5ACB8] uppercase tracking-wider block">
              3. Optional Add-ons
            </label>
            <div className="space-y-2">
              {addonsList.map((addon) => {
                const isSelected = selectedAddons.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer select-none ${
                      isSelected
                        ? "bg-blue-600/10 border-blue-500 text-white"
                        : "bg-[#05070A] border-white/5 text-zinc-400 hover:border-white/10"
                    }`}
                  >
                    <div className={`mt-0.5 w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 border ${
                      isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-zinc-700 bg-zinc-900"
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white font-display">{addon.name}</span>
                        <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold">
                          +${addon.price}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#A5ACB8] mt-0.5">{addon.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Output Card */}
        <div className="md:col-span-5 h-full flex flex-col">
          <div className="bg-[#05070A] border border-white/5 rounded-2xl p-5 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <span className="text-[9px] font-mono font-extrabold tracking-widest text-[#A5ACB8] uppercase block text-center">
                Estimated Project Cost
              </span>
              
              <div className="text-center py-2 relative">
                <span className="text-3xl lg:text-4xl font-mono font-extrabold tracking-tight text-white">
                  ${currentTotal.toLocaleString()}
                </span>
                <span className="text-xs text-[#A5ACB8] block mt-1 font-mono">One-Time Project Cost</span>
              </div>

              <div className="border-t border-dashed border-white/10 my-4 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Base Architecture {selectedBasePackage.toUpperCase()}</span>
                  <span className="font-mono text-white">${getBasePackagePriceNumeric()}</span>
                </div>
                
                {selectedBasePackage !== "launch" && pageCount !== getSuggestedPageRangeDefault() && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Extra Custom Copy ({Math.max(0, pageCount - getSuggestedPageRangeDefault())} pgs)</span>
                    <span className="font-mono text-white">
                      +${(Math.max(0, pageCount - getSuggestedPageRangeDefault()) * 150).toLocaleString()}
                    </span>
                  </div>
                )}

                {selectedAddons.length > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Performance Upgrades ({selectedAddons.length})</span>
                    <span className="font-mono text-white">
                      +${selectedAddons.reduce((sum, current) => sum + (addonsList.find((a) => a.id === current)?.price || 0), 0)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-zinc-400 border-t border-white/5 pt-2 text-[10px]">
                  <span>Avg Launch Timeline:</span>
                  <span className="font-bold text-white">
                    {selectedBasePackage === "launch" ? "3-5 Days" : "3-4 Weeks"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 pt-4">
              <button
                onClick={() => onOpenConsultation(`Model Quote Request - Est: $${currentTotal.toLocaleString()} for package: ${selectedBasePackage}`)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs tracking-wider font-mono uppercase transition-all shadow-[0_4px_16px_rgba(37,99,255,0.25)] hover:shadow-[0_4px_24px_rgba(37,99,255,0.4)] flex items-center justify-center gap-2 cursor-pointer"
              >
                Start Your Project <ArrowRight className="w-4 h-4" />
              </button>
              
              <p className="text-[10px] text-[#A5ACB8] text-center leading-normal">
                No automatic charge. We will detail this scope proposal and confirm local keyword structures in your Free Strategy Consultation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
