## Google Ads Pixel Integration (AW-18302872132)

### 1. Site-wide Google tag
Add the base gtag loader to `index.html` inside `<head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-18302872132"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-18302872132');
</script>
```

This loads on every route (Index, Upgrade, Privacy, Terms, Contact) since it's an SPA served from a single `index.html`.

### 2. Fire Subscribe conversion on new application success
In `src/components/application/SuccessScreen.tsx`, add a `useEffect` that fires once on mount:

```ts
useEffect(() => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    (window as any).gtag('event', 'conversion', {
      send_to: 'AW-18302872132/F72WCNWI2MscEMTUvpdE',
      value: 1.0,
      currency: 'ZAR',
    });
  }
}, []);
```

Add a minimal TypeScript declaration for `window.gtag` in `src/vite-env.d.ts` to keep types clean.

### 3. Scope
- Upgrade flow: no conversion event fired (per user's answer).
- No changes to edge functions, backend, or existing form logic.
- No cookie banner changes (existing POPIA consent copy already covers analytics).

### Files to change
- `index.html` — add gtag loader in `<head>`
- `src/components/application/SuccessScreen.tsx` — fire conversion on mount
- `src/vite-env.d.ts` — add `gtag` window type
