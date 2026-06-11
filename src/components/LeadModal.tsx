import React, { useState, useEffect } from "react";
import { X, Send, CheckCircle, ShieldCheck, Zap, Mail, ArrowRight, PhoneCall } from "lucide-react";
import SiterraLogo from "./SiterraLogo";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export default function LeadModal({ isOpen, onClose, defaultSubject = "" }: LeadModalProps) {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [url, setUrl] = useState("");
  const [websiteType, setWebsiteType] = useState("service-pro-landing");
  const [budget, setBudget] = useState("$2,500 - $5,000");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Set message placeholder or automated base subject
  useEffect(() => {
    if (defaultSubject && isOpen) {
      setMessage(`Hi Siterra Team, I'm interested in: ${defaultSubject}. Please call me to walk through this schema.`);
      
      // Auto pre-match budget tier if available in defaultSubject
      if (defaultSubject.includes("$997")) {
        setBudget("Under $1,000");
        setWebsiteType("one-page-launch");
      } else if (defaultSubject.includes("$2,500")) {
        setBudget("$1,000 - $2,500");
        setWebsiteType("local-specialty-trade");
      } else if (defaultSubject.includes("$5,000")) {
        setBudget("$2,500 - $5,000");
        setWebsiteType("fully-integrated-pro");
      } else if (defaultSubject.includes("$10,000")) {
        setBudget("$5,000 - $10,000");
        setWebsiteType("enterprise-authority");
      }
    }
  }, [defaultSubject, isOpen]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const data = new URLSearchParams();
    data.append("form-name", "lead-inquiry");
    data.append("name", name);
    data.append("businessName", businessName);
    data.append("email", email);
    data.append("phone", phone);
    data.append("website", url);
    data.append("websiteType", websiteType);
    data.append("budget", budget);
    data.append("message", message);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data.toString(),
    })
      .then((res) => {
        setLoading(false);
        if (res.ok) {
          setSubmitted(true);
        } else {
          setErrorMsg("Failed to submit inquiry to server. Please check your network and try again.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg("Failed to connect to the server. Please check your connection.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#05070AE0] backdrop-blur-md transition-all duration-300" 
      />

      {/* Main Form Modal container */}
      <div className="relative bg-[#0E1117] border border-white/12 w-full max-w-lg rounded-2xl shadow-[0_30px_70px_-10px_rgba(37,99,255,0.3)] overflow-hidden z-10 transition-all transform duration-300">
        
        {/* Accent glow corner */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Top Header */}
        <div className="border-b border-white/5 py-4 px-5.5 flex items-center justify-between bg-black/30">
          <SiterraLogo className="scale-90" />
          <button 
            onClick={onClose}
            className="text-[#A5ACB8] hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Submission success state */
          <div className="p-8 text-center space-y-5 animate-fadeIn">
            <div className="relative w-16 h-16 bg-blue-600/10 border border-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-8 h-8 stroke-[2.5px]" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-25" />
            </div>

            <div className="space-y-2">
              <h4 className="font-display font-black text-2xl text-white tracking-tight">
                Strategy Session Booked!
              </h4>
              <p className="text-sm text-[#A5ACB8] max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="text-white font-semibold">{name}</span>. Our lead strategist is reviewing <span className="text-white font-semibold">{businessName || "your trade portfolio"}</span>'s local competitors right now.
              </p>
            </div>

            <div className="bg-[#05070A] border border-white/5 p-4 rounded-xl text-left text-xs space-y-3 max-w-sm mx-auto">
              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Next Step: Call Reserved</span>
                  <p className="text-zinc-400 mt-0.5">We will call or text your mobile number <strong className="text-white font-mono">{phone}</strong> within 1-2 business hours to verify local keywords.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 border-t border-white/5 pt-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Secured Pricing Frame</span>
                  <p className="text-zinc-400 mt-0.5">Your customized investment criteria has been locked into our scheduling ledger.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName("");
                  setBusinessName("");
                  setEmail("");
                  setPhone("");
                  setUrl("");
                  setMessage("");
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg text-xs font-mono tracking-wider text-center cursor-pointer transition-all w-full"
              >
                Return to Studio Home
              </button>
            </div>
          </div>
        ) : (
          /* Submission form */
          <form onSubmit={handleSubmit} className="p-5.5 space-y-4 max-h-[76vh] overflow-y-auto scrollbar-none">
            <div className="space-y-1.5 text-left mb-2">
              <span className="font-mono text-[9px] font-bold text-blue-500 uppercase tracking-widest block">No commitment</span>
              <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
                Secure Your Strategic Briefing
              </h3>
              <p className="text-xs text-[#A5ACB8] leading-normal">
                Tell Siterra about your specialty, scale, and targets. Receive customized local competitor diagnostics absolutely free.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-3.5 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Your Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#05070A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Business Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. ASAP Window Tinting"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#05070A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Email Address *</label>
                <input
                  required
                  type="email"
                  placeholder="e.g. j.doe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#05070A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Mobile Number *</label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#05070A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Selector Fields */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Current Website (Optional)</label>
              <input
                type="url"
                placeholder="e.g. www.myoutdatedsite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#05070A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Target Platform type</label>
                <select
                  value={websiteType}
                  onChange={(e) => setWebsiteType(e.target.value)}
                  className="w-full bg-[#05070A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="one-page-launch">Siterra Launch (1-Page)</option>
                  <option value="local-specialty-trade">Siterra Local (4-6 Pgs)</option>
                  <option value="fully-integrated-pro">Siterra Pro (Premium Standard)</option>
                  <option value="enterprise-authority">Siterra Authority (Comprehensive)</option>
                  <option value="app-portal">Custom Portal / Software Solution</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Estimated Budget Bracket</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-[#05070A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="Under $1,000">Under $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000+">$10,000+</option>
                </select>
              </div>
            </div>

            {/* Custom scope message */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase">Project Message & Details</label>
              <textarea
                rows={3}
                placeholder="Briefly describe what services you sell or which cities you need to target..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#05070A] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs p-3 rounded-lg text-left font-mono">
                ⚠ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_16px_rgba(37,99,255,0.25)] select-none mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                  Locking Project Criteria...
                </>
              ) : (
                <>
                  Request My Website Quote <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
            <div className="flex items-center justify-center gap-1.5 text-[9.5px] text-[#A5ACB8]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your information is only used to respond to your website inquiry.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
