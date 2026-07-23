import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FALLBACK_ORIGIN = "https://lignerougetours.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const { application_id } = await req.json();
    if (!application_id) {
      throw new Error("application_id is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: app, error: appError } = await supabase
      .from("applications")
      .select("id, email, first_name, expedition_id")
      .eq("id", application_id)
      .single();

    if (appError || !app) {
      throw new Error("Application not found");
    }

    // Deposit amount is always re-derived server-side from the landing page
    // config, never trusted from the client, so a tampered request can't
    // force a lower charge.
    const { data: lp, error: lpError } = await supabase
      .from("landing_pages")
      .select("slug, deposit_amount_usd, expeditions(name)")
      .eq("expedition_id", app.expedition_id)
      .eq("deposit_required", true)
      .limit(1)
      .maybeSingle();

    if (lpError || !lp) {
      return new Response(JSON.stringify({ error: "Deposit not required for this expedition" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expeditionName = (lp as any).expeditions?.name || "Expedition";
    const amountCents = lp.deposit_amount_usd * 100;
    const origin = req.headers.get("origin") || FALLBACK_ORIGIN;
    const successUrl = `${origin}/lp/${lp.slug}?deposit=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/lp/${lp.slug}?deposit=cancelled`;

    const body = new URLSearchParams();
    body.set("mode", "payment");
    body.set("success_url", successUrl);
    body.set("cancel_url", cancelUrl);
    body.set("line_items[0][quantity]", "1");
    body.set("line_items[0][price_data][currency]", "usd");
    body.set("line_items[0][price_data][unit_amount]", String(amountCents));
    body.set("line_items[0][price_data][product_data][name]", `Deposit - ${expeditionName}`);
    body.set("metadata[application_id]", application_id);
    if (app.email) body.set("customer_email", app.email);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      console.error("Stripe error:", session);
      throw new Error(session?.error?.message || `Stripe API error: ${stripeRes.status}`);
    }

    await supabase
      .from("applications")
      .update({
        deposit_required: true,
        deposit_amount_usd: lp.deposit_amount_usd,
        stripe_checkout_session_id: session.id,
      })
      .eq("id", application_id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
