// Secure API client for application operations using edge functions

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface GenerateTokenResponse {
  token: string;
  applicantId: string;
}

interface UpdateApplicationResponse {
  success: boolean;
  applicant: Record<string, unknown>;
}

/**
 * Create a new application and get a signed token
 */
export const createApplication = async (data: {
  firearmLicenceStatus: string;
  source: string;
  agentId?: string;
  userAgent?: string;
}): Promise<GenerateTokenResponse> => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-session-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create application");
  }

  return response.json();
};

/**
 * Update an application using the signed token
 */
export const updateApplication = async (
  token: string,
  data: Record<string, unknown>
): Promise<UpdateApplicationResponse> => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/update-application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, data }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update application");
  }

  return response.json();
};

/**
 * Send application email (existing function, now with token auth)
 */
export const sendApplicationEmail = async (
  applicantId: string,
  token: string
): Promise<void> => {
  const response = await fetch(`${SUPABASE_URL}/functions/v1/send-application-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-session-token": token,
    },
    body: JSON.stringify({ applicantId }),
  });

  if (!response.ok) {
    console.error("Failed to send application email");
  }
};
