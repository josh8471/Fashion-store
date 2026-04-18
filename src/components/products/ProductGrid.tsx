"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".grid-product-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: { amount: 0.5, from: "start" },
          ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 85%", once: true },
        }
      );
    },
    { scope: gridRef }
  );

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-zinc-400 text-sm tracking-wide">No products found.</p>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {products.map((product) => (
        <div key={product._id} className="grid-product-item">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
