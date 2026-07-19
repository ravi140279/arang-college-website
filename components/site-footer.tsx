import Link from "next/link";

type Props = {
  footerName: string;
  footerAddress: string;
  footerAffiliation: string;
  footerLinks: { label: string; href: string }[];
  officialSiteUrl: string;
};

export function SiteFooter({
  footerName,
  footerAddress,
  footerAffiliation,
  footerLinks,
  officialSiteUrl,
}: Props) {
  return (
    <footer className="mt-14 border-t border-primary-900/15 bg-primary-950 text-primary-50">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-lg font-bold">{footerName}</p>
          <p className="mt-2 text-sm text-primary-100/90">{footerAddress}</p>
          <p className="text-sm text-primary-100/90">{footerAffiliation}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-300">Important</p>
          <ul className="mt-2 space-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-accent-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-300">Official Source</p>
          <a
            className="mt-2 block text-sm hover:text-accent-300"
            href={officialSiteUrl}
            target="_blank"
            rel="noreferrer"
          >
            {officialSiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
          <p className="mt-3 text-xs text-primary-100/70">
            This redesigned implementation is built with Next.js, React, and Tailwind CSS from publicly available
            content structure and page data.
          </p>
        </div>
      </div>
    </footer>
  );
}
