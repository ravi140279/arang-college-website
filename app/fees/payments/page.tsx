import type { Metadata } from "next";
import Link from "next/link";
import { fetchPayments } from "@/lib/fees/db";
import { getCollegeConfig } from "@/lib/fees/config";

export const metadata: Metadata = {
  title: "Fee Payment Register",
  description: "View all recorded fee payments.",
};

// Disable caching so every visit shows fresh data
export const dynamic = "force-dynamic";

export default function PaymentsPage() {
  const payments = fetchPayments();
  const { collegeName } = getCollegeConfig();

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-[95%] px-2 py-10 sm:px-4 lg:py-12">
        <div className="rounded-2xl border border-primary-900/10 bg-white/90 p-6 shadow-lg backdrop-blur sm:p-8">
          {/* Heading */}
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-800">
                Collection Register
              </p>
              <h1 className="mt-1 font-serif text-2xl font-black text-primary-950 sm:text-3xl">
                {collegeName}
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/api/fees/payments/export"
                prefetch={false}
                download
                className="rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800"
              >
                Download CSV
              </Link>
              <Link
                href="/fees"
                className="rounded-lg border border-primary-800 px-4 py-2 text-sm font-semibold text-primary-800 hover:bg-primary-50"
              >
                ← Back to payment form
              </Link>
            </div>
          </div>

          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[1400px]">
                <thead>
                  <tr className="border-b border-primary-900/10">
                    {[
                      "Date",
                      "Payment Category",
                      "Student Name",
                      "Father's Name",
                      "Aadhar Number",
                      "ABC ID",
                      "University",
                      "Class",
                      "Semester",
                      "Gender",
                      "Student Type",
                      "Category",
                      "Amount",
                      "Order ID",
                      "Payment ID",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-2 py-3 text-left font-bold uppercase tracking-wide text-primary-800"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr
                      key={p.order_id}
                      className={
                        i % 2 === 0
                          ? "border-b border-primary-900/5"
                          : "border-b border-primary-900/5 bg-primary-50/30"
                      }
                    >
                      <td className="whitespace-nowrap px-2 py-3 text-slate-600">
                        {new Date(p.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-2 py-3 font-semibold text-slate-800">
                        {p.payment_category || p.fee_label}
                      </td>
                      <td className="px-2 py-3 font-semibold text-slate-800">
                        {p.student_name}
                      </td>
                      <td className="px-2 py-3 text-slate-700">
                        {p.father_name}
                      </td>
                      <td className="px-2 py-3 font-mono text-slate-600">
                        {p.aadhar_number || "-"}
                      </td>
                      <td className="px-2 py-3 font-mono text-slate-600">
                        {p.abc_id || "-"}
                      </td>
                      <td className="px-2 py-3 text-slate-600">
                        {p.university || "-"}
                      </td>
                      <td className="px-2 py-3 text-slate-700">
                        {p.class_name}
                      </td>
                      <td className="px-2 py-3 text-slate-700">
                        {p.semester || p.semester_year}
                      </td>
                      <td className="px-2 py-3 text-slate-700">
                        {p.gender}
                      </td>
                      <td className="px-2 py-3 text-slate-700">
                        {p.student_type}
                      </td>
                      <td className="px-2 py-3 text-slate-700">
                        {p.caste}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 font-semibold text-primary-900">
                        {p.currency} {p.amount_rupees.toLocaleString("en-IN")}
                      </td>
                      <td className="px-2 py-3 font-mono text-slate-500">
                        {p.order_id}
                      </td>
                      <td className="px-2 py-3 font-mono text-slate-500">
                        {p.payment_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl bg-primary-50/60 px-5 py-8 text-center text-sm text-slate-500">
              No successful fee payments have been recorded yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
