"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/utils";
import type { Collection } from "@/types";

const EMPTY = { name: "", description: "", image: "", sortOrder: "0" };

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchCollections = () => {
    setLoading(true);
    fetch("/api/collections")
      .then((r) => r.json())
      .then((j) => setCollections(j.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCollections(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: slugify(form.name), sortOrder: parseInt(form.sortOrder), isActive: true }),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Collection created!");
      setForm(EMPTY);
      setShowForm(false);
      fetchCollections();
    } else {
      setMessage("Failed to save.");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-light text-zinc-900">Collections</h1>
        <button onClick={() => setShowForm((v) => !v)} className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-800 transition-colors">
          {showForm ? "Cancel" : "+ Add Collection"}
        </button>
      </div>

      {message && <div className="mb-4 text-sm text-zinc-700 bg-zinc-100 px-4 py-3">{message}</div>}

      {showForm && (
        <form onSubmit={handleSave} className="bg-white border border-zinc-100 p-8 mb-8 space-y-5 max-w-lg">
          <h2 className="text-lg font-light text-zinc-900">New Collection</h2>
          {[
            { name: "name", label: "Name", type: "text", required: true },
            { name: "description", label: "Description", type: "text" },
            { name: "image", label: "Image URL", type: "text" },
            { name: "sortOrder", label: "Sort Order", type: "number" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1">{f.label}</label>
              <input
                type={f.type}
                required={f.required}
                value={(form as Record<string, string>)[f.name]}
                onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))}
                className="w-full border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-500"
              />
            </div>
          ))}
          <button type="submit" disabled={saving} className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-8 py-3 hover:bg-zinc-800 transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save Collection"}
          </button>
        </form>
      )}

      <div className="bg-white border border-zinc-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              {["Name", "Slug", "Sort Order", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-500 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {collections.map((c) => (
              <tr key={c._id} className="border-b border-zinc-50">
                <td className="px-4 py-3 text-zinc-900">{c.name}</td>
                <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{c.slug}</td>
                <td className="px-4 py-3 text-zinc-500">{c.sortOrder}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] tracking-widest uppercase px-2 py-1 bg-green-50 text-green-700">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && collections.length === 0 && (
          <p className="text-center py-12 text-zinc-400 text-sm">No collections yet.</p>
        )}
      </div>
    </div>
  );
}
