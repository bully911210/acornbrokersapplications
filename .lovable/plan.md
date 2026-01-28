
# Plan: Smart Logic Form Optimization

## Overview

Implement 5 smart logic rules to dramatically reduce cognitive load and typing effort in the application form. This includes input masking, SA ID parsing with verification feedback, keyboard optimization, banking smart defaults, and progressive disclosure on the review page.

---

## Rule 1: Smart Inputs (Reduce Typing by 50%)

### 1A. SA ID Number Parsing with Verification Feedback

**Current State**: Plain text input that validates but gives no immediate feedback

**New Behaviour**:
- When user enters a valid 13-digit SA ID:
  - Extract Date of Birth (first 6 digits: YYMMDD)
  - Determine Gender (digits 7-10: 0000-4999 = Female, 5000-9999 = Male)
  - Determine Citizenship (digit 11: 0 = SA Citizen, 1 = Permanent Resident)
- Display success message below field:
  ```
  ✓ Verified: Born 24 May 1990 • Male • SA Citizen
  ```

**Files to Create/Modify**:
- Create `src/lib/saIdParser.ts` - utility functions to parse SA ID
- Modify `PersonalDetailsStep.tsx` - add verification message display

### 1B. Address Autocomplete (Simplified Approach)

**Note**: Google Places Autocomplete requires an API key and billing setup. Instead, we'll optimize the existing address fields with better UX:

**Improvement**:
- Keep the 4 address fields but add smart placeholder text
- Add province auto-selection hint based on common city/suburb patterns
- This avoids external API dependencies while still improving UX

---

## Rule 2: Visual Chunking with Input Masks

**Current State**: Raw number strings that are hard to verify

**New Behaviour with Masks**:

| Field | Current | Masked Format |
|-------|---------|---------------|
| Mobile | 0821234567 | 082 123 4567 |
| SA ID | 9102105009087 | 910210 5009 08 7 |
| Account Number | 1234567890 | 1234 5678 90 |

**Implementation**:
- Create `src/components/ui/masked-input.tsx` - reusable masked input component
- Apply masks that auto-format as user types
- Store raw values (without spaces) in form state for validation
- Display formatted values for readability

**Technical Approach**:
- Use controlled input with custom onChange handler
- Format display value with spaces at specific positions
- Strip spaces before validation/submission

---

## Rule 3: Keyboard Optimization for Mobile

**Current State**: Standard text inputs open QWERTY keyboard on mobile

**New Behaviour**:
Add `inputMode="numeric"` and `pattern="[0-9]*"` to numeric-only fields:
- Mobile Number
- SA ID Number
- Account Number

**Files to Modify**:
- `PersonalDetailsStep.tsx` - SA ID, Mobile inputs
- `BankingDetailsStep.tsx` - Account Number input

This forces mobile devices to show the large number pad instead of the tiny QWERTY keyboard.

---

## Rule 4: Banking Smart Defaults

### 4A. Universal Branch Codes

**Current State**: No branch code field exists (already optimal)

**Verification**: The banking form already doesn't require branch codes since major SA banks use universal codes. No changes needed here.

### 4B. Debit Date Selection

**Current State**: Already uses button group (1st, 15th, 25th) - already optimal

**Verification**: The `BankingDetailsStep.tsx` already implements clickable cards for date selection. This is already following best practice.

---

## Rule 5: Progressive Disclosure on Review Page

**Current State**: All 3 legal sections are fully expanded, creating a "wall of text"

**New Behaviour**:
- Present each legal section as a collapsible accordion
- Default state: Collapsed with summary title
- Title format: `Debit Order Authorisation • R245/pm` (includes key info)
- User expands to read full text
- Checkbox only visible when expanded OR as "I have read and agree" without needing expansion

**Accordion Titles**:
1. `Debit Order Authorisation • R[premium]/pm`
2. `Policy Declaration`
3. `POPIA Consent & Privacy Notice`

**Files to Modify**:
- `AuthorisationsStep.tsx` - wrap legal sections in accordions

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/lib/saIdParser.ts` | CREATE | SA ID parsing utilities (DOB, gender, citizenship) |
| `src/components/ui/masked-input.tsx` | CREATE | Reusable masked input component |
| `src/components/application/PersonalDetailsStep.tsx` | MODIFY | Add SA ID verification, input masks, keyboard optimization |
| `src/components/application/BankingDetailsStep.tsx` | MODIFY | Add account number mask, keyboard optimization |
| `src/components/application/AuthorisationsStep.tsx` | MODIFY | Convert legal sections to accordions |

---

## Technical Implementation Details

### SA ID Parser (saIdParser.ts)

```typescript
interface SAIdInfo {
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  citizenship: 'SA Citizen' | 'Permanent Resident';
  isValid: boolean;
}

function parseSAId(idNumber: string): SAIdInfo | null
function formatDateOfBirth(date: Date): string // "24 May 1990"
```

### Masked Input Component

The masked input will:
1. Accept a `mask` pattern prop (e.g., "### ### ####" for mobile)
2. Auto-format input as user types
3. Expose raw value (no spaces) via `onValueChange` callback
4. Display formatted value in the input field

### Accordion Legal Sections

Each accordion item will:
1. Show collapsed by default with summary title
2. Expand on click to reveal full legal text
3. Keep checkbox at bottom of expanded content
4. Allow independent expand/collapse of each section

---

## Mobile UX Improvements

**Keyboard Attributes** added to all numeric fields:
```html
<input 
  inputMode="numeric" 
  pattern="[0-9]*"
  autoComplete="off"
/>
```

This ensures:
- iOS shows numeric keypad
- Android shows numeric keypad
- Reduced thumb errors on mobile

---

## Expected Impact

| Metric | Before | After |
|--------|--------|-------|
| Mobile Number entry | ~12 taps | ~10 taps |
| SA ID entry | Hard to verify | Instant verification |
| SA ID typing errors | Common | Rare (chunked display) |
| Account Number verification | Impossible | Easy (chunked) |
| Legal text anxiety | High | Low (collapsed) |
| Overall form completion time | ~5 min | ~3 min |
