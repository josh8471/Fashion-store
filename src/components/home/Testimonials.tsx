"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const REVIEWS = [
  {
    quote: "The most considered wardrobe I have ever owned. Every piece earns its place.",
    author: "Aarti S.",
    role: "Editor, Vogue India",
  },
  {
    quote: "Unmatched tailoring. The fit feels made for me — because it basically is.",
    author: "Rohan M.",
    role: "Architect, Mumbai",
  },
  {
    quote: "I bought a linen shirt three years ago and it still wears like the first day.",
    author: "Priya K.",
    role: "Creative Director",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".testimonial-quote", { type: "lines" });
      gsap.from(split.lines, {
        opacity: 0,
        y: 50,
        stagger: 0.08,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".testimonials-grid", start: "top 80%" },
      });

      gsap.fromTo(
        ".testimonial-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".testimonials-grid", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".testimonial-divider",
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.1,
          ease: "power2.out",
          transformOrigin: "top center",
          stagger: 0.2,
          scrollTrigger: { trigger: ".testimonials-grid", start: "top 80%" },
        }
      );
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="py-32 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 max-w-2xl">
          <p className="text-[10px] tracking-[0.5em] uppercase text-white/40 mb-4 flex items-center gap-3">
            <span className="block w-6 h-px bg-white/30" />
            In Their Words
          </p>
          <h2 className="text-5xl sm:text-6xl font-light tracking-[-0.02em] leading-[0.95]">
            The people who
            <br />
            <span className="italic font-serif text-white/80">wear it.</span>
          </h2>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-0 relative">
          {REVIEWS.map((r, i) => (
            <div
              key={i}
              className="testimonial-card relative px-6 md:px-10 py-10 md:py-0"
            >
              {i > 0 && (
                <span className="testimonial-divider hidden md:block absolute left-0 top-0 bottom-0 w-px bg-white/10 origin-top" />
              )}
              <div className="text-white/20 text-6xl font-serif leading-none mb-6">
                &ldquo;
              </div>
              <p className="testimonial-quote text-xl md:text-2xl font-light leading-relaxed text-white/90 mb-10">
                {r.quote}
              </p>
              <div>
                <p className="text-sm tracking-wide text-white">{r.author}</p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mt-1">
                  {r.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
