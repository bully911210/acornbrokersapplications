# Full search visibility and favicon upgrade

## Goal
Improve discovery by Google, Bing, and AI answer engines across the public website, while keeping the private upgrade journey out of search and leaving all application behaviour unchanged.

## What will change

### 1. Give every public page accurate search information
- Add route-aware page titles, descriptions, canonical URLs, Open Graph data, and indexing rules.
- Keep the homepage focused on Firearms Guardian firearm legal expense and liability cover in South Africa.
- Give Privacy, Terms, Contact, and 404 pages appropriate metadata.
- Mark `/upgrade` as `noindex, nofollow` so it remains accessible only by direct link and is not promoted in search.

### 2. Improve machine and AI understanding
- Add trustworthy structured data for the website, Acorn Brokers, the Firearms Guardian insurance product, the three cover offers, and homepage breadcrumbs.
- Represent the visible homepage questions and answers as FAQ structured data without adding new claims.
- Add an `llms.txt` summary pointing AI systems to the canonical public pages and clearly identifying the providers, product scope, pricing, waiting periods, and contact details already shown on the site.
- Expand crawler rules for major search and AI discovery crawlers while explicitly excluding `/upgrade`.

### 3. Correct crawl files
- Remove `/upgrade` from the XML sitemap.
- Keep only canonical custom-domain URLs in the sitemap.
- Keep the application homepage and the public legal/contact pages discoverable.

### 4. Add a proper branded favicon
- Derive a lightweight square favicon from the existing Acorn Brokers logo.
- Serve it locally from the website instead of the temporary preview URL.
- Remove the old default icon so browsers cannot fall back to it.

### 5. Preserve application safety
- Do not alter form fields, validation, submissions, Google Ads tracking, upgrade emails, pricing logic, or navigation behaviour.
- Keep all structured content sourced from existing verified website content and regulatory disclosures.

## Technical details
- Use route-level head management for dynamic title, description, canonical, robots, and social metadata.
- Keep a useful static homepage fallback in the base HTML for crawlers that do not run JavaScript.
- Add JSON-LD with stable custom-domain identifiers and no personal application data.
- Generate a padded 64×64 PNG favicon from the existing brand image.

## Verification
- Run the TypeScript check, lint, and production build.
- Verify each route’s rendered head tags and structured data in a browser.
- Confirm `/upgrade` is absent from the sitemap and has `noindex, nofollow`.
- Confirm the favicon loads locally on desktop and mobile-sized previews.
- Check for horizontal overflow or visible regressions on the homepage and application form.

## Limitation
This remains a client-rendered application. Google and major search engines can process route-level metadata, while social crawlers that do not execute JavaScript will use the homepage fallback metadata. Full server-rendered per-page previews would require a separate framework migration and is not included here.
