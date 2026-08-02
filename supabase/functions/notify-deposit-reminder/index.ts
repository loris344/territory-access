import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://lignerougetours.com";

const reassuranceHtml = `
  <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
    <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px auto;">
      <tr>
        <td style="padding: 0 4px;"><img src="https://lignerougetours.com/assets/founder.webp" width="48" height="48" alt="Loris" style="border-radius: 50%; display: block;" /></td>
        <td style="padding: 0 4px;"><img src="https://lignerougetours.com/assets/lea.webp" width="48" height="48" alt="Léa" style="border-radius: 50%; display: block;" /></td>
        <td style="padding: 0 4px;"><img src="https://lignerougetours.com/assets/rym.webp" width="48" height="48" alt="Rym" style="border-radius: 50%; display: block;" /></td>
      </tr>
    </table>
    <p style="font-size: 13px; line-height: 1.6; color: #555; margin: 0 0 14px 0;">Talk to us directly, we&#39;re here to help.</p>
    <a href="https://wa.me/33767135458" style="display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 28px; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px;">
      &#128172; Contact us on WhatsApp
    </a>
  </div>
`;

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
// 20260727140000_deposit_attempt_tracking.sql), ~2h after a deposit-gated
// application is submitted. This is now the PRIMARY way applicants are
// invited to pay the deposit — the form no longer offers it immediately on
// submit (see ApplicationForm's "pending_review" status), so this doubles as
// the "your file has been reviewed, dates are available" confirmation email,
// not just a nudge for stragglers. One-shot: the cron function marks
// deposit_reminder_sent_at before calling this, so it never re-fires for the
// same application.
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
          Good news — we've reviewed your application for <strong>${expeditionName}</strong>${dateLabel ? ` (${dateLabel})` : ""} — ${participantsLabel} — and your selected dates are available.
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 24px 0;">
          To secure your spot, the next step is a $${amountLabel} deposit (30% of the total price). It's fully refundable if your application isn&#39;t accepted, or if we&#39;re ever unable to run this departure. Once we receive it, a member of our team will personally reach out to you.
        </p>
        <div style="text-align: center; margin: 0 0 24px 0;">
          <a href="${resumeUrl}" style="display: inline-block; background: #1a1a1a; color: #fff; text-decoration: none; padding: 14px 32px; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;">
            Secure Your Spot
          </a>
        </div>
        ${reassuranceHtml}
        <p style="font-size: 14px; line-height: 1.8; margin: 24px 0 0 0;">
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
        subject: `Your dates are available - ${expeditionName}`,
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
