// Secure Supabase client helper that includes session_id in headers for RLS
import { createClient } from '@supabase/supabase-js';
import type { Database } from "@/integrations/supabase/types";
import { getSession } from "./sessionManager";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Create a Supabase client with session_id header for RLS policy verification
 * This ensures the applicant can only access their own data
 */
export const createSecureClient = () => {
  const session = getSession();
  const sessionId = session?.sessionId || '';
  
  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      headers: {
        'x-session-id': sessionId,
      },
    },
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

/**
 * Insert a new applicant with session_id header for RLS
 */
export const insertApplicant = async (data: Record<string, unknown>) => {
  const client = createSecureClient();
  
  return client
    .from("applicants")
    .insert(data)
    .select()
    .single();
};

/**
 * Update an applicant with session_id header for RLS
 */
export const updateApplicantById = async (id: string, data: Record<string, unknown>) => {
  const client = createSecureClient();
  
  return client
    .from("applicants")
    .update(data)
    .eq("id", id);
};

/**
 * Update and return an applicant with session_id header for RLS
 */
export const updateApplicantByIdReturning = async (id: string, data: Record<string, unknown>) => {
  const client = createSecureClient();
  
  return client
    .from("applicants")
    .update(data)
    .eq("id", id)
    .select()
    .single();
};

/**
 * Get an applicant by ID with session_id header for RLS
 */
export const getApplicantById = async (id: string) => {
  const client = createSecureClient();
  
  return client
    .from("applicants")
    .select("*")
    .eq("id", id)
    .single();
};
