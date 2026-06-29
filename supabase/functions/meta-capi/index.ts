// Meta Conversions API relay.
//
// The browser fires the Pixel `Lead` event AND calls this function with the
// SAME `event_id`, so Meta deduplicates the browser + server events into a
// single conversion. Here we hash PII (SHA-256, as Meta requires) and attach
// IP / user-agent / _fbp / _fbc for match quality, then forward to the Graph API.
//
// Required secrets (set via `supabase secrets set`):
//   META_PIXEL_ID            — your Pixel / dataset id
//   META_CAPI_ACCESS_TOKEN   — Conversions API access token (Events Manager)
//   META_TEST_EVENT_CODE     — optional; when set, every event shows up in the
//                              Events Manager "Test events" tab (use for testing,
//                              then remove it so events count as live).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GRAPH_VERSION = "v21.0";

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const norm = (s?: string) => (s || "").trim().toLowerCase();
const digits = (s?: string) => (s || "").replace(/[^0-9]/g, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PIXEL_ID = Deno.env.get("META_PIXEL_ID");
    const ACCESS_TOKEN = Deno.env.get("META_CAPI_ACCESS_TOKEN");
    if (!PIXEL_ID || !ACCESS_TOKEN) {
      throw new Error("META_PIXEL_ID / META_CAPI_ACCESS_TOKEN not configured");
    }

    const body = await req.json();
    const u = body.user || {};

    // Build user_data: hashed PII + non-hashed identifiers/context.
    const user_data: Record<string, unknown> = {};
    if (u.email) user_data.em = [await sha256Hex(norm(u.email))];
    const ph = digits(u.phone);
    if (ph) user_data.ph = [await sha256Hex(ph)];
    if (u.first_name) user_data.fn = [await sha256Hex(norm(u.first_name))];
    if (u.last_name) user_data.ln = [await sha256Hex(norm(u.last_name))];
    // external_id: sent plain on BOTH Pixel + here so the values match (Meta
    // allows external_id un-hashed). Stable per-browser id for cross-session match.
    if (u.external_id) user_data.external_id = u.external_id;
    if (u.fbp) user_data.fbp = u.fbp; // already an identifier — NOT hashed
    if (u.fbc) user_data.fbc = u.fbc; // already an identifier — NOT hashed

    const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    if (ip) user_data.client_ip_address = ip;
    const ua = req.headers.get("user-agent");
    if (ua) user_data.client_user_agent = ua;

    const event = {
      event_name: body.event_name || "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id, // <- dedup key, shared with the browser Pixel
      event_source_url: body.event_source_url,
      action_source: "website",
      user_data,
      custom_data: {
        value: body.value,
        currency: body.currency || "USD",
        form_type: body.form_type, // application | info_request | waitlist
        lead_quality: body.lead_quality, // high | medium | low
        content_name: body.content_name,
      },
    };

    const payload: Record<string, unknown> = { data: [event] };
    const testCode = body.test_event_code || Deno.env.get("META_TEST_EVENT_CODE");
    if (testCode) payload.test_event_code = testCode;

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();

    // Ground-truth audit log (never blocks the response). One row per event sent.
    try {
      const url = Deno.env.get("SUPABASE_URL");
      const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (url && key) {
        await createClient(url, key).from("meta_event_log").insert({
          event_name: event.event_name,
          form_type: body.form_type ?? null,
          value: body.value ?? null,
          currency: body.currency ?? "USD",
          content_name: body.content_name ?? null,
          event_id: body.event_id ?? null,
          event_source_url: body.event_source_url ?? null,
          client_ip: ip || null,
          meta_events_received: typeof data?.events_received === "number" ? data.events_received : null,
          meta_status: res.status,
          meta_error: res.ok ? null : JSON.stringify(data).slice(0, 500),
        });
      }
    } catch (logErr) {
      console.error("meta_event_log insert failed:", logErr);
    }

    if (!res.ok) {
      console.error("Meta CAPI error:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: data }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, meta: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("meta-capi error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
