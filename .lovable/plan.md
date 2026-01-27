
# Legal Disclosures and Footer Update Plan

## Overview
This plan addresses the required legal text updates, visual improvements, and footer regulatory disclosure for the Firearms Guardian application form. Changes are scoped to the authorisations step and footer only.

---

## Part 1: Legal Text Updates (AuthorisationsStep.tsx)

### Current State
The current implementation has 5 consent items:
1. Debit Order Authorisation (simple, generic text)
2. Declaration (basic accuracy statement)
3. Terms and Conditions (link to terms page)
4. POPIA Consent (link to privacy page)
5. Electronic Signature

### Required Changes
Replace with 3 comprehensive legal blocks containing the verbatim text provided:

**1. Debit Order Authorisation**
- Full 4-paragraph authorisation text naming Firearms Guardian, Acorn Brokers, and agents
- Covers premium deduction authority, increases, legal equivalence of debits, and public holiday handling

**2. Declaration**
- Full 5-paragraph declaration text
- Names GENRIC Insurance Company Limited as underwriter
- Clarifies Firearms Guardian and Acorn Brokers as administrators/intermediaries
- Covers application terms, personal completion, accuracy warranty, and acceptance discretion

**3. Declaration and Informed Consent in Terms of POPIA**
- Full 6-paragraph POPIA consent
- Names GENRIC, Firearms Guardian, and Acorn Brokers
- Covers data collection purposes, third-party sharing, retention, and data subject rights

### Validation Schema Update (validations.ts)
- Reduce from 5 consent fields to 3:
  - `debitOrderConsent` (required, literal true)
  - `declarationConsent` (required, literal true)
  - `popiaConsent` (required, literal true)
- Remove `termsConsent` and `electronicSignatureConsent`

---

## Part 2: Visual Clarity Improvements

### Container Grouping
- Wrap all 3 legal blocks in a single bordered container with:
  - Clear border (`border border-border`)
  - Rounded corners (`rounded-xl`)
  - Distinct background (`bg-muted/20`)
  - Adequate padding (`p-6 md:p-8`)

### Typography Hierarchy
- Headings: Larger size (`text-base md:text-lg`), bold weight (`font-semibold`)
- Body paragraphs: Regular size (`text-sm`), muted colour
- Increased spacing between paragraphs (`space-y-3`)

### Checkbox Alignment
- Position checkboxes consistently at the bottom of each legal block
- Add visual separation (`mt-4 pt-4 border-t`)

### Mobile Optimisation
- Increase padding and spacing for mobile readability
- Ensure text doesn't appear cramped

### Visual Distinction
- Add a section header above the legal container: "Legal Authorisations"
- Subtle visual separator from the Application Summary above

---

## Part 3: Footer Update (Footer.tsx)

### Current Footer Content (Preserved)
- Acorn Brokers logo
- Quick Links section
- Contact section
- Copyright notice
- FSP 47433 disclosure

### New Addition
Add the following regulatory line in the footer bottom section:

> "The Firearms Guardian policy is administered by Firearms Guardian (Pty) Ltd (FSP47115), an authorised Financial Services Provider and underwritten by GENRIC Insurance Company Limited (FSP43638), an authorised Financial Services Provider and licensed non-life Insurer."

- Style: Same as existing footer disclosures (`text-xs text-muted-foreground`)
- Position: New line below existing disclosures

---

## Technical Details

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/validations.ts` | Update authorisationsSchema to 3 fields |
| `src/components/application/AuthorisationsStep.tsx` | Replace consent items with new legal text, update form fields, add visual container |
| `src/components/Footer.tsx` | Add Firearms Guardian/GENRIC regulatory disclosure |

### Schema Changes (validations.ts)
```text
Before: 5 consent fields
- debitOrderConsent
- declarationConsent
- termsConsent
- popiaConsent
- electronicSignatureConsent

After: 3 consent fields
- debitOrderConsent
- declarationConsent
- popiaConsent
```

### Form Default Values Update
- Update defaultValues in useForm to only include the 3 required fields
- All default to `false` (unchecked)

### Validation Rules
- All 3 checkboxes use `z.literal(true)` requiring explicit agreement
- Form submission blocked until all are checked
- Appropriate error messages for each consent type

---

## Implementation Checklist

- [ ] Update authorisationsSchema in validations.ts (3 fields)
- [ ] Replace consentItems array with new legal text
- [ ] Add visual container for legal blocks
- [ ] Improve typography hierarchy (headings, spacing)
- [ ] Ensure mobile-friendly spacing
- [ ] Add footer regulatory disclosure
- [ ] Verify all checkboxes start unchecked
- [ ] Verify form blocks submission without all consents

---

## Final Validation Confirmation
Upon completion, the following will be verified:
- Legal relationships between GENRIC, Firearms Guardian, and Acorn Brokers are explicit
- Debit order authority is enforceable with complete text
- POPIA consent is complete with all required disclosures
- Footer regulatory disclosure is present
- Only minor visual clarity fixes were applied (no redesign)
