import { NextResponse } from "next/server";
import { fetchPayments } from "@/lib/fees/db";

function escapeCsvCell(value: string | number): string {
  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export async function GET() {
  const payments = fetchPayments();

  const header = [
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
    "Email",
    "Phone",
    "Amount",
    "Currency",
    "Order ID",
    "Payment ID",
    "Status",
  ];

  const rows = payments.map((payment) => [
    payment.created_at,
    payment.payment_category || payment.fee_label,
    payment.student_name,
    payment.father_name,
    payment.aadhar_number || "-",
    payment.abc_id || "-",
    payment.university || "-",
    payment.class_name,
    payment.semester || payment.semester_year,
    payment.gender,
    payment.student_type,
    payment.caste,
    payment.email,
    payment.phone,
    payment.amount_rupees,
    payment.currency,
    payment.order_id,
    payment.payment_id,
    payment.status,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="fee-payments-register.csv"',
      "Cache-Control": "no-store",
    },
  });
}