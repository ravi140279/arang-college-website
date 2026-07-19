import type { Metadata } from "next";
import Link from "next/link";
import { fetchPayments } from "@/lib/fees/db";
import { getCollegeConfig } from "@/lib/fees/config";

export const metadata: Metadata = {
  title: "Admin Fees Management",
  description: "Authenticated fee payment management for administrators.",
};

export const dynamic = "force-dynamic";

export default function AdminFeesPage() {
  const payments = fetchPayments();
  const { collegeName } = getCollegeConfig();

  const totalAmount = payments.reduce(
    (sum, payment) => sum + payment.amount_rupees,
    0
  );
  const termCount = payments.filter((payment) => payment.fee_type === "term").length;
  const examinationCount = payments.filter(
    (payment) => payment.fee_type === "examination"
  ).length;
  const latestPaymentDate = payments[0]?.created_at
    ? new Date(payments[0].created_at).toLocaleString("en-IN")
    : "No payments yet";

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Fees Management
          </h1>
          <p className="text-sm text-slate-600">
            Authenticated payment register and exports for {collegeName}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/api/admin/fees/export"
            prefetch={false}
            download
            className="rounded-lg bg-teal-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Download CSV
          </Link>
          <Link
            href="/fees/payments"
            target="_blank"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Open Public Register
          </Link>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80">
            Total Collected
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-900">
            INR {totalAmount.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-800/80">
            Total Payments
          </p>
          <p className="mt-1 text-2xl font-bold text-blue-900">{payments.length}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-800/80">
            Term Fees
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-900">{termCount}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-purple-800/80">
            Last Payment
          </p>
          <p className="mt-1 text-sm font-bold text-purple-900">{latestPaymentDate}</p>
          <p className="mt-2 text-sm font-semibold text-purple-900">
            Exam Fees: {examinationCount}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-slate-900">
              Payment Register
            </h2>
            <p className="text-sm text-slate-500">
              Includes Gender and Caste fields for current collection records
            </p>
          </div>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1280px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  {[
                    "Date",
                    "Student ID",
                    "Student Name",
                    "Father's Name",
                    "Gender",
                    "Caste",
                    "Class",
                    "Student Type",
                    "Semester / Year",
                    "Email",
                    "Phone",
                    "Fee Type",
                    "Amount",
                    "Order ID",
                    "Payment ID",
                    "Status",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-600"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr
                    key={payment.order_id}
                    className={
                      index % 2 === 0
                        ? "border-b border-slate-100"
                        : "border-b border-slate-100 bg-slate-50/40"
                    }
                  >
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600">
                      {new Date(payment.created_at).toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-700">
                      {payment.student_id}
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-900">
                      {payment.student_name}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {payment.father_name}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{payment.gender}</td>
                    <td className="px-3 py-3 text-slate-700">{payment.caste}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {payment.class_name}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {payment.student_type}
                    </td>
                    <td className="px-3 py-3 text-slate-700">
                      {payment.semester_year}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{payment.email}</td>
                    <td className="px-3 py-3 text-slate-700">{payment.phone}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {payment.fee_label}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-semibold text-emerald-800">
                      {payment.currency} {payment.amount_rupees.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-500">
                      {payment.order_id}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-500">
                      {payment.payment_id}
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-12 text-center text-sm text-slate-500">
            No fee payments have been recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}