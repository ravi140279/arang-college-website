import type { Metadata } from "next";
import {
  CLASS_OPTIONS,
  STUDENT_TYPE_OPTIONS,
  GENDER_OPTIONS,
  CASTE_OPTIONS,
  SEMESTER_YEAR_OPTIONS,
  getFeeCatalog,
  getPaytmCheckoutJsUrl,
  isPaytmReady,
  getCollegeConfig,
} from "@/lib/fees/config";
import { FeePaymentForm } from "@/components/fees/fee-payment-form";

export const metadata: Metadata = {
  title: "Pay College Fees",
  description: "Pay your term or examination fees securely through Paytm.",
};

export default function FeesPage() {
  const feeCatalog = getFeeCatalog();
  const { currency } = getCollegeConfig();
  const gatewayReady = isPaytmReady();
  const paytmCheckoutJsUrl = getPaytmCheckoutJsUrl();

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <FeePaymentForm
          feeCatalog={feeCatalog}
          classOptions={[...CLASS_OPTIONS]}
          genderOptions={[...GENDER_OPTIONS]}
          casteOptions={[...CASTE_OPTIONS]}
          studentTypeOptions={[...STUDENT_TYPE_OPTIONS]}
          semesterYearOptions={[...SEMESTER_YEAR_OPTIONS]}
          currency={currency}
          paytmCheckoutJsUrl={paytmCheckoutJsUrl}
          gatewayReady={gatewayReady}
        />
      </div>
    </main>
  );
}
