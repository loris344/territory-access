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

// A stable first-party id for this browser, sent (plain) on both the Pixel
// (advanced matching, set at init in layout.tsx) and the server event, under the
// same `lr_eid` localStorage key — improves match quality and lets Meta link the
// same person across sessions on a long purchase cycle.
function getExternalId(): string | undefined {
  try {
    let eid = localStorage.getItem("lr_eid");
    if (!eid) {
      eid =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : "e" + Date.now() + Math.random().toString(36).slice(2);
      localStorage.setItem("lr_eid", eid);
    }
    return eid;
  } catch {
    return undefined;
  }
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

// A distinct standard event per form. Meta shows each natively in Events Manager
// with its own count — no custom conversion / parameter matching needed. We also
// keep firing `Lead` for all of them so campaign optimisation on Lead still works.
const STD_EVENT: Record<LeadFormType, string> = {
  application: "SubmitApplication",
  info_request: "Contact",
  waitlist: "CompleteRegistration",
  notify_destination: "Schedule",
  newsletter: "Subscribe",
};

/**
 * Fire Meta events for a COMPLETED form submission (never on click).
 * Sends TWO events, each deduplicated browser-Pixel + server-CAPI:
 *   1) `Lead` for every form (so the campaign optimises on one aggregate event)
 *   2) a distinct standard event per form (Subscribe / SubmitApplication / …) so
 *      each type is visible natively in Events Manager.
 * Fire-and-forget: never awaited, never throws into the caller.
 */
export function trackLead(
  formType: LeadFormType,
  user: LeadUser = {},
  expeditionName?: string,
): void {
  if (typeof window === "undefined") return;

  const { quality, value } = LEAD_CONFIG[formType];
  const eventSourceUrl = window.location.href;
  const customData = {
    value,
    currency: "USD",
    form_type: formType,
    lead_quality: quality,
    content_name: expeditionName,
  };

  // Fire one named event: browser Pixel + server CAPI sharing an event_id so Meta
  // deduplicates them into a single conversion.
  const fire = (eventName: string) => {
    const eventId = makeEventId();
    try {
      window.fbq?.("track", eventName, customData, { eventID: eventId });
    } catch {
      /* pixel blocked / not loaded — server event still fires below */
    }
    try {
      supabase.functions
        .invoke("meta-capi", {
          body: {
            event_id: eventId,
            event_name: eventName,
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
              external_id: getExternalId(),
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
  };

  fire("Lead"); // aggregate event for campaign optimisation
  fire(STD_EVENT[formType]); // per-form event for native visibility
}
