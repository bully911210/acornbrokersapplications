import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { generateApplicationPDF } from "../_shared/pdfGenerator.ts";
import { COVER_OPTIONS, ApplicantData } from "../_shared/types.ts";
import { sendCAPIEvent } from "../_shared/metaCapi.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
};

const RECIPIENT_EMAILS = [
  "franz@sigsolutions.co.za",
  "franz@acornbrokers.co.za",
];

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

// HTML escape function to prevent XSS in emails
const escapeHtml = (text: string | null | undefined): string => {
  if (!text) return "";
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
};

const generateEmailHtml = (applicant: ApplicantData): string => {
  const coverOption = COVER_OPTIONS.find((opt) => opt.id === applicant.cover_option)!;
  const debitDate = `${applicant.preferred_debit_date}${getOrdinalSuffix(applicant.preferred_debit_date)}`;

  // Escape all user-controlled fields
  const firstName = escapeHtml(applicant.first_name);
  const lastName = escapeHtml(applicant.last_name);
  const saIdNumber = escapeHtml(applicant.sa_id_number);
  const mobile = escapeHtml(applicant.mobile);
  const email = escapeHtml(applicant.email);
  const streetAddress = escapeHtml(applicant.street_address);
  const suburb = escapeHtml(applicant.suburb);
  const city = escapeHtml(applicant.city);
  const province = escapeHtml(applicant.province);
  const accountHolder = escapeHtml(applicant.account_holder);
  const bankName = escapeHtml(applicant.bank_name);
  const accountType = escapeHtml(applicant.account_type);
  const accountNumber = escapeHtml(applicant.account_number);
  const source = escapeHtml(applicant.source);
  const agentId = escapeHtml(applicant.agent_id);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Application Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f7fa; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #29ABE2; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Acorn Brokers</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">New Application Received</p>
            </td>
          </tr>
          
          <!-- Reference -->
          <tr>
            <td style="padding: 25px 30px; background-color: #e8f7fc;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin: 0; color: #29ABE2; font-size: 12px; text-transform: uppercase; font-weight: bold;">Reference Number</p>
                    <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 20px; font-weight: bold;">${applicant.id.toUpperCase().substring(0, 8)}</p>
                  </td>
                  <td style="text-align: right;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">Submitted</p>
                    <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 14px;">${formatDate(applicant.created_at)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Personal Details -->
          <tr>
            <td style="padding: 25px 30px;">
              <h2 style="color: #29ABE2; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">Personal Details</h2>
              <table width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td width="35%" style="color: #64748b; font-size: 14px;">Full Name:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: bold;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">SA ID Number:</td>
                  <td style="color: #1e293b; font-size: 14px;">${saIdNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Mobile:</td>
                  <td style="color: #1e293b; font-size: 14px;">${mobile}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Email:</td>
                  <td style="color: #1e293b; font-size: 14px;">${email}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Address:</td>
                  <td style="color: #1e293b; font-size: 14px;">${streetAddress}, ${suburb}<br>${city}, ${province}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Cover Selection -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #29ABE2; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">Cover Selection</h2>
              <table width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td width="35%" style="color: #64748b; font-size: 14px;">Plan:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: bold;">${coverOption.name}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Monthly Premium:</td>
                  <td style="color: #29ABE2; font-size: 16px; font-weight: bold;">${formatCurrency(coverOption.premium)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Legal Expense Limit:</td>
                  <td style="color: #1e293b; font-size: 14px;">${formatCurrency(coverOption.legalExpenseLimit)}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Liability Limit:</td>
                  <td style="color: #1e293b; font-size: 14px;">${formatCurrency(coverOption.liabilityLimit)}</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Banking Details -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #29ABE2; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">Banking Details</h2>
              <table width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td width="35%" style="color: #64748b; font-size: 14px;">Account Holder:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: bold;">${accountHolder}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Bank:</td>
                  <td style="color: #1e293b; font-size: 14px;">${bankName}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Account Type:</td>
                  <td style="color: #1e293b; font-size: 14px;">${accountType ? accountType.charAt(0).toUpperCase() + accountType.slice(1) : ''}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Account Number:</td>
                  <td style="color: #1e293b; font-size: 14px;">${accountNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Debit Date:</td>
                  <td style="color: #1e293b; font-size: 14px;">${debitDate} of each month</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Consent Confirmations -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #29ABE2; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">Consent Confirmations</h2>
              <table width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td style="color: #1e293b; font-size: 14px;">✅ Debit Order Authorisation</td>
                </tr>
                <tr>
                  <td style="color: #1e293b; font-size: 14px;">✅ Declaration</td>
                </tr>
                <tr>
                  <td style="color: #1e293b; font-size: 14px;">✅ POPIA Consent</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 12px; padding-top: 10px;">
                    Consent recorded: ${formatDate(applicant.consent_timestamp)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Attribution -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <h2 style="color: #29ABE2; font-size: 16px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #e2e8f0;">Attribution</h2>
              <table width="100%" cellpadding="5" cellspacing="0">
                <tr>
                  <td width="35%" style="color: #64748b; font-size: 14px;">Source:</td>
                  <td style="color: #1e293b; font-size: 14px;">${source || "Direct"}</td>
                </tr>
                ${agentId ? `
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Agent ID:</td>
                  <td style="color: #1e293b; font-size: 14px;">${agentId}</td>
                </tr>
                ` : ""}
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1e293b; padding: 20px 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Acorn Brokers (Pty) Ltd | FSP 47433
              </p>
              <p style="color: #64748b; font-size: 11px; margin: 10px 0 0 0;">
                This is an automated notification. The full application PDF is attached.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// SendGrid API call
const sendEmailWithSendGrid = async (
  apiKey: string,
  to: string[],
  from: { email: string; name: string },
  subject: string,
  htmlContent: string,
  attachments?: { content: string; filename: string; type: string; disposition: string }[]
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const payload: Record<string, unknown> = {
    personalizations: [{ to: to.map(email => ({ email })) }],
    from: { email: from.email, name: from.name },
    subject,
    content: [{ type: "text/html", value: htmlContent }],
  };

  if (attachments && attachments.length > 0) {
    payload.attachments = attachments;
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 202) {
    const messageId = response.headers.get("X-Message-Id") || "sent";
    return { success: true, messageId };
  }

  const errorText = await response.text();
  console.error("SendGrid API error:", response.status, errorText);
  return { success: false, error: `SendGrid error: ${response.status} - ${errorText}` };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicantId, eventId } = await req.json();

    if (!applicantId) {
      throw new Error("Missing applicantId");
    }

    // Validate UUID format to prevent injection
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(applicantId)) {
      throw new Error("Invalid applicantId format");
    }

    // Get session ID from header for validation
    const sessionId = req.headers.get("x-session-id");
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing session" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role for full access
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sendGridApiKey = Deno.env.get("SENDGRID_API_KEY")!;

    if (!sendGridApiKey) {
      throw new Error("SendGrid API key not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the complete applicant record - verify session_id matches AND status is complete
    const { data: applicant, error: fetchError } = await supabase
      .from("applicants")
      .select("*")
      .eq("id", applicantId)
      .eq("session_id", sessionId)
      .eq("status", "complete")
      .single();

    if (fetchError || !applicant) {
      console.error("Error fetching applicant or session mismatch:", fetchError);
      return new Response(
        JSON.stringify({ error: "Unauthorized or application not found" }),
        { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Idempotency check: Only send email if not already sent
    if (applicant.abandonment_email_sent === true) {
      console.log("Email already sent for applicant:", applicantId);
      return new Response(
        JSON.stringify({ success: true, message: "Email already sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark email as sent BEFORE sending to prevent race conditions
    const { error: updateError } = await supabase
      .from("applicants")
      .update({ abandonment_email_sent: true })
      .eq("id", applicantId)
      .eq("session_id", sessionId);

    if (updateError) {
      console.error("Error marking email as sent:", updateError);
      // Continue anyway - better to possibly send duplicate than not send at all
    }

    // Generate PDF
    console.log("Generating PDF for applicant:", applicantId);
    const pdfBase64 = generateApplicationPDF(applicant as ApplicantData);

    // Generate email HTML
    const emailHtml = generateEmailHtml(applicant as ApplicantData);
    const refNumber = applicant.id.toUpperCase().substring(0, 8);

    // Send email with SendGrid
    console.log("Sending email via SendGrid to:", RECIPIENT_EMAILS);
    const emailResponse = await sendEmailWithSendGrid(
      sendGridApiKey,
      RECIPIENT_EMAILS,
      { email: "benefits@firearmsguardian.co.za", name: "Acorn Brokers" },
      `New Application Received - ${escapeHtml(applicant.first_name)} ${escapeHtml(applicant.last_name)} - Ref: ${refNumber}`,
      emailHtml,
      [
        {
          content: pdfBase64,
          filename: `Acorn-Application-${refNumber}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ]
    );

    if (!emailResponse.success) {
      console.error("SendGrid email failed:", emailResponse.error);
      throw new Error(emailResponse.error || "Failed to send email");
    }

    console.log("Email sent successfully via SendGrid:", emailResponse.messageId);

    // Fire-and-forget: Send Purchase event to Meta CAPI
    const coverOption = COVER_OPTIONS.find((opt) => opt.id === applicant.cover_option);
    sendCAPIEvent({
      eventName: "Purchase",
      eventId: eventId || undefined,
      userData: {
        em: applicant.email,
        ph: applicant.mobile,
        fn: applicant.first_name,
        ln: applicant.last_name,
        ct: applicant.city,
        st: applicant.province,
        country: "ZA",
      },
      customData: {
        value: coverOption?.premium || 0,
        currency: "ZAR",
        content_name: coverOption?.name || applicant.cover_option,
      },
    }).catch((err) => console.error("CAPI Purchase event error:", err));

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.messageId }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-application-email:", errorMessage);
    
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
