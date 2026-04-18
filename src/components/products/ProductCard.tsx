"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

gsap.registerPlugin(useGSAP);

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const { addItem, openCart } = useCart();

  const { contextSafe } = useGSAP({ scope: cardRef });

  const handleMouseEnter = contextSafe(() => {
    gsap.to(imageRef.current, { scale: 1.04, duration: 0.6, ease: "power2.out" });
    gsap.to(actionsRef.current, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    if (product.images.length > 1) setImgIndex(1);
  });

  const handleMouseLeave = contextSafe(() => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.6, ease: "power2.out" });
    gsap.to(actionsRef.current, { opacity: 0, y: 8, duration: 0.25, ease: "power2.in" });
    setImgIndex(0);
  });

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultSize = product.variants.find((v) => v.stock > 0)?.size;
    if (!defaultSize) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0] || "",
      price: product.price,
      size: defaultSize,
      quantity: 1,
      slug: product.slug,
    });
    openCart();
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div ref={cardRef} className="group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div className="relative overflow-hidden bg-zinc-100 aspect-[3/4]">
          <div ref={imageRef} className="absolute inset-0">
            <Image
              src={product.images[imgIndex] || "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="bg-zinc-900 text-white text-[10px] tracking-widest uppercase px-2 py-1">
                Featured
              </span>
            )}
            {discount && (
              <span className="bg-red-600 text-white text-[10px] tracking-widest uppercase px-2 py-1">
                −{discount}%
              </span>
            )}
          </div>

          {/* Quick add */}
          <div
            ref={actionsRef}
            className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-2"
          >
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white text-zinc-900 text-xs tracking-widest uppercase py-3 hover:bg-zinc-900 hover:text-white transition-colors duration-200"
            >
              Quick Add
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-1">
          <p className="text-[10px] tracking-widest uppercase text-zinc-400">{product.category}</p>
          <h3 className="text-sm font-light text-zinc-900 leading-snug line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm text-zinc-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-zinc-400 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          {/* Size dots */}
          <div className="flex gap-1 pt-1">
            {product.variants.slice(0, 5).map((v) => (
              <span
                key={v.size}
                className={`text-[10px] tracking-wide ${v.stock > 0 ? "text-zinc-500" : "text-zinc-300 line-through"}`}
              >
                {v.size}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
