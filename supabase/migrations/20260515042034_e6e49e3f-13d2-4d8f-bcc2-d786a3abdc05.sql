-- Drop current_policy_number column from upgrade_requests table
ALTER TABLE public.upgrade_requests DROP COLUMN IF EXISTS current_policy_number;