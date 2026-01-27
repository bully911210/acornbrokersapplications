
# Align Backend Cover Data with Frontend

## Overview

Update `supabase/functions/_shared/types.ts` to match the correct cover option data from `src/lib/coverData.ts`, then redeploy the edge function.

## Changes Required

### 1. Update `supabase/functions/_shared/types.ts`

Replace the `COVER_OPTIONS` array with the correct frontend values:

**Option A - Essential Cover:**
- Premium: R135 (unchanged)
- Legal Expense Limit: R100,000 (unchanged)
- Liability Limit: R100,000 (currently shows R1,000,000 - WRONG)
- Benefits: Update to 8-item list from frontend
- Exclusions: Update to 6-item list from frontend

**Option B - Comprehensive Cover:**
- Premium: R245 (currently shows R225 - WRONG)
- Legal Expense Limit: R300,000 (currently shows R250,000 - WRONG)
- Liability Limit: R300,000 (currently shows R2,500,000 - WRONG)
- Benefits: Update to 11-item list from frontend
- Exclusions: Update to 6-item list from frontend

### 2. Redeploy Edge Function

Redeploy `send-application-email` to pick up the corrected shared types.

### 3. Verify Fix

Reset the test application's email flag and re-trigger to confirm the email now shows:
- Correct R245 premium for Comprehensive Cover
- Correct R300,000 limits
- Correct benefits and exclusions lists

## Files to Modify

| File | Change |
|------|--------|
| `supabase/functions/_shared/types.ts` | Replace COVER_OPTIONS with frontend data |

## Impact

This fix ensures consistency across:
- Application form (already correct)
- Email notifications (will be fixed)
- PDF attachments (will be fixed)
