"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCart } from "@/context/CartContext";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "Collections", href: "/collections" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const { itemCount, toggleCart } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (navRef.current) {
        if (y > lastScrollY.current && y > 80) {
          gsap.to(navRef.current, { y: "-100%", duration: 0.4, ease: "power2.in" });
        } else {
          gsap.to(navRef.current, { y: "0%", duration: 0.4, ease: "power2.out" });
        }
      }
      setScrolled(y > 20);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // mobile menu animation
  useGSAP(
    () => {
      if (!menuRef.current) return;
      if (menuOpen) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", display: "flex" }
        );
      } else {
        gsap.to(menuRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            if (menuRef.current) menuRef.current.style.display = "none";
          },
        });
      }
    },
    { scope: menuRef, dependencies: [menuOpen] }
  );

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="font-light tracking-[0.3em] text-lg uppercase text-zinc-900">
            Maison
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-widest uppercase transition-colors duration-200 ${
                  pathname === link.href ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-zinc-500 hover:text-zinc-900 transition-colors" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {session ? (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/account" className="text-xs tracking-widest uppercase text-zinc-500 hover:text-zinc-900 transition-colors">
                  {session.user?.name?.split(" ")[0]}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
                  aria-label="Sign out"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-zinc-500 hover:text-zinc-900 transition-colors hidden md:block" aria-label="Account">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            <button
              onClick={toggleCart}
              className="relative text-zinc-500 hover:text-zinc-900 transition-colors"
              aria-label={`Cart (${itemCount} items)`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-zinc-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-zinc-700"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`block h-px bg-current transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-1" : ""}`} />
                <span className={`block h-px bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
                <span className={`block h-px bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        ref={menuRef}
        style={{ display: "none" }}
        className="md:hidden flex-col bg-white border-t border-zinc-100 px-6 py-6 gap-6"
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="text-sm tracking-widest uppercase text-zinc-700 hover:text-zinc-900"
          >
            {link.label}
          </Link>
        ))}
        <Link href="/account" onClick={() => setMenuOpen(false)} className="text-sm tracking-widest uppercase text-zinc-700 hover:text-zinc-900">
          Account
        </Link>
      </div>
    </nav>
  );
}
