"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { Suspense } from "react";

gsap.registerPlugin(useGSAP, SplitText);

function LoginForm() {
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const split = SplitText.create(".login-title", { type: "chars" });
      tl.from(split.chars, { opacity: 0, y: 30, stagger: 0.03, duration: 0.5 })
        .fromTo(".login-card > *", { opacity: 0, y: 16 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.5 }, "-=0.2");
    },
    { scope: pageRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      const session = await getSession();
      const role = (session?.user as { role?: string } | undefined)?.role;
      const target = role === "admin" ? "/admin" : callbackUrl;
      router.push(target);
      router.refresh();
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-light tracking-[0.3em] text-xl uppercase text-zinc-900">
            Maison
          </Link>
          <h1 className="login-title text-3xl font-light text-zinc-900 mt-6 tracking-tight">
            Welcome back
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="login-card bg-white p-8 space-y-5 shadow-sm border border-zinc-100">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-widest uppercase text-zinc-500 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] tracking-widest uppercase text-zinc-500">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full border border-zinc-200 px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white text-xs tracking-widest uppercase py-4 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-zinc-900 underline underline-offset-4 hover:text-zinc-600">
                Create one
              </Link>
            </p>
          </div>

          <div className="relative border-t border-zinc-100 pt-5">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white px-3 text-[10px] tracking-widest uppercase text-zinc-400">
              or
            </span>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full flex items-center justify-center gap-3 border border-zinc-200 px-4 py-3 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="text-center">
            <Link href="/shop" className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-700 underline underline-offset-4">
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
