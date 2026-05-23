"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

interface Props {
  products: Product[];
}

export default function FeaturedProducts({ products }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".featured-heading", { type: "words, chars" });
      gsap.from(split.chars, {
        opacity: 0,
        y: 60,
        rotateX: -40,
        stagger: 0.025,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".featured-heading", start: "top 85%" },
      });

      gsap.fromTo(
        ".featured-eyebrow",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          scrollTrigger: { trigger: ".featured-eyebrow", start: "top 90%" },
        }
      );

      if (products.length > 0) {
        gsap.fromTo(
          ".product-card-item",
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power4.out",
            scrollTrigger: { trigger: ".products-row", start: "top 82%", once: true },
          }
        );
      }

      gsap.fromTo(
        ".featured-number",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.05,
          scrollTrigger: { trigger: ".products-row", start: "top 82%" },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-zinc-50 overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-20 -left-20 text-[20rem] font-light text-zinc-100 leading-none select-none hidden lg:block">
        Edit
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-16">
          <div>
            <p className="featured-eyebrow text-[10px] tracking-[0.5em] uppercase text-zinc-400 mb-4 flex items-center gap-3">
              <span className="block w-6 h-px bg-zinc-400" />
              Hand-Picked Essentials
            </p>
            <h2 className="featured-heading text-5xl sm:text-6xl lg:text-7xl font-light text-zinc-900 tracking-[-0.02em] leading-[0.95]">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="group hidden sm:inline-flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Shop All
            <span className="relative block w-10 h-px bg-zinc-300 overflow-hidden">
              <span className="absolute inset-0 bg-zinc-900 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            </span>
          </Link>
        </div>

        <div className="products-row grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {products.slice(0, 4).map((product, i) => (
            <div key={product._id} className="product-card-item group relative">
              <span className="featured-number absolute -top-1 left-0 text-[10px] tracking-[0.4em] uppercase text-zinc-400 z-10">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="pt-4">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
