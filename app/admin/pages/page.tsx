"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PageSummary = {
  slug: string;
  title: string;
  type: string;
  heroTag: string;
};

export default function PagesListPage() {
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/pages")
      .then((r) => r.json())
      .then((data) => {
        setPages(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete page "${title}"? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/pages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    if (res.ok) {
      setPages((prev) => prev.filter((p) => p.slug !== slug));
    }
  }

  const filtered = pages
    .filter((p) => filter === "all" || p.type === filter)
    .filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Pages
          </h1>
          <p className="text-sm text-slate-600">
            {pages.length} pages total
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
        >
          + New Page
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search pages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="all">All Types</option>
          <option value="text">Text</option>
          <option value="records">Records</option>
          <option value="links">Links</option>
          <option value="gallery">Gallery</option>
        </select>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading...</div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Tag</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((page) => (
                  <tr key={page.slug} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-medium text-slate-900">
                      {page.title}
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      /{page.slug}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        {page.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600">
                      {page.heroTag}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/pages/${page.slug}`}
                          className="rounded-md bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800 hover:bg-teal-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(page.slug, page.title)
                          }
                          className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-8 text-center text-slate-500"
                    >
                      No pages found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
