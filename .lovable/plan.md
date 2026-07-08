# Code Simplification Plan — Acorn Brokers Applications

## Google Tag Verification (Read-Only)

The Google Ads tag flow is correct and complete:

1. `index.html` — Loads `gtag.js` for `AW-18302872132`, fires `gtag('config', ...)` on page load
2. `src/vite-env.d.ts` — TypeScript declarations for `window.gtag` and `window.dataLayer`
3. `src/components/application/SuccessScreen.tsx` — Fires conversion on mount: label `AW-18302872132/l55TCIKl18wcEMTUvpdE`, value 1.0 ZAR, `transaction_id` = application ID

Fires exactly once per completed application. No changes needed.

---

## Phase 1: Remove Dead Code & Unused Imports (zero risk)

| Change | File |
|--------|------|
| Remove unused icons (`Users`, `Globe`, `UserPlus`); keep `Shield` | `EligibilityStep.tsx` |
| Remove unused `Shield` (lucide) and `getSession` imports | `pages/Index.tsx` |
| Delete unused component | `ApplicationTrustPanel.tsx` |
| Delete unused helpers `luhnCheck`, `formatSAId`, `formatMobile`, `formatAccountNumber` | `lib/saIdParser.ts` |
| Remove Sonner Toaster (unused) + delete `components/ui/sonner.tsx` | `App.tsx` |
| Delete unused Supabase client file (all API via `apiClient.ts`) | `integrations/supabase/client.ts` |

## Phase 2: Consolidate Duplicated Utilities (low risk)

Create `src/lib/formatters.ts` with:
- `formatCurrency(amount)` — dedupe 4x
- `getOrdinalSuffix(num)` — dedupe 3x
- `maskIdNumber(id)` — dedupe 2x
- `maskAccountNumber(account)` — dedupe 2x

Remove local copies from `pdfGenerator.ts`, `CoverSelectionStep.tsx`, `AuthorisationsStep.tsx`, `SuccessScreen.tsx`. Update `DesktopCoverComparison.tsx` to import `formatCurrency` directly instead of receiving as prop.

## Phase 3: Simplify Wrappers (low risk)

- Remove redundant `onSubmit` wrappers in 5 step components; pass prop directly to `form.handleSubmit()`
- Remove `async` from `getClientInfo` in `sessionManager.ts`; update `Index.tsx` call site

## Phase 4: Extract Shared UI (medium risk)

- Create `src/components/ComplianceStrip.tsx` — extract identical regulatory strip from `Index.tsx` and `Upgrade.tsx`
- `UpgradeForm.tsx` — render cover option select items from `COVER_OPTIONS` + `formatCurrency` instead of hardcoding

## Deferred

- Google Ads tag ID → env var (needs Vite plugin for `index.html`)
- Shared step nav buttons (too much variation)
- `fullApplicationSchema` (needed by `z.infer`)

## Verification

1. `npm run build` after each phase
2. Walk all 5 form steps in dev
3. Confirm SuccessScreen renders and conversion fires
4. Check `/upgrade`, `/privacy`, `/terms`, `/contact`
5. `npm run lint`
