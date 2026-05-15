CREATE TABLE public.upgrade_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  sa_id_number TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  current_policy_number TEXT,
  current_cover_option TEXT,
  requested_cover_option public.cover_option NOT NULL,
  effective_date_preference TEXT,
  signature_name TEXT NOT NULL,
  signature_consent BOOLEAN NOT NULL DEFAULT false,
  popia_consent BOOLEAN NOT NULL DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  notes TEXT,
  agent_id TEXT,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.upgrade_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block direct client access" ON public.upgrade_requests
  FOR ALL TO anon, authenticated USING (false) WITH CHECK (false);

CREATE POLICY "Block all deletes" ON public.upgrade_requests
  FOR DELETE TO public USING (false);

CREATE TRIGGER update_upgrade_requests_updated_at
  BEFORE UPDATE ON public.upgrade_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();