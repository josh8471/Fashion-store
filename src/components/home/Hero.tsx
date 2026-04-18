"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Image reveal
      tl.fromTo(
        ".hero-image-wrap",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.out" }
      );

      // Headline split text
      const split = SplitText.create(".hero-headline", { type: "words, chars" });
      tl.from(
        split.chars,
        { opacity: 0, y: 60, rotateX: -45, stagger: 0.02, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      );

      // Subtext
      tl.fromTo(
        ".hero-sub",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.3"
      );

      // CTA
      tl.fromTo(
        ".hero-cta",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.4"
      );

      // Scroll indicator
      tl.fromTo(
        ".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.2"
      );

      // Parallax on scroll
      gsap.to(".hero-image-inner", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative h-screen min-h-[600px] overflow-hidden bg-zinc-950">
      {/* Background image */}
      <div className="hero-image-wrap absolute inset-0">
        <div
          className="hero-image-inner absolute inset-0 scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <p className="hero-sub text-white/60 text-xs tracking-[0.4em] uppercase mb-6">
            New Collection · SS 2025
          </p>
          <h1 className="hero-headline text-white font-light text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-8">
            Wear the Silence
          </h1>
          <p className="hero-sub text-white/70 text-base sm:text-lg font-light leading-relaxed mb-10 max-w-md">
            Pieces that speak without words. Elevated minimalism for the modern wardrobe.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center bg-white text-zinc-900 text-xs tracking-widest uppercase px-10 py-4 hover:bg-zinc-100 transition-colors duration-200"
            >
              Explore Collection
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center border border-white/60 text-white text-xs tracking-widest uppercase px-10 py-4 hover:bg-white/10 transition-colors duration-200"
            >
              Shop All
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 right-8 sm:right-12 lg:right-20 flex flex-col items-center gap-2">
        <span className="text-white/40 text-[10px] tracking-widest uppercase rotate-90 mb-1">Scroll</span>
        <div className="w-px h-16 bg-white/20 overflow-hidden">
          <div className="w-full h-1/2 bg-white/60 animate-[slideDown_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
