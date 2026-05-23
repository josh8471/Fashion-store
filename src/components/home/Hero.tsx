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
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-left",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.out" }
      )
        .fromTo(
          ".hero-right",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.out" },
          "-=1.2"
        )
        .fromTo(
          ".hero-eyebrow",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6 },
          "-=0.8"
        );

      const split = SplitText.create(".hero-headline", { type: "words, chars" });
      tl.from(
        split.chars,
        {
          opacity: 0,
          y: 100,
          rotateX: -60,
          stagger: 0.025,
          duration: 0.9,
          ease: "power4.out",
        },
        "-=0.5"
      )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta > *",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
          "-=0.4"
        )
        .fromTo(
          ".hero-meta",
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.3"
        );

      gsap.to(".hero-left-inner", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".hero-right-inner", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-progress-fill", {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      const cta = ctaRef.current;
      if (cta) {
        const onMove = (e: MouseEvent) => {
          const rect = cta.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(cta, { x: x * 0.25, y: y * 0.35, duration: 0.4, ease: "power3.out" });
        };
        const onLeave = () => {
          gsap.to(cta, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        };
        cta.addEventListener("mousemove", onMove);
        cta.addEventListener("mouseleave", onLeave);
        return () => {
          cta.removeEventListener("mousemove", onMove);
          cta.removeEventListener("mouseleave", onLeave);
        };
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] overflow-hidden bg-zinc-950 text-white"
    >
      <div className="absolute inset-0 grid grid-cols-12">
        <div className="hero-left col-span-12 md:col-span-7 relative overflow-hidden">
          <div
            className="hero-left-inner absolute inset-0 scale-110"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=2000&q=90')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
        </div>
        <div className="hero-right hidden md:block md:col-span-5 relative overflow-hidden bg-zinc-900">
          <div
            className="hero-right-inner absolute inset-0 scale-110"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=90')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col items-center gap-3">
        <span className="text-[9px] tracking-[0.5em] uppercase text-white/50 rotate-180 [writing-mode:vertical-rl]">
          Atelier · Est. 2012
        </span>
        <div className="w-px h-32 bg-white/10 relative overflow-hidden">
          <div className="hero-progress-fill absolute top-0 left-0 w-full h-full bg-white/70 scale-y-0" />
        </div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20 px-6 sm:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <p className="hero-eyebrow text-white/70 text-[10px] sm:text-xs tracking-[0.5em] uppercase mb-6 flex items-center gap-3">
            <span className="block w-8 h-px bg-white/50" />
            New Collection · Spring Summer 2026
          </p>
          <h1 className="hero-headline text-white font-light text-[clamp(2.75rem,9vw,8.5rem)] leading-[0.9] tracking-[-0.02em] mb-8">
            Wear the
            <br />
            <span className="italic font-serif">Silence</span>
          </h1>
          <p className="hero-sub text-white/75 text-base sm:text-lg font-light leading-relaxed mb-10 max-w-md">
            Pieces that speak without words. Elevated minimalism, crafted in limited runs for the modern wardrobe.
          </p>
          <div className="hero-cta flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link
              ref={ctaRef}
              href="/collections"
              className="group relative inline-flex items-center justify-center bg-white text-zinc-900 text-xs tracking-[0.25em] uppercase px-10 py-4 overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Explore Collection
              </span>
              <span className="absolute inset-0 bg-zinc-900 scale-y-0 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:scale-y-100" />
            </Link>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 text-white text-xs tracking-[0.25em] uppercase px-2 py-4"
            >
              Shop All
              <span className="relative block w-10 h-px bg-white/60 overflow-hidden">
                <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-meta absolute bottom-8 left-6 sm:left-12 lg:left-20 z-20 flex items-center gap-6">
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">
          <span className="text-white/80">01</span> / 04
        </div>
        <div className="h-px w-12 bg-white/20" />
        <div className="text-[10px] tracking-[0.3em] uppercase text-white/40">
          Maison — Studio
        </div>
      </div>

      <div className="absolute bottom-8 right-6 sm:right-12 lg:right-20 z-20 flex flex-col items-center gap-2">
        <span className="text-white/40 text-[9px] tracking-[0.4em] uppercase">
          Scroll
        </span>
        <div className="w-px h-16 bg-white/10 overflow-hidden">
          <div className="w-full h-1/2 bg-white/70 animate-[slideDown_1.8s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
