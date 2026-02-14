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

    const { waitlist_id } = await req.json();
    if (!waitlist_id) {
      throw new Error("waitlist_id is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: entry, error: fetchError } = await supabase
      .from("waitlist")
      .select("*, expeditions!waitlist_expedition_id_fkey(name)")
      .eq("id", waitlist_id)
      .single();

    if (fetchError || !entry) {
      throw new Error("Waitlist entry not found");
    }

    const expeditionName = entry.expeditions?.name || "Unknown";

    let dateLabel = "";
    if (entry.expedition_date_id) {
      const { data: dateData } = await supabase
        .from("expedition_dates")
        .select("start_date, end_date")
        .eq("id", entry.expedition_date_id)
        .single();
      if (dateData) {
        dateLabel = `${dateData.start_date} → ${dateData.end_date}`;
      }
    }

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 400; margin: 0;">
            New Waitlist Entry - Ligne Rouge Tours
          </h1>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Expedition</td><td style="padding: 8px 0; font-weight: 600;">${expeditionName}${dateLabel ? ` (${dateLabel})` : ""}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Name</td><td style="padding: 8px 0;">${entry.first_name} ${entry.last_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${entry.email}" style="color: #1a1a1a;">${entry.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Nationality</td><td style="padding: 8px 0;">${entry.nationality}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">People</td><td style="padding: 8px 0;">${entry.number_of_people}</td></tr>
        </table>
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; text-align: center;">
          <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #aaa;">Ligne Rouge Tours - Waitlist System</p>
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
        subject: `Waitlist - ${entry.first_name} ${entry.last_name} - ${expeditionName}`,
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();
    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      throw new Error(`Resend API error: ${resendRes.status}`);
    }

    // Confirmation email to the person
    const confirmHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 18px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 400; margin: 0;">
            Ligne Rouge Tours
          </h1>
        </div>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
          Hi ${entry.first_name},
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
          Thank you for joining the waitlist for <strong>${expeditionName}</strong>${dateLabel ? ` (${dateLabel})` : ""}. We've noted your interest for ${entry.number_of_people} ${entry.number_of_people > 1 ? "people" : "person"}.
        </p>
        <p style="font-size: 14px; line-height: 1.8; margin: 0 0 16px 0;">
          We'll reach out to you as soon as a spot becomes available.
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
        to: [entry.email],
        subject: `Waitlist Confirmation - ${expeditionName}`,
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
