import React from "react";
import { motion } from "motion/react";

type ObjectType = "moon" | "glass" | "lego" | "group";

interface Floating3DObjectProps {
  type: ObjectType;
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number;
}

const OBJECT_URLS: Record<ObjectType, string> = {
  moon: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png",
  glass: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png",
  lego: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png",
  group: "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png",
};

export default function Floating3DObject({
  type,
  className = "",
  delay = 0,
  duration = 6,
  scale = 1,
}: Floating3DObjectProps) {
  return (
    <motion.div
      initial={{ y: 0, rotate: 0 }}
      animate={{
        y: [0, -18, 0],
        rotate: [0, 4, -4, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
      style={{ scale }}
      className={`pointer-events-none select-none filter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${className}`}
    >
      <img
        src={OBJECT_URLS[type]}
        alt="Tactile 3D Creative Element"
        className="w-full h-auto object-contain"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
}
