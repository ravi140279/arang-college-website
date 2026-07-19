"use client";

import { useEffect, useState } from "react";

type ThemeDef = {
  id: string;
  name: string;
  description: string;
  colors: Record<string, string>;
};

const themes: ThemeDef[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Teal & Amber — the original look",
    colors: {
      primary950: "#042f2e", primary900: "#134e4a", primary800: "#115e59",
      primary50: "#f0fdfa",
      accent700: "#b45309", accent400: "#fbbf24", accent300: "#fcd34d",
      accent200: "#fde68a", accent100: "#fef3c7", accent50: "#fffbeb",
      bgPage: "#f7f8f4",
    },
  },
  {
    id: "royal",
    name: "Royal",
    description: "Indigo & Gold — regal and authoritative",
    colors: {
      primary950: "#1e1b4b", primary900: "#312e81", primary800: "#3730a3",
      primary50: "#eef2ff",
      accent700: "#a16207", accent400: "#facc15", accent300: "#fde047",
      accent200: "#fef08a", accent100: "#fef9c3", accent50: "#fefce8",
      bgPage: "#f5f5fa",
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    description: "Rose & Warm Orange — bold and energetic",
    colors: {
      primary950: "#4c0519", primary900: "#881337", primary800: "#9f1239",
      primary50: "#fff1f2",
      accent700: "#c2410c", accent400: "#fb923c", accent300: "#fdba74",
      accent200: "#fed7aa", accent100: "#ffedd5", accent50: "#fff7ed",
      bgPage: "#faf6f5",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Emerald & Tan — natural and organic",
    colors: {
      primary950: "#022c22", primary900: "#064e3b", primary800: "#065f46",
      primary50: "#ecfdf5",
      accent700: "#92400e", accent400: "#fb923c", accent300: "#fdba74",
      accent200: "#fed7aa", accent100: "#ffedd5", accent50: "#fff7ed",
      bgPage: "#f4f7f2",
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cyan & Coral — fresh and modern",
    colors: {
      primary950: "#083344", primary900: "#164e63", primary800: "#155e75",
      primary50: "#ecfeff",
      accent700: "#be123c", accent400: "#fb7185", accent300: "#fda4af",
      accent200: "#fecdd3", accent100: "#ffe4e6", accent50: "#fff1f2",
      bgPage: "#f3f8fa",
    },
  },
  {
    id: "plum",
    name: "Plum",
    description: "Purple & Pink — creative and vibrant",
    colors: {
      primary950: "#2e1065", primary900: "#4c1d95", primary800: "#5b21b6",
      primary50: "#f5f3ff",
      accent700: "#be185d", accent400: "#f472b6", accent300: "#f9a8d4",
      accent200: "#fbcfe8", accent100: "#fce7f3", accent50: "#fdf2f8",
      bgPage: "#f8f5fa",
    },
  },
];

export default function ThemePage() {
  const [activeTheme, setActiveTheme] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((r) => r.json())
      .then((d) => setActiveTheme(d.activeTheme));
  }, []);

  async function applyTheme(themeId: string) {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeId }),
    });
    if (res.ok) {
      setActiveTheme(themeId);
      setMessage("Theme applied! Refresh the site to see changes.");
    } else {
      setMessage("Failed to apply theme.");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Theme</h1>
          <p className="mt-1 text-sm text-slate-600">
            Choose a color theme for the entire portal
          </p>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {message}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => {
          const isActive = activeTheme === theme.id;
          const c = theme.colors;
          return (
            <div
              key={theme.id}
              className={`overflow-hidden rounded-2xl border-2 transition ${
                isActive
                  ? "border-teal-600 ring-2 ring-teal-600/30"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {/* Visual preview */}
              <div className="relative" style={{ background: c.bgPage }}>
                {/* Simulated header */}
                <div
                  className="flex items-center justify-between px-4 py-2"
                  style={{
                    borderBottom: `2px solid ${c.accent200}`,
                    background: "rgba(255,255,255,0.9)",
                  }}
                >
                  <span className="text-xs font-bold" style={{ color: c.primary900 }}>
                    College Name
                  </span>
                  <div className="flex gap-1">
                    <span className="rounded px-2 py-0.5 text-[10px]" style={{ background: c.accent100, color: c.accent700 }}>
                      Menu
                    </span>
                    <span className="rounded px-2 py-0.5 text-[10px]" style={{ background: c.accent100, color: c.accent700 }}>
                      Menu
                    </span>
                  </div>
                </div>

                {/* Simulated hero */}
                <div
                  className="px-4 py-6"
                  style={{
                    background: `linear-gradient(135deg, ${c.primary950} 0%, ${c.primary900} 50%, ${c.accent700}90 100%)`,
                  }}
                >
                  <span
                    className="inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase"
                    style={{
                      border: `1px solid ${c.accent300}60`,
                      background: `${c.accent100}25`,
                      color: c.accent100,
                    }}
                  >
                    Badge
                  </span>
                  <p className="mt-1 text-sm font-bold text-white">
                    Welcome to the Portal
                  </p>
                  <div className="mt-2 flex gap-1">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{ background: c.accent400, color: "#1a1a1a" }}
                    >
                      Button
                    </span>
                    <span
                      className="rounded-full border px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ borderColor: "rgba(255,255,255,0.4)" }}
                    >
                      Button
                    </span>
                  </div>
                </div>

                {/* Simulated stats */}
                <div className="flex gap-1 px-4 py-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-1 rounded px-1 py-1"
                      style={{ border: `1px solid ${c.accent200}`, background: "#fff" }}
                    >
                      <p className="text-[8px] font-bold" style={{ color: c.accent700 }}>
                        Stat
                      </p>
                      <p className="text-[10px] font-bold" style={{ color: c.primary950 }}>
                        Value
                      </p>
                    </div>
                  ))}
                </div>

                {/* Simulated footer */}
                <div className="px-4 py-2" style={{ background: c.primary950 }}>
                  <p className="text-[9px] font-bold text-white">Footer</p>
                  <p className="text-[8px]" style={{ color: c.accent300 }}>
                    Links &middot; Links
                  </p>
                </div>
              </div>

              {/* Theme info */}
              <div className="border-t border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{theme.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{theme.description}</p>
                  </div>
                  {isActive && (
                    <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                      Active
                    </span>
                  )}
                </div>

                {/* Color swatches */}
                <div className="mt-3 flex gap-1">
                  {[c.primary950, c.primary900, c.primary800, c.primary50].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="h-5 flex-1 rounded"
                        style={{ background: color }}
                        title={`Primary ${["950", "900", "800", "50"][i]}`}
                      />
                    )
                  )}
                  <div className="w-1" />
                  {[c.accent700, c.accent400, c.accent200, c.accent50].map(
                    (color, i) => (
                      <div
                        key={i + 4}
                        className="h-5 flex-1 rounded"
                        style={{ background: color }}
                        title={`Accent ${["700", "400", "200", "50"][i]}`}
                      />
                    )
                  )}
                </div>

                <button
                  onClick={() => applyTheme(theme.id)}
                  disabled={isActive || saving}
                  className={`mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "cursor-default bg-slate-100 text-slate-400"
                      : "bg-teal-900 text-white hover:bg-teal-800"
                  }`}
                >
                  {isActive ? "Currently Active" : saving ? "Applying…" : "Apply Theme"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
