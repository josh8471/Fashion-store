import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin" };

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Collections", href: "/admin/collections" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-zinc-900 text-zinc-400 flex flex-col flex-shrink-0">
        <div className="px-6 py-6 border-b border-zinc-800">
          <p className="text-white font-light tracking-[0.2em] uppercase text-sm">Maison</p>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2.5 text-xs tracking-widest uppercase rounded hover:bg-zinc-800 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 py-5 border-t border-zinc-800">
          <Link href="/" className="text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-400">
            ← View Store
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
