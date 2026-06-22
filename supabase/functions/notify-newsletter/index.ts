import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Shared footer: lets subscribers reach a real inbox (we also set reply_to)
// and links to Instagram with a self-hosted logo (served from the site root).
const footerHtml = `
  <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
    <p style="font-size: 13px; line-height: 1.7; color: #555; margin: 0 0 16px 0;">
      Any questions? Just reply to this email, or reach us at<br/>
      <a href="mailto:contact@lignerougetours.com" style="color: #1a1a1a; font-weight: 600; text-decoration: none;">contact@lignerougetours.com</a>
    </p>
    <a href="https://www.instagram.com/lignerougetours/" target="_blank" style="display: inline-block; text-decoration: none;">
      <img src="https://lignerougetours.com/instagram.png" width="24" height="24" alt="Instagram" style="vertical-align: middle; border: 0;" />
      <span style="font-size: 13px; color: #555; vertical-align: middle; margin-left: 8px;">@lignerougetours</span>
    </a>
    <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #aaa; margin: 20px 0 0 0;">lignerougetours.com</p>
  </div>
`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { subscriber_id } = await req.json();
    if (!subscriber_id) {
      throw new Error("subscriber_id is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: sub, error: fetchError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("id", subscriber_id)
      .single();

    if (fetchError || !sub) {
      throw new Error("Subscriber not found");
    }

    // Welcome email to the subscriber
    const welcomeHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 400; margin: 0;">
            Ligne Rouge Tours
          </h1>
        </div>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
          Welcome aboard.
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
          You're now on our list. We'll keep you posted on upcoming expeditions, newly opened dates, and stories from the field — no noise, just the essentials.
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0;">
          The Ligne Rouge Tours Team
        </p>
        ${footerHtml}
      </div>
    `;

    const welcomeRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ligne Rouge Tours <noreply@lignerougetours.com>",
        to: [sub.email],
        reply_to: "contact@lignerougetours.com",
        subject: "Welcome to Ligne Rouge Tours",
        html: welcomeHtml,
      }),
    });

    const welcomeData = await welcomeRes.json();
    if (!welcomeRes.ok) {
      console.error("Welcome email error:", welcomeData);
      throw new Error(`Resend API error: ${welcomeRes.status}`);
    }

    return new Response(JSON.stringify({ success: true }), {
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
