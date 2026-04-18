"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { Collection } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export default function CollectionsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((j) => setCollections(j.data || []))
      .finally(() => setLoading(false));
  }, []);

  useGSAP(
    () => {
      const split = SplitText.create(".page-title", { type: "chars" });
      gsap.from(split.chars, {
        opacity: 0,
        y: 40,
        stagger: 0.03,
        duration: 0.6,
        ease: "power3.out",
      });

      if (!loading) {
        gsap.fromTo(
          ".col-item",
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: ".col-grid", start: "top 85%" },
          }
        );
      }
    },
    { scope: pageRef, dependencies: [loading] }
  );

  const FALLBACK = [
    { _id: "1", name: "Resort", slug: "resort", description: "Destination dressing", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", isActive: true, sortOrder: 0 },
    { _id: "2", name: "Evening", slug: "evening", description: "Night-time luxury", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80", isActive: true, sortOrder: 1 },
    { _id: "3", name: "Workwear", slug: "workwear", description: "Command the room", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80", isActive: true, sortOrder: 2 },
    { _id: "4", name: "Casuals", slug: "casuals", description: "Effortless everyday", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80", isActive: true, sortOrder: 3 },
  ];

  const display = collections.length > 0 ? collections : FALLBACK;

  return (
    <div ref={pageRef} className="pt-24 pb-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs tracking-[0.4em] uppercase text-zinc-400 mb-4">All Collections</p>
        <h1 className="page-title text-5xl sm:text-7xl font-light text-zinc-900 tracking-tight">
          Collections
        </h1>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="col-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            {display.map((col, i) => (
              <Link
                key={col._id}
                href={`/collections/${col.slug}`}
                className={`col-item group relative overflow-hidden bg-zinc-100 ${i === 0 ? "md:col-span-2 aspect-[16/7]" : "aspect-[4/3]"}`}
              >
                <Image
                  src={col.image || "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80"}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={i === 0 ? "100vw" : "50vw"}
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 p-8">
                  <h2 className="text-white text-3xl sm:text-4xl font-light">{col.name}</h2>
                  <p className="text-white/60 text-sm mt-1">{col.description}</p>
                  <span className="inline-block mt-4 text-white text-xs tracking-widest uppercase border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                    View Collection →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
