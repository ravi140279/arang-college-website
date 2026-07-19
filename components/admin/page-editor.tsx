"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RecordItem = {
  title: string;
  category?: string;
  date?: string;
  href?: string;
};

type LinkItem = {
  label: string;
  href: string;
};

type PageFormData = {
  slug: string;
  title: string;
  heroTag: string;
  type: "text" | "records" | "links" | "gallery";
  intro: string;
  content?: string[];
  records?: RecordItem[];
  links?: LinkItem[];
  note?: string;
};

type Props = {
  initialData?: PageFormData;
  isNew?: boolean;
};

export function PageEditor({ initialData, isNew }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [heroTag, setHeroTag] = useState(initialData?.heroTag ?? "");
  const [type, setType] = useState<PageFormData["type"]>(
    initialData?.type ?? "text"
  );
  const [intro, setIntro] = useState(initialData?.intro ?? "");
  const [content, setContent] = useState<string[]>(
    initialData?.content ?? [""]
  );
  const [records, setRecords] = useState<RecordItem[]>(
    initialData?.records ?? [{ title: "" }]
  );
  const [links, setLinks] = useState<LinkItem[]>(
    initialData?.links ?? [{ label: "", href: "" }]
  );
  const [note, setNote] = useState(initialData?.note ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const pageData: PageFormData = {
      slug: slug
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, ""),
      title,
      heroTag,
      type,
      intro,
    };

    if (content.some((c) => c.trim())) {
      pageData.content = content.filter((c) => c.trim());
    }
    if (type === "records" && records.some((r) => r.title.trim())) {
      pageData.records = records.filter((r) => r.title.trim());
    }
    if (
      (type === "links" || links.some((l) => l.label.trim())) &&
      links.some((l) => l.label.trim())
    ) {
      pageData.links = links.filter((l) => l.label.trim());
    }
    if (note.trim()) {
      pageData.note = note.trim();
    }

    try {
      let res: Response;
      if (isNew) {
        res = await fetch("/api/admin/pages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pageData),
        });
      } else {
        res = await fetch(`/api/admin/pages/${initialData?.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pageData),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      router.push("/admin/pages");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  // Content paragraphs helpers
  function addContentParagraph() {
    setContent([...content, ""]);
  }
  function updateContent(idx: number, val: string) {
    const updated = [...content];
    updated[idx] = val;
    setContent(updated);
  }
  function removeContent(idx: number) {
    setContent(content.filter((_, i) => i !== idx));
  }

  // Records helpers
  function addRecord() {
    setRecords([...records, { title: "" }]);
  }
  function updateRecord(idx: number, field: keyof RecordItem, val: string) {
    const updated = [...records];
    updated[idx] = { ...updated[idx], [field]: val };
    setRecords(updated);
  }
  function removeRecord(idx: number) {
    setRecords(records.filter((_, i) => i !== idx));
  }

  // Links helpers
  function addLink() {
    setLinks([...links, { label: "", href: "" }]);
  }
  function updateLink(idx: number, field: keyof LinkItem, val: string) {
    const updated = [...links];
    updated[idx] = { ...updated[idx], [field]: val };
    setLinks(updated);
  }
  function removeLink(idx: number) {
    setLinks(links.filter((_, i) => i !== idx));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-lg font-bold text-slate-900">
          Basic Information
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={!isNew}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="my-page-slug"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Hero Tag
            </label>
            <input
              type="text"
              value={heroTag}
              onChange={(e) => setHeroTag(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="e.g. Institution Profile"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Page Type
            </label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as PageFormData["type"])
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            >
              <option value="text">Text</option>
              <option value="records">Records</option>
              <option value="links">Links</option>
              <option value="gallery">Gallery</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Introduction *
          </label>
          <textarea
            required
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Content Paragraphs */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Content Paragraphs
          </h2>
          <button
            type="button"
            onClick={addContentParagraph}
            className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
          >
            + Add Paragraph
          </button>
        </div>
        <div className="space-y-3">
          {content.map((para, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                value={para}
                onChange={(e) => updateContent(idx, e.target.value)}
                rows={2}
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder={`Paragraph ${idx + 1}`}
              />
              <button
                type="button"
                onClick={() => removeContent(idx)}
                className="self-start rounded-md px-2 py-2 text-xs text-red-600 hover:bg-red-50"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Records */}
      {(type === "records" || records.some((r) => r.title)) && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Records / Entries
            </h2>
            <button
              type="button"
              onClick={addRecord}
              className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              + Add Record
            </button>
          </div>
          <div className="space-y-3">
            {records.map((rec, idx) => (
              <div
                key={idx}
                className="grid gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3 sm:grid-cols-4"
              >
                <input
                  type="text"
                  value={rec.title}
                  onChange={(e) =>
                    updateRecord(idx, "title", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={rec.category ?? ""}
                  onChange={(e) =>
                    updateRecord(idx, "category", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Category"
                />
                <input
                  type="text"
                  value={rec.date ?? ""}
                  onChange={(e) =>
                    updateRecord(idx, "date", e.target.value)
                  }
                  className="rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Date"
                />
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={rec.href ?? ""}
                    onChange={(e) =>
                      updateRecord(idx, "href", e.target.value)
                    }
                    className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                    placeholder="Link URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeRecord(idx)}
                    className="rounded-md px-2 text-xs text-red-600 hover:bg-red-50"
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {(type === "links" || links.some((l) => l.label)) && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Links & Downloads
            </h2>
            <button
              type="button"
              onClick={addLink}
              className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              + Add Link
            </button>
          </div>
          <div className="space-y-3">
            {links.map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) =>
                    updateLink(idx, "label", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) =>
                    updateLink(idx, "href", e.target.value)
                  }
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="URL"
                />
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="rounded-md px-2 text-xs text-red-600 hover:bg-red-50"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-serif text-lg font-bold text-slate-900">
          Note (optional)
        </h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          placeholder="Add a note or disclaimer for this page..."
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-teal-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : isNew ? "Create Page" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/pages")}
          className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
