import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://lignerougetours.com";

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

// Fired by the send-deposit-reminders pg_cron job (every 15 min, see
// 20260727140000_deposit_attempt_tracking.sql) for applicants who submitted
// the application form for a deposit-gated tour but never reached the
// deposit step. One-shot: the cron function marks deposit_reminder_sent_at
// before calling this, so it never re-fires for the same application.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { application_id } = await req.json();
    if (!application_id) {
      throw new Error("application_id is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: app, error: fetchError } = await supabase
      .from("applications")
      .select("*, expeditions!applications_expedition_id_fkey(name)")
      .eq("id", application_id)
      .single();

    if (fetchError || !app) {
      throw new Error("Application not found");
    }

    // Safety net in case of a race with the real thing happening in between.
    if (app.deposit_paid || app.deposit_attempted_at) {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expeditionName = app.expeditions?.name || "your expedition";
    const amountLabel = app.deposit_amount_usd != null ? Number(app.deposit_amount_usd).toLocaleString("en-US") : "";
    const resumeUrl = `${SITE_URL}/apply?resume=${app.id}`;

    // Fetch date info if linked (same pattern as notify-application).
    let dateLabel = "";
    if (app.expedition_date_id) {
      const { data: dateData } = await supabase
        .from("expedition_dates")
        .select("start_date, end_date")
        .eq("id", app.expedition_date_id)
        .single();
      if (dateData) {
        dateLabel = `${dateData.start_date} → ${dateData.end_date}`;
      }
    }
    const participantsLabel = `${app.participants} participant${app.participants === 1 ? "" : "s"}`;

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 400; margin: 0;">
            Ligne Rouge Tours
          </h1>
        </div>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
          Hi ${app.first_name},
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
          Your application for <strong>${expeditionName}</strong>${dateLabel ? ` (${dateLabel})` : ""} — ${participantsLabel} — is <strong>not registered yet</strong>. Paying the $${amountLabel} deposit (30% of the total price) is a required step to confirm it, and we haven't received it.
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 24px 0;">
          Pick up right where you left off, it only takes a minute.
        </p>
        <div style="text-align: center; margin: 0 0 24px 0;">
          <a href="${resumeUrl}" style="display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none; padding: 14px 32px; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
            Complete Your Deposit
          </a>
        </div>
        <p style="font-size: 14px; line-height: 1.8; margin: 0;">
          The Ligne Rouge Tours Team
        </p>
        ${footerHtml}
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ligne Rouge Tours <noreply@lignerougetours.com>",
        to: [app.email],
        reply_to: "contact@lignerougetours.com",
        subject: `Complete your deposit - ${expeditionName}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      throw new Error(`Resend API error: ${resendRes.status}`);
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
