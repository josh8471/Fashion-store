"use client";

import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!contentRef.current || !curtainRef.current) return;
    const tl = gsap.timeline();
    tl.set(curtainRef.current, { scaleY: 1, transformOrigin: "top" })
      .to(curtainRef.current, { scaleY: 0, duration: 0.6, ease: "power3.inOut", transformOrigin: "top" })
      .fromTo(contentRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
  }, [pathname]);

  return (
    <>
      <div
        ref={curtainRef}
        className="fixed inset-0 bg-zinc-900 z-[100] pointer-events-none"
        style={{ transformOrigin: "top" }}
      />
      <div ref={contentRef}>{children}</div>
    </>
  );
}
