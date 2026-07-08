## Swap conversion label to new Purchase page-load event

The base Google tag (`AW-18302872132`) already loaded in `index.html` stays as-is — it's the same account. Only the conversion label changes, and only the page-load variant is used (SuccessScreen mount = purchase confirmation equivalent).

### Change

`src/components/application/SuccessScreen.tsx` — update the `useEffect` conversion call:

- Old `send_to`: `AW-18302872132/F72WCNWI2MscEMTUvpdE`
- New `send_to`: `AW-18302872132/l55TCIKl18wcEMTUvpdE`

Keep the existing behaviour:
- Fires once on mount (page-load pattern, matching Google's snippet)
- `value: 1.0`, `currency: 'ZAR'`
- `transaction_id: applicationData.id` (real applicant ID — better than Google's empty-string default for dedup)
- `window.gtag` existence guard preserved

### Not changing

- `index.html` gtag loader — same AW ID, no edit needed.
- `src/vite-env.d.ts` — `window.gtag` type already declared.
- Upgrade flow — still no conversion fired (per prior decision).
- The click-handler variant (`gtag_report_conversion`) is not needed: the SuccessScreen render itself is the post-conversion page, so the page-load snippet is the correct pattern.

### Verification after edit

Drive the preview with Playwright to the success screen and confirm:
1. `dataLayer` receives an `event: 'conversion'` push with the new `send_to`.
2. A network request to `googleads.g.doubleclick.net` / `www.google.com/pagead/1p-conversion` fires with the new label.
