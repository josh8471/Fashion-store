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
  { label: "Editorial", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const TICKER_MESSAGES = [
  "Complimentary shipping on orders over ₹2,999",
  "New arrivals — Spring Summer 2026 now live",
  "30-day returns · Handcrafted in India",
];

function HoverLink({
  label,
  href,
  isActive,
  isLight,
}: {
  label: string;
  href: string;
  isActive: boolean;
  isLight: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative group py-2 overflow-hidden"
      aria-current={isActive ? "page" : undefined}
    >
      <span className="relative block text-[11px] tracking-[0.3em] uppercase overflow-hidden h-[14px]">
        <span
          className={`block transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full ${
            isLight ? "text-white/80" : isActive ? "text-zinc-900" : "text-zinc-500"
          }`}
        >
          {label}
        </span>
        <span
          className={`absolute top-full left-0 block transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] group-hover:-translate-y-full ${
            isLight ? "text-white" : "text-zinc-900"
          }`}
        >
          {label}
        </span>
      </span>
      <span
        className={`absolute bottom-1 left-0 right-0 h-px origin-left transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        } ${isLight ? "bg-white" : "bg-zinc-900"}`}
      />
    </Link>
  );
}

function Ticker() {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TICKER_MESSAGES.length);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      if (!ref.current) return;
      gsap.fromTo(
        ref.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
    },
    { dependencies: [index] }
  );

  return (
    <div className="bg-zinc-950 text-white/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between text-[10px] tracking-[0.3em] uppercase">
        <span className="hidden sm:block text-white/40">✦ Maison Atelier</span>
        <div ref={ref} className="flex-1 text-center sm:text-center truncate">
          {TICKER_MESSAGES[index]}
        </div>
        <span className="hidden sm:flex items-center gap-3 text-white/40">
          <span className="flex gap-1">
            {TICKER_MESSAGES.map((_, i) => (
              <span
                key={i}
                className={`block w-1 h-1 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/20"
                }`}
              />
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const cartBadgeRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const { itemCount, toggleCart } = useCart();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const prevCount = useRef(itemCount);

  const role = (session?.user as { role?: string } | undefined)?.role;
  const isHome = pathname === "/";
  // transparent over hero only when at top AND on home
  const isLight = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (navRef.current) {
        if (y > lastScrollY.current && y > 120) {
          gsap.to(navRef.current, { y: "-100%", duration: 0.45, ease: "power2.in" });
        } else {
          gsap.to(navRef.current, { y: "0%", duration: 0.45, ease: "power2.out" });
        }
      }
      setScrolled(y > 24);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (itemCount > prevCount.current && cartBadgeRef.current) {
      gsap
        .timeline()
        .fromTo(
          cartBadgeRef.current,
          { scale: 1 },
          { scale: 1.45, duration: 0.18, ease: "power2.out" }
        )
        .to(cartBadgeRef.current, {
          scale: 1,
          duration: 0.35,
          ease: "elastic.out(1, 0.4)",
        });
    }
    prevCount.current = itemCount;
  }, [itemCount]);

  useGSAP(
    () => {
      if (!overlayRef.current) return;
      if (menuOpen) {
        document.body.style.overflow = "hidden";
        gsap
          .timeline()
          .set(overlayRef.current, { display: "flex" })
          .fromTo(
            ".menu-bg-panel",
            { scaleY: 0 },
            { scaleY: 1, duration: 0.6, ease: "power4.inOut" }
          )
          .fromTo(
            ".menu-link",
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.07,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.15"
          )
          .fromTo(
            ".menu-meta",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.3"
          );
      } else {
        gsap
          .timeline({
            onComplete: () => {
              document.body.style.overflow = "";
              if (overlayRef.current) overlayRef.current.style.display = "none";
            },
          })
          .to(".menu-link", {
            y: 30,
            opacity: 0,
            stagger: 0.03,
            duration: 0.3,
            ease: "power2.in",
          })
          .to(
            ".menu-bg-panel",
            {
              scaleY: 0,
              duration: 0.5,
              ease: "power4.inOut",
              transformOrigin: "top center",
            },
            "-=0.15"
          );
      }
    },
    { dependencies: [menuOpen] }
  );

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
          isLight
            ? "bg-transparent"
            : "bg-white/85 backdrop-blur-xl border-b border-zinc-100"
        }`}
      >
        <Ticker />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex-1 flex items-center">
              <Link
                href="/"
                className={`font-light tracking-[0.35em] text-lg uppercase transition-colors duration-500 ${
                  isLight ? "text-white" : "text-zinc-900"
                }`}
              >
                Maison
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
              {NAV_LINKS.map((link) => (
                <HoverLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  isActive={pathname === link.href}
                  isLight={isLight}
                />
              ))}
            </div>

            <div className="flex-1 flex items-center justify-end gap-5">
              <Link
                href="/search"
                className={`transition-colors duration-500 ${
                  isLight ? "text-white/80 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                }`}
                aria-label="Search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Link>

              {role === "admin" && (
                <Link
                  href="/admin"
                  className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 text-[10px] tracking-[0.3em] uppercase border transition-colors duration-500 ${
                    isLight
                      ? "border-white/40 text-white hover:bg-white hover:text-zinc-900"
                      : "border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <span className="block w-1 h-1 rounded-full bg-current" />
                  Admin
                </Link>
              )}

              {session ? (
                <div className="hidden md:flex items-center gap-4">
                  <Link
                    href="/account"
                    className={`text-[11px] tracking-[0.3em] uppercase transition-colors duration-500 ${
                      isLight ? "text-white/80 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    {session.user?.name?.split(" ")[0] ?? "Account"}
                  </Link>
                  <span className={`h-3 w-px ${isLight ? "bg-white/30" : "bg-zinc-300"}`} />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`text-[11px] tracking-[0.3em] uppercase transition-colors duration-500 ${
                      isLight ? "text-white/60 hover:text-white" : "text-zinc-400 hover:text-zinc-900"
                    }`}
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`hidden md:block transition-colors duration-500 ${
                    isLight ? "text-white/80 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                  aria-label="Account"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-[18px] w-[18px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}

              <button
                onClick={toggleCart}
                className={`relative transition-colors duration-500 ${
                  isLight ? "text-white/80 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
                }`}
                aria-label={`Cart (${itemCount} items)`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <span
                    ref={cartBadgeRef}
                    className={`absolute -top-1.5 -right-1.5 text-[9px] font-medium w-[18px] h-[18px] rounded-full flex items-center justify-center ${
                      isLight ? "bg-white text-zinc-900" : "bg-zinc-900 text-white"
                    }`}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              <button
                className={`md:hidden transition-colors duration-500 ${
                  isLight ? "text-white" : "text-zinc-900"
                }`}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                <div className="w-6 flex flex-col gap-[5px]">
                  <span
                    className={`block h-px bg-current transition-transform duration-300 ${
                      menuOpen ? "rotate-45 translate-y-[6px]" : ""
                    }`}
                  />
                  <span
                    className={`block h-px bg-current transition-opacity duration-300 ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <span
                    className={`block h-px bg-current transition-transform duration-300 ${
                      menuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile overlay */}
      <div
        ref={overlayRef}
        style={{ display: "none" }}
        className="fixed inset-0 z-40 md:hidden flex-col"
      >
        <div className="menu-bg-panel absolute inset-0 bg-zinc-950 origin-top" />
        <div className="relative flex-1 flex flex-col justify-between pt-28 pb-10 px-6 text-white">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="menu-link group flex items-baseline gap-4 py-2"
              >
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-4xl sm:text-5xl font-light tracking-tight text-white/80 group-hover:text-white transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
            {role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="menu-link group flex items-baseline gap-4 py-2 mt-2"
              >
                <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 w-8">★</span>
                <span className="text-4xl sm:text-5xl font-light italic font-serif tracking-tight text-white/80 group-hover:text-white transition-colors">
                  Admin
                </span>
              </Link>
            )}
          </nav>

          <div className="menu-meta space-y-6">
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs tracking-[0.3em] uppercase text-white/70 hover:text-white border-b border-white/20 pb-0.5"
                  >
                    {session.user?.name?.split(" ")[0] ?? "Account"}
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="text-xs tracking-[0.3em] uppercase text-white/40 hover:text-white"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-xs tracking-[0.3em] uppercase text-white border-b border-white/60 pb-0.5"
                >
                  Sign In / Create Account
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] tracking-[0.3em] uppercase text-white/30">
              <span>Maison · Est. 2012</span>
              <span>hello@maison.com</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
