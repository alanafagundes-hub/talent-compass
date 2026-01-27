import { useEffect, useState } from "react";

export interface TrackingData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string;
  landing_page: string;
}

/**
 * Captures UTM parameters and referrer for marketing attribution.
 * Implements fallback logic: UTM → referrer → "direct"
 */
export function useTrackingParams(): TrackingData {
  const [trackingData, setTrackingData] = useState<TrackingData>(() => captureTrackingData());

  useEffect(() => {
    // Re-capture on mount to ensure we have the latest data
    setTrackingData(captureTrackingData());
  }, []);

  return trackingData;
}

/**
 * Captures tracking data from URL and document
 */
export function captureTrackingData(): TrackingData {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get("utm_source"),
    utm_medium: urlParams.get("utm_medium"),
    utm_campaign: urlParams.get("utm_campaign"),
    utm_content: urlParams.get("utm_content"),
    utm_term: urlParams.get("utm_term"),
    referrer: document.referrer || "",
    landing_page: window.location.pathname + window.location.search,
  };
}

/**
 * Resolves the source name based on UTM params and referrer.
 * Fallback priority: utm_source → referrer domain → "Acesso Direto"
 */
export function resolveSourceName(tracking: TrackingData): string {
  // Priority 1: UTM source
  if (tracking.utm_source) {
    return normalizeSourceName(tracking.utm_source);
  }
  
  // Priority 2: Referrer domain
  if (tracking.referrer) {
    try {
      const referrerUrl = new URL(tracking.referrer);
      const domain = referrerUrl.hostname.toLowerCase();
      
      // Map common referrers to friendly names
      if (domain.includes("linkedin.com")) return "LinkedIn";
      if (domain.includes("indeed.com")) return "Indeed";
      if (domain.includes("glassdoor.com")) return "Glassdoor";
      if (domain.includes("google.com") || domain.includes("google.com.br")) return "Google";
      if (domain.includes("facebook.com") || domain.includes("fb.com")) return "Facebook";
      if (domain.includes("instagram.com")) return "Instagram";
      if (domain.includes("twitter.com") || domain.includes("x.com")) return "Twitter/X";
      if (domain.includes("whatsapp.com")) return "WhatsApp";
      if (domain.includes("t.co")) return "Twitter/X";
      
      // Return cleaned domain for unknown referrers
      return domain.replace("www.", "");
    } catch {
      return "Referral";
    }
  }
  
  // Priority 3: Direct access
  return "Acesso Direto";
}

/**
 * Normalizes UTM source values to friendly names
 */
function normalizeSourceName(source: string): string {
  const normalized = source.toLowerCase().trim();
  
  const sourceMap: Record<string, string> = {
    "linkedin": "LinkedIn",
    "linkedin_jobs": "LinkedIn Jobs",
    "indeed": "Indeed",
    "glassdoor": "Glassdoor",
    "google": "Google",
    "google_ads": "Google Ads",
    "facebook": "Facebook",
    "facebook_ads": "Facebook Ads",
    "instagram": "Instagram",
    "twitter": "Twitter/X",
    "whatsapp": "WhatsApp",
    "indicacao": "Indicação Interna",
    "indicacao_interna": "Indicação Interna",
    "referral": "Indicação",
    "email": "E-mail Marketing",
    "newsletter": "Newsletter",
    "site": "Site Carreiras",
    "carreiras": "Site Carreiras",
    "qr_code": "QR Code",
    "evento": "Evento",
  };
  
  return sourceMap[normalized] || source;
}

/**
 * Formats tracking data for display in the internal panel
 */
export function formatTrackingForDisplay(tracking: TrackingData | null): {
  source: string;
  medium: string | null;
  campaign: string | null;
  referrer: string | null;
  landingPage: string | null;
} | null {
  if (!tracking) return null;
  
  return {
    source: resolveSourceName(tracking),
    medium: tracking.utm_medium,
    campaign: tracking.utm_campaign,
    referrer: tracking.referrer || null,
    landingPage: tracking.landing_page || null,
  };
}
