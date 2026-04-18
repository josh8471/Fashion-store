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
      const split = SplitText.create(".featured-heading", { type: "words" });
      gsap.from(split.words, {
        opacity: 0,
        y: 40,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".featured-heading", start: "top 85%" },
      });

      if (products.length > 0) {
        gsap.fromTo(
          ".product-card-item",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: ".products-row", start: "top 80%", once: true },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase text-zinc-400 mb-3">Hand-Picked</p>
            <h2 className="featured-heading text-4xl sm:text-5xl font-light text-zinc-900 tracking-tight">
              Featured Pieces
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 underline underline-offset-4 transition-colors"
          >
            Shop All
          </Link>
        </div>

        <div className="products-row grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <div key={product._id} className="product-card-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
