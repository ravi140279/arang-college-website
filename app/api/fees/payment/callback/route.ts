import { NextRequest, NextResponse } from "next/server";
import { getPaytmConfig, getPaytmHost, isPaytmReady } from "@/lib/fees/config";
import { verifySignature, buildPaytmRequestHeaders } from "@/lib/fees/paytm";
import {
  fetchPendingOrder,
  deletePendingOrder,
  recordPayment,
} from "@/lib/fees/db";

// Paytm sends a form POST to this endpoint after payment
export async function POST(req: NextRequest) {
  // Parse the form-encoded body
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return redirectToFailed(req, "Invalid callback request.");
  }

  const form: Record<string, string> = {};
  formData.forEach((value, key) => {
    form[key] = String(value);
  });

  const requiredFields = ["ORDERID", "TXNID", "CHECKSUMHASH"];
  const missing = requiredFields.filter((f) => !form[f]?.trim());
  if (missing.length > 0) {
    return redirectToFailed(
      req,
      `Missing verification fields: ${missing.join(", ")}`
    );
  }

  const orderId = form.ORDERID.trim();
  const checksumHash = form.CHECKSUMHASH.trim();

  const pendingOrder = fetchPendingOrder(orderId);
  if (!pendingOrder) {
    return redirectToFailed(req, "Order session not found for this callback.");
  }

  if (!isPaytmReady()) {
    return redirectToFailed(req, "Paytm merchant key is not configured.");
  }

  const paytmConfig = getPaytmConfig();

  // Verify checksum — exclude CHECKSUMHASH from the params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { CHECKSUMHASH: _cs, ...paramsWithoutChecksum } = form;
  const checksumValid = verifySignature(
    paramsWithoutChecksum,
    paytmConfig.merchantKey,
    checksumHash
  );

  if (!checksumValid) {
    return redirectToFailed(req, "Paytm checksum verification failed.");
  }

  // Query Paytm order status to confirm payment
  let statusResponse: Record<string, unknown>;
  try {
    const paytmHost = getPaytmHost();
    const statusBody = { mid: paytmConfig.mid, orderId };
    const res = await fetch(`${paytmHost}/v3/order/status`, {
      method: "POST",
      headers: buildPaytmRequestHeaders(statusBody, paytmConfig.merchantKey),
      body: JSON.stringify(statusBody),
    });
    if (!res.ok) {
      throw new Error(`Paytm status check returned HTTP ${res.status}`);
    }
    statusResponse = (await res.json()) as Record<string, unknown>;
  } catch (err) {
    return redirectToFailed(
      req,
      `Payment verification failed: ${(err as Error).message}`
    );
  }

  const statusBody = (statusResponse.body ?? {}) as Record<string, unknown>;
  const resultInfo = (statusBody.resultInfo ?? {}) as Record<string, unknown>;

  if (resultInfo.resultStatus !== "TXN_SUCCESS") {
    return redirectToFailed(
      req,
      (resultInfo.resultMsg as string) ?? "Paytm transaction failed."
    );
  }

  const paymentRecord = {
    student_id: pendingOrder.student_id,
    student_name: pendingOrder.student_name,
    father_name: pendingOrder.father_name,
    gender: pendingOrder.gender,
    caste: pendingOrder.caste,
    class_name: pendingOrder.class_name,
    student_type: pendingOrder.student_type,
    semester_year: pendingOrder.semester_year,
    email: pendingOrder.email,
    phone: pendingOrder.phone,
    fee_type: pendingOrder.fee_type,
    fee_label: pendingOrder.fee_label,
    amount_rupees: pendingOrder.amount_rupees,
    currency: pendingOrder.currency,
    order_id: orderId,
    payment_id: (statusBody.txnId as string) ?? form.TXNID ?? "",
    signature: checksumHash,
    status: "captured_via_paytm",
    created_at: new Date().toISOString(),
    raw_payload: JSON.stringify({ callback: form, status: statusResponse }),
    
    // New fields
    payment_category: pendingOrder.payment_category,
    aadhar_number: pendingOrder.aadhar_number,
    abc_id: pendingOrder.abc_id,
    university: pendingOrder.university,
    semester: pendingOrder.semester,
    fee_breakdown: pendingOrder.fee_breakdown,
  };

  try {
    recordPayment(paymentRecord);
  } catch {
    // Already recorded — proceed to success
  }

  deletePendingOrder(orderId);

  return NextResponse.redirect(
    new URL(
      `/fees/payment/success?orderId=${encodeURIComponent(orderId)}`,
      req.url
    )
  );
}

// Paytm may also call GET in some flows — reject it
export async function GET(req: NextRequest) {
  return redirectToFailed(req, "Invalid callback request method.");
}

function redirectToFailed(req: NextRequest, message: string): NextResponse {
  // Use request protocol and host fallback if base URL env var is not set
  const params = new URLSearchParams({ message });
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  return NextResponse.redirect(
    new URL(`/fees/payment/failed?${params.toString()}`, baseUrl)
  );
}
