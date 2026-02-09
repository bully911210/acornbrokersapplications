// Meta Conversions API (CAPI) server-side event tracking

const PIXEL_ID = "26040292058930114";
const GRAPH_API_VERSION = "v21.0";

interface UserData {
  em?: string; // email (will be hashed)
  ph?: string; // phone (will be hashed)
  fn?: string; // first name (will be hashed)
  ln?: string; // last name (will be hashed)
  ct?: string; // city (will be hashed)
  st?: string; // state/province (will be hashed)
  country?: string; // country code (will be hashed)
  client_ip_address?: string;
  client_user_agent?: string;
  fbc?: string; // click ID
  fbp?: string; // browser ID
}

interface CAPIEventParams {
  eventName: string;
  eventId?: string;
  userData?: UserData;
  customData?: Record<string, unknown>;
  eventSourceUrl?: string;
}

/**
 * SHA-256 hash a string (lowercase, trimmed) for Meta CAPI user data.
 */
async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash user data fields for Meta CAPI compliance.
 * Meta requires PII to be SHA-256 hashed before sending.
 */
async function hashUserData(userData: UserData): Promise<Record<string, string>> {
  const hashed: Record<string, string> = {};

  if (userData.em) hashed.em = await sha256(userData.em);
  if (userData.ph) hashed.ph = await sha256(userData.ph.replace(/[^0-9]/g, ""));
  if (userData.fn) hashed.fn = await sha256(userData.fn);
  if (userData.ln) hashed.ln = await sha256(userData.ln);
  if (userData.ct) hashed.ct = await sha256(userData.ct);
  if (userData.st) hashed.st = await sha256(userData.st);
  if (userData.country) hashed.country = await sha256(userData.country);

  // These are not hashed
  if (userData.client_ip_address) hashed.client_ip_address = userData.client_ip_address;
  if (userData.client_user_agent) hashed.client_user_agent = userData.client_user_agent;
  if (userData.fbc) hashed.fbc = userData.fbc;
  if (userData.fbp) hashed.fbp = userData.fbp;

  return hashed;
}

/**
 * Send an event to Meta Conversions API.
 * Fire-and-forget — errors are logged but don't affect the main flow.
 */
export async function sendCAPIEvent(params: CAPIEventParams): Promise<void> {
  const accessToken = Deno.env.get("META_CAPI_ACCESS_TOKEN");
  if (!accessToken) {
    console.warn("META_CAPI_ACCESS_TOKEN not configured, skipping CAPI event");
    return;
  }

  try {
    const hashedUserData = params.userData
      ? await hashUserData(params.userData)
      : {};

    const eventData = {
      data: [
        {
          event_name: params.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: params.eventId || crypto.randomUUID(),
          event_source_url: params.eventSourceUrl || undefined,
          action_source: "website",
          user_data: hashedUserData,
          custom_data: params.customData || undefined,
        },
      ],
    };

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${accessToken}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CAPI event ${params.eventName} failed:`, response.status, errorText);
    } else {
      console.log(`CAPI event ${params.eventName} sent successfully`);
    }
  } catch (error) {
    console.error(`CAPI event ${params.eventName} error:`, error);
  }
}
