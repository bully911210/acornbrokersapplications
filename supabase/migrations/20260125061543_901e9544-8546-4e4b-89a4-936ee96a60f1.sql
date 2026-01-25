-- Drop existing dangerous permissive policies
DROP POLICY IF EXISTS "Allow public insert" ON public.applicants;
DROP POLICY IF EXISTS "Allow public select" ON public.applicants;
DROP POLICY IF EXISTS "Allow public update" ON public.applicants;

-- Create secure INSERT policy (allow new applications with session_id)
CREATE POLICY "Allow insert with session_id"
ON public.applicants
FOR INSERT
WITH CHECK (
  session_id IS NOT NULL AND
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

-- Create secure SELECT policy (only read own application by session_id)
CREATE POLICY "Allow select own application"
ON public.applicants
FOR SELECT
USING (
  session_id IS NOT NULL AND
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
);

-- Create secure UPDATE policy (only update own application by session_id)
CREATE POLICY "Allow update own application"
ON public.applicants
FOR UPDATE
USING (
  session_id IS NOT NULL AND
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
)
WITH CHECK (
  session_id IS NOT NULL AND
  session_id = current_setting('request.headers', true)::json->>'x-session-id'
);