-- Create enum for firearm licence status
CREATE TYPE public.firearm_licence_status AS ENUM ('valid', 'in_progress');

-- Create enum for application source
CREATE TYPE public.application_source AS ENUM ('online', 'agent', 'referral', 'other');

-- Create enum for cover option
CREATE TYPE public.cover_option AS ENUM ('option_a', 'option_b');

-- Create enum for account type
CREATE TYPE public.account_type AS ENUM ('cheque', 'savings', 'transmission');

-- Create enum for application status
CREATE TYPE public.application_status AS ENUM ('partial', 'complete');

-- Create applicants table
CREATE TABLE public.applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Step 1: Eligibility
  firearm_licence_status firearm_licence_status,
  source application_source,
  
  -- Step 2: Personal Details
  first_name TEXT,
  last_name TEXT,
  sa_id_number TEXT,
  mobile TEXT,
  email TEXT,
  street_address TEXT,
  suburb TEXT,
  city TEXT,
  province TEXT,
  
  -- Step 3: Cover Selection
  cover_option cover_option,
  
  -- Step 4: Banking Details
  account_holder TEXT,
  bank_name TEXT,
  account_type account_type,
  account_number TEXT,
  preferred_debit_date INTEGER CHECK (preferred_debit_date IN (1, 15, 25)),
  
  -- Step 5: Authorisations
  debit_order_consent BOOLEAN DEFAULT FALSE,
  declaration_consent BOOLEAN DEFAULT FALSE,
  terms_consent BOOLEAN DEFAULT FALSE,
  popia_consent BOOLEAN DEFAULT FALSE,
  electronic_signature_consent BOOLEAN DEFAULT FALSE,
  consent_timestamp TIMESTAMPTZ,
  
  -- Metadata
  current_step INTEGER DEFAULT 1,
  status application_status DEFAULT 'partial',
  agent_id TEXT,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  abandonment_email_sent BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public insert" ON public.applicants
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public update" ON public.applicants
FOR UPDATE TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public select" ON public.applicants
FOR SELECT TO anon, authenticated
USING (true);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for auto-updating updated_at
CREATE TRIGGER update_applicants_updated_at
BEFORE UPDATE ON public.applicants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();