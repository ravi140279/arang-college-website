import {
  getAllPages,
  getAllPageSlugs,
  getNavigation,
  getSettings,
  getHomeContent,
} from "@/lib/cms/data";
import type { SiteSettings, HomeContent } from "@/lib/cms/data";

export type PageType = "text" | "records" | "links" | "gallery";

export type RecordItem = {
  title: string;
  category?: string;
  date?: string;
  href?: string;
};

export type PageData = {
  slug: string;
  title: string;
  heroTag: string;
  type: PageType;
  intro: string;
  content?: string[];
  records?: RecordItem[];
  links?: { label: string; href: string }[];
  note?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  items: { label: string; href: string }[];
};

// Re-export functions so consumers call them per-request (no stale cache)
export { getAllPages, getAllPageSlugs, getNavigation, getSettings, getHomeContent };
export type { SiteSettings, HomeContent };
