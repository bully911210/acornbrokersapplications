import { Link } from "react-router-dom";
import {
  ArrowDown,
  BadgeCheck,
  Check,
  Clock3,
  FileCheck2,
  Gavel,
  Headphones,
  ShieldCheck,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { COVER_OPTIONS, WAITING_PERIOD_INFO } from "@/lib/coverData";
import { formatCurrency } from "@/lib/formatters";

interface PolicyIntroductionProps {
  onStartApplication: () => void;
}

const POLICY_HIGHLIGHTS = [
  { icon: Headphones, label: "24/7 legal advice" },
  { icon: Gavel, label: "Legal representation" },
  { icon: ShieldCheck, label: "Public liability cover" },
  { icon: FileCheck2, label: "Licensing and administrative support" },
];

const APPLICATION_STEPS = [
  "Check your eligibility",
  "Add your details",
  "Choose your cover",
  "Submit for review",
];

const FAQS = [
  {
    question: "Who can apply?",
    answer:
      "You can begin an application if you hold a valid firearm licence or your firearm licence application is currently in progress.",
  },
  {
    question: "When does cover become available?",
    answer: `${WAITING_PERIOD_INFO.immediate} ${WAITING_PERIOD_INFO.representation}`,
  },
  {
    question: "Does cover include my family?",
    answer:
      "Comprehensive Cover extends selected benefits to family members residing at the same address. Premium Cover includes a spouse and dependent children, regardless of the number of firearms owned.",
  },
  {
    question: "When can my monthly debit order run?",
    answer: "You can select the 1st, 15th, or 25th of each month during the application.",
  },
  {
    question: "What happens after I submit?",
    answer:
      "Your details are submitted for review, premium confirmation, and policy processing. Final acceptance remains subject to the applicable policy terms.",
  },
];

export const PolicyIntroduction = ({ onStartApplication }: PolicyIntroductionProps) => (
  <div className="policy-introduction">
    <section className="policy-hero" aria-labelledby="policy-title">
      <div className="policy-hero-copy">
        <p className="policy-eyebrow">Firearm legal expense and liability cover</p>
        <h1 id="policy-title">Firearms Guardian</h1>
        <p className="policy-hero-lead">
          Practical legal support and liability protection for South African firearm owners,
          backed by authorised financial services providers.
        </p>

        <div className="policy-price-anchor">
          <span>Cover from</span>
          <strong>{formatCurrency(COVER_OPTIONS[0].premium)}</strong>
          <span>per month</span>
        </div>

        <div className="policy-hero-actions">
          <Button size="lg" onClick={onStartApplication} className="w-full sm:w-auto">
            Start my application
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
            <Link to="/upgrade">Already have a policy? Upgrade</Link>
          </Button>
        </div>

        <p className="policy-reassurance">
          <BadgeCheck className="h-4 w-4 text-success" />
          Five guided steps · POPIA-conscious handling · Review before final submission
        </p>
      </div>

      <div className="policy-highlights" aria-label="Policy highlights">
        {POLICY_HIGHLIGHTS.map(({ icon: Icon, label }) => (
          <div key={label} className="policy-highlight">
            <Icon className="h-5 w-5 text-primary" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="policy-section" aria-labelledby="compare-cover-title">
      <div className="policy-section-heading">
        <p className="policy-eyebrow">Choose the protection that fits</p>
        <h2 id="compare-cover-title">Compare cover options</h2>
        <p>Every option includes firearm-focused support, with higher limits and added benefits as you move up.</p>
      </div>

      <div className="policy-plan-grid">
        {COVER_OPTIONS.map((option) => (
          <article key={option.id} className="policy-plan">
            <div className="policy-plan-heading">
              <div>
                <h3>{option.name}</h3>
                <p className="policy-plan-price">
                  {formatCurrency(option.premium)} <span>/ month</span>
                </p>
              </div>
              {option.id === "option_b" && <span className="policy-plan-badge">Most Popular</span>}
            </div>

            <dl className="policy-plan-limits">
              <div>
                <dt>Legal expense</dt>
                <dd>{formatCurrency(option.legalExpenseLimit)}</dd>
              </div>
              <div>
                <dt>Liability cover</dt>
                <dd>{formatCurrency(option.liabilityLimit)}</dd>
              </div>
            </dl>

            <ul className="policy-plan-benefits">
              {option.benefits.slice(0, 3).map((benefit) => (
                <li key={benefit}>
                  <Check className="h-4 w-4 text-success" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Accordion type="single" collapsible>
              <AccordionItem value="terms" className="border-0">
                <AccordionTrigger className="py-3 text-sm text-muted-foreground hover:no-underline">
                  Benefits and exclusions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <div>
                      <p className="mb-2 font-medium text-foreground">Included benefits</p>
                      <ul className="space-y-2">
                        {option.benefits.map((benefit) => <li key={benefit}>• {benefit}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 font-medium text-foreground">Key exclusions and conditions</p>
                      <ul className="space-y-2">
                        {option.exclusions.map((exclusion) => <li key={exclusion}>• {exclusion}</li>)}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </article>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button size="lg" onClick={onStartApplication}>Compare and apply</Button>
      </div>
    </section>

    <section className="policy-section policy-process" aria-labelledby="how-it-works-title">
      <div className="policy-section-heading">
        <p className="policy-eyebrow">A clear application process</p>
        <h2 id="how-it-works-title">How it works</h2>
      </div>
      <ol className="policy-process-grid">
        {APPLICATION_STEPS.map((step, index) => (
          <li key={step}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="policy-section policy-faq" aria-labelledby="faq-title">
      <div className="policy-section-heading">
        <p className="policy-eyebrow">Before you apply</p>
        <h2 id="faq-title">Common questions</h2>
      </div>
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {FAQS.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-left hover:no-underline">{item.question}</AccordionTrigger>
            <AccordionContent className="leading-6 text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="policy-waiting-note">
        <Clock3 className="h-4 w-4" />
        Waiting periods, terms, conditions, and exclusions apply. Review the selected option before submitting.
      </p>
    </section>
  </div>
);