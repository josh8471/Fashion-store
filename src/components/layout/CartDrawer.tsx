"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, itemCount } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!drawerRef.current || !overlayRef.current) return;
      if (isOpen) {
        gsap.set([drawerRef.current, overlayRef.current], { display: "block" });
        gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(drawerRef.current, { x: "100%" }, { x: "0%", duration: 0.45, ease: "power3.out" });
      } else {
        gsap.to(drawerRef.current, {
          x: "100%",
          duration: 0.35,
          ease: "power3.in",
          onComplete: () => {
            if (drawerRef.current) drawerRef.current.style.display = "none";
          },
        });
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            if (overlayRef.current) overlayRef.current.style.display = "none";
          },
        });
      }
    },
    { dependencies: [isOpen] }
  );

  // prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const FREE_SHIPPING_THRESHOLD = 2999;
  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        style={{ display: "none" }}
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{ display: "none" }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <h2 className="text-xs tracking-widest uppercase font-medium">
            Your Bag {itemCount > 0 && <span className="text-zinc-400">({itemCount})</span>}
          </h2>
          <button onClick={closeCart} className="text-zinc-400 hover:text-zinc-900 transition-colors" aria-label="Close cart">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free shipping progress */}
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="px-6 py-3 bg-zinc-50 text-xs text-zinc-500">
            Spend{" "}
            <span className="text-zinc-900 font-medium">
              {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}
            </span>{" "}
            more for free shipping
            <div className="mt-2 h-0.5 bg-zinc-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                style={{ width: `${shippingProgress}%` }}
              />
            </div>
          </div>
        )}
        {subtotal >= FREE_SHIPPING_THRESHOLD && (
          <div className="px-6 py-3 bg-zinc-50 text-xs text-green-700 font-medium">
            ✓ You qualify for free shipping
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-zinc-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-zinc-400 text-sm tracking-wide">Your bag is empty</p>
              <button onClick={closeCart} className="text-xs tracking-widest uppercase underline underline-offset-4 text-zinc-700 hover:text-zinc-900">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                <div className="relative w-20 h-24 bg-zinc-100 flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80"}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="text-sm font-light text-zinc-900 hover:text-zinc-600 line-clamp-2 leading-snug"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-zinc-400 mt-1">Size: {item.size}</p>
                  <p className="text-sm text-zinc-900 mt-1">{formatPrice(item.price)}</p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-zinc-200">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 text-lg"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-zinc-900 text-lg"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-xs text-zinc-400 hover:text-red-500 transition-colors underline underline-offset-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 px-6 py-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500 tracking-wide">Subtotal</span>
              <span className="text-zinc-900 font-light">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-zinc-400">Shipping and taxes calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-zinc-900 text-white text-xs tracking-widest uppercase text-center py-4 hover:bg-zinc-800 transition-colors"
            >
              Checkout — {formatPrice(subtotal)}
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 underline underline-offset-4"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
