"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((j) => {
        setUsers(j.data || []);
        setTotal(j.total || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-1">Accounts</p>
        <h1 className="text-3xl font-light text-zinc-900">Users</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-zinc-100 p-6">
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">Total Users</p>
          <p className="text-3xl font-light text-zinc-900">{total}</p>
        </div>
        <div className="bg-white border border-zinc-100 p-6">
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">Google OAuth</p>
          <p className="text-3xl font-light text-zinc-900">
            {users.filter((u) => !u.password).length}
          </p>
        </div>
        <div className="bg-white border border-zinc-100 p-6">
          <p className="text-xs tracking-widest uppercase text-zinc-400 mb-2">Email Signup</p>
          <p className="text-3xl font-light text-zinc-900">
            {users.filter((u) => !!u.password).length}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-zinc-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white border border-zinc-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {["Name", "Email", "Sign-in Method", "Orders", "Total Spent", "Role", "Joined"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 text-zinc-900">{u.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${
                      u.password ? "bg-zinc-100 text-zinc-600" : "bg-blue-50 text-blue-700"
                    }`}>
                      {u.password ? "Email" : "Google"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{u.orderCount}</td>
                  <td className="px-4 py-3 text-zinc-900">{formatPrice(u.totalSpent)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${
                      u.role === "admin" ? "bg-purple-50 text-purple-700" : "bg-zinc-50 text-zinc-500"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center py-12 text-zinc-400 text-sm">No users yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
