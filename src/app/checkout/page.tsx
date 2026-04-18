"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import type { ShippingAddress } from "@/types";

gsap.registerPlugin(useGSAP);

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
}

const FREE_SHIPPING = 2999;
const SHIPPING_COST = 199;

const STEPS = ["Shipping", "Review", "Payment"];

export default function CheckoutPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ShippingAddress>({
    name: "", email: "", phone: "",
    line1: "", line2: "", city: "", state: "", pincode: "", country: "India",
  });

  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  useGSAP(
    () => {
      const el = document.querySelector(".checkout-panel");
      if (el) gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
    },
    { dependencies: [step] }
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep0 = () => {
    const required: (keyof ShippingAddress)[] = ["name", "email", "phone", "line1", "city", "state", "pincode"];
    return required.every((k) => (form[k] as string).trim().length > 0);
  };

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create order in DB
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          shippingAddress: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, pincode: form.pincode, country: form.country },
          items: items.map((i) => ({ productId: i.productId, name: i.name, image: i.image, size: i.size, price: i.price, quantity: i.quantity })),
          subtotal,
          shippingCost: shipping,
          total,
        }),
      });
      if (!orderRes.ok) {
        const errJson = await orderRes.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.details || "Failed to create order");
      }
      const { data: order } = await orderRes.json();

      // 2. Create Razorpay order
      const rzpRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, receipt: order.orderNumber }),
      });
      if (!rzpRes.ok) throw new Error("Failed to create payment");
      const { data: rzpOrder } = await rzpRes.json();

      // 3. Load Razorpay SDK
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Razorpay SDK failed to load");

      // 4. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Maison",
        description: `Order ${order.orderNumber}`,
        order_id: rzpOrder.id,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#18181b" },
        handler: async (response: RazorpayResponse) => {
          // 5. Verify payment
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, orderId: order._id }),
          });
          if (verifyRes.ok) {
            clearCart();
            router.push(`/order-confirmed?order=${order.orderNumber}`);
          } else {
            setError("Payment verification failed. Contact support with your order number.");
          }
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items.length, router]);

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  if (items.length === 0) return null;

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen bg-zinc-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Steps */}
        <div className="flex items-center justify-center gap-0 mb-14">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 text-xs tracking-widest uppercase ${i === step ? "text-zinc-900" : i < step ? "text-green-700" : "text-zinc-300"}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] ${i === step ? "border-zinc-900 bg-zinc-900 text-white" : i < step ? "border-green-700 bg-green-700 text-white" : "border-zinc-200"}`}>
                  {i < step ? "✓" : i + 1}
                </span>
                {s}
              </div>
              {i < STEPS.length - 1 && <div className={`w-12 h-px mx-3 ${i < step ? "bg-green-700" : "bg-zinc-200"}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main panel */}
          <div className="lg:col-span-2">
            <div className="checkout-panel bg-white p-8">
              {/* Step 0 — Shipping */}
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-light text-zinc-900 mb-6">Shipping Details</h2>
                  {[
                    { name: "name", label: "Full Name", type: "text" },
                    { name: "email", label: "Email Address", type: "email" },
                    { name: "phone", label: "Phone Number", type: "tel" },
                    { name: "line1", label: "Address Line 1", type: "text" },
                    { name: "line2", label: "Address Line 2 (Optional)", type: "text" },
                    { name: "city", label: "City", type: "text" },
                    { name: "state", label: "State", type: "text" },
                    { name: "pincode", label: "PIN Code", type: "text" },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5">{field.label}</label>
                      <input
                        name={field.name}
                        type={field.type}
                        value={(form as unknown as Record<string, string>)[field.name]}
                        onChange={handleFormChange}
                        className="w-full border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => { if (validateStep0()) setStep(1); else setError("Please fill all required fields."); }}
                    className="mt-4 w-full bg-zinc-900 text-white text-xs tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors"
                  >
                    Continue to Review
                  </button>
                </div>
              )}

              {/* Step 1 — Review */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light text-zinc-900">Review Order</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={`${item.productId}-${item.size}`} className="flex gap-4 py-3 border-b border-zinc-50">
                        <div className="text-sm text-zinc-900 flex-1">{item.name}</div>
                        <div className="text-xs text-zinc-500">×{item.quantity} · {item.size}</div>
                        <div className="text-sm text-zinc-900">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-zinc-50 p-4 text-sm space-y-1">
                    <p className="font-medium text-xs tracking-widest uppercase text-zinc-500 mb-2">Ships to</p>
                    <p className="text-zinc-700">{form.name}</p>
                    <p className="text-zinc-500">{form.line1}{form.line2 ? `, ${form.line2}` : ""}</p>
                    <p className="text-zinc-500">{form.city}, {form.state} {form.pincode}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(0)} className="flex-1 border border-zinc-200 text-zinc-700 text-xs tracking-widest uppercase py-4 hover:bg-zinc-50 transition-colors">Edit Address</button>
                    <button onClick={() => setStep(2)} className="flex-1 bg-zinc-900 text-white text-xs tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors">Continue to Payment</button>
                  </div>
                </div>
              )}

              {/* Step 2 — Payment */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light text-zinc-900">Payment</h2>
                  <div className="border border-zinc-100 p-4 rounded flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">R</span>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-900">Razorpay Secure Checkout</p>
                      <p className="text-xs text-zinc-400">Cards, UPI, Net Banking, Wallets</p>
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3">{error}</p>}
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-zinc-900 text-white text-xs tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Processing..." : `Pay ${formatPrice(total)}`}
                  </button>
                  <p className="text-[11px] text-zinc-400 text-center">Secured by Razorpay. Your payment info is never stored.</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sticky top-24 space-y-4">
              <h3 className="text-xs tracking-widest uppercase text-zinc-900">Summary</h3>
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-xs text-zinc-500">
                  <span className="line-clamp-1 flex-1 mr-2">{item.name} ×{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-zinc-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Shipping</span>
                  <span className={shipping === 0 ? "text-green-700" : ""}>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-zinc-100">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
