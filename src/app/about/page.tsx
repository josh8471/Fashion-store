"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero title
      const split = SplitText.create(".about-hero-title", { type: "lines" });
      gsap.from(split.lines, {
        opacity: 0,
        y: 60,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Sections
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });

      // Image reveal
      gsap.fromTo(
        ".about-img",
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out",
          scrollTrigger: { trigger: ".about-img", start: "top 80%" },
        }
      );
    },
    { scope: pageRef }
  );

  return (
    <div ref={pageRef} className="pt-24 pb-24">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs tracking-[0.4em] uppercase text-zinc-400 mb-6">Our Story</p>
        <h1 className="about-hero-title text-5xl sm:text-7xl lg:text-8xl font-light text-zinc-900 leading-[0.95] tracking-tight max-w-4xl">
          Craft. Intention. Permanence.
        </h1>
      </div>

      {/* Large image */}
      <div className="about-img max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="w-full aspect-[21/9] bg-zinc-100"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%",
          }}
        />
      </div>

      {/* Story text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="reveal-section space-y-6">
            <h2 className="text-3xl font-light text-zinc-900">Born from a belief in better.</h2>
            <p className="text-zinc-500 leading-relaxed">
              Maison was founded in 2012 with a singular conviction — that fashion should outlast its moment. We started in a small atelier, working with artisans who had spent decades mastering their craft.
            </p>
            <p className="text-zinc-500 leading-relaxed">
              Every piece we create begins with a question: will this still feel right in ten years? That question shapes our material choices, our construction methods, and our designs.
            </p>
          </div>
          <div className="reveal-section space-y-6">
            <h2 className="text-3xl font-light text-zinc-900">Made to be kept.</h2>
            <p className="text-zinc-500 leading-relaxed">
              We source our fabrics from small mills in Italy and Japan who share our obsession with quality. Our manufacturing partners are visited regularly — we believe in knowing where and how our garments are made.
            </p>
            <p className="text-zinc-500 leading-relaxed">
              Each garment is finished by hand, inspected individually, and shipped in packaging that can be reused or composted. This is slow fashion — by design.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-zinc-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="reveal-section text-3xl font-light text-zinc-900 mb-16 text-center">What we stand for</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              { title: "Craftsmanship", text: "Every seam is intentional. We work with artisans who take pride in their work and are paid fairly for it." },
              { title: "Sustainability", text: "Natural fibres, responsible sourcing, minimal packaging. We measure our impact and work to reduce it." },
              { title: "Timelessness", text: "We don't follow seasons. We design pieces that earn a permanent place in your wardrobe." },
            ].map((v) => (
              <div key={v.title} className="reveal-section space-y-4">
                <h3 className="text-xl font-light text-zinc-900">{v.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
