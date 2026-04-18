"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function Editorial() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".editorial-image",
        { clipPath: "inset(30% 0% 30% 0%)", scale: 1.1 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".editorial-image", start: "top 80%" },
        }
      );

      const split = SplitText.create(".editorial-headline", { type: "lines" });
      gsap.from(split.lines, {
        opacity: 0,
        y: 60,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".editorial-headline", start: "top 80%" },
      });

      gsap.fromTo(
        ".editorial-text",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: ".editorial-text", start: "top 85%" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div
            className="editorial-image relative aspect-[4/5] overflow-hidden bg-zinc-100"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Text */}
          <div className="space-y-8">
            <p className="editorial-text text-xs tracking-[0.4em] uppercase text-zinc-400">
              The Philosophy
            </p>
            <h2 className="editorial-headline text-4xl sm:text-5xl lg:text-6xl font-light text-zinc-900 leading-[1.05] tracking-tight">
              Craft Over Haste. Quality Over Volume.
            </h2>
            <p className="editorial-text text-zinc-500 text-base leading-relaxed max-w-md">
              We believe in making fewer things better. Each piece is designed with intention, crafted with care, and built to last beyond seasons. This is not fast fashion — it is a considered choice.
            </p>
            <div className="editorial-text flex flex-col sm:flex-row gap-6">
              <div>
                <p className="text-3xl font-light text-zinc-900">12+</p>
                <p className="text-xs tracking-widest uppercase text-zinc-400 mt-1">Years of craft</p>
              </div>
              <div className="w-px bg-zinc-200 hidden sm:block" />
              <div>
                <p className="text-3xl font-light text-zinc-900">100%</p>
                <p className="text-xs tracking-widest uppercase text-zinc-400 mt-1">Natural fibres</p>
              </div>
              <div className="w-px bg-zinc-200 hidden sm:block" />
              <div>
                <p className="text-3xl font-light text-zinc-900">30-day</p>
                <p className="text-xs tracking-widest uppercase text-zinc-400 mt-1">Free returns</p>
              </div>
            </div>
            <Link
              href="/about"
              className="editorial-text inline-flex items-center gap-2 text-xs tracking-widest uppercase text-zinc-900 border-b border-zinc-900 pb-0.5 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
            >
              Our Story →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
