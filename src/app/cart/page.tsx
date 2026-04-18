"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const FREE_SHIPPING = 2999;

export default function CartPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  useGSAP(
    () => {
      if (items.length > 0) {
        gsap.fromTo(
          ".cart-row",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" }
        );
      }
    },
    { scope: pageRef, dependencies: [items.length] }
  );

  const shipping = subtotal >= FREE_SHIPPING ? 0 : 199;
  const total = subtotal + shipping;

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-light text-zinc-900 tracking-tight mb-12">Your Bag</h1>

        {items.length === 0 ? (
          <div className="text-center py-24 space-y-6">
            <p className="text-zinc-400 text-lg">Your bag is empty.</p>
            <Link href="/shop" className="inline-block bg-zinc-900 text-white text-xs tracking-widest uppercase px-10 py-4 hover:bg-zinc-800 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 text-[10px] tracking-widest uppercase text-zinc-400 border-b border-zinc-100 pb-3">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Size</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="cart-row grid grid-cols-12 gap-4 items-start border-b border-zinc-50 pb-8">
                  {/* Image + name */}
                  <div className="col-span-6 flex gap-4">
                    <div className="relative w-20 h-24 bg-zinc-100 flex-shrink-0">
                      <Image
                        src={item.image || "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&q=80"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div>
                      <Link href={`/products/${item.slug}`} className="text-sm font-light text-zinc-900 hover:text-zinc-500 transition-colors leading-snug">
                        {item.name}
                      </Link>
                      <p className="text-xs text-zinc-400 mt-1">{formatPrice(item.price)}</p>
                      <button onClick={() => removeItem(item.productId, item.size)} className="text-xs text-zinc-400 hover:text-red-500 mt-2 underline underline-offset-2 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="col-span-2 text-center text-xs text-zinc-600 pt-1">{item.size}</div>

                  {/* Qty */}
                  <div className="col-span-2 flex items-start justify-center">
                    <div className="flex items-center border border-zinc-200">
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 text-lg">−</button>
                      <span className="w-8 text-center text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-zinc-900 text-lg">+</button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 text-right text-sm text-zinc-900 pt-1">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-2">
                <button onClick={clearCart} className="text-xs text-zinc-400 hover:text-red-500 underline underline-offset-2 transition-colors">
                  Clear bag
                </button>
                <Link href="/shop" className="text-xs tracking-widest uppercase text-zinc-600 hover:text-zinc-900 underline underline-offset-4">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-zinc-50 p-6 space-y-4 sticky top-24">
                <h2 className="text-xs tracking-widest uppercase text-zinc-900 mb-4">Order Summary</h2>

                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span className={shipping === 0 ? "text-green-700" : ""}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>

                {subtotal < FREE_SHIPPING && (
                  <p className="text-[11px] text-zinc-400">
                    Add {formatPrice(FREE_SHIPPING - subtotal)} more for free shipping
                  </p>
                )}

                <div className="border-t border-zinc-200 pt-4 flex justify-between font-medium">
                  <span className="text-sm">Total</span>
                  <span className="text-sm">{formatPrice(total)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-zinc-900 text-white text-xs tracking-widest uppercase text-center py-4 hover:bg-zinc-800 transition-colors mt-4"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
