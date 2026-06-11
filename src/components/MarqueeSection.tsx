import React, { useRef, useState, useEffect } from "react";

const IMAGE_ROW_1 = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
];

const IMAGE_ROW_2 = [
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTopFromDoc = window.scrollY + rect.top;
      
      // Calculate offset based on user's exact specification formula
      const offset = (window.scrollY - sectionTopFromDoc + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initially
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Triple the arrays for a seamless scrolling effect
  const row1Images = [...IMAGE_ROW_1, ...IMAGE_ROW_1, ...IMAGE_ROW_1];
  const row2Images = [...IMAGE_ROW_2, ...IMAGE_ROW_2, ...IMAGE_ROW_2];

  // Align positions based on scroll offset calculations
  const translateXRow1 = scrollOffset - 250;
  const translateXRow2 = -(scrollOffset - 250);

  return (
    <section 
      ref={sectionRef}
      className="bg-[#05070A] py-16 sm:py-20 md:py-24 overflow-hidden relative"
      id="marquee-gallery"
    >
      <div className="absolute inset-x-0 -top-px h-px bg-white/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-10 sm:mb-12">
        <span className="font-mono text-xs font-bold text-blue-500 tracking-widest uppercase block mb-3">
          Siterra Design Library
        </span>
        <h2 className="font-display font-extrabold text-2xl sm:text-3.5xl text-white tracking-tight">
          Visual catalogs engineered for local prominence.
        </h2>
        <p className="text-[#A5ACB8] text-xs sm:text-sm max-w-xl mx-auto mt-2 leading-relaxed">
          Behind every local Siterra deployment is a curated database of premium visual architectures designed specifically to lock in premium contracts.
        </p>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Row 1 - Moves RIGHT on scroll */}
        <div className="w-full flex">
          <div 
            style={{
              transform: `translate3d(${translateXRow1}px, 0px, 0px)`,
              willChange: "transform",
            }}
            className="flex gap-4 transition-transform duration-75 ease-out select-none"
          >
            {row1Images.map((src, index) => (
              <div 
                key={`r1-${index}`} 
                className="w-[280px] sm:w-[360px] md:w-[420px] aspect-[16/10] shrink-0 rounded-2xl overflow-hidden bg-zinc-950/80 border border-white/5 relative group shadow-lg"
              >
                {/* Visual template sheen overlay */}
                <span className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur border border-white/10 text-white font-mono text-[9px] font-extrabold tracking-wider uppercase py-0.5 px-2 rounded-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  DESIGN #{index % IMAGE_ROW_1.length + 1}
                </span>
                <img 
                  src={src} 
                  alt="High Fidelity Website Showcase" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Moves LEFT on scroll */}
        <div className="w-full flex">
          <div 
            style={{
              transform: `translate3d(${translateXRow2}px, 0px, 0px)`,
              willChange: "transform",
            }}
            className="flex gap-4 transition-transform duration-75 ease-out select-none"
          >
            {row2Images.map((src, index) => (
              <div 
                key={`r2-${index}`} 
                className="w-[280px] sm:w-[360px] md:w-[420px] aspect-[16/10] shrink-0 rounded-2xl overflow-hidden bg-zinc-950/80 border border-white/5 relative group shadow-lg"
              >
                <span className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur border border-white/10 text-white font-mono text-[9px] font-extrabold tracking-wider uppercase py-0.5 px-2 rounded-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  LAYOUT #{index % IMAGE_ROW_2.length + 1}
                </span>
                <img 
                  src={src} 
                  alt="High Fidelity Website Showcase" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 -bottom-px h-px bg-white/5" />
    </section>
  );
}
