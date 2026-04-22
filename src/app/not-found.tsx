import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-xs tracking-widest uppercase text-zinc-400 mb-4">404</p>
        <h1 className="text-3xl font-light text-zinc-900 mb-4">Page not found</h1>
        <p className="text-sm text-zinc-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-zinc-900 text-white text-xs tracking-widest uppercase px-6 py-3 hover:bg-zinc-800 transition-colors"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
