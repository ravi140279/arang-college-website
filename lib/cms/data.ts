import fs from "node:fs";
import path from "node:path";
import type { PageData, NavGroup } from "@/lib/site-data";

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

function writeJson<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ── Pages ──

export function getAllPages(): Record<string, PageData> {
  return readJson<Record<string, PageData>>("pages.json");
}

export function getPage(slug: string): PageData | null {
  const pages = getAllPages();
  return pages[slug] ?? null;
}

export function getAllPageSlugs(): string[] {
  return Object.keys(getAllPages());
}

export function savePage(page: PageData): void {
  const pages = getAllPages();
  pages[page.slug] = page;
  writeJson("pages.json", pages);
}

export function deletePage(slug: string): boolean {
  const pages = getAllPages();
  if (!pages[slug]) return false;
  delete pages[slug];
  writeJson("pages.json", pages);
  return true;
}

// ── Navigation ──

export function getNavigation(): NavGroup[] {
  return readJson<NavGroup[]>("navigation.json");
}

export function saveNavigation(nav: NavGroup[]): void {
  writeJson("navigation.json", nav);
}

// ── Site Settings ──

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  collegeName: string;
  collegeSubtitle: string;
  footerName: string;
  footerAddress: string;
  footerAffiliation: string;
  officialSiteUrl: string;
  quickLinks: { label: string; href: string }[];
  footerLinks: { label: string; href: string }[];
  stats: { label: string; value: string }[];
};

export function getSettings(): SiteSettings {
  return readJson<SiteSettings>("settings.json");
}

export function saveSettings(settings: SiteSettings): void {
  writeJson("settings.json", settings);
}

// ── Home Page Content ──

export type HomeContent = {
  slides: { title: string; subtitle: string; image: string }[];
  heroBadge: string;
  ctaButtons: { label: string; href: string }[];
};

export function getHomeContent(): HomeContent {
  return readJson<HomeContent>("home.json");
}

export function saveHomeContent(content: HomeContent): void {
  writeJson("home.json", content);
}

// ── Theme ──

export function getActiveTheme(): string {
  const data = readJson<{ activeTheme: string }>("theme.json");
  return data.activeTheme;
}

export function saveActiveTheme(themeId: string): void {
  writeJson("theme.json", { activeTheme: themeId });
}
