"use client";

import { useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function OrderConfirmedContent() {
  const pageRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".confirm-icon", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 })
        .fromTo(".confirm-text > *", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, "-=0.2");
    },
    { scope: pageRef }
  );

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-6 space-y-8">
        <div className="confirm-icon w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="confirm-text space-y-4">
          <h1 className="text-3xl font-light text-zinc-900">Order Confirmed</h1>
          {orderNumber && (
            <p className="text-zinc-500 text-sm">
              Order <span className="text-zinc-900 font-medium">{orderNumber}</span>
            </p>
          )}
          <p className="text-zinc-500 text-sm leading-relaxed">
            Thank you for your purchase. A confirmation has been sent to your email.
            Your order will be processed and shipped within 2–3 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link href="/shop" className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-8 py-4 hover:bg-zinc-800 transition-colors">
              Continue Shopping
            </Link>
            <Link href="/" className="border border-zinc-200 text-zinc-700 text-xs tracking-widest uppercase px-8 py-4 hover:bg-zinc-50 transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <OrderConfirmedContent />
    </Suspense>
  );
}
