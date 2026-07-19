"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PageSummary = {
  slug: string;
  title: string;
  type: string;
  heroTag: string;
};

export default function AdminDashboard() {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((data) => {
        setPages(data);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: "Total Pages", value: pages.length, color: "bg-teal-50 text-teal-800 border-teal-200" },
    {
      label: "Text Pages",
      value: pages.filter((p) => p.type === "text").length,
      color: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      label: "Record Pages",
      value: pages.filter((p) => p.type === "records").length,
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      label: "Gallery Pages",
      value: pages.filter((p) => p.type === "gallery").length,
      color: "bg-purple-50 text-purple-800 border-purple-200",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-sm text-slate-600">
            Manage your college website content
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + New Page
        </Link>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`rounded-xl border p-4 ${s.color}`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  {s.label}
                </p>
                <p className="mt-1 text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/admin/fees"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition"
            >
              <h3 className="font-serif text-lg font-bold text-teal-950">
                Fee Management
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Review collections and export the payment register
              </p>
            </Link>
            <Link
              href="/admin/pages"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition"
            >
              <h3 className="font-serif text-lg font-bold text-teal-950">
                Manage Pages
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Add, edit, or delete content pages
              </p>
            </Link>
            <Link
              href="/admin/navigation"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition"
            >
              <h3 className="font-serif text-lg font-bold text-teal-950">
                Navigation Menus
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Configure header navigation structure
              </p>
            </Link>
            <Link
              href="/admin/home"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition"
            >
              <h3 className="font-serif text-lg font-bold text-teal-950">
                Home Page
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Edit hero slides, badges, and CTAs
              </p>
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 hover:shadow-md transition"
            >
              <h3 className="font-serif text-lg font-bold text-teal-950">
                Site Settings
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                College info, quick links, footer, stats
              </p>
            </Link>
          </div>

          {/* Recent pages */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-serif text-lg font-bold text-slate-900">
                All Pages ({pages.length})
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {pages.slice(0, 10).map((page) => (
                <div
                  key={page.slug}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {page.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      /{page.slug} &middot; {page.type}
                    </p>
                  </div>
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Edit
                  </Link>
                </div>
              ))}
            </div>
            {pages.length > 10 && (
              <div className="border-t border-slate-200 px-5 py-3 text-center">
                <Link
                  href="/admin/pages"
                  className="text-sm font-semibold text-teal-800 hover:underline"
                >
                  View all {pages.length} pages &rarr;
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
