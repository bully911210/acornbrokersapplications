// Meta Pixel client-side event tracking

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

/**
 * Track a Meta Pixel event and return a unique event_id for CAPI deduplication.
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
): string => {
  const eventId = crypto.randomUUID();

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params || {}, { eventID: eventId });
  }

  return eventId;
};

// Step 1 complete — new applicant created
export const trackLead = () => trackEvent("Lead");

// Step 2 complete — personal details submitted
export const trackContact = (email: string) =>
  trackEvent("Contact", { content_name: "Personal Details", email });

// Step 3 complete — cover option selected
export const trackCustomizeProduct = (coverOption: string, value: number) =>
  trackEvent("CustomizeProduct", {
    content_name: coverOption,
    value,
    currency: "ZAR",
  });

// Step 4 complete — banking details submitted
export const trackAddPaymentInfo = () => trackEvent("AddPaymentInfo");

// Step 5 complete — application submitted
export const trackPurchase = (value: number) =>
  trackEvent("Purchase", { value, currency: "ZAR" });

// Page load — ViewContent (matching Events Manager setup)
export const trackViewContent = () =>
  trackEvent("ViewContent", { content_name: "Application Form" });
