"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", exact: true },
  { label: "Products", href: "/admin/products" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Collections", href: "/admin/collections" },
  { label: "Users", href: "/admin/users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <aside className="w-60 bg-zinc-900 text-zinc-400 flex flex-col flex-shrink-0 fixed h-full">
        <div className="px-6 py-6 border-b border-zinc-800">
          <p className="text-white font-light tracking-[0.2em] uppercase text-sm">Maison</p>
          <p className="text-zinc-500 text-[10px] tracking-widest uppercase mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-0.5">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-xs tracking-widest uppercase rounded transition-colors ${
                isActive(item.href, item.exact)
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-5 border-t border-zinc-800 space-y-2">
          <Link href="/" className="block px-3 text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-400 transition-colors">
            ← View Store
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="block px-3 text-[10px] tracking-widest uppercase text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-60 overflow-auto min-h-screen">{children}</main>
    </div>
  );
}
