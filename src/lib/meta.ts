"use client";

// Meta (Facebook) Pixel + Conversions API.
//
// Every lead-type form fires ONE standard `Lead` event, sent twice for
// redundancy — once from the browser (Pixel) and once from our server
// (the `meta-capi` edge function → Conversions API) — sharing a single
// `event_id` so Meta deduplicates them into one conversion while maximising
// match quality. The custom params `form_type` / `lead_quality` let us split
// that single Lead into per-form custom conversions in Events Manager later
// (Application_Submitted / Info_Request_Submitted / Waitlist_Submitted).

import { supabase } from "@/integrations/supabase/client";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export type LeadFormType =
  | "application"
  | "info_request"
  | "waitlist"
  | "notify_destination"
  | "newsletter";

// The intent ladder: stronger signal → higher value. Newsletter is the lightest,
// fastest action — a high-volume top-of-funnel signal to keep Meta's optimiser
// fed within the 7-day attribution window on a long purchase cycle.
const LEAD_CONFIG: Record<
  LeadFormType,
  { quality: "high" | "medium" | "low"; value: number }
> = {
  application: { quality: "high", value: 100 },
  info_request: { quality: "medium", value: 40 },
  waitlist: { quality: "low", value: 20 },
  notify_destination: { quality: "low", value: 15 },
  newsletter: { quality: "low", value: 10 },
};

export interface LeadUser {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// Read a first-party cookie (Meta's _fbp / _fbc) for server-side matching.
function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = document.cookie.match(new RegExp("(?:^|; )" + escaped + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

// One id shared by the browser + server event so Meta dedupes them into one.
function makeEventId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    /* noop */
  }
  return "evt-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Fire a single Meta `Lead` conversion for a COMPLETED form submission.
 * Call this only after the row was successfully inserted — never on click —
 * so a Lead always reflects a real, submitted form.
 *
 * Fire-and-forget: it is never awaited and never throws into the caller.
 */
export function trackLead(
  formType: LeadFormType,
  user: LeadUser = {},
  expeditionName?: string,
): void {
  if (typeof window === "undefined") return;

  const { quality, value } = LEAD_CONFIG[formType];
  const eventId = makeEventId();
  const eventSourceUrl = window.location.href;

  // 1) Browser Pixel — passes eventID for deduplication against the server event.
  try {
    window.fbq?.(
      "track",
      "Lead",
      {
        value,
        currency: "USD",
        form_type: formType,
        lead_quality: quality,
        content_name: expeditionName,
      },
      { eventID: eventId },
    );
  } catch {
    /* pixel blocked / not loaded — server event still fires below */
  }

  // 2) Server Conversions API via our Supabase edge function. Fire-and-forget.
  try {
    supabase.functions
      .invoke("meta-capi", {
        body: {
          event_id: eventId,
          event_name: "Lead",
          event_source_url: eventSourceUrl,
          form_type: formType,
          lead_quality: quality,
          value,
          currency: "USD",
          content_name: expeditionName,
          user: {
            email: user.email,
            phone: user.phone,
            first_name: user.firstName,
            last_name: user.lastName,
            fbp: readCookie("_fbp"),
            fbc: readCookie("_fbc"),
          },
        },
      })
      .catch(() => {
        /* network/edge error — the browser Pixel above still counts */
      });
  } catch {
    /* noop */
  }
}
