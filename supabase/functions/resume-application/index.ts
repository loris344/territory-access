import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Lets the /apply page resume an application from a reminder-email link
// (?resume=<application_id>). applications has no public SELECT policy, so
// this is the only way the client can read anything back — and it returns
// only what the deposit screen needs to redraw, never email/phone/motivation.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { application_id } = await req.json();
    if (!application_id) {
      throw new Error("application_id is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: app, error } = await supabase
      .from("applications")
      .select(
        "first_name, participants, expedition_date_id, deposit_required, deposit_amount_usd, deposit_paid, expeditions!applications_expedition_id_fkey(name)",
      )
      .eq("id", application_id)
      .single();

    if (error || !app) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Same date-range formatting as the confirmation/reminder emails, so the
    // resumed screen can show the same summary the applicant already saw.
    let dateLabel: string | null = null;
    if (app.expedition_date_id) {
      const { data: dateData } = await supabase
        .from("expedition_dates")
        .select("start_date, end_date")
        .eq("id", app.expedition_date_id)
        .single();
      if (dateData) {
        dateLabel = `${new Date(dateData.start_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })} - ${new Date(dateData.end_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
      }
    }

    return new Response(
      JSON.stringify({
        first_name: app.first_name,
        expedition_name: (app as any).expeditions?.name || null,
        date_label: dateLabel,
        participants: app.participants,
        deposit_required: app.deposit_required,
        deposit_amount_usd: app.deposit_amount_usd,
        deposit_paid: app.deposit_paid,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
