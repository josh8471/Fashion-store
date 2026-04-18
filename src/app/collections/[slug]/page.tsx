"use client";

import { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductGrid from "@/components/products/ProductGrid";
import type { Collection, Product } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function CollectionPage() {
  const { slug } = useParams<{ slug: string }>();
  const pageRef = useRef<HTMLDivElement>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("createdAt");

  useEffect(() => {
    fetch(`/api/collections/${slug}`)
      .then((r) => r.json())
      .then((j) => {
        setCollection(j.data || null);
        setProducts(j.products || []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const sorted = [...products].sort((a, b) => {
    if (sort === "priceAsc") return a.price - b.price;
    if (sort === "priceDesc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  useGSAP(
    () => {
      gsap.fromTo(
        ".col-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    },
    { scope: pageRef, dependencies: [loading] }
  );

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen">
      {/* Hero banner */}
      <div
        className="relative h-56 sm:h-72 bg-zinc-900 flex items-end"
        style={
          collection?.image
            ? { backgroundImage: `url(${collection.image})`, backgroundSize: "cover", backgroundPosition: "center" }
            : {}
        }
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 col-header">
          <p className="text-white/50 text-xs tracking-widest uppercase mb-2">Collection</p>
          <h1 className="text-white text-4xl sm:text-5xl font-light tracking-tight">
            {collection?.name || slug}
          </h1>
          {collection?.description && (
            <p className="text-white/60 text-sm mt-2">{collection.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-zinc-400">{products.length} products</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs tracking-wide border border-zinc-200 px-3 py-2 text-zinc-700 focus:outline-none focus:border-zinc-400"
          >
            <option value="createdAt">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <ProductGrid products={sorted} />
        )}
      </div>
    </div>
  );
}
