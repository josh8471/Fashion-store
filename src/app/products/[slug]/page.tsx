"use client";

import { useRef, useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

gsap.registerPlugin(useGSAP);

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const pageRef = useRef<HTMLDivElement>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addItem, openCart } = useCart();
  const mainImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((j) => setProduct(j.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useGSAP(
    () => {
      if (!product) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".product-gallery", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8 })
        .fromTo(".product-info", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8 }, "-=0.6")
        .fromTo(".product-info > *", { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.5 }, "-=0.4");
    },
    { scope: pageRef, dependencies: [product] }
  );

  const handleImageChange = (i: number) => {
    if (!mainImgRef.current) return;
    gsap.to(mainImgRef.current, {
      opacity: 0, scale: 0.98, duration: 0.2,
      onComplete: () => {
        setSelectedImg(i);
        gsap.to(mainImgRef.current, { opacity: 1, scale: 1, duration: 0.3 });
      },
    });
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    setAdding(true);
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0] || "",
      price: product.price,
      size: selectedSize,
      quantity: 1,
      slug: product.slug,
    });
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
    openCart();
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-zinc-100 animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 w-1/2 bg-zinc-100 animate-pulse" />
            <div className="h-10 w-3/4 bg-zinc-100 animate-pulse" />
            <div className="h-6 w-1/4 bg-zinc-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return notFound();

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="py-6 text-xs text-zinc-400 tracking-wide flex gap-2">
          <Link href="/" className="hover:text-zinc-900">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-zinc-900">Shop</Link>
          <span>/</span>
          <span className="text-zinc-600">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="flex gap-3">
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex flex-col gap-2 w-16">
                  {product.images.slice(0, 5).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => handleImageChange(i)}
                      className={`relative aspect-[3/4] overflow-hidden bg-zinc-100 border-2 transition-colors ${
                        selectedImg === i ? "border-zinc-900" : "border-transparent hover:border-zinc-300"
                      }`}
                    >
                      <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
              {/* Main image */}
              <div ref={mainImgRef} className="flex-1 relative aspect-[3/4] overflow-hidden bg-zinc-100">
                <Image
                  src={product.images[selectedImg] || "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {discount && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] tracking-widest uppercase px-2 py-1">
                    −{discount}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="product-info space-y-6 lg:pt-4">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-2">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl font-light text-zinc-900 leading-tight">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl text-zinc-900">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-base text-zinc-400 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
              {discount && (
                <span className="text-sm text-red-600">Save {discount}%</span>
              )}
            </div>

            {/* Size picker */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className={`text-xs tracking-widest uppercase ${sizeError ? "text-red-500" : "text-zinc-600"}`}>
                  {sizeError ? "Please select a size" : "Select Size"}
                </p>
                <button className="text-xs text-zinc-400 hover:text-zinc-900 underline underline-offset-2">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.size}
                    disabled={v.stock === 0}
                    onClick={() => setSelectedSize(v.size)}
                    className={`min-w-[44px] h-11 px-3 text-xs border transition-colors duration-150 ${
                      v.stock === 0
                        ? "border-zinc-100 text-zinc-300 line-through cursor-not-allowed"
                        : selectedSize === v.size
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {v.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`w-full py-4 text-xs tracking-widest uppercase transition-colors duration-200 ${
                added
                  ? "bg-green-700 text-white"
                  : "bg-zinc-900 text-white hover:bg-zinc-800"
              }`}
            >
              {adding ? "Adding..." : added ? "✓ Added to Bag" : "Add to Bag"}
            </button>

            {/* Description */}
            <div className="border-t border-zinc-100 pt-6 space-y-4">
              <p className="text-sm text-zinc-600 leading-relaxed">{product.description}</p>
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-[10px] tracking-widest uppercase text-zinc-400 border border-zinc-100 px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping info */}
            <div className="border-t border-zinc-100 pt-6 space-y-2 text-xs text-zinc-400">
              <p>✓ Free shipping on orders over ₹2,999</p>
              <p>✓ Free returns within 30 days</p>
              <p>✓ Authenticity guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
