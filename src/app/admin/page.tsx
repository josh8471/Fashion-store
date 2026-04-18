"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<{ _id: string; orderNumber: string; customer: { name: string }; total: number; status: string; createdAt: string }[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/orders?limit=5").then((r) => r.json()),
      fetch("/api/admin/products?limit=1").then((r) => r.json()),
    ]).then(([orders, products]) => {
      const orderList = orders.data || [];
      setRecentOrders(orderList);
      setStats({
        totalOrders: orders.total || 0,
        totalRevenue: orderList.reduce((s: number, o: { total: number }) => s + o.total, 0),
        totalProducts: products.total || 0,
        pendingOrders: orderList.filter((o: { status: string }) => o.status === "pending").length,
      });
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-light text-zinc-900 mb-10">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Total Orders", value: stats.totalOrders },
          { label: "Revenue", value: formatPrice(stats.totalRevenue) },
          { label: "Products", value: stats.totalProducts },
          { label: "Pending", value: stats.pendingOrders },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-zinc-100 p-6">
            <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">{s.label}</p>
            <p className="text-3xl font-light text-zinc-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-zinc-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm tracking-widest uppercase text-zinc-700">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-zinc-400 hover:text-zinc-900 underline">View All</Link>
        </div>
        <div className="space-y-3">
          {recentOrders.length === 0 ? (
            <p className="text-zinc-400 text-sm">No orders yet.</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order._id} className="flex items-center justify-between py-3 border-b border-zinc-50">
                <div>
                  <p className="text-sm text-zinc-900">{order.orderNumber}</p>
                  <p className="text-xs text-zinc-400">{order.customer.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-900">{formatPrice(order.total)}</p>
                  <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${
                    order.status === "delivered" ? "bg-green-50 text-green-700" :
                    order.status === "pending" ? "bg-yellow-50 text-yellow-700" :
                    "bg-zinc-50 text-zinc-500"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
