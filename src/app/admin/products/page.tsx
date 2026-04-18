"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

const EMPTY_FORM = {
  name: "", description: "", price: "", compareAtPrice: "",
  category: "", images: "", tags: "",
  sizes: "XS,S,M,L,XL", stock: "10", isFeatured: false, isActive: true,
};

type FormState = typeof EMPTY_FORM;

function ProductForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: FormState;
  onSave: (form: FormState) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: string, v: string | boolean) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="bg-white border border-zinc-100 p-8 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
    >
      <h2 className="col-span-full text-lg font-light text-zinc-900 mb-2">
        {initial.name ? "Edit Product" : "New Product"}
      </h2>
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
            onChange={(e) => set(f.name, e.target.value)}
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
          onChange={(e) => set("description", e.target.value)}
          className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-500 resize-none"
        />
      </div>
      <div className="col-span-full">
        <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1">Image URLs (one per line)</label>
        <textarea
          rows={3}
          value={form.images}
          onChange={(e) => set("images", e.target.value)}
          className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-500 resize-none font-mono text-xs"
          placeholder="https://..."
        />
      </div>
      <div className="col-span-full flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="w-4 h-4" />
          <span className="text-xs tracking-widest uppercase text-zinc-500">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4" />
          <span className="text-xs tracking-widest uppercase text-zinc-500">Active (visible in store)</span>
        </label>
      </div>
      <div className="col-span-full flex gap-3">
        <button type="submit" disabled={saving} className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-8 py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save Product"}
        </button>
        <button type="button" onClick={onCancel} className="border border-zinc-200 text-zinc-600 text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((j) => setProducts(j.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const formFromProduct = (p: Product): FormState => ({
    name: p.name,
    description: p.description,
    price: String(p.price),
    compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
    category: p.category,
    images: p.images?.join("\n") ?? "",
    tags: p.tags?.join(", ") ?? "",
    sizes: p.variants?.map((v: { size: string }) => v.size).join(",") ?? "XS,S,M,L,XL",
    stock: p.variants?.[0]?.stock ? String(p.variants[0].stock) : "10",
    isFeatured: p.isFeatured ?? false,
    isActive: p.isActive ?? true,
  });

  const buildPayload = (form: FormState) => {
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    return {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      compareAtPrice: form.compareAtPrice ? parseFloat(form.compareAtPrice) : undefined,
      category: form.category,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      variants: sizes.map((size) => ({ size, stock: parseInt(form.stock) })),
      isFeatured: form.isFeatured,
      isActive: form.isActive,
    };
  };

  const handleCreate = async (form: FormState) => {
    setSaving(true);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(form)),
    });
    setSaving(false);
    if (res.ok) {
      setMessage({ text: "Product created!", ok: true });
      setShowForm(false);
      fetchProducts();
    } else {
      const j = await res.json();
      setMessage({ text: j.error || "Failed to save product.", ok: false });
    }
  };

  const handleEdit = async (form: FormState) => {
    if (!editProduct) return;
    setSaving(true);
    const res = await fetch(`/api/admin/products/${editProduct._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(form)),
    });
    setSaving(false);
    if (res.ok) {
      setMessage({ text: "Product updated!", ok: true });
      setEditProduct(null);
      fetchProducts();
    } else {
      setMessage({ text: "Failed to update product.", ok: false });
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchProducts();
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-1">Catalogue</p>
          <h1 className="text-3xl font-light text-zinc-900">Products</h1>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setEditProduct(null); }}
          className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-800 transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Product"}
        </button>
      </div>

      {message && (
        <div className={`mb-4 text-sm px-4 py-3 ${message.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
          {message.text}
        </div>
      )}

      {showForm && !editProduct && (
        <ProductForm initial={EMPTY_FORM} onSave={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
      )}

      {editProduct && (
        <ProductForm initial={formFromProduct(editProduct)} onSave={handleEdit} onCancel={() => setEditProduct(null)} saving={saving} />
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-light text-zinc-900 mb-2">Delete product?</h3>
            <p className="text-sm text-zinc-500 mb-6">This is permanent and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 text-white text-xs tracking-widest uppercase py-3 hover:bg-red-700 transition-colors">
                Delete
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-zinc-200 text-zinc-700 text-xs tracking-widest uppercase py-3 hover:bg-zinc-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-zinc-100 animate-pulse" />)}</div>
      ) : (
        <div className="bg-white border border-zinc-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50">
                {["Product", "Category", "Price", "Status", "Featured", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-zinc-900">{p.name}</p>
                    <p className="text-xs text-zinc-400 font-mono">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{p.category}</td>
                  <td className="px-4 py-3 text-zinc-900">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] tracking-widest uppercase px-2 py-1 ${p.isActive ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-400"}`}>
                      {p.isActive ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-zinc-400">{p.isFeatured ? "★" : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setEditProduct(p); setShowForm(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        className="text-xs text-zinc-500 hover:text-zinc-900 underline underline-offset-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(p._id)}
                        className="text-xs text-red-400 hover:text-red-700 underline underline-offset-2"
                      >
                        Delete
                      </button>
                    </div>
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
