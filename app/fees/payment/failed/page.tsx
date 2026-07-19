import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Failed",
};

type Props = {
  searchParams: Promise<{ message?: string }>;
};

export default async function PaymentFailedPage({ searchParams }: Props) {
  const { message } = await searchParams;
  const errorMessage =
    message?.trim() || "The payment could not be completed or verified.";

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 shadow-lg backdrop-blur">
          {/* Failed badge */}
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">
              Payment Failed
            </p>
          </div>

          <h1 className="font-serif text-2xl font-black text-slate-900 sm:text-3xl">
            Verification could not be completed
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">{errorMessage}</p>

          <div className="mt-8">
            <Link
              href="/fees"
              className="inline-block rounded-xl bg-primary-900 px-6 py-3 text-sm font-bold text-white hover:bg-primary-800"
            >
              Return to fee form
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
