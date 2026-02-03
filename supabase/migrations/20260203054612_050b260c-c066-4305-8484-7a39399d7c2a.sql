-- Drop existing RLS policies that rely on x-session-id header
DROP POLICY IF EXISTS "Allow insert with session_id" ON public.applicants;
DROP POLICY IF EXISTS "Allow select own application" ON public.applicants;
DROP POLICY IF EXISTS "Allow update own application" ON public.applicants;

-- Block all direct client operations for anon and authenticated roles
-- Service role bypasses RLS, so edge functions can still access
CREATE POLICY "Block direct client access"
ON public.applicants
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Block all DELETE operations (even from service role perspective, we don't want deletes)
CREATE POLICY "Block all deletes"
ON public.applicants
FOR DELETE
USING (false);