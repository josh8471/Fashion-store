"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function NewsletterCTA() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      const split = SplitText.create(".newsletter-headline", { type: "lines, words" });
      gsap.from(split.words, {
        opacity: 0,
        y: 50,
        rotateX: -30,
        stagger: 0.05,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".newsletter-headline", start: "top 85%" },
      });

      gsap.fromTo(
        ".newsletter-body",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: ".newsletter-body", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".newsletter-pattern",
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        }
      );
    },
    { scope: ref }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section
      ref={ref}
      className="relative py-32 bg-white overflow-hidden border-t border-zinc-100"
    >
      <div className="newsletter-pattern pointer-events-none absolute inset-0 opacity-0">
        <div className="absolute top-10 left-10 w-32 h-32 border border-zinc-100 rounded-full" />
        <div className="absolute bottom-16 right-16 w-48 h-48 border border-zinc-100 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-px h-40 bg-zinc-100" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="newsletter-body text-[10px] tracking-[0.5em] uppercase text-zinc-400 mb-6">
          ✦  The Letter  ✦
        </p>
        <h2 className="newsletter-headline text-4xl sm:text-5xl lg:text-6xl font-light text-zinc-900 tracking-[-0.02em] leading-[1.05] mb-8">
          Quiet dispatches
          <br />
          from the <span className="italic font-serif">atelier.</span>
        </h2>
        <p className="newsletter-body text-zinc-500 text-base leading-relaxed max-w-lg mx-auto mb-12 font-light">
          New collections, private previews, and the occasional essay — delivered once a month. Never more.
        </p>

        {submitted ? (
          <p className="newsletter-body text-zinc-900 text-sm tracking-widest uppercase">
            Thank you — look out for a note soon.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="newsletter-body group relative max-w-md mx-auto"
          >
            <div className="flex items-center border-b border-zinc-300 focus-within:border-zinc-900 transition-colors duration-300 py-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="flex-1 bg-transparent outline-none text-sm text-zinc-900 placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="text-[10px] tracking-[0.3em] uppercase text-zinc-900 hover:text-zinc-500 transition-colors ml-4"
              >
                Subscribe →
              </button>
            </div>
          </form>
        )}

        <p className="newsletter-body text-[10px] tracking-[0.3em] uppercase text-zinc-300 mt-8">
          Unsubscribe anytime · No spam, ever
        </p>
      </div>
    </section>
  );
}
