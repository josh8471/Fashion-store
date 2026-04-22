"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">Error</p>
        <h1 className="text-3xl font-light text-zinc-900 mb-4">Something went wrong</h1>
        <p className="text-sm text-zinc-500 mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-800 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-zinc-200 text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-50 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
