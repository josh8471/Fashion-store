"use client";

import { useRef, useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product } from "@/types";

gsap.registerPlugin(useGSAP);

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Product[]>([]);
  const [searched, setSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  useGSAP(
    () => {
      gsap.fromTo(".search-bar", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    },
    { scope: pageRef }
  );

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    router.push(`/search?q=${encodeURIComponent(q.trim())}`, { scroll: false });
    startTransition(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      const j = await res.json();
      setResults(j.data || []);
      setSearched(true);
    });
  };

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-light text-zinc-900 mb-10">Search</h1>

        {/* Search bar */}
        <div className="search-bar flex gap-0 max-w-xl mb-14">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            placeholder="Search for products..."
            className="flex-1 border border-zinc-300 border-r-0 px-5 py-4 text-sm focus:outline-none focus:border-zinc-600"
          />
          <button
            onClick={() => handleSearch(query)}
            className="bg-zinc-900 text-white px-6 py-4 hover:bg-zinc-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {isPending && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-zinc-100 animate-pulse" />)}
          </div>
        )}

        {!isPending && searched && (
          results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-zinc-400">No results for &ldquo;{searchParams.get("q")}&rdquo;</p>
              <p className="text-zinc-300 text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            <>
              <p className="text-xs tracking-widest text-zinc-400 uppercase mb-6">{results.length} results for &ldquo;{searchParams.get("q")}&rdquo;</p>
              <ProductGrid products={results} />
            </>
          )
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>;
}
