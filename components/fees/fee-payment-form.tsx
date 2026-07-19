"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  CLASS_OPTIONS,
  STUDENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  CASTE_OPTIONS,
  SEMESTER_YEAR_OPTIONS,
  PAYMENT_CATEGORY_OPTIONS,
  UNIVERSITY_OPTIONS,
  calculateFees,
} from "@/lib/fees/config";

declare global {
  interface Window {
    Paytm?: {
      CheckoutJS?: {
        init: (config: unknown) => Promise<void>;
        invoke: () => void;
      };
    };
  }
}

type Props = {
  feeCatalog: unknown;
  classOptions: string[];
  genderOptions: string[];
  casteOptions: string[];
  studentTypeOptions: string[];
  semesterYearOptions: string[];
  currency: string;
  paytmCheckoutJsUrl: string;
  gatewayReady: boolean;
};

export function FeePaymentForm({
  currency,
  paytmCheckoutJsUrl,
  gatewayReady,
}: Props) {
  const [formData, setFormData] = useState({
    payment_category: "New Admission",
    student_name: "",
    father_name: "",
    aadhar_number: "",
    abc_id: "",
    university: "PRSU",
    class_name: "B.A.",
    semester: "1st Semester",
    gender: "Male",
    student_type: "Regular",
    caste: "General",
    phone: "",
    email: "",
    misc_fees: 0,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptLoaded = useRef(false);

  // Filter semester options based on Payment Category
  const availableSemesters = useMemo(() => {
    if (formData.payment_category === "New Admission") {
      return ["1st Semester"];
    } else if (formData.payment_category === "Promoted Class") {
      return [
        "2nd Semester",
        "3rd Semester",
        "4th Semester",
        "5th Semester",
        "6th Semester",
      ];
    } else {
      // Examination category - show all semesters
      return [...SEMESTER_YEAR_OPTIONS];
    }
  }, [formData.payment_category]);

  // Handle auto-adjusting semester when payment category changes
  useEffect(() => {
    if (formData.payment_category === "New Admission") {
      setFormData((prev) => ({ ...prev, semester: "1st Semester" }));
    } else if (formData.payment_category === "Promoted Class") {
      if (formData.semester === "1st Semester") {
        setFormData((prev) => ({ ...prev, semester: "2nd Semester" }));
      }
    }
  }, [formData.payment_category, formData.semester]);

  // Load Paytm CheckoutJS
  useEffect(() => {
    if (!gatewayReady || scriptLoaded.current) return;
    const script = document.createElement("script");
    script.src = paytmCheckoutJsUrl;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
    scriptLoaded.current = true;
  }, [gatewayReady, paytmCheckoutJsUrl]);

  // Calculate live fees breakdown dynamically
  const breakdown = useMemo(() => {
    return calculateFees({
      payment_category: formData.payment_category,
      student_name: formData.student_name,
      father_name: formData.father_name,
      aadhar_number: formData.aadhar_number,
      abc_id: formData.abc_id,
      university: formData.university,
      class_name: formData.class_name,
      semester: formData.semester,
      gender: formData.gender,
      student_type: formData.student_type,
      caste: formData.caste,
      phone: formData.phone,
      misc_fees: formData.misc_fees,
    });
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "misc_fees") {
      setFormData((prev) => ({ ...prev, [name]: Math.max(0, Number(value)) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Run format validations
    if (!/^\d{12}$/.test(formData.aadhar_number)) {
      setError("Aadhar Number must be exactly 12 digits.");
      return;
    }
    if (!/^\d{12}$/.test(formData.abc_id)) {
      setError("ABC ID must be exactly 12 digits.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Mobile Number must be exactly 10 digits.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/fees/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as {
        error?: string;
        order_id?: string;
        txn_token?: string;
        amount?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to create payment order.");
      }

      if (!window.Paytm?.CheckoutJS) {
        throw new Error(
          "Paytm CheckoutJS failed to load. Please verify your internet connection or MID."
        );
      }

      const paytmConfig = {
        root: "",
        flow: "DEFAULT",
        data: {
          orderId: data.order_id,
          token: data.txn_token,
          tokenType: "TXN_TOKEN",
          amount: data.amount,
        },
        handler: {
          notifyMerchant: (eventName: string) => {
            if (eventName === "APP_CLOSED") {
              setSubmitting(false);
            }
          },
        },
      };

      await window.Paytm.CheckoutJS.init(paytmConfig);
      window.Paytm.CheckoutJS.invoke();
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-primary-900/10 bg-white/80 p-6 shadow-md backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-800">
          Digital Fee Collection Portal
        </p>
        <h1 className="mt-1 font-serif text-3xl font-black text-primary-950">
          Pay College Fees
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          Enter your profile details. The system dynamically computes the appropriate
          tuition, laboratory, JBS, and university fees based on your category, class, semester,
          and gender. Payment is settled securely via Paytm.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold">
          <span className="rounded-full bg-primary-100 px-3 py-1 text-primary-800">
            Gateway: {gatewayReady ? "Ready (Configured)" : "Configuration Pending"}
          </span>
          <span className="rounded-full bg-accent-100 px-3 py-1 text-accent-800">
            Currency: {currency}
          </span>
          <Link
            href="/fees/payments"
            className="ml-auto text-primary-900 underline hover:text-primary-700"
          >
            View payment history ledger →
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      )}

      {/* Main Grid: Form on Left (3 cols), Live Receipt on Right (2 cols) */}
      <div className="grid gap-8 lg:grid-cols-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-3 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="font-serif text-xl font-bold text-primary-950 border-b pb-3 border-slate-100">
            Enter Payment Details
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Payment Category */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Payment Category *
              </label>
              <select
                name="payment_category"
                value={formData.payment_category}
                onChange={handleChange}
                required
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-primary-800 focus:outline-none"
              >
                {PAYMENT_CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Student Name *
              </label>
              <input
                type="text"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                placeholder="Student full name"
                required
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              />
            </div>

            {/* Father's Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Father&apos;s Name *
              </label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                placeholder="Father's full name"
                required
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              />
            </div>

            {/* Aadhar Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Aadhar Number *
              </label>
              <input
                type="text"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                placeholder="12-digit Aadhar"
                pattern="[0-9]{12}"
                maxLength={12}
                required
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              />
            </div>

            {/* ABC ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Academic Bank of Credits (ABC ID) *
              </label>
              <input
                type="text"
                name="abc_id"
                value={formData.abc_id}
                onChange={handleChange}
                placeholder="12-digit ABC ID"
                pattern="[0-9]{12}"
                maxLength={12}
                required
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              />
            </div>

            {/* University Radio */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                University *
              </label>
              <div className="flex gap-6 mt-1">
                {UNIVERSITY_OPTIONS.map((univ) => (
                  <label key={univ} className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="university"
                      value={univ}
                      checked={formData.university === univ}
                      onChange={handleChange}
                      className="accent-primary-800"
                    />
                    {univ}
                  </label>
                ))}
              </div>
            </div>

            {/* Class Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Class *
              </label>
              <select
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                required
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              >
                {availableSemesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Student Type *
              </label>
              <select
                name="student_type"
                value={formData.student_type}
                onChange={handleChange}
                required
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              >
                {STUDENT_TYPE_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Category / Caste */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Category *
              </label>
              <select
                name="caste"
                value={formData.caste}
                onChange={handleChange}
                required
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              >
                {CASTE_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit number"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
                required
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              />
            </div>

            {/* Miscellaneous Fees */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Miscellaneous Fees
              </label>
              <input
                type="number"
                name="misc_fees"
                value={formData.misc_fees === 0 ? "" : formData.misc_fees}
                onChange={handleChange}
                placeholder="0.00"
                min={0}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !gatewayReady}
              className="rounded-xl bg-primary-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Initiating transaction..." : "Proceed to Pay Securely"}
            </button>
          </div>
        </form>

        {/* Live Bill Breakdown Side Panel (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-primary-900/10 bg-primary-900 p-6 text-white shadow-md sticky top-20">
            <h3 className="font-serif text-lg font-bold border-b border-primary-800 pb-3">
              Live Fee Receipt
            </h3>
            
            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-primary-200">Category:</span>
                <span className="font-semibold">{formData.payment_category}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span className="text-primary-200">Class & Sem:</span>
                <span className="font-semibold">
                  {formData.class_name} ({formData.semester})
                </span>
              </div>

              {/* Individual Fee Components */}
              <div className="space-y-2.5 pt-2">
                <div className="flex justify-between">
                  <span className="text-primary-200">Govt. Fees:</span>
                  <span className="font-medium">{currency} {breakdown.govt_fees.toFixed(2)}</span>
                </div>
                {breakdown.lab_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">Laboratory Fees:</span>
                    <span className="font-medium">{currency} {breakdown.lab_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.practical_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">Practical Fees:</span>
                    <span className="font-medium">{currency} {breakdown.practical_fees.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-primary-200">AF Fees:</span>
                  <span className="font-medium">{currency} {breakdown.af_fees.toFixed(2)}</span>
                </div>
                {breakdown.jbs_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">JBS Fees:</span>
                    <span className="font-medium">{currency} {breakdown.jbs_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.enrollment_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">PRSU Enrollment:</span>
                    <span className="font-medium">{currency} {breakdown.enrollment_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.migration_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">PRSU Migration:</span>
                    <span className="font-medium">{currency} {breakdown.migration_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.pd_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">PD Fees:</span>
                    <span className="font-medium">{currency} {breakdown.pd_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.self_finance_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">Self Finance Fees:</span>
                    <span className="font-medium">{currency} {breakdown.self_finance_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.agresan_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">Agresan Fees:</span>
                    <span className="font-medium">{currency} {breakdown.agresan_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.lab_exam_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">Laboratory (Exam) Fees:</span>
                    <span className="font-medium">{currency} {breakdown.lab_exam_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.icard_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">I-Card Fees:</span>
                    <span className="font-medium">{currency} {breakdown.icard_fees.toFixed(2)}</span>
                  </div>
                )}
                {breakdown.misc_fees > 0 && (
                  <div className="flex justify-between">
                    <span className="text-primary-200">Miscellaneous Fees:</span>
                    <span className="font-medium">{currency} {breakdown.misc_fees.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 border-t border-primary-800 pt-4 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-wider text-accent-300">
                Total Payable
              </span>
              <span className="text-2xl font-black text-accent-400">
                {currency} {breakdown.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
