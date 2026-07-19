"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Fees", href: "/admin/fees" },
  { label: "Pages", href: "/admin/pages" },
  { label: "Navigation", href: "/admin/navigation" },
  { label: "Home Page", href: "/admin/home" },
  { label: "Theme", href: "/admin/theme" },
  { label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-teal-950 text-white flex flex-col">
        <div className="border-b border-teal-800 px-5 py-5">
          <Link href="/admin" className="block">
            <p className="font-serif text-sm font-bold text-amber-300">
              CMS Admin
            </p>
            <p className="text-xs text-teal-200">Arang College Portal</p>
          </Link>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-teal-800 text-amber-300"
                    : "text-teal-100 hover:bg-teal-900 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-teal-800 p-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-300 hover:bg-teal-900 hover:text-red-200"
          >
            Logout
          </button>
          <Link
            href="/"
            target="_blank"
            className="mt-1 block rounded-lg px-4 py-2 text-sm text-teal-300 hover:bg-teal-900 hover:text-white"
          >
            View Site &rarr;
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
