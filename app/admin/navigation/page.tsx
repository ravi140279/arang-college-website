"use client";

import { useEffect, useState } from "react";

type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

export default function NavigationAdmin() {
  const [groups, setGroups] = useState<NavGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/navigation")
      .then((r) => r.json())
      .then((data) => {
        setGroups(data);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/navigation", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groups),
    });
    setSaving(false);
    setMessage(res.ok ? "Navigation saved!" : "Failed to save");
    setTimeout(() => setMessage(""), 3000);
  }

  function addGroup() {
    setGroups([...groups, { label: "New Group", items: [] }]);
  }

  function removeGroup(idx: number) {
    if (!confirm(`Remove "${groups[idx].label}" group?`)) return;
    setGroups(groups.filter((_, i) => i !== idx));
  }

  function updateGroupLabel(idx: number, label: string) {
    const updated = [...groups];
    updated[idx] = { ...updated[idx], label };
    setGroups(updated);
  }

  function addItem(groupIdx: number) {
    const updated = [...groups];
    updated[groupIdx] = {
      ...updated[groupIdx],
      items: [...updated[groupIdx].items, { label: "", href: "" }],
    };
    setGroups(updated);
  }

  function removeItem(groupIdx: number, itemIdx: number) {
    const updated = [...groups];
    updated[groupIdx] = {
      ...updated[groupIdx],
      items: updated[groupIdx].items.filter((_, i) => i !== itemIdx),
    };
    setGroups(updated);
  }

  function updateItem(
    groupIdx: number,
    itemIdx: number,
    field: keyof NavItem,
    value: string
  ) {
    const updated = [...groups];
    updated[groupIdx] = {
      ...updated[groupIdx],
      items: updated[groupIdx].items.map((item, i) =>
        i === itemIdx ? { ...item, [field]: value } : item
      ),
    };
    setGroups(updated);
  }

  function moveGroup(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= groups.length) return;
    const updated = [...groups];
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    setGroups(updated);
  }

  function moveItem(groupIdx: number, itemIdx: number, dir: -1 | 1) {
    const target = itemIdx + dir;
    const items = groups[groupIdx].items;
    if (target < 0 || target >= items.length) return;
    const updated = [...groups];
    const newItems = [...items];
    [newItems[itemIdx], newItems[target]] = [newItems[target], newItems[itemIdx]];
    updated[groupIdx] = { ...updated[groupIdx], items: newItems };
    setGroups(updated);
  }

  if (loading) {
    return <div className="py-12 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Navigation
          </h1>
          <p className="text-sm text-slate-600">
            Configure header menu groups and links
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
            onClick={addGroup}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            + Add Group
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Navigation"}
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {groups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Group header */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => moveGroup(gIdx, -1)}
                  disabled={gIdx === 0}
                  className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                >
                  &#9650;
                </button>
                <button
                  type="button"
                  onClick={() => moveGroup(gIdx, 1)}
                  disabled={gIdx === groups.length - 1}
                  className="rounded px-1.5 py-0.5 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                >
                  &#9660;
                </button>
              </div>
              <input
                type="text"
                value={group.label}
                onChange={(e) => updateGroupLabel(gIdx, e.target.value)}
                className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm font-semibold focus:border-teal-500 focus:outline-none"
              />
              <span className="text-xs text-slate-500">
                {group.items.length} items
              </span>
              <button
                onClick={() => removeGroup(gIdx)}
                className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                Remove Group
              </button>
            </div>

            {/* Items */}
            <div className="p-4 space-y-2">
              {group.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveItem(gIdx, iIdx, -1)}
                      disabled={iIdx === 0}
                      className="text-[10px] leading-none text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      &#9650;
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(gIdx, iIdx, 1)}
                      disabled={iIdx === group.items.length - 1}
                      className="text-[10px] leading-none text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      &#9660;
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) =>
                      updateItem(gIdx, iIdx, "label", e.target.value)
                    }
                    className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-teal-500 focus:outline-none"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={item.href}
                    onChange={(e) =>
                      updateItem(gIdx, iIdx, "href", e.target.value)
                    }
                    className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm focus:border-teal-500 focus:outline-none"
                    placeholder="/slug"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(gIdx, iIdx)}
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem(gIdx)}
                className="mt-2 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                + Add Item
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
