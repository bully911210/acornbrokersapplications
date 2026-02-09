import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Verify JWT signature
async function verifyJWT(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // Verify signature
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Decode signature
    const signatureStr = signatureB64.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (signatureStr.length % 4)) % 4);
    const signature = Uint8Array.from(atob(signatureStr + padding), (c) => c.charCodeAt(0));

    const isValid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!isValid) return null;

    // Decode payload
    const payloadStr = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const payloadPadding = "=".repeat((4 - (payloadStr.length % 4)) % 4);
    const payload = JSON.parse(atob(payloadStr + payloadPadding));

    // Check expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      console.error("Token expired");
      return null;
    }

    return payload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, data } = await req.json();

    if (!token || !data) {
      return new Response(
        JSON.stringify({ error: "Missing token or data" }),
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

    // Verify token
    const payload = await verifyJWT(token, jwtSecret);
    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const applicantId = payload.applicant_id as string;

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Whitelist allowed fields to prevent arbitrary column updates
    const ALLOWED_FIELDS = [
      "first_name", "last_name", "sa_id_number", "mobile", "email",
      "street_address", "suburb", "city", "province",
      "cover_option",
      "account_holder", "bank_name", "account_type", "account_number", "preferred_debit_date",
      "debit_order_consent", "declaration_consent", "popia_consent",
      "consent_timestamp", "status", "current_step",
    ];

    const sanitizedData: Record<string, unknown> = {};
    for (const key of ALLOWED_FIELDS) {
      if (key in data) {
        sanitizedData[key] = data[key];
      }
    }

    if (Object.keys(sanitizedData).length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update applicant record
    const { data: updatedApplicant, error: updateError } = await supabase
      .from("applicants")
      .update(sanitizedData)
      .eq("id", applicantId)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update application" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, applicant: updatedApplicant }),
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
