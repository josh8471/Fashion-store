"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = (status?: string) => {
    setLoading(true);
    const url = status && status !== "all" ? `/api/admin/orders?status=${status}` : "/api/admin/orders";
    fetch(url)
      .then((r) => r.json())
      .then((j) => setOrders(j.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    fetchOrders(filter !== "all" ? filter : undefined);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-light text-zinc-900 mb-8">Orders</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["all", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); fetchOrders(s !== "all" ? s : undefined); }}
            className={`text-xs tracking-widest uppercase px-4 py-2 transition-colors ${
              filter === s ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-zinc-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white border border-zinc-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", "Update Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 text-zinc-900 font-mono text-xs">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-900">{order.customer.name}</p>
                    <p className="text-zinc-400 text-xs">{order.customer.email}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{order.items.length}</td>
                  <td className="px-4 py-3 text-zinc-900">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${
                      order.paymentStatus === "paid" ? "bg-green-50 text-green-700" :
                      order.paymentStatus === "failed" ? "bg-red-50 text-red-700" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${
                      order.status === "delivered" ? "bg-green-50 text-green-700" :
                      order.status === "cancelled" ? "bg-red-50 text-red-700" :
                      "bg-zinc-100 text-zinc-500"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border border-zinc-200 px-2 py-1.5 text-zinc-700 focus:outline-none focus:border-zinc-400"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center py-12 text-zinc-400 text-sm">No orders found.</p>}
        </div>
      )}
    </div>
  );
}
