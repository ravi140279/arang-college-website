"use client";

import { useEffect, useState } from "react";

type LinkItem = { label: string; href: string };
type StatItem = { label: string; value: string };

type Settings = {
  siteName: string;
  siteDescription: string;
  collegeName: string;
  collegeSubtitle: string;
  footerName: string;
  footerAddress: string;
  footerAffiliation: string;
  officialSiteUrl: string;
  quickLinks: LinkItem[];
  footerLinks: LinkItem[];
  stats: StatItem[];
};

export default function SettingsAdmin() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setMessage(res.ok ? "Settings saved!" : "Failed to save");
    setTimeout(() => setMessage(""), 3000);
  }

  function update<K extends keyof Settings>(field: K, value: Settings[K]) {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  }

  function updateLink(
    field: "quickLinks" | "footerLinks",
    idx: number,
    key: keyof LinkItem,
    value: string
  ) {
    if (!settings) return;
    const updated = [...settings[field]];
    updated[idx] = { ...updated[idx], [key]: value };
    update(field, updated);
  }

  function addLink(field: "quickLinks" | "footerLinks") {
    if (!settings) return;
    update(field, [...settings[field], { label: "", href: "" }]);
  }

  function removeLink(field: "quickLinks" | "footerLinks", idx: number) {
    if (!settings) return;
    update(
      field,
      settings[field].filter((_, i) => i !== idx)
    );
  }

  function updateStat(idx: number, key: keyof StatItem, value: string) {
    if (!settings) return;
    const updated = [...settings.stats];
    updated[idx] = { ...updated[idx], [key]: value };
    update("stats", updated);
  }

  function addStat() {
    if (!settings) return;
    update("stats", [...settings.stats, { label: "", value: "" }]);
  }

  function removeStat(idx: number) {
    if (!settings) return;
    update(
      "stats",
      settings.stats.filter((_, i) => i !== idx)
    );
  }

  if (loading || !settings) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Site Settings
          </h1>
          <p className="text-sm text-slate-600">
            College information, links, footer, and stats
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
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* General */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-lg font-bold text-slate-900">
            General
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => update("siteName", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Site Description
              </label>
              <input
                type="text"
                value={settings.siteDescription}
                onChange={(e) => update("siteDescription", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-lg font-bold text-slate-900">
            Header
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                College Name (Header)
              </label>
              <input
                type="text"
                value={settings.collegeName}
                onChange={(e) => update("collegeName", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                College Subtitle
              </label>
              <input
                type="text"
                value={settings.collegeSubtitle}
                onChange={(e) =>
                  update("collegeSubtitle", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-lg font-bold text-slate-900">
            Footer
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Footer Name
              </label>
              <input
                type="text"
                value={settings.footerName}
                onChange={(e) => update("footerName", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Footer Address
              </label>
              <input
                type="text"
                value={settings.footerAddress}
                onChange={(e) => update("footerAddress", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Footer Affiliation
              </label>
              <input
                type="text"
                value={settings.footerAffiliation}
                onChange={(e) =>
                  update("footerAffiliation", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Official Site URL
              </label>
              <input
                type="text"
                value={settings.officialSiteUrl}
                onChange={(e) =>
                  update("officialSiteUrl", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Footer Links
              </p>
              <button
                type="button"
                onClick={() => addLink("footerLinks")}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
              >
                + Add
              </button>
            </div>
            {settings.footerLinks.map((link, idx) => (
              <div key={idx} className="mb-2 flex gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) =>
                    updateLink("footerLinks", idx, "label", e.target.value)
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) =>
                    updateLink("footerLinks", idx, "href", e.target.value)
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="/path"
                />
                <button
                  onClick={() => removeLink("footerLinks", idx)}
                  className="rounded px-2 text-xs text-red-600 hover:bg-red-50"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Quick Links (Home Page)
            </h2>
            <button
              type="button"
              onClick={() => addLink("quickLinks")}
              className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {settings.quickLinks.map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) =>
                    updateLink("quickLinks", idx, "label", e.target.value)
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) =>
                    updateLink("quickLinks", idx, "href", e.target.value)
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="/path"
                />
                <button
                  onClick={() => removeLink("quickLinks", idx)}
                  className="rounded px-2 text-xs text-red-600 hover:bg-red-50"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Stats (Home Page)
            </h2>
            <button
              type="button"
              onClick={addStat}
              className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              + Add
            </button>
          </div>
          <div className="space-y-2">
            {settings.stats.map((stat, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) =>
                    updateStat(idx, "label", e.target.value)
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) =>
                    updateStat(idx, "value", e.target.value)
                  }
                  className="flex-1 rounded border border-slate-300 px-2 py-1.5 text-sm focus:border-teal-500 focus:outline-none"
                  placeholder="Value"
                />
                <button
                  onClick={() => removeStat(idx)}
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
