export const CLASS_OPTIONS = [
  "B.A.",
  "B.COM.",
  "B.SC. Maths",
  "B.SC. Biology",
  "M.A. Hindi",
  "M.A. Pol.Sc.",
  "M.A. Economics",
  "M.COM.",
  "M.SC. Maths",
  "M.SC. Zoology",
  "P.G.D.C.A.",
  "D.C.A.",
] as const;

export const SEMESTER_YEAR_OPTIONS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
] as const;

export const PAYMENT_CATEGORY_OPTIONS = [
  "New Admission",
  "Promoted Class",
  "Examination",
] as const;

export const UNIVERSITY_OPTIONS = ["PRSU", "OTHER"] as const;

export const STUDENT_TYPE_OPTIONS = ["Regular", "Private"] as const;

export const GENDER_OPTIONS = ["Male", "Female"] as const;

export const CASTE_OPTIONS = ["SC", "ST", "OBC", "General"] as const;

export type FeeInput = {
  payment_category: string;
  student_name: string;
  father_name: string;
  aadhar_number: string;
  abc_id: string;
  university: string;
  class_name: string;
  semester: string;
  gender: string;
  student_type: string;
  caste: string; // "SC" | "ST" | "OBC" | "General"
  phone: string;
  misc_fees?: number;
};

export type FeeBreakdown = {
  govt_fees: number;
  lab_fees: number;
  practical_fees: number;
  af_fees: number;
  jbs_fees: number;
  enrollment_fees: number;
  migration_fees: number;
  pd_fees: number;
  self_finance_fees: number;
  agresan_fees: number;
  lab_exam_fees: number;
  icard_fees: number;
  misc_fees: number;
  total: number;
};

export function calculateFees(input: FeeInput): FeeBreakdown {
  const {
    payment_category,
    university,
    class_name,
    semester,
    gender,
    student_type,
    caste,
    misc_fees = 0,
  } = input;

  // 1. Govt. Fees
  // Fixed Rs. 5.00 if SC/ST is selected or if Female is selected in Gender
  // Fixed Rs. 120.00 for OBC/ General and for all Male students
  let govt_fees = 120;
  if (caste === "SC" || caste === "ST" || gender === "Female") {
    govt_fees = 5;
  }

  // 2. Laboratory Fees
  // Fixed Rs. 20.00 if Student Type is Regular and B.Sc. Maths/ Biology, M.Sc. Maths/ Zoology is selected in Class
  // For Rest other selections Rs. 0.00
  let lab_fees = 0;
  if (
    student_type === "Regular" &&
    (class_name === "B.SC. Maths" ||
      class_name === "B.SC. Biology" ||
      class_name === "M.SC. Maths" ||
      class_name === "M.SC. Zoology")
  ) {
    lab_fees = 20;
  }

  // 3. Practical Fees
  // Fixed Rs. 100.00 if Student Type is Regular and B.Sc. Maths/ Biology Class is selected.
  // Fixed Rs. 250.00 if Student Type is Private and B.Sc. Maths/ Biology Class is selected
  // For rest other Students Rs. 0.00
  let practical_fees = 0;
  if (class_name === "B.SC. Maths" || class_name === "B.SC. Biology") {
    if (student_type === "Regular") {
      practical_fees = 100;
    } else if (student_type === "Private") {
      practical_fees = 250;
    }
  }

  // 4. AF Fees
  // Fixed Rs. 77.00 for all Students
  const af_fees = 77;

  // 5. JBS Fees
  // Fixed Rs. 500.00 Only for 1st, 3rd, 5th Semester selection, and Rs. 0.00 for rest other Students
  let jbs_fees = 0;
  if (
    semester === "1st Semester" ||
    semester === "3rd Semester" ||
    semester === "5th Semester"
  ) {
    jbs_fees = 500;
  }

  // 6. PRSU Enrollment Fees
  // Fixed Rs. 150.00 only if 1st Semester selection in Class (semester), and Rs. 0.00 for rest other Students.
  let enrollment_fees = 0;
  if (semester === "1st Semester") {
    enrollment_fees = 150;
  }

  // 7. PRSU Migration Fees
  // Fixed Rs. 350.00 Only if OTHER is selected in University section, and Rs. 0.00 for rest other Students
  let migration_fees = 0;
  if (university === "OTHER") {
    migration_fees = 350;
  }

  // 8. PD Fees
  // 1. Fixed Rs. 695.00 [For BA/BCOM/BSC Maths_Biology 1st Sem. Students]
  // 2. Fixed Rs. 520.00 [For BA/BCOM/BSC Maths_Biology 3rd and 5th Semester Students]
  // 3. Fixed Rs. 545.00 [For M.A. Hindi/ M.A. Pol.Sc./ M.A. Economics/ M.COM./ M.SC. Maths / M.SC. Zoology 1st Semester Students]
  // 4. Fixed Rs. 480.00 [For M.A. Hindi/ M.A. Pol.Sc./ M.A. Economics/ M.COM./ M.SC. Maths / M.SC. Zoology 3rd & 5th Semester Students]
  // 5. Fixed Rs. 835.00 [For PGDCA 1st Sem.]
  // 6. Fixed Rs. 795.00 [For DCA 1st Sem.]
  let pd_fees = 0;
  const isUG =
    class_name === "B.A." ||
    class_name === "B.COM." ||
    class_name === "B.SC. Maths" ||
    class_name === "B.SC. Biology";
  const isPG =
    class_name === "M.A. Hindi" ||
    class_name === "M.A. Pol.Sc." ||
    class_name === "M.A. Economics" ||
    class_name === "M.COM." ||
    class_name === "M.SC. Maths" ||
    class_name === "M.SC. Zoology";

  if (isUG) {
    if (semester === "1st Semester") {
      pd_fees = 695;
    } else if (semester === "3rd Semester" || semester === "5th Semester") {
      pd_fees = 520;
    }
  } else if (isPG) {
    if (semester === "1st Semester") {
      pd_fees = 545;
    } else if (semester === "3rd Semester" || semester === "5th Semester") {
      pd_fees = 480;
    }
  } else if (class_name === "P.G.D.C.A.") {
    if (semester === "1st Semester") {
      pd_fees = 835;
    }
  } else if (class_name === "D.C.A.") {
    if (semester === "1st Semester") {
      pd_fees = 795;
    }
  }

  // 9. Self Finance Fees
  // Fixed Rs. 7500.00 for if DCA selected in Class and Fixed Rs. 8500.00 if PGDCA selected class
  // For rest other Students Rs. 0.00.
  let self_finance_fees = 0;
  if (class_name === "D.C.A.") {
    self_finance_fees = 7500;
  } else if (class_name === "P.G.D.C.A.") {
    self_finance_fees = 8500;
  }

  // 10. Other Fees - 1. Agresan Fees
  // Fixed Rs. 30.00 [if Examination is selected in Payment Category]
  let agresan_fees = 0;
  if (payment_category === "Examination") {
    agresan_fees = 30;
  }

  // 11. Other Fees - 2. Laboratory Fees (Exam)
  // Fixed Rs. 250.00 [if Examination is selected in Payment Category, Student Type is Private and B.SC. Maths or B.SC. Zoology class is selected]
  let lab_exam_fees = 0;
  if (
    payment_category === "Examination" &&
    student_type === "Private" &&
    (class_name === "B.SC. Maths" || class_name === "B.SC. Biology")
  ) {
    lab_exam_fees = 250;
  }

  // 12. Other Fees - 3. I-Card Fees
  // Fixed Rs. 35.00 [if Payment Category is New Admission (1st Semester only)]
  let icard_fees = 0;
  if (payment_category === "New Admission" && semester === "1st Semester") {
    icard_fees = 35;
  }

  // 13. Miscellaneous
  const miscellaneous_fees = Math.max(0, Number(misc_fees));

  const total =
    govt_fees +
    lab_fees +
    practical_fees +
    af_fees +
    jbs_fees +
    enrollment_fees +
    migration_fees +
    pd_fees +
    self_finance_fees +
    agresan_fees +
    lab_exam_fees +
    icard_fees +
    miscellaneous_fees;

  return {
    govt_fees,
    lab_fees,
    practical_fees,
    af_fees,
    jbs_fees,
    enrollment_fees,
    migration_fees,
    pd_fees,
    self_finance_fees,
    agresan_fees,
    lab_exam_fees,
    icard_fees,
    misc_fees: miscellaneous_fees,
    total,
  };
}

export type FeeCatalog = {
  term: { label: string; description: string; amount_rupees: number };
  examination: { label: string; description: string; amount_rupees: number };
};

export function getFeeCatalog(): FeeCatalog {
  return {
    term: {
      label: "Term Fees",
      description: "Academic term fee payment",
      amount_rupees: parseInt(process.env.TERM_FEE_AMOUNT ?? "25000", 10),
    },
    examination: {
      label: "Examination Fees",
      description: "Examination registration fee payment",
      amount_rupees: parseInt(process.env.EXAMINATION_FEE_AMOUNT ?? "3500", 10),
    },
  };
}

export function getPaytmConfig() {
  return {
    mid: (process.env.PAYTM_MID ?? "").trim(),
    merchantKey: (process.env.PAYTM_MERCHANT_KEY ?? "").trim(),
    website: (process.env.PAYTM_WEBSITE ?? "WEBSTAGING").trim(),
    channelId: (process.env.PAYTM_CHANNEL_ID ?? "WEB").trim(),
    environment: (process.env.PAYTM_ENV ?? "staging").trim().toLowerCase(),
  };
}

export function isPaytmReady(): boolean {
  const config = getPaytmConfig();
  return !!(config.mid && config.merchantKey);
}

export function getPaytmHost(): string {
  const { environment } = getPaytmConfig();
  return environment === "production"
    ? "https://securegw.paytm.in"
    : "https://securegw-stage.paytm.in";
}

export function getPaytmCheckoutJsUrl(): string {
  const { mid } = getPaytmConfig();
  return `${getPaytmHost()}/merchantpgpui/checkoutjs/merchants/${mid}.js`;
}

export function getCollegeConfig() {
  return {
    collegeName: process.env.COLLEGE_NAME ?? "ABC College",
    accountLabel:
      process.env.COLLEGE_ACCOUNT_LABEL ??
      "State Bank of India Current Account",
    currency: process.env.CURRENCY ?? "INR",
  };
}
