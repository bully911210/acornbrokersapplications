

# Plan: Remove SA ID Validation & Improve Page Load Performance

## Overview

This plan removes the SA ID number validation (Luhn checksum and verification feedback) and implements performance optimizations to make the page load faster.

---

## Part 1: Remove SA ID Validation

### What Gets Removed

1. **Luhn checksum validation** - The mathematical check that validates if an ID is structurally correct
2. **DO NOT REMOVE THE SA ID message** - The green "Verified: Born 24 May 1990 • Male • SA Citizen" feedback

### What Stays

1. **13-digit length requirement** - Still needs exactly 13 digits (can start with 0 or 00 as well)
2. **Digits-only validation** - Must be numbers only
3. **Visual chunking/masking** - The "910210 5009 087" formatting stays (it helps users proofread)

### Files to Modify

**1. `src/lib/validations.ts`**
- Simplify `saIdNumberSchema` to only check length and digits
- Remove the Luhn check function

**2. `src/components/application/PersonalDetailsStep.tsx`**
- Remove the import of `parseSAId` from saIdParser
- Remove the `idInfo` useMemo hook
- Remove the green verification message display below the SA ID field

### Changes Summary

| File | Change |
|------|--------|
| `src/lib/validations.ts` | Remove Luhn check, keep length/digit validation |
| `PersonalDetailsStep.tsx` | Remove ID parsing feedback display |
| `src/lib/saIdParser.ts` | Can be deleted or kept for future use |

---

## Part 2: Improve Page Load Performance

### Current Performance Issues Identified

1. **External Font Loading** - Google Fonts loaded via CSS import blocks rendering
2. **Staggered Animations** - Multiple elements with `opacity-0` and animation delays
3. **Console Warning** - RadioGroup/Select switching from uncontrolled to controlled

### Optimizations to Implement

**1. Optimize Font Loading**
- Add `font-display: swap` to prevent font blocking
- Consider preloading the Inter font
- Add font preconnect hints to index.html

**2. Remove Initial Opacity-0 on Form Fields**
- Currently form fields start with `opacity-0` and animate in with staggered delays (0.05s to 0.45s)
- This causes a perceived delay before content appears
- Reduce or remove these animation delays for faster perceived load

**3. Fix Controlled Component Warnings**
- Ensure RadioGroup and Select have defined initial values (not `undefined`)
- Change `defaultValues` from `undefined` to empty strings or specific defaults

**4. Lazy Load Non-Critical Assets**
- The form is already lightweight
- Ensure TanStack Query doesn't block initial render

### Files to Modify

| File | Change |
|------|--------|
| `index.html` | Add font preconnect and preload hints |
| `src/index.css` | Optimize font import with display swap |
| `PersonalDetailsStep.tsx` | Remove staggered animation delays |
| `EligibilityStep.tsx` | Fix RadioGroup controlled state warning |
| `BankingDetailsStep.tsx` | Remove animation delays |

---

## Implementation Details

### Validation Changes (validations.ts)

Current SA ID schema:
```typescript
const saIdNumberSchema = z
  .string()
  .length(13, "SA ID number must be 13 digits")
  .regex(/^\d{13}$/, "SA ID number must contain only digits")
  .refine(luhnCheck, "Invalid SA ID number");
```

New simplified schema:
```typescript
const saIdNumberSchema = z
  .string()
  .length(13, "SA ID number must be 13 digits")
  .regex(/^\d{13}$/, "SA ID number must contain only digits");
```

### PersonalDetailsStep Changes

Remove:
```typescript
import { parseSAId } from "@/lib/saIdParser";
// ...
const idInfo = useMemo(() => {
  const rawId = watchedIdNumber?.replace(/\s/g, '') || '';
  if (rawId.length === 13) {
    return parseSAId(rawId);
  }
  return null;
}, [watchedIdNumber]);
```

Remove the verification message JSX:
```jsx
{idInfo?.isValid && (
  <div className="flex items-center gap-2 text-sm text-emerald-600...">
    ...
  </div>
)}
```

### Animation Optimization

Current (slow perceived load):
```tsx
<FormItem className="stagger-1 animate-fade-in opacity-0">
```

Optimized (instant visibility):
```tsx
<FormItem className="animate-fade-in">
```

Or remove animations entirely for form fields:
```tsx
<FormItem>
```

### Font Loading Optimization

Add to `index.html` head:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

Update `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```
The `display=swap` is already present in the Google Fonts URL.

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/validations.ts` | Modify | Remove Luhn check validation |
| `PersonalDetailsStep.tsx` | Modify | Remove ID verification feedback, reduce animations |
| `EligibilityStep.tsx` | Modify | Fix controlled component, reduce animations |
| `BankingDetailsStep.tsx` | Modify | Reduce animations |
| `index.html` | Modify | Add font preconnect hints |
| `src/lib/saIdParser.ts` | Keep | May be useful later, not actively used |

---

## Expected Results

1. **SA ID field** - Still validates 13 digits, still shows chunked format
2. **Page load** - Form fields appear immediately without staggered animation delays
3. **Console warnings** - RadioGroup/Select warnings eliminated
4. **Font loading** - Faster initial text rendering with preconnect
5. **Increase logo size by 25%** in both footer and header.
6. **and also change the site title [Firearm Legal and Liability Cover] and the the favicon of the form application**


