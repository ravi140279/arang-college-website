import type { Metadata } from "next";
import Link from "next/link";
import { fetchPaymentByOrderId } from "@/lib/fees/db";
import { getCollegeConfig, FeeBreakdown } from "@/lib/fees/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Payment Successful",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ orderId?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (!orderId) notFound();

  const payment = fetchPaymentByOrderId(orderId);
  if (!payment) notFound();

  const { accountLabel } = getCollegeConfig();

  const details: [string, string][] = [
    ["Payment Category", payment.payment_category || payment.fee_label],
    ["Student Name", payment.student_name],
    ["Father's Name", payment.father_name],
    ["Aadhar Number", payment.aadhar_number || "-"],
    ["ABC ID", payment.abc_id || "-"],
    ["University", payment.university || "-"],
    ["Class", payment.class_name],
    ["Semester", payment.semester || payment.semester_year],
    ["Gender", payment.gender],
    ["Student Type", payment.student_type],
    ["Category", payment.caste],
    ["Paytm Order ID", payment.order_id],
    ["Paytm Transaction ID", payment.payment_id],
  ];

  let breakdown: FeeBreakdown | null = null;
  if (payment.fee_breakdown) {
    try {
      breakdown = JSON.parse(payment.fee_breakdown) as FeeBreakdown;
    } catch {
      breakdown = null;
    }
  }

  // Label translations for fee breakdown items
  const labelMap: Record<keyof Omit<FeeBreakdown, "total">, string> = {
    govt_fees: "Government Fees",
    lab_fees: "Laboratory Fees",
    practical_fees: "Practical Fees",
    af_fees: "Amalgamated Fund (AF) Fees",
    jbs_fees: "Janbhagidari Samiti (JBS) Fees",
    enrollment_fees: "PRSU Enrollment Fees",
    migration_fees: "PRSU Migration Fees",
    pd_fees: "PD Fees",
    self_finance_fees: "Self Finance Fees",
    agresan_fees: "Agresan Fees",
    lab_exam_fees: "Laboratory (Exam) Fees",
    icard_fees: "I-Card Fees",
    misc_fees: "Miscellaneous Fees",
  };

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-primary-800/20 bg-white/90 p-6 sm:p-10 shadow-lg backdrop-blur space-y-8">
          
          {/* Header Status */}
          <div className="border-b pb-6 border-slate-100">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-900 text-white">
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-800">
                Payment Completed Successfully
              </p>
            </div>
            <h1 className="mt-3 font-serif text-3xl font-black text-primary-950">
              Receipt for {payment.payment_category || payment.fee_label}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Fees cleared and routed to the configured bank account: <strong>{accountLabel}</strong>.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Student Profile details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary-800">
                Student Profile
              </h3>
              <dl className="grid grid-cols-1 gap-2.5">
                {details.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between border-b border-slate-100 pb-2 text-sm"
                  >
                    <dt className="text-slate-500 font-medium">{label}:</dt>
                    <dd className="font-semibold text-slate-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Fee Breakdown Details */}
            <div className="rounded-2xl border border-primary-900/10 bg-primary-50/50 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary-800 border-b border-primary-900/15 pb-2.5 mb-4">
                  Itemized Receipt Breakdown
                </h3>
                
                {breakdown ? (
                  <div className="space-y-2.5 text-xs text-slate-700">
                    {Object.entries(breakdown).map(([key, value]) => {
                      if (key === "total" || value === 0) return null;
                      return (
                        <div key={key} className="flex justify-between">
                          <span>{labelMap[key as keyof Omit<FeeBreakdown, "total">] || key}:</span>
                          <span className="font-semibold">{payment.currency} {Number(value).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Detailed breakdown not stored for this transaction.
                  </p>
                )}
              </div>

              <div className="mt-6 border-t border-primary-900/15 pt-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-800">
                  Total Paid
                </span>
                <span className="text-xl font-black text-primary-950">
                  {payment.currency} {payment.amount_rupees.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap gap-4">
            <Link
              href="/fees"
              className="rounded-xl bg-primary-900 px-6 py-3 text-sm font-bold text-white hover:bg-primary-800"
            >
              Make another payment
            </Link>
            <Link
              href="/fees/payments"
              className="rounded-xl border border-primary-800 px-6 py-3 text-sm font-semibold text-primary-800 hover:bg-primary-50"
            >
              View collection register
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
