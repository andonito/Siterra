import React from "react";

interface SiterraLogoProps {
  className?: string;
  iconOnly?: boolean;
  lightBackground?: boolean;
}

export default function SiterraLogo({
  className = "",
  iconOnly = false,
  lightBackground = false,
}: SiterraLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon Emblem: Luxury geometric crown/diamond pattern */}
      <div className="relative w-9 h-9 flex items-center justify-center">
        {/* Soft radial blue glow in background */}
        <div className="absolute inset-0 bg-[#2563FF] opacity-20 blur-[8px] rounded-full animate-pulse-glow" />
        
        {/* Outer silver/gray circle border */}
        <div className="absolute inset-0 rounded-xl border border-white/10 bg-gradient-to-br from-[#0F172A] to-[#020617] shadow-xl" />
        
        {/* Vector geometry representing a digital framework "S" */}
        <svg
          viewBox="0 0 100 100"
          className="w-5.5 h-5.5 relative z-10 drop-shadow-[0_2px_8px_rgba(37,99,255,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Arc in pure white / silver gradient */}
          <path
            d="M25 65C25 54 34 46 45 46C56 46 65 38 65 27"
            stroke={lightBackground ? "#0F172A" : "#FFFFFF"}
            strokeWidth="10"
            strokeLinecap="round"
            className="transition-colors duration-300"
          />
          {/* Bottom Arc in vibrant cobalt blue */}
          <path
            d="M35 73C35 62 44 54 55 54C66 54 75 46 75 35"
            stroke="#2563FF"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Center core pixel */}
          <circle cx="50" cy="50" r="8" fill="#3B82F6" />
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col items-start leading-none tracking-tight">
          <span
            className={`font-display text-lg font-extrabold tracking-[0.08em] uppercase ${
              lightBackground ? "text-[#080A0F]" : "text-white"
            } transition-colors duration-300`}
          >
            Siterra
          </span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-[#A5ACB8] uppercase">
            Digital Studio
          </span>
        </div>
      )}
    </div>
  );
}
