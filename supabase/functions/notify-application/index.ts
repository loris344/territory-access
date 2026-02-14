import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    // Fetch application details with expedition name
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

    const expeditionName = app.expeditions?.name || "Unknown";

    // Fetch date info if linked
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

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 400; margin: 0;">
            New Application - Ligne Rouge Tours
          </h1>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Expedition</td><td style="padding: 8px 0; font-weight: 600;">${expeditionName}${dateLabel ? ` (${dateLabel})` : ""}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Name</td><td style="padding: 8px 0;">${app.first_name} ${app.last_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${app.email}" style="color: #1a1a1a;">${app.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${app.phone}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Nationality</td><td style="padding: 8px 0;">${app.nationality}</td></tr>
        </table>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
          <h3 style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #888; margin: 0 0 8px 0;">Physical Condition</h3>
          <p style="font-size: 14px; line-height: 1.6; margin: 0;">${app.physical_condition}</p>
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
          <h3 style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #888; margin: 0 0 8px 0;">Motivation</h3>
          <p style="font-size: 14px; line-height: 1.6; margin: 0;">${app.motivation_text}</p>
        </div>
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; text-align: center;">
          <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #aaa;">Ligne Rouge Tours - Application System</p>
        </div>
      </div>
    `;

    // Email to admin
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ligne Rouge Tours <noreply@lignerougetours.com>",
        to: ["contact@lignerougetours.com"],
        subject: `New Application - ${app.first_name} ${app.last_name} - ${expeditionName}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      throw new Error(`Resend API error: ${resendRes.status}`);
    }

    // Confirmation email to the applicant
    const confirmHtml = `
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
          We've received your application for <strong>${expeditionName}</strong>${dateLabel ? ` (${dateLabel})` : ""}. Our team will carefully review it and get back to you shortly.
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
          In the meantime, feel free to reach out if you have any questions.
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0;">
          The Ligne Rouge Tours Team
        </p>
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; text-align: center;">
          <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #aaa;">lignerougetours.com</p>
        </div>
      </div>
    `;

    const confirmRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Ligne Rouge Tours <noreply@lignerougetours.com>",
        to: [app.email],
        subject: `Application Received - ${expeditionName}`,
        html: confirmHtml,
      }),
    });

    const confirmData = await confirmRes.json();
    if (!confirmRes.ok) {
      console.error("Confirmation email error:", confirmData);
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
