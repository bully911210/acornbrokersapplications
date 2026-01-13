import { z } from "zod";

// SA ID Number validation with Luhn check
const luhnCheck = (idNumber: string): boolean => {
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    let digit = parseInt(idNumber[i], 10);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

const saIdNumberSchema = z
  .string()
  .length(13, "SA ID number must be 13 digits")
  .regex(/^\d{13}$/, "SA ID number must contain only digits")
  .refine(luhnCheck, "Invalid SA ID number");

// SA Mobile number validation
const saMobileSchema = z
  .string()
  .min(10, "Mobile number is required")
  .regex(
    /^(?:\+27|0)[6-8][0-9]{8}$/,
    "Enter a valid SA mobile number (e.g., 0821234567 or +27821234567)"
  );

// Normalize phone to +27 format
export const normalizePhone = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.startsWith("0")) {
    return "+27" + cleaned.slice(1);
  }
  return cleaned;
};

// SA Provinces
export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
] as const;

// SA Banks
export const SA_BANKS = [
  "ABSA Bank",
  "African Bank",
  "Capitec Bank",
  "Discovery Bank",
  "First National Bank (FNB)",
  "Investec",
  "Nedbank",
  "Standard Bank",
  "TymeBank",
  "Bank Zero",
] as const;

// Step 1: Eligibility Schema
export const eligibilitySchema = z.object({
  firearmLicenceStatus: z.enum(["valid", "in_progress"], {
    required_error: "Please select your firearm licence status",
  }),
  source: z.enum(["online", "agent", "referral", "other"], {
    required_error: "Please select how you heard about us",
  }),
});

// Step 2: Personal Details Schema
export const personalDetailsSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),
  saIdNumber: saIdNumberSchema,
  mobile: saMobileSchema,
  email: z
    .string()
    .email("Enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  streetAddress: z
    .string()
    .min(5, "Street address is required")
    .max(200, "Street address must be less than 200 characters"),
  suburb: z
    .string()
    .min(2, "Suburb is required")
    .max(100, "Suburb must be less than 100 characters"),
  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City must be less than 100 characters"),
  province: z.enum(SA_PROVINCES, {
    required_error: "Please select your province",
  }),
});

// Step 3: Cover Selection Schema
export const coverSelectionSchema = z.object({
  coverOption: z.enum(["option_a", "option_b"], {
    required_error: "Please select a cover option",
  }),
});

// Step 4: Banking Details Schema
export const bankingDetailsSchema = z.object({
  accountHolder: z
    .string()
    .min(2, "Account holder name is required")
    .max(100, "Account holder name must be less than 100 characters"),
  bankName: z.enum(SA_BANKS as unknown as [string, ...string[]], {
    required_error: "Please select your bank",
  }),
  accountType: z.enum(["cheque", "savings", "transmission"], {
    required_error: "Please select account type",
  }),
  accountNumber: z
    .string()
    .min(5, "Account number is required")
    .max(20, "Account number must be less than 20 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  preferredDebitDate: z.enum(["1", "15", "25"], {
    required_error: "Please select your preferred debit date",
  }),
});

// Step 5: Authorisations Schema
export const authorisationsSchema = z.object({
  debitOrderConsent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to the debit order" }),
  }),
  declarationConsent: z.literal(true, {
    errorMap: () => ({ message: "You must accept the declaration" }),
  }),
  termsConsent: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  popiaConsent: z.literal(true, {
    errorMap: () => ({ message: "You must provide POPIA consent" }),
  }),
  electronicSignatureConsent: z.literal(true, {
    errorMap: () => ({ message: "You must consent to electronic signature" }),
  }),
});

// Full application schema
export const fullApplicationSchema = eligibilitySchema
  .merge(personalDetailsSchema)
  .merge(coverSelectionSchema)
  .merge(bankingDetailsSchema)
  .merge(authorisationsSchema);

export type EligibilityData = z.infer<typeof eligibilitySchema>;
export type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;
export type CoverSelectionData = z.infer<typeof coverSelectionSchema>;
export type BankingDetailsData = z.infer<typeof bankingDetailsSchema>;
export type AuthorisationsData = z.infer<typeof authorisationsSchema>;
export type FullApplicationData = z.infer<typeof fullApplicationSchema>;
