import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-700">404</p>
      <h1 className="mt-3 font-serif text-4xl font-black text-primary-950">Page Not Found</h1>
      <p className="mt-3 text-slate-700">The requested page was not found in this rebuilt college website.</p>
      <Link href="/" className="mt-8 rounded-full bg-primary-900 px-6 py-2 font-semibold text-white hover:bg-primary-800">
        Return Home
      </Link>
    </main>
  );
}
