import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple JWT implementation for Deno
async function createJWT(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  
  const encoder = new TextEncoder();
  const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  
  const data = encoder.encode(`${headerB64}.${payloadB64}`);
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  
  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firearmLicenceStatus, source, agentId, userAgent } = await req.json();

    // Validate required fields
    if (!firearmLicenceStatus || !source) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate enum values
    const VALID_LICENCE_STATUSES = ["valid", "in_progress"];
    const VALID_SOURCES = ["online", "agent", "referral", "other"];

    if (!VALID_LICENCE_STATUSES.includes(firearmLicenceStatus)) {
      return new Response(
        JSON.stringify({ error: "Invalid firearm licence status" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!VALID_SOURCES.includes(source)) {
      return new Response(
        JSON.stringify({ error: "Invalid source" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get secrets
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const jwtSecret = Deno.env.get("SESSION_JWT_SECRET");

    if (!supabaseUrl || !supabaseServiceKey || !jwtSecret) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Generate session ID
    const sessionId = crypto.randomUUID();

    // Insert applicant record
    const { data: applicant, error: insertError } = await supabase
      .from("applicants")
      .insert({
        firearm_licence_status: firearmLicenceStatus,
        source: source,
        session_id: sessionId,
        agent_id: agentId || null,
        user_agent: userAgent || null,
        current_step: 1,
        status: "partial",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create application" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create signed JWT token
    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      session_id: sessionId,
      applicant_id: applicant.id,
      agent_id: agentId || null,
      iat: now,
      exp: now + 86400, // 24 hours
    };

    const token = await createJWT(tokenPayload, jwtSecret);

    return new Response(
      JSON.stringify({
        token,
        applicantId: applicant.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
