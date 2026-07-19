import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  CLASS_OPTIONS,
  STUDENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  CASTE_OPTIONS,
  SEMESTER_YEAR_OPTIONS,
  PAYMENT_CATEGORY_OPTIONS,
  UNIVERSITY_OPTIONS,
  calculateFees,
  getPaytmConfig,
  getPaytmHost,
  isPaytmReady,
} from "@/lib/fees/config";
import { buildPaytmRequestHeaders } from "@/lib/fees/paytm";
import { upsertPendingOrder } from "@/lib/fees/db";

function generateOrderId(): string {
  const ts = new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, "")
    .slice(0, 14);
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `FEE${ts}${rand}`;
}

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const requiredFields = [
    "payment_category",
    "student_name",
    "father_name",
    "aadhar_number",
    "abc_id",
    "university",
    "class_name",
    "semester",
    "gender",
    "student_type",
    "caste", // Maps to Category in DB
    "email",
    "phone",
  ];

  const missing = requiredFields.filter(
    (f) => !String(payload[f] ?? "").trim()
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  const paymentCategory = String(payload.payment_category).trim();
  if (!(PAYMENT_CATEGORY_OPTIONS as readonly string[]).includes(paymentCategory)) {
    return NextResponse.json(
      { error: "Invalid payment category selected." },
      { status: 400 }
    );
  }

  const university = String(payload.university).trim();
  if (!(UNIVERSITY_OPTIONS as readonly string[]).includes(university)) {
    return NextResponse.json(
      { error: "Invalid university selected." },
      { status: 400 }
    );
  }

  const className = String(payload.class_name).trim();
  if (!(CLASS_OPTIONS as readonly string[]).includes(className)) {
    return NextResponse.json(
      { error: "Invalid class selected." },
      { status: 400 }
    );
  }

  const semester = String(payload.semester).trim();
  if (!(SEMESTER_YEAR_OPTIONS as readonly string[]).includes(semester)) {
    return NextResponse.json(
      { error: "Invalid semester selected." },
      { status: 400 }
    );
  }

  const gender = String(payload.gender).trim();
  if (!(GENDER_OPTIONS as readonly string[]).includes(gender)) {
    return NextResponse.json(
      { error: "Invalid gender selected." },
      { status: 400 }
    );
  }

  const studentType = String(payload.student_type).trim();
  if (!(STUDENT_TYPE_OPTIONS as readonly string[]).includes(studentType)) {
    return NextResponse.json(
      { error: "Invalid student type selected." },
      { status: 400 }
    );
  }

  const caste = String(payload.caste).trim(); // category
  if (!(CASTE_OPTIONS as readonly string[]).includes(caste)) {
    return NextResponse.json(
      { error: "Invalid category selected." },
      { status: 400 }
    );
  }

  const aadharNumber = String(payload.aadhar_number).trim();
  if (!/^\d{12}$/.test(aadharNumber)) {
    return NextResponse.json(
      { error: "Aadhar Number must be exactly 12 digits." },
      { status: 400 }
    );
  }

  const abcId = String(payload.abc_id).trim();
  if (!/^\d{12}$/.test(abcId)) {
    return NextResponse.json(
      { error: "ABC ID must be exactly 12 digits." },
      { status: 400 }
    );
  }

  const phone = String(payload.phone).trim();
  if (!/^\d{10}$/.test(phone)) {
    return NextResponse.json(
      { error: "Mobile number must be exactly 10 digits." },
      { status: 400 }
    );
  }

  // Perform dynamic fee calculations
  const miscFees = Number(payload.misc_fees ?? 0);
  const feeInput = {
    payment_category: paymentCategory,
    student_name: String(payload.student_name).trim(),
    father_name: String(payload.father_name).trim(),
    aadhar_number: aadharNumber,
    abc_id: abcId,
    university,
    class_name: className,
    semester,
    gender,
    student_type: studentType,
    caste,
    phone,
    misc_fees: miscFees,
  };

  const breakdown = calculateFees(feeInput);
  const amountRupees = breakdown.total;

  if (amountRupees <= 0) {
    return NextResponse.json(
      { error: "Calculated fee total must be greater than zero." },
      { status: 400 }
    );
  }

  if (!isPaytmReady()) {
    return NextResponse.json(
      { error: "Paytm credentials are not configured." },
      { status: 500 }
    );
  }

  const currency = process.env.CURRENCY ?? "INR";
  const orderId = generateOrderId();
  const paytmConfig = getPaytmConfig();

  // Build an absolute callback URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const callbackUrl = `${baseUrl}/api/fees/payment/callback`;

  const pendingOrder = {
    order_id: orderId,
    student_id: aadharNumber, // Set Aadhar as customer/student identifier
    student_name: feeInput.student_name,
    father_name: feeInput.father_name,
    gender,
    caste,
    class_name: className,
    student_type: studentType,
    semester_year: semester, // keep semester_year aligned for compatibility
    email: String(payload.email).trim(),
    phone,
    fee_type: paymentCategory.toLowerCase().replace(" ", "_"),
    fee_label: paymentCategory,
    amount_rupees: amountRupees,
    currency,
    created_at: new Date().toISOString(),

    // New fields
    payment_category: paymentCategory,
    aadhar_number: aadharNumber,
    abc_id: abcId,
    university,
    semester,
    fee_breakdown: JSON.stringify(breakdown),
  };

  upsertPendingOrder(pendingOrder);

  const body = {
    requestType: "Payment",
    mid: paytmConfig.mid,
    websiteName: paytmConfig.website,
    orderId,
    callbackUrl,
    txnAmount: { value: amountRupees.toFixed(2), currency },
    userInfo: {
      custId: pendingOrder.student_id,
      firstName: pendingOrder.student_name,
      mobile: pendingOrder.phone,
      email: pendingOrder.email,
    },
  };

  let paytmResponse: Record<string, unknown>;
  try {
    const paytmHost = getPaytmHost();
    const res = await fetch(
      `${paytmHost}/theia/api/v1/initiateTransaction?mid=${paytmConfig.mid}&orderId=${orderId}`,
      {
        method: "POST",
        headers: buildPaytmRequestHeaders(body, paytmConfig.merchantKey),
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) {
      throw new Error(`Paytm returned HTTP ${res.status}`);
    }
    paytmResponse = (await res.json()) as Record<string, unknown>;
  } catch (err) {
    return NextResponse.json(
      { error: `Unable to initiate Paytm transaction: ${(err as Error).message}` },
      { status: 500 }
    );
  }

  const responseBody = (paytmResponse.body ?? {}) as Record<string, unknown>;
  const resultInfo = (responseBody.resultInfo ?? {}) as Record<string, unknown>;
  const txnToken = responseBody.txnToken as string | undefined;

  if (resultInfo.resultStatus !== "S" || !txnToken) {
    return NextResponse.json(
      {
        error:
          (resultInfo.resultMsg as string) ??
          "Paytm transaction initiation failed.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    order_id: orderId,
    amount: amountRupees.toFixed(2),
    amount_rupees: amountRupees,
    currency,
    description: `Payment for ${paymentCategory} - ${className}`,
    fee_label: paymentCategory,
    txn_token: txnToken,
    mid: paytmConfig.mid,
  });
}
