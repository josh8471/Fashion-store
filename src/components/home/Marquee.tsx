"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const ITEMS = [
  "Free Shipping Over ₹2999",
  "New Collection SS 2025",
  "Sustainably Made",
  "Returns Within 30 Days",
  "Handcrafted in India",
  "Free Shipping Over ₹2999",
  "New Collection SS 2025",
  "Sustainably Made",
  "Returns Within 30 Days",
  "Handcrafted in India",
];

export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const width = trackRef.current.scrollWidth / 2;
      gsap.fromTo(
        trackRef.current,
        { x: 0 },
        {
          x: -width,
          duration: 30,
          ease: "none",
          repeat: -1,
        }
      );
    },
    { scope: trackRef }
  );

  return (
    <div className="bg-zinc-900 py-3.5 overflow-hidden">
      <div ref={trackRef} className="flex whitespace-nowrap">
        {ITEMS.map((item, i) => (
          <span key={i} className="text-white/60 text-xs tracking-[0.3em] uppercase mx-8">
            {item}
            <span className="mx-8 text-white/20">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
