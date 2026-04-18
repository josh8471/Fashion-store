"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Collection } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
];

interface Props {
  collections: Collection[];
}

export default function FeaturedCollections({ collections }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".section-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: { trigger: ".section-label", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".collection-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".collections-grid",
            start: "top 80%",
          },
        }
      );
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
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-white max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="section-label text-xs tracking-[0.4em] uppercase text-zinc-400 mb-3">
            Curated for You
          </p>
          <h2 className="section-label text-4xl sm:text-5xl font-light text-zinc-900 tracking-tight">
            Collections
          </h2>
        </div>
        <Link
          href="/collections"
          className="hidden sm:inline-flex text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 underline underline-offset-4 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="collections-grid grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayCollections.map((col, i) => (
          <Link key={col._id} href={`/collections/${col.slug}`} className="collection-card group block">
            <div className="relative overflow-hidden aspect-[3/4] bg-zinc-100">
              <Image
                src={col.image || FALLBACK_IMAGES[i % 3]}
                alt={col.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-light tracking-wide">{col.name}</h3>
                <p className="text-white/60 text-sm mt-1">{col.description}</p>
                <span className="inline-block mt-4 text-white text-xs tracking-widest uppercase border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                  Explore →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
