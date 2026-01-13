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
];

export const WAITING_PERIOD_INFO = {
  immediate: "Legal advice hotline is available immediately upon policy activation.",
  representation: "A 3-month waiting period applies to legal representation services. This waiting period is waived for incidents occurring after the waiting period has lapsed.",
};
