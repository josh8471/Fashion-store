"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

function Counter({
  target,
  suffix = "",
  trigger,
}: {
  target: number;
  suffix?: string;
  trigger: React.RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !trigger.current) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: { trigger: trigger.current, start: "top 80%" },
        onUpdate: () => {
          el.textContent = Math.round(obj.val).toString() + suffix;
        },
      });
    },
    { scope: trigger }
  );

  return <span ref={ref}>0{suffix}</span>;
}

export default function Editorial() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".editorial-image-main",
        { clipPath: "inset(30% 0% 30% 0%)", scale: 1.15 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ".editorial-image-main", start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".editorial-image-secondary",
        { clipPath: "inset(50% 0% 50% 0%)", y: 40 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          y: 0,
          duration: 1.3,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: { trigger: ".editorial-image-main", start: "top 80%" },
        }
      );

      gsap.to(".editorial-image-secondary", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      const split = SplitText.create(".editorial-headline", { type: "lines, words" });
      gsap.from(split.lines, {
        opacity: 0,
        y: 80,
        stagger: 0.12,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: ".editorial-headline", start: "top 80%" },
      });

      gsap.fromTo(
        ".editorial-text",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".editorial-text", start: "top 85%" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div
              className="editorial-image-main relative aspect-[4/5] overflow-hidden bg-zinc-100"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1100&q=90')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="editorial-image-secondary hidden sm:block absolute -bottom-12 -right-8 w-44 h-60 overflow-hidden shadow-2xl"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=90')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </div>

          <div className="space-y-10">
            <p className="editorial-text text-[10px] tracking-[0.5em] uppercase text-zinc-400 flex items-center gap-3">
              <span className="block w-6 h-px bg-zinc-400" />
              The Philosophy
            </p>
            <h2 className="editorial-headline text-4xl sm:text-5xl lg:text-6xl font-light text-zinc-900 leading-[1.02] tracking-[-0.02em]">
              Craft over haste.
              <br />
              <span className="italic font-serif">Quality</span> over volume.
            </h2>
            <p className="editorial-text text-zinc-500 text-base leading-relaxed max-w-md font-light">
              We believe in making fewer things better. Each piece is designed with intention, crafted with care, and built to last beyond seasons. This is not fast fashion — it is a considered choice.
            </p>

            <div className="editorial-text grid grid-cols-3 gap-6 pt-8 border-t border-zinc-100">
              <div>
                <p className="text-4xl font-light text-zinc-900">
                  <Counter target={14} suffix="+" trigger={sectionRef} />
                </p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mt-2">
                  Years of craft
                </p>
              </div>
              <div>
                <p className="text-4xl font-light text-zinc-900">
                  <Counter target={100} suffix="%" trigger={sectionRef} />
                </p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mt-2">
                  Natural fibres
                </p>
              </div>
              <div>
                <p className="text-4xl font-light text-zinc-900">
                  <Counter target={30} suffix="d" trigger={sectionRef} />
                </p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-400 mt-2">
                  Free returns
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className="editorial-text group inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-zinc-900"
            >
              Our Story
              <span className="relative block w-10 h-px bg-zinc-300 overflow-hidden">
                <span className="absolute inset-0 bg-zinc-900 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
