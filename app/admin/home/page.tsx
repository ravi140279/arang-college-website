"use client";

import { useEffect, useState } from "react";

type Slide = { title: string; subtitle: string; image: string };
type CTA = { label: string; href: string };
type HomeContent = {
  slides: Slide[];
  heroBadge: string;
  ctaButtons: CTA[];
};

export default function HomeAdmin() {
  const [data, setData] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/home")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setMessage(res.ok ? "Home page saved!" : "Failed to save");
    setTimeout(() => setMessage(""), 3000);
  }

  // Slide helpers
  function updateSlide(idx: number, field: keyof Slide, value: string) {
    if (!data) return;
    const updated = [...data.slides];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, slides: updated });
  }

  function addSlide() {
    if (!data) return;
    setData({
      ...data,
      slides: [
        ...data.slides,
        { title: "", subtitle: "", image: "" },
      ],
    });
  }

  function removeSlide(idx: number) {
    if (!data) return;
    setData({
      ...data,
      slides: data.slides.filter((_, i) => i !== idx),
    });
  }

  // CTA helpers
  function updateCTA(idx: number, field: keyof CTA, value: string) {
    if (!data) return;
    const updated = [...data.ctaButtons];
    updated[idx] = { ...updated[idx], [field]: value };
    setData({ ...data, ctaButtons: updated });
  }

  function addCTA() {
    if (!data) return;
    setData({
      ...data,
      ctaButtons: [...data.ctaButtons, { label: "", href: "" }],
    });
  }

  function removeCTA(idx: number) {
    if (!data) return;
    setData({
      ...data,
      ctaButtons: data.ctaButtons.filter((_, i) => i !== idx),
    });
  }

  if (loading || !data) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Home Page
          </h1>
          <p className="text-sm text-slate-600">
            Manage hero slides, badge text, and call-to-action buttons
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span
              className={`text-sm font-medium ${
                message.includes("saved")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Badge */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-lg font-bold text-slate-900">
            Hero Badge Text
          </h2>
          <input
            type="text"
            value={data.heroBadge}
            onChange={(e) =>
              setData({ ...data, heroBadge: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
            placeholder="e.g. Official Institution Rebuild"
          />
        </div>

        {/* Slides */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Hero Slides
            </h2>
            <button
              type="button"
              onClick={addSlide}
              className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              + Add Slide
            </button>
          </div>
          <div className="space-y-4">
            {data.slides.map((slide, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-100 bg-slate-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Slide {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSlide(idx)}
                    className="rounded px-2 py-0.5 text-xs text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Title
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) =>
                        updateSlide(idx, "title", e.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={slide.subtitle}
                      onChange={(e) =>
                        updateSlide(idx, "subtitle", e.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={slide.image}
                      onChange={(e) =>
                        updateSlide(idx, "image", e.target.value)
                      }
                      className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              CTA Buttons
            </h2>
            <button
              type="button"
              onClick={addCTA}
              className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              + Add Button
            </button>
          </div>
          <div className="space-y-2">
            {data.ctaButtons.map((cta, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={cta.label}
                  onChange={(e) =>
                    updateCTA(idx, "label", e.target.value)
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Button Label"
                />
                <input
                  type="text"
                  value={cta.href}
                  onChange={(e) =>
                    updateCTA(idx, "href", e.target.value)
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="/path"
                />
                <button
                  type="button"
                  onClick={() => removeCTA(idx)}
                  className="rounded px-2 text-xs text-red-600 hover:bg-red-50"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
