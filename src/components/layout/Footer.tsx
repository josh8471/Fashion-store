"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="text-white font-light tracking-[0.3em] text-lg uppercase mb-4">Maison</p>
            <p className="text-sm leading-relaxed text-zinc-500">
              Elevated essentials crafted for the discerning. Timeless pieces, exceptional quality.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase mb-5">Shop</h4>
            <ul className="space-y-3 text-sm">
              {["New Arrivals", "Collections", "All Products", "Sale"].map((l) => (
                <li key={l}>
                  <Link href="/shop" className="hover:text-white transition-colors duration-200">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase mb-5">Help</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Size Guide", href: "/size-guide" },
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-xs tracking-widest uppercase mb-5">Stay in Touch</h4>
            <p className="text-sm text-zinc-500 mb-4">
              Early access, exclusive drops, and stories from behind the atelier.
            </p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white text-xs px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              <button
                type="submit"
                className="bg-white text-zinc-900 text-xs px-4 py-3 font-medium tracking-widest uppercase hover:bg-zinc-100 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Maison. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
