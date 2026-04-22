// Shared types for Edge Functions

export interface CoverOption {
  id: "option_a" | "option_b" | "option_c";
  name: string;
  premium: number;
  legalExpenseLimit: number;
  liabilityLimit: number;
  benefits: string[];
  exclusions: string[];
}

export const COVER_OPTIONS: CoverOption[] = [
  {
    id: "option_a",
    name: "Essential Cover",
    premium: 135,
    legalExpenseLimit: 100000,
    liabilityLimit: 100000,
    benefits: [
      "Legal advice hotline - 24/7 access to qualified attorneys",
      "R100,000 legal expense cover for firearm-related matters",
      "R100,000 public liability cover",
      "Bail application assistance",
      "SAP 13 enquiry representation",
      "Criminal defence for lawful firearm use",
      "Administrative appeals for licence applications",
      "CFR hearing representation",
    ],
    exclusions: [
      "Intentional illegal acts or gross negligence",
      "Claims arising from intoxication",
      "Pre-existing legal disputes before policy inception",
      "Matters unrelated to lawful firearm ownership/use",
      "Commercial or business-related firearm use",
      "Claims where the insured admits guilt",
    ],
  },
  {
    id: "option_b",
    name: "Comprehensive Cover",
    premium: 245,
    legalExpenseLimit: 300000,
    liabilityLimit: 300000,
    benefits: [
      "Legal advice hotline - 24/7 access to qualified attorneys",
      "R300,000 legal expense cover for firearm-related matters",
      "R300,000 public liability cover",
      "Bail application assistance",
      "SAP 13 enquiry representation",
      "Criminal defence for lawful firearm use",
      "Administrative appeals for licence applications",
      "CFR hearing representation",
      "Extended cover for family members residing at same address",
      "Cover for safe storage prosecutions",
      "Inquest representation",
    ],
    exclusions: [
      "Intentional illegal acts or gross negligence",
      "Claims arising from intoxication",
      "Pre-existing legal disputes before policy inception",
      "Matters unrelated to lawful firearm ownership/use",
      "Commercial or business-related firearm use",
      "Claims where the insured admits guilt",
    ],
  },
  {
    id: "option_c",
    name: "Option C",
    premium: 325,
    legalExpenseLimit: 400000,
    liabilityLimit: 300000,
    benefits: [
      "Legal expense protection up to R400,000 per case",
      "Firearm-liability protection up to R300,000 per annum",
      "SAPS Delay Assist up to R3,000",
      "24/7 nationwide access to our panel of 2,500+ practicing attorneys",
      "Legal representation in High Court and Magistrate's Court",
      "Spouse and dependent children included, regardless of the number of firearms owned",
      "Full firearms administrative support (licensing, renewals, estate transfers)",
    ],
    exclusions: [
      "1-month waiting period for legal representation",
      "3-month waiting period for liability claims",
      "Pre-existing cases at policy inception are excluded",
      "Premiums are reviewed annually",
    ],
  },
];

export interface ApplicantData {
  id: string;
  first_name: string;
  last_name: string;
  sa_id_number: string;
  mobile: string;
  email: string;
  street_address: string;
  suburb: string;
  city: string;
  province: string;
  cover_option: "option_a" | "option_b";
  account_holder: string;
  bank_name: string;
  account_type: string;
  account_number: string;
  preferred_debit_date: number;
  debit_order_consent: boolean;
  declaration_consent: boolean;
  terms_consent: boolean;
  popia_consent: boolean;
  electronic_signature_consent: boolean;
  consent_timestamp: string;
  status: string;
  source: string;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
}
