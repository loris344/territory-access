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

    const { info_request_id } = await req.json();
    if (!info_request_id) {
      throw new Error("info_request_id is required");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: r, error: fetchError } = await supabase
      .from("tour_info_requests")
      .select("*, expeditions(name)")
      .eq("id", info_request_id)
      .single();

    if (fetchError || !r) {
      throw new Error("Info request not found");
    }

    const expeditionName = r.expeditions?.name || "Unknown";

    const emailHtml = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="border-bottom: 1px solid #e5e5e5; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="font-size: 16px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 400; margin: 0;">
            New Info Request - Ligne Rouge Tours
          </h1>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #888; width: 140px;">Expedition</td><td style="padding: 8px 0; font-weight: 600;">${expeditionName}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Name</td><td style="padding: 8px 0;">${r.first_name} ${r.last_name}</td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0;"><a href="mailto:${r.email}" style="color: #1a1a1a;">${r.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #888;">Phone</td><td style="padding: 8px 0;">${r.phone || "-"}</td></tr>
        </table>
        ${r.message ? `
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e5e5;">
          <h3 style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #888; margin: 0 0 8px 0;">Message</h3>
          <p style="font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${r.message}</p>
        </div>` : ""}
        <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e5e5; text-align: center;">
          <p style="font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #aaa;">Ligne Rouge Tours - Info Request</p>
        </div>
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
        to: ["contact@lignerougetours.com"],
        reply_to: r.email,
        subject: `New Info Request - ${r.first_name} ${r.last_name} - ${expeditionName}`,
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
