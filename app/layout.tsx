import type { Metadata } from "next";
import { Merriweather, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getNavigation, getSettings } from "@/lib/site-data";
import { getActiveTheme } from "@/lib/cms/data";
import { getThemeById, themeToStyleVars } from "@/lib/themes";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  weight: ["400", "700", "900"],
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const settings = getSettings();
  return {
    title: settings.siteName,
    description: settings.siteDescription,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navGroups = getNavigation();
  const settings = getSettings();
  const theme = getThemeById(getActiveTheme());

  return (
    <html lang="en" className={`${merriweather.variable} ${sourceSans.variable} h-full antialiased`} style={themeToStyleVars(theme.colors) as React.CSSProperties} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-page text-slate-900">
        <SiteHeader navGroups={navGroups} collegeName={settings.collegeName} collegeSubtitle={settings.collegeSubtitle} />
        {children}
        <SiteFooter footerName={settings.footerName} footerAddress={settings.footerAddress} footerAffiliation={settings.footerAffiliation} footerLinks={settings.footerLinks} officialSiteUrl={settings.officialSiteUrl} />
      </body>
    </html>
  );
}
