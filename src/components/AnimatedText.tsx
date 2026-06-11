import React, { useRef, useState, useEffect } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const end = window.innerHeight * 0.15;
      
      // Calculate progress of scroll through this text
      const currentScroll = start - rect.top;
      const totalScrollRange = start - end;
      
      const newProgress = Math.min(
        1,
        Math.max(0, currentScroll / totalScrollRange)
      );
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run initially
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const chars = text.split("");
  const totalChars = chars.length;

  return (
    <p ref={containerRef} className={`${className} leading-relaxed select-none`}>
      {chars.map((char, index) => {
        // Individual character target progress
        const targetProgress = index / totalChars;
        // Map current progress to a value from 0.2 to 1.0 (opacity)
        // With a nice local ramp up so it's not a hard toggle
        const charWeight = 0.05; // range over which letter transitions
        let opacity = 0.2;
        if (progress >= targetProgress) {
          const ratio = Math.min(1, (progress - targetProgress) / charWeight);
          opacity = 0.2 + ratio * 0.8;
        }

        return (
          <span
            key={index}
            style={{
              opacity,
              transition: "opacity 0.1s ease-out",
            }}
            className="transition-colors duration-150"
          >
            {char}
          </span>
        );
      })}
    </p>
  );
}
