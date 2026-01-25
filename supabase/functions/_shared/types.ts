// Shared types for Edge Functions

export interface CoverOption {
  id: "option_a" | "option_b";
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
    liabilityLimit: 1000000,
    benefits: [
      "24/7 Legal Advice Hotline",
      "Criminal Defence Cover",
      "Civil Liability Protection",
      "Firearm License Renewal Assistance",
      "SAPS Station Representation",
    ],
    exclusions: [
      "Intentional unlawful acts",
      "Pre-existing legal matters",
      "Commercial use of firearms",
    ],
  },
  {
    id: "option_b",
    name: "Comprehensive Cover",
    premium: 225,
    legalExpenseLimit: 250000,
    liabilityLimit: 2500000,
    benefits: [
      "All Essential Cover Benefits",
      "Extended Legal Expense Limit",
      "Higher Liability Protection",
      "Appeal Representation",
      "Expert Witness Fees",
      "Bail Application Assistance",
      "Firearm Theft Legal Support",
    ],
    exclusions: [
      "Intentional unlawful acts",
      "Pre-existing legal matters",
      "Commercial use of firearms",
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
