"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  pendingOrders: number;
  paidOrders: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customer: { name: string; email: string };
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-purple-50 text-purple-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/orders?limit=8").then((r) => r.json()),
    ]).then(([s, orders]) => {
      setStats(s);
      setRecentOrders(orders.data || []);
      setLoading(false);
    });
  }, []);

  const statCards = stats
    ? [
        { label: "Total Orders", value: stats.totalOrders },
        { label: "Revenue", value: formatPrice(stats.totalRevenue) },
        { label: "Products", value: stats.totalProducts },
        { label: "Users", value: stats.totalUsers },
        { label: "Pending Orders", value: stats.pendingOrders },
        { label: "Paid Orders", value: stats.paidOrders },
      ]
    : [];

  return (
    <div className="p-8">
      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-1">Overview</p>
        <h1 className="text-3xl font-light text-zinc-900">Dashboard</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-zinc-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white border border-zinc-100 p-6">
              <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">{s.label}</p>
              <p className="text-3xl font-light text-zinc-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white border border-zinc-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs tracking-widest uppercase text-zinc-700">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-zinc-400 hover:text-zinc-900 underline underline-offset-2">
              View All
            </Link>
          </div>
          <div className="space-y-0">
            {recentOrders.length === 0 ? (
              <p className="text-zinc-400 text-sm py-6 text-center">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between py-3 border-b border-zinc-50 last:border-0">
                  <div>
                    <p className="text-sm text-zinc-900 font-mono">{order.orderNumber}</p>
                    <p className="text-xs text-zinc-400">{order.customer.name} · {order.customer.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-zinc-900">{formatPrice(order.total)}</p>
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${STATUS_COLORS[order.status] || "bg-zinc-50 text-zinc-500"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick links */}
        <div className="space-y-3">
          {[
            { label: "Manage Products", href: "/admin/products", sub: "Add, edit, hide products" },
            { label: "Manage Orders", href: "/admin/orders", sub: "Update order status" },
            { label: "Manage Collections", href: "/admin/collections", sub: "Create collections" },
            { label: "View Users", href: "/admin/users", sub: "All registered users" },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="block bg-white border border-zinc-100 p-4 hover:border-zinc-300 transition-colors group">
              <p className="text-xs tracking-widest uppercase text-zinc-900 group-hover:text-zinc-700">{l.label}</p>
              <p className="text-xs text-zinc-400 mt-0.5">{l.sub}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
