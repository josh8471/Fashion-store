"use client";

import { useEffect, useState } from "react";
import { formatPrice, slugify } from "@/lib/utils";
import type { Product } from "@/types";

const EMPTY_FORM = {
  name: "", description: "", price: "", compareAtPrice: "",
  category: "", images: "", tags: "",
  sizes: "XS,S,M,L,XL", stock: "10", isFeatured: false,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((j) => setProducts(j.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      slug: slugify(form.name),
      description: form.description,
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
      category: form.category,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      variants: sizes.map((size) => ({ size, stock: parseInt(form.stock) })),
      isFeatured: form.isFeatured,
      isActive: true,
    };
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Product created!");
      setForm(EMPTY_FORM);
      setShowForm(false);
      fetchProducts();
    } else {
      setMessage("Failed to save product.");
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchProducts();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light text-zinc-900">Products</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-800 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {message && (
        <div className="mb-4 text-sm text-zinc-700 bg-zinc-100 px-4 py-3">{message}</div>
      )}

      {/* Add product form */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-zinc-100 p-8 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <h2 className="col-span-full text-lg font-light text-zinc-900 mb-2">New Product</h2>
          {[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "price", label: "Price (₹)", type: "number", required: true },
            { name: "compareAtPrice", label: "Compare At Price (₹)", type: "number" },
            { name: "category", label: "Category", type: "text", required: true },
            { name: "sizes", label: "Sizes (comma-separated)", type: "text" },
            { name: "stock", label: "Stock per size", type: "number" },
            { name: "tags", label: "Tags (comma-separated)", type: "text" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1">{f.label}</label>
              <input
                type={f.type}
                required={f.required}
                value={(form as Record<string, string | boolean>)[f.name] as string}
                onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
          ))}
          <div className="col-span-full">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-500 resize-none"
            />
          </div>
          <div className="col-span-full">
            <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1">Image URLs (one per line)</label>
            <textarea
              rows={3}
              value={form.images}
              onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
              className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-500 resize-none font-mono text-xs"
              placeholder="https://..."
            />
          </div>
          <div className="col-span-full flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              checked={form.isFeatured}
              onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="isFeatured" className="text-xs tracking-widest uppercase text-zinc-500">Featured product</label>
          </div>
          <div className="col-span-full">
            <button type="submit" disabled={saving} className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-8 py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-zinc-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white border border-zinc-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal">Product</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal">Category</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal">Price</th>
                <th className="text-center px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal">Status</th>
                <th className="text-center px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3 text-zinc-900">{p.name}</td>
                  <td className="px-4 py-3 text-zinc-500">{p.category}</td>
                  <td className="px-4 py-3 text-right text-zinc-900">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${p.isActive ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-400"}`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-zinc-400">{p.isFeatured ? "★" : "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleToggleActive(p._id, p.isActive)}
                      className="text-xs text-zinc-400 hover:text-zinc-900 underline underline-offset-2"
                    >
                      {p.isActive ? "Hide" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <p className="text-center py-12 text-zinc-400 text-sm">No products yet.</p>}
        </div>
      )}
    </div>
  );
}
