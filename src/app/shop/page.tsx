"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CATEGORIES = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Accessories"];

export default function ShopPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("createdAt");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ sort, page: String(page), limit: "12" });
    if (category !== "All") params.set("category", category);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((j) => {
        setProducts(j.data || []);
        setTotalPages(j.pages || 1);
      })
      .finally(() => setLoading(false));
  }, [category, sort, page]);

  useGSAP(
    () => {
      gsap.fromTo(".shop-header", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    },
    { scope: pageRef }
  );

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="shop-header py-14">
          <p className="text-xs tracking-[0.4em] uppercase text-zinc-400 mb-3">Discover</p>
          <h1 className="text-5xl sm:text-6xl font-light text-zinc-900 tracking-tight">All Products</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-t border-zinc-100 pt-6">
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`text-xs tracking-widest uppercase px-4 py-2 transition-colors duration-200 ${
                  category === cat
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="text-xs tracking-wide border border-zinc-200 px-3 py-2 text-zinc-700 focus:outline-none focus:border-zinc-400"
          >
            <option value="createdAt">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse" />)}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 text-xs transition-colors ${
                  page === i + 1 ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
