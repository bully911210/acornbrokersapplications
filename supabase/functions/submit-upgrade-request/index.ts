import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const isStr = (v: unknown, max = 255): v is string =>
  typeof v === "string" && v.length > 0 && v.length <= max;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    // Validate required fields
    const required = [
      "firstName", "lastName", "saIdNumber", "mobile", "email",
      "currentCoverOption", "requestedCoverOption",
      "effectiveDatePreference", "signatureName",
    ];
    for (const k of required) {
      if (!isStr(body[k])) {
        return new Response(
          JSON.stringify({ error: `Missing or invalid: ${k}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (!["option_a", "option_b", "unsure"].includes(body.currentCoverOption)) {
      return new Response(
        JSON.stringify({ error: "Invalid currentCoverOption" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!["option_a", "option_b"].includes(body.requestedCoverOption)) {
      return new Response(
        JSON.stringify({ error: "Invalid requestedCoverOption" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (body.signatureConsent !== true || body.popiaConsent !== true) {
      return new Response(
        JSON.stringify({ error: "Authorisation and POPIA consent required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const ua = req.headers.get("user-agent") || null;

    const { data, error } = await supabase
      .from("upgrade_requests")
      .insert({
        first_name: body.firstName,
        last_name: body.lastName,
        sa_id_number: body.saIdNumber,
        mobile: body.mobile,
        email: body.email,
        current_cover_option: body.currentCoverOption,
        requested_cover_option: body.requestedCoverOption,
        effective_date_preference: body.effectiveDatePreference,
        signature_name: body.signatureName,
        signature_consent: true,
        popia_consent: true,
        consent_timestamp: new Date().toISOString(),
        notes: typeof body.notes === "string" ? body.notes.slice(0, 1000) : null,
        agent_id: typeof body.agentId === "string" ? body.agentId : null,
        session_id: crypto.randomUUID(),
        ip_address: ip,
        user_agent: ua,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit upgrade request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fire-and-forget notification email via SendGrid
    const sendgridKey = Deno.env.get("SENDGRID_API_KEY");
    if (sendgridKey) {
      const maskedId = `${body.saIdNumber.slice(0, 6)}*******`;
      const tierLabel = (id: string) =>
        id === "option_a" ? "Essential (R135/pm)" :
        id === "option_b" ? "Comprehensive (R245/pm)" :
        "Unsure";
      const html = `
        <h2>New policy upgrade request</h2>
        <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
        <p><strong>ID:</strong> ${maskedId}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Mobile:</strong> ${body.mobile}</p>
        <p><strong>Current cover:</strong> ${tierLabel(body.currentCoverOption)}</p>
        <p><strong>Requested cover:</strong> ${tierLabel(body.requestedCoverOption)}</p>
        <p><strong>Effective:</strong> ${body.effectiveDatePreference}</p>
        <p><strong>Signed by:</strong> ${body.signatureName}</p>
        ${body.notes ? `<p><strong>Notes:</strong> ${body.notes}</p>` : ""}
        <hr/>
        <p>Request ID: ${data.id}</p>
      `;
      fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: "info@acornbrokers.co.za" }] }],
          from: { email: "info@acornbrokers.co.za", name: "Acorn Brokers Applications" },
          reply_to: { email: body.email },
          subject: `Upgrade request – ${body.firstName} ${body.lastName}`,
          content: [{ type: "text/html", value: html }],
        }),
      }).catch((e) => console.error("SendGrid error:", e));
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
