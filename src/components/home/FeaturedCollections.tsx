"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Collection } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&q=85",
];

interface Props {
  collections: Collection[];
}

export default function FeaturedCollections({ collections }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".collections-heading", { type: "words" });
      gsap.from(split.words, {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".collections-heading", start: "top 85%" },
      });

      gsap.fromTo(
        ".collections-eyebrow",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          scrollTrigger: { trigger: ".collections-eyebrow", start: "top 90%" },
        }
      );

      gsap.utils.toArray<HTMLElement>(".collection-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: i * 0.12,
            ease: "power4.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
          }
        );

        const img = card.querySelector(".collection-image");
        if (img) {
          gsap.fromTo(
            img,
            { clipPath: "inset(8% 8% 8% 8%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 80%" },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  const displayCollections =
    collections.length > 0
      ? collections.slice(0, 3)
      : [
          { _id: "1", name: "Summer Essentials", slug: "summer", description: "Light, breathable luxury", image: FALLBACK_IMAGES[0], isActive: true, sortOrder: 0 },
          { _id: "2", name: "Evening Wear", slug: "evening", description: "For the night ahead", image: FALLBACK_IMAGES[1], isActive: true, sortOrder: 1 },
          { _id: "3", name: "Workwear Edit", slug: "workwear", description: "Command the room", image: FALLBACK_IMAGES[2], isActive: true, sortOrder: 2 },
        ];

  return (
    <section ref={sectionRef} className="py-32 px-4 sm:px-6 lg:px-8 bg-white max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-16">
        <div>
          <p className="collections-eyebrow text-[10px] tracking-[0.5em] uppercase text-zinc-400 mb-4 flex items-center gap-3">
            <span className="block w-6 h-px bg-zinc-400" />
            Curated for the Season
          </p>
          <h2 className="collections-heading text-5xl sm:text-6xl lg:text-7xl font-light text-zinc-900 tracking-[-0.02em] leading-[0.95]">
            Collections
          </h2>
        </div>
        <Link
          href="/collections"
          className="group hidden sm:inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          View All
          <span className="relative block w-10 h-px bg-zinc-300 overflow-hidden">
            <span className="absolute inset-0 bg-zinc-900 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayCollections.map((col, i) => (
          <Link
            key={col._id}
            href={`/collections/${col.slug}`}
            className="collection-card group block"
          >
            <div className="relative overflow-hidden aspect-[3/4] bg-zinc-100">
              <div className="collection-image absolute inset-0">
                <Image
                  src={col.image || FALLBACK_IMAGES[i % 3]}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-90" />

              <div className="absolute top-5 left-5 text-white/80 text-[10px] tracking-[0.4em] uppercase">
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <h3 className="text-white text-2xl font-light tracking-tight">
                  {col.name}
                </h3>
                <p className="text-white/70 text-sm mt-1.5 font-light">
                  {col.description}
                </p>
                <div className="mt-5 flex items-center gap-3 text-white text-[10px] tracking-[0.3em] uppercase">
                  <span>Explore</span>
                  <span className="relative block w-8 h-px bg-white/40 overflow-hidden">
                    <span className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
