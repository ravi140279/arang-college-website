"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavGroup } from "@/lib/site-data";

type Props = {
  navGroups: NavGroup[];
  collegeName: string;
  collegeSubtitle: string;
};

export function SiteHeader({ navGroups, collegeName, collegeSubtitle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-accent-200/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="max-w-[16rem] leading-tight">
          <p className="font-serif text-sm font-bold text-primary-900 sm:text-base">
            {collegeName}
          </p>
          <p className="text-xs text-accent-700">{collegeSubtitle}</p>
        </Link>

        <button
          type="button"
          className="rounded-lg border border-primary-800 px-3 py-1 text-sm font-semibold text-primary-800 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          Menu
        </button>

        <nav className="hidden lg:block">
          <ul className="flex items-center gap-3 text-sm font-semibold text-primary-900">
            <li>
              <Link href="/" className="rounded px-2 py-1 hover:bg-accent-100">
                Home
              </Link>
            </li>
            {navGroups.map((group) =>
              group.href ? (
                <li key={group.label}>
                  <Link
                    href={group.href}
                    className="rounded-full border border-primary-800 bg-primary-900 px-3 py-1.5 text-sm font-bold text-white hover:bg-primary-800"
                  >
                    {group.label}
                  </Link>
                </li>
              ) : (
                <li key={group.label} className="group relative">
                  <span className="cursor-default rounded px-2 py-1 group-hover:bg-accent-100">{group.label}</span>
                  <div className="invisible absolute right-0 top-full w-72 translate-y-1 rounded-xl border border-accent-200 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-900"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>

      {open ? (
        <div className="border-t border-accent-200 bg-white px-4 py-4 lg:hidden">
          <Link href="/" className="mb-3 block rounded px-2 py-2 font-semibold text-primary-900" onClick={() => setOpen(false)}>
            Home
          </Link>
          {navGroups.map((group) =>
            group.href ? (
              <Link
                key={group.label}
                href={group.href}
                className="mb-3 block rounded-lg border border-primary-800 bg-primary-900 px-3 py-2 text-center text-sm font-bold text-white"
                onClick={() => setOpen(false)}
              >
                {group.label}
              </Link>
            ) : (
              <div key={group.label} className="mb-4">
                <p className="px-2 pb-1 text-xs font-bold uppercase tracking-wide text-accent-700">{group.label}</p>
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded px-2 py-2 text-sm text-slate-800 hover:bg-primary-50"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      ) : null}
    </header>
  );
}
