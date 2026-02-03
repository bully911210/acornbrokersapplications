
# Plan: Remove SA ID Validation Entirely, Update Favicon, and Secure Application Flow

## Overview

This plan addresses three requests:
1. Remove ALL validation logic from the SA ID field (accept any 13-digit input without any checks)
2. Update the favicon using a provided URL
3. Secure the anonymous application flow using signed tokens (without requiring user sign-in)

---

## Part 1: Remove SA ID Validation Entirely

### Current State

The SA ID field currently has:
- A Zod schema requiring exactly 13 digits
- A `parseSAId` function in `src/lib/saIdParser.ts` that parses the ID

### Changes Required

The `parseSAId` function in `src/lib/saIdParser.ts` already accepts any 13 digits (the Luhn check was previously removed). However, the problem is that the MaskedInput strips non-digits before validation, but the Zod schema is still rejecting some inputs.

**Root Cause**: The regex in `validations.ts` uses `^\d{13}$` which is correct, but the issue might be:
1. The masked input is sending formatted values (with spaces) to validation
2. There could be edge cases with leading zeros

**Fix Required in `src/lib/validations.ts`**:
- Simplify schema to only check that the raw value (spaces stripped) has 13 characters

**File: `src/lib/validations.ts`**
- Change `saIdNumberSchema` to accept any 13 digits without additional checks
- Remove the regex check and use a simpler transform/validation that strips spaces first

---

## Part 2: Update Favicon

Since you selected "Use URL", please provide the favicon URL and I will update `index.html` to reference it:

```html
<link rel="icon" href="YOUR_FAVICON_URL_HERE" type="image/x-icon">
```

I will add this once you provide the URL in your next message.

---

## Part 3: Secure Anonymous Application Flow with Signed Tokens

### Current Security Issues

The security scan identified these problems:
1. **Session Hijacking Risk**: Anyone who guesses/intercepts the `x-session-id` header can access/modify other users' applications
2. **Missing DELETE Policy**: No protection against unauthorized deletion

### Solution: Signed Token Architecture

Instead of trusting a raw session ID from the client, we'll:
1. Generate a cryptographically signed JWT token on the server when an application starts
2. Store the token client-side and send it with each request
3. Validate the signature on the server before allowing access

### Implementation Steps

#### Step 1: Create a new Edge Function `generate-session-token`

This function will:
- Generate a secure session ID server-side
- Sign it with a secret key (stored in Supabase secrets)
- Return the signed JWT to the client
- Create the initial applicant record

```text
supabase/functions/generate-session-token/index.ts
```

#### Step 2: Create Edge Function `update-application`

This function will:
- Receive the signed token
- Validate the signature
- Update the application data using the service role key

```text
supabase/functions/update-application/index.ts
```

#### Step 3: Modify RLS Policies

Change policies to block all direct client access:
- Remove current INSERT/UPDATE/SELECT policies that rely on `x-session-id`
- Add policies that only allow the `service_role` to access the table
- All client operations go through edge functions

#### Step 4: Add DELETE Policy

Block all DELETE operations:

```sql
CREATE POLICY "Block all deletes"
ON public.applicants
FOR DELETE
USING (false);
```

#### Step 5: Add JWT Secret

Add a new secret `SESSION_JWT_SECRET` for signing tokens.

#### Step 6: Update Frontend

Modify the frontend to:
1. Call `generate-session-token` on Step 1 (instead of direct insert)
2. Store the returned JWT in sessionStorage
3. Send the JWT to `update-application` for all subsequent updates
4. Call `send-application-email` (already implemented) on completion

### Architecture Diagram

```text
┌─────────────────┐
│   Frontend      │
│  (React App)    │
└────────┬────────┘
         │
         ▼ Step 1: POST /generate-session-token
┌─────────────────┐
│ Edge Function:  │──────────► Creates record with service_role
│ generate-token  │◄────────── Returns signed JWT
└─────────────────┘
         │
         ▼ Steps 2-5: POST /update-application (with JWT)
┌─────────────────┐
│ Edge Function:  │──────────► Validates JWT signature
│ update-app      │──────────► Updates record with service_role
└─────────────────┘
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/lib/validations.ts` | Modify | Remove SA ID regex, accept any 13 digits |
| `index.html` | Modify | Add favicon link (after you provide URL) |
| `supabase/functions/generate-session-token/index.ts` | Create | Generate signed JWT for new applications |
| `supabase/functions/generate-session-token/deno.json` | Create | Deno config for the function |
| `supabase/functions/update-application/index.ts` | Create | Secure update endpoint |
| `supabase/functions/update-application/deno.json` | Create | Deno config for the function |
| `supabase/config.toml` | Modify | Add function configs with `verify_jwt = false` |
| `src/lib/supabaseClient.ts` | Modify | Update to use edge functions instead of direct DB access |
| `src/lib/sessionManager.ts` | Modify | Store/retrieve signed JWT token |
| `src/pages/Index.tsx` | Modify | Call edge functions instead of direct DB mutations |
| Database migration | Create | Update RLS policies to block client access, add DELETE policy |

---

## Technical Details

### Session Token JWT Payload

```typescript
{
  session_id: string;      // Random UUID
  applicant_id: string;    // The created applicant record ID
  agent_id?: string;       // Attribution from URL
  iat: number;             // Issued at timestamp
  exp: number;             // Expiry (e.g., 24 hours)
}
```

### New RLS Policies (Database Migration)

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Allow insert with session_id" ON public.applicants;
DROP POLICY IF EXISTS "Allow select own application" ON public.applicants;
DROP POLICY IF EXISTS "Allow update own application" ON public.applicants;

-- Block all direct client operations
-- Service role bypasses RLS, so edge functions can still access
CREATE POLICY "Block direct client access"
ON public.applicants
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);
```

---

## Security Improvements

| Before | After |
|--------|-------|
| Anyone can guess session_id | JWT signature prevents tampering |
| Client writes directly to DB | All writes go through edge functions |
| No DELETE protection | DELETE blocked at RLS level |
| Session hijacking possible | Token must be cryptographically valid |

---

## Expected Outcome

1. **SA ID Field**: Accepts any 13-digit number without validation errors
2. **Favicon**: Updated to your specified URL
3. **Security**: Application data protected by signed tokens, eliminating the security scanner errors


**URL for the favicon: https://id-preview--4d7d9f51-2976-420c-9020-b5676a8bdb6d.lovable.app/assets/acorn-logo-BPjP8sH4.png**
