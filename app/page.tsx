import Image from "next/image";
import Link from "next/link";
import { getAllPages, getHomeContent, getSettings } from "@/lib/site-data";

export default function Home() {
  const homeContent = getHomeContent();
  const settings = getSettings();
  const pages = getAllPages();

  const homeSlides = homeContent.slides;
  const heroBadge = homeContent.heroBadge;
  const ctaButtons = homeContent.ctaButtons;
  const quickLinks = settings.quickLinks;
  const siteStats = settings.stats;
  const featuredNotices = pages["notice-board"]?.records ?? [];
  const featuredEvents = pages["event"]?.records ?? [];

  const lead = homeSlides[0];

  return (
    <main className="flex-1">
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image src={lead.image} alt={lead.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-950/90 via-primary-900/75 to-accent-900/70" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-20">
          <div className="lg:col-span-7">
            <p className="inline-block rounded-full border border-accent-300/40 bg-accent-100/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent-100">
              {heroBadge}
            </p>
            <h1 className="mt-5 font-serif text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              {lead.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-primary-50/95 sm:text-lg">{lead.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {ctaButtons.map((btn, idx) => (
                <Link
                  key={btn.href}
                  href={btn.href}
                  className={idx === 0
                    ? "rounded-full bg-accent-400 px-5 py-2 text-sm font-bold text-slate-900 hover:bg-accent-300"
                    : "rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-bold text-white hover:bg-white/20"
                  }
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-accent-200/25 bg-white/10 p-4 backdrop-blur lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-100">Quick Access</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs text-primary-100">
              Source studied: govpgcollarang.cgstate.gov.in and linked internal pages.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-accent-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-700">{stat.label}</p>
              <p className="mt-2 text-lg font-bold text-primary-950">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-primary-950">Notice Board</h2>
            <Link href="/notice-board" className="text-sm font-semibold text-primary-800 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {featuredNotices.slice(0, 6).map((notice) => (
              <article key={`${notice.title}-${notice.date ?? ""}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{notice.title}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {notice.category ?? "General"} {notice.date ? `| ${notice.date}` : ""}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-primary-950">Events</h2>
            <Link href="/event" className="text-sm font-semibold text-primary-800 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {featuredEvents.slice(0, 6).map((event) => (
              <article key={`${event.title}-${event.date ?? ""}`} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                <p className="mt-1 text-xs text-slate-600">{event.date ?? "Date not listed"}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
