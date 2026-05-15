## 1. Declutter the new-application UI

In `src/pages/Index.tsx` and the step components:

- **Remove the "Firearm Legal Cover Application" pill label** above the H1 in the dossier header. Keep only the H1 + sub-copy.
- **Remove the "Application Progress / Step 1 of 5: Eligibility" text label** above the `StepIndicator` bar (in `StepIndicator.tsx`). The visual bar already conveys this. Keep step numbers/dots only.
- **Remove the "Section N / [title]" kicker block** (`step-content-kicker` + `step-content-title` intro) from each of the 5 step components — `EligibilityStep`, `PersonalDetailsStep`, `CoverSelectionStep`, `BankingDetailsStep`, `AuthorisationsStep`. Each step opens directly with its first question. Keep a single short instructional sentence only where it adds real info (e.g. banking, authorisations).
- **Remove the inner `fieldset-title` "Licence position" sub-header** on the eligibility step since the step now contains a single question.

## 2. Remove the referral source question

- Delete the entire "Referral source" `<section>` from `EligibilityStep.tsx`.
- Drop `source` from `eligibilitySchema` in `src/lib/validations.ts` (make it optional/removed) and from `EligibilityData`.
- In `Index.tsx` `createApplicantMutation`, stop sending `source`. Attribution will rely solely on the `?agent=` / `?ref=` URL params already captured in `sessionManager` and stored as `agent_id`.
- Leave the DB column in place (nullable already) — no migration needed.

## 3. Add "Already have a Policy?" upgrade entry point

- Add a small secondary CTA above the dossier header on `Index.tsx`:
  > *Already have a policy and want to upgrade?* **[Upgrade your cover →]**
- Clicking it routes to a new page `/upgrade` (added to `App.tsx`).

## 4. New upgrade form (separate from new-signup flow)

New page `src/pages/Upgrade.tsx` + components in `src/components/upgrade/`. Single-page form (no 5-step wizard), Medium scope:

**Fields**
- Identity: First name, Last name, SA ID number, Mobile, Email
- Current policy: Existing policy number, Current cover tier (Essential / Comprehensive / Unsure)
- Requested change: Desired new tier (Essential ↔ Comprehensive), Effective date preference
- E-signature: Typed full name + checkbox authorising Acorn Brokers to process the upgrade and amend debit order amount on the existing mandate, POPIA consent
- Optional notes textarea

Validation via Zod, same UK English tone, masked SA ID display, identical header/footer/compliance strip as main app.

## 5. New `upgrade_requests` table + edge function

**Migration** — new table:
- `id`, `created_at`, `updated_at`
- identity fields (first_name, last_name, sa_id_number, mobile, email)
- `current_policy_number`, `current_cover_option` (nullable enum reusing `cover_option` + 'unknown' text fallback)
- `requested_cover_option` (`cover_option` enum)
- `effective_date_preference` text
- `signature_name`, `signature_consent` boolean, `popia_consent` boolean, `consent_timestamp`
- `notes` text
- `agent_id`, `session_id`, `ip_address`, `user_agent`, `status` (`pending` / `processed`)
- RLS: block all direct client access (same pattern as `applicants`)

**Edge function** `supabase/functions/submit-upgrade-request/index.ts`:
- Public endpoint (no JWT — single-shot submission), CORS, Zod-validated body
- Inserts row via service role
- Sends notification email via SendGrid to info@acornbrokers.co.za + confirmation to applicant (reuses SendGrid pattern from `send-application-email`)

Frontend `src/lib/apiClient.ts` gets a `submitUpgradeRequest()` helper that posts to the new function.

## 6. Header CTA

Update the desktop "Apply Now" button in `Header.tsx` to keep the new-signup CTA, and on the upgrade page render an inverse CTA ("New application →") so navigation is symmetrical.

## Files touched

**New**
- `src/pages/Upgrade.tsx`
- `src/components/upgrade/UpgradeForm.tsx`
- `supabase/functions/submit-upgrade-request/index.ts`
- migration: create `upgrade_requests` + RLS

**Edited**
- `src/App.tsx` (route)
- `src/pages/Index.tsx` (declutter, upgrade link, drop source from create payload)
- `src/components/application/StepIndicator.tsx` (drop text label)
- `src/components/application/EligibilityStep.tsx` (drop kicker, drop referral)
- `src/components/application/{PersonalDetails,CoverSelection,BankingDetails,Authorisations}Step.tsx` (drop kicker block)
- `src/lib/validations.ts` (remove `source`, add upgrade schema)
- `src/lib/apiClient.ts` (add upgrade submit helper)

The new-signup flow's 5-step logic, JWT session, email PDF, and database writes are untouched.