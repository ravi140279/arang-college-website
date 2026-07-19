import Link from "next/link";
import { PageData } from "@/lib/site-data";

type Props = {
  page: PageData;
};

export function PageRenderer({ page }: Props) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-50 via-white to-primary-50 p-6 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-700">{page.heroTag}</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-primary-950 sm:text-4xl">{page.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-700">{page.intro}</p>
      </section>

      {page.content?.length ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-primary-950">Overview</h2>
          <div className="mt-4 space-y-4 text-slate-700">
            {page.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      {page.records?.length ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-primary-950">Published Entries</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-3 pr-3">Title</th>
                  <th className="py-3 pr-3">Category</th>
                  <th className="py-3 pr-3">Date / Note</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {page.records.map((record) => (
                  <tr key={`${record.title}-${record.date ?? ""}`} className="border-b border-slate-100 align-top">
                    <td className="py-3 pr-3 font-medium text-slate-900">{record.title}</td>
                    <td className="py-3 pr-3 text-slate-600">{record.category ?? "-"}</td>
                    <td className="py-3 pr-3 text-slate-600">{record.date ?? "-"}</td>
                    <td className="py-3 text-primary-800">
                      {record.href ? (
                        <a href={record.href} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                          Open
                        </a>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {page.links?.length ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-primary-950">Links & Downloads</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {page.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-primary-900/15 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-900 transition hover:bg-primary-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {page.type === "gallery" ? (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-primary-950">Gallery Section</h2>
          <p className="mt-3 text-slate-700">
            The official website hosts this as a photo gallery page. This implementation keeps the dedicated route and
            page shell ready for full media integration.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="aspect-square rounded-xl bg-gradient-to-br from-accent-200 via-accent-50 to-primary-100" />
            ))}
          </div>
        </section>
      ) : null}

      {page.note ? (
        <section className="mt-8 rounded-2xl border border-accent-300 bg-accent-50 p-5 text-sm text-accent-900">
          <p>{page.note}</p>
          <p className="mt-2">
            For exact latest documents, verify against the official portal:
            <a
              className="ml-1 font-semibold underline"
              href={`https://govpgcollarang.cgstate.gov.in/${page.slug.replaceAll("-", "-")}`}
              target="_blank"
              rel="noreferrer"
            >
              Source page
            </a>
          </p>
        </section>
      ) : null}

      <div className="mt-10">
        <Link href="/" className="inline-flex rounded-full bg-primary-900 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-800">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
