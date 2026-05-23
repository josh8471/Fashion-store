"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TOP = [
  "Free Shipping Over ₹2,999",
  "New Collection · SS 2026",
  "Sustainably Made",
  "Returns Within 30 Days",
  "Handcrafted in India",
  "Small Batch · Limited Runs",
];

const BOTTOM = [
  "Maison Atelier",
  "Est. 2012",
  "Made to Last",
  "Ethical Materials",
  "Considered Design",
  "Slow Fashion",
];

function Row({
  items,
  direction = 1,
  duration = 40,
}: {
  items: string[];
  direction?: 1 | -1;
  duration?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const doubled = [...items, ...items, ...items];

  useGSAP(
    () => {
      if (!trackRef.current) return;
      const width = trackRef.current.scrollWidth / 3;
      gsap.set(trackRef.current, { x: direction === 1 ? 0 : -width });
      gsap.to(trackRef.current, {
        x: direction === 1 ? -width : 0,
        duration,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: trackRef }
  );

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="text-[11px] sm:text-xs tracking-[0.35em] uppercase mx-8 flex items-center gap-8"
          >
            {item}
            <span className="text-white/20 text-[10px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="bg-zinc-950 text-white/70 py-5 border-y border-white/5 space-y-2">
      <Row items={TOP} direction={1} duration={45} />
      <Row items={BOTTOM} direction={-1} duration={55} />
    </div>
  );
}
