"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

gsap.registerPlugin(useGSAP);

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AccountPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [tab, setTab] = useState<"orders" | "profile">("orders");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      const role = (session?.user as { role?: string } | undefined)?.role;
      if (role === "admin") {
        router.replace("/admin");
        return;
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch(`/api/orders?email=${encodeURIComponent(session.user.email)}`)
      .then((r) => r.json())
      .then((j) => setOrders(j.data || []))
      .finally(() => setLoadingOrders(false));
  }, [session]);

  useGSAP(
    () => {
      gsap.fromTo(
        ".account-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: "power2.out" }
      );
    },
    { scope: pageRef, dependencies: [tab, loadingOrders] }
  );

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="pt-24 pb-24 min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="account-item flex items-start justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-1">My Account</p>
            <h1 className="text-3xl font-light text-zinc-900">{session?.user?.name}</h1>
            <p className="text-zinc-500 text-sm mt-1">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 border border-zinc-200 px-4 py-2 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="account-item flex border-b border-zinc-200 mb-8">
          {(["orders", "profile"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-xs tracking-widest uppercase px-6 py-3 transition-colors ${
                tab === t
                  ? "border-b-2 border-zinc-900 text-zinc-900"
                  : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {t === "orders" ? "Order History" : "Profile"}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {loadingOrders ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-zinc-100 animate-pulse" />
              ))
            ) : orders.length === 0 ? (
              <div className="account-item text-center py-20 space-y-4">
                <p className="text-zinc-400">No orders yet.</p>
                <a
                  href="/shop"
                  className="inline-block bg-zinc-900 text-white text-xs tracking-widest uppercase px-8 py-3 hover:bg-zinc-800 transition-colors"
                >
                  Start Shopping
                </a>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="account-item bg-white border border-zinc-100 p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-xs tracking-widest uppercase text-zinc-400 mb-1">Order</p>
                      <p className="text-sm font-medium text-zinc-900 font-mono">{order.orderNumber}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-light text-zinc-900">{formatPrice(order.total)}</p>
                      <span className={`inline-block mt-1 text-[10px] tracking-widest uppercase px-2 py-1 ${STATUS_COLORS[order.status] || "bg-zinc-100 text-zinc-500"}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-4 pt-4 border-t border-zinc-50 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs text-zinc-500">
                        <span className="flex-1 mr-4 line-clamp-1">{item.name} — {item.size} × {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping */}
                  <div className="mt-3 text-xs text-zinc-400">
                    Ships to: {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="account-item bg-white border border-zinc-100 p-8 space-y-6 max-w-md">
            <h2 className="text-sm tracking-widest uppercase text-zinc-700">Account Details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1">Name</p>
                <p className="text-zinc-900">{session?.user?.name}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1">Email</p>
                <p className="text-zinc-900">{session?.user?.email}</p>
              </div>
            </div>
            <div className="border-t border-zinc-100 pt-6">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-xs tracking-widest uppercase text-red-500 hover:text-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
