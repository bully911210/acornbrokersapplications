// Session management for application tracking with signed tokens

export interface SessionData {
  sessionId: string;
  applicantId?: string;
  agentId?: string;
  startTime: number;
  currentStep: number;
  token?: string; // Signed JWT token from server
}

const SESSION_KEY = "acorn_application_session";

// Extract agent attribution from URL
export const extractAgentAttribution = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get("agent") || params.get("agent_id") || params.get("ref");
};

// Initialize or retrieve session
export const initSession = (): SessionData => {
  const existingSession = sessionStorage.getItem(SESSION_KEY);
  
  if (existingSession) {
    try {
      return JSON.parse(existingSession);
    } catch {
      // Invalid session, create new one
    }
  }

  // Return a placeholder session - actual session will be created on server
  const newSession: SessionData = {
    sessionId: "", // Will be set by server
    agentId: extractAgentAttribution() || undefined,
    startTime: Date.now(),
    currentStep: 1,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
  return newSession;
};

// Update session
export const updateSession = (updates: Partial<SessionData>): SessionData => {
  const session = initSession();
  const updatedSession = { ...session, ...updates };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  return updatedSession;
};

// Get current session
export const getSession = (): SessionData | null => {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) return null;
  try {
    return JSON.parse(session);
  } catch {
    return null;
  }
};

// Get token from session
export const getToken = (): string | null => {
  const session = getSession();
  return session?.token || null;
};

// Clear session on completion
export const clearSession = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
};

// Get user agent
export const getUserAgent = (): string => {
  return navigator.userAgent;
};

// Get client info
export const getClientInfo = async (): Promise<{ ip?: string; userAgent: string }> => {
  return {
    userAgent: getUserAgent(),
  };
};
