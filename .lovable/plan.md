# Firearms Guardian Landing Page and Safe Improvement Plan

## Goal
Turn the top of `/` into a concise, high-converting policy introduction while keeping the existing five-step application directly below it and preserving the current `/upgrade` flow, validation, pricing, tracking, regulatory disclosures, and backend behaviour.

## 1. Conversion-focused policy introduction above the form

Build an unframed, compact landing section above Step 1 using only verified policy information already held in the project.

### First viewport
- Lead with the product name **Firearms Guardian** and a clear description of firearm legal expense and liability cover.
- Show an immediate price anchor: **Cover from R135 per month**.
- Summarise the strongest decision-making benefits: 24/7 legal advice, legal representation, public liability cover, and firearm licensing/administrative support.
- Use one primary action, **Start my application**, which scrolls directly to Step 1 and places focus at the first selector.
- Keep the existing **Already have a policy and want to upgrade?** action visible and unchanged in purpose.
- Add concise reassurance beside the action: five steps, POPIA-conscious handling, and no commitment until final confirmation. Avoid unsupported claims such as guaranteed acceptance or invented completion times.

### Policy comparison
- Present all three existing plans from the shared policy data:
  - Essential — R135/month
  - Comprehensive — R245/month
  - Premium — R325/month
- Surface the monthly premium, legal expense limit, liability limit, and a short selection of distinguishing benefits.
- Keep Comprehensive marked **Most Popular**, consistent with Step 3.
- Add a clear **Compare and apply** action that scrolls to Step 1 rather than creating a second application path.
- Include expandable exclusions and waiting-period information so important terms remain available without making the page visually dense.

### Trust and objection handling
- Add a short **How it works** sequence: check eligibility, choose cover, submit securely, receive confirmation.
- Add a compact FAQ covering eligibility, waiting periods, family cover differences, debit-order timing, and what happens after submission. Answers will be derived from existing policy content and legal wording only.
- Retain the existing Acorn Brokers, Firearms Guardian, GENRIC, FSP, and POPIA disclosures. Do not duplicate the same regulatory block in multiple places.
- Keep the design flat and legible: no nested cards, excessive borders, decorative gradients, or unrelated imagery.

## 2. Protect the existing application flow

- Keep the five step components, field names, validation schemas, API payloads, signed-session flow, Google Ads conversion event, and `/upgrade` route intact.
- Mount the existing application below the policy introduction with a stable `Start application` anchor.
- Preserve referral attribution query parameters when users scroll into or enter the form.
- Do not preselect a plan from the landing comparison in the first release; this prevents hidden state changes and keeps Step 3 as the authoritative selection point.
- Keep Step 1 creation logic exactly where it is so merely viewing the landing content does not create applicant records.

## 3. Low-hanging UX improvements

### Safer session recovery
- Restore the saved active step after a reload only when a valid application token and applicant ID are present.
- Persist entered form values in session storage and clear them after successful completion.
- Validate restored step bounds and fail safely back to Step 1 if stored data is malformed or incomplete.
- Never persist data beyond the current browser session and never move sensitive values into URLs or analytics.

### Faster mobile completion
- Add standards-based browser autofill hints to name, mobile, email, and manual address inputs.
- Allow masked fields to accept the appropriate autofill hints rather than forcing autofill off.
- Preserve all existing masks, SA validation rules, and manual address entry.

### Reliable background saves
- Prevent Steps 2–4 from silently advancing when their save fails.
- Prefer awaiting each save before moving forward, with a clear retry message and duplicate-click protection.
- Keep already-entered values in place after a failed save.

### Small interface corrections
- Replace the raw green ID-verification colour with the existing success token.
- Remove the forced full-page reload from the logo link while retaining navigation to `/`.
- Ensure legal/support pages hide the application step indicator and use the intended readable width.
- Correct only verified contact/legal content; do not invent an address or policy promise.
- Standardise mobile action buttons and minimum touch targets without changing the established visual system.

## 4. Build and code simplification

- Confirm actual imports before removing anything; delete only unused UI wrappers and their packages.
- Target the previously identified unused chart, carousel, command palette, calendar, resizable panel, and OTP packages only if a fresh usage scan confirms no live references.
- Keep the dynamically imported PDF generator so its large code is downloaded only when the user requests a PDF.
- Refresh Browserslist compatibility data and resolve actionable lint findings in editable source files; do not edit generated cloud integration files.
- Remove obsolete CSS utilities only after confirming they have no JSX references.
- Rebuild and compare initial JavaScript/CSS output before and after; do not accept a change that increases the initial route payload without a clear reason.

## 5. Execution order and safety gates

1. **Baseline:** capture desktop and mobile screenshots, initial route requests, Google tag presence, application step transitions, `/upgrade`, and current bundle sizes.
2. **Landing section:** add the policy introduction using shared cover data; visually test common mobile and desktop widths.
3. **Application resilience:** implement session recovery, autofill, and awaited save/error handling in isolated changes.
4. **Polish:** apply the small interface corrections and verify legal/support pages.
5. **Cleanup:** prune only confirmed-unused code/dependencies, refresh compatibility data, and resolve safe lint issues.
6. **Regression pass:** run type checks, lint, and production build; then exercise all five application steps, back navigation, reload recovery, completion, PDF download, Google conversion firing once, and the complete upgrade submission path.
7. **Release:** publish only after the regression pass; verify `/`, `/upgrade`, sitemap access, and the custom-domain application flow after release.

## Acceptance criteria

- Visitors understand the product, price range, core cover, key exclusions, and next step before entering personal information.
- The application remains on `/`, directly below the new policy information.
- No viewing or scrolling action creates an applicant record.
- Existing validation, backend payloads, emails, Google Ads conversion behaviour, and upgrade notifications remain unchanged unless explicitly covered above.
- Reloading an in-progress application restores the correct step and entered values safely.
- Failed saves are visible and retriable; users are not advanced on an unsuccessful save.
- Mobile autofill works without weakening validation.
- All routes render correctly on mobile and desktop, and the production build passes without new warnings or material initial-bundle growth.
