# Mobile-first form legibility audit

## Goal
Review all five application steps on a narrow phone screen first, then confirm the same changes remain clear on desktop, without changing field logic, legal wording, branding, or the separate upgrade flow.

## What I’ll change
- Inspect each step in its real interactive state, including expanded cover details, banking selectors, validation messages, the review summary, and expanded declarations.
- Fix cramped text, weak line spacing, wrapping, overly small controls, and touch targets below 44px.
- Prioritise phone layouts: full-width actions, readable stacked rows, safe wrapping for long labels, and clearer separation between sections.
- Preserve the existing desktop comparison while correcting any desktop-only overflow or low-contrast text.

## Verification
- Complete the application through Steps 1–5 at a mobile viewport and capture each step.
- Repeat key checks at desktop width.
- Check for horizontal overflow, clipped text, overlapping controls, and browser console errors.
- Run the project’s TypeScript check and production build.

## Technical details
- Changes will be limited to shared form presentation styles and the affected application step components.
- No validation rules, field names, prices, cover details, consent wording, or submission behaviour will change.
