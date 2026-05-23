"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const VALUES = [
  {
    num: "01",
    title: "Natural Fibres",
    desc: "Linen, cotton, silk and wool — nothing synthetic.",
  },
  {
    num: "02",
    title: "Small Batch",
    desc: "Limited runs. When it's gone, it's gone.",
  },
  {
    num: "03",
    title: "Artisan Led",
    desc: "Every piece made by hand in our Jaipur atelier.",
  },
  {
    num: "04",
    title: "Considered",
    desc: "Designed to be worn for a decade, not a season.",
  },
];

export default function ValuesStrip() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".value-item",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".value-divider",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power2.out",
          transformOrigin: "left center",
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-white py-20 border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="value-divider h-px bg-zinc-200 mb-16 origin-left" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {VALUES.map((v) => (
            <div key={v.num} className="value-item">
              <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-400 mb-4">
                {v.num}
              </p>
              <h3 className="text-lg font-light text-zinc-900 tracking-tight mb-2">
                {v.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-[22ch]">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
