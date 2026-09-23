import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import { COVER_OPTIONS } from "@/lib/coverData";

const SITE_URL = "https://applications.acornbrokers.co.za";

const FAQS = [
  {
    question: "Who can apply?",
    answer:
      "You can begin an application if you hold a valid firearm licence or your firearm licence application is currently in progress.",
  },
  {
    question: "When does cover become available?",
    answer:
      "Legal advice is available immediately after policy activation. A 1-month waiting period applies to legal representation services. There is a 3-month waiting period for Liability cover.",
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

const ROUTE_META: Record<string, { title: string; description: string; robots?: string }> = {
  "/": {
    title: "Firearms Guardian | Firearm Legal & Liability Cover",
    description:
      "Compare Firearms Guardian cover from R135 per month and apply online for firearm legal expense and liability protection in South Africa.",
  },
  "/privacy": {
    title: "Privacy Policy | Firearms Guardian",
    description:
      "Read how Acorn Brokers collects, uses, stores and protects personal information under South Africa's POPIA.",
  },
  "/terms": {
    title: "Terms of Service | Firearms Guardian",
    description:
      "Read the terms, waiting periods and important conditions that apply to Firearms Guardian cover and online applications.",
  },
  "/contact": {
    title: "Contact Acorn Brokers | Firearms Guardian",
    description:
      "Contact Acorn Brokers for help with a Firearms Guardian application, policy query or complaint.",
  },
  "/upgrade": {
    title: "Policy Upgrade | Firearms Guardian",
    description: "Existing Firearms Guardian policyholder upgrade request.",
    robots: "noindex, nofollow, noarchive",
  },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${SITE_URL}/#firearms-guardian`,
  name: "Firearms Guardian",
  description:
    "Firearm legal expense and public liability cover for South African firearm owners.",
  brand: {
    "@type": "Brand",
    name: "Firearms Guardian",
  },
  offers: COVER_OPTIONS.map((option) => ({
    "@type": "Offer",
    name: option.name,
    url: `${SITE_URL}/#compare-cover-title`,
    price: option.premium.toString(),
    priceCurrency: "ZAR",
    availability: "https://schema.org/InStock",
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Firearms Guardian",
      item: `${SITE_URL}/`,
    },
  ],
};

export const SeoHead = () => {
  const { pathname } = useLocation();
  const meta = ROUTE_META[pathname] ?? {
    title: "Page Not Found | Firearms Guardian",
    description: "The requested Firearms Guardian page could not be found.",
    robots: "noindex, nofollow",
  };
  const canonicalPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;
  const isHome = pathname === "/";

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="robots" content={meta.robots ?? "index, follow, max-image-preview:large"} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="Firearms Guardian" />
      <meta property="og:locale" content="en_ZA" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />

      {isHome && (
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      )}
      {isHome && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
      {isHome && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Helmet>
  );
};