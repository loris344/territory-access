"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { trackLead } from "@/lib/meta";
import { expeditions as localExpeditions } from "@/data/expeditions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TurnstileWidget from "@/components/TurnstileWidget";

const applicationSchema = z.object({
  expedition_id: z.string().min(1, "Please select an expedition"),
  first_name: z.string().trim().min(1, "Required").max(100, "Max 100 characters"),
  last_name: z.string().trim().min(1, "Required").max(100, "Max 100 characters"),
  email: z.string().trim().email("Invalid email").max(255, "Max 255 characters"),
  phone: z.string().trim().min(1, "Required").max(30, "Max 30 characters"),
  nationality: z.string().trim().min(1, "Required").max(100, "Max 100 characters"),
  participants: z.number().min(1, "At least 1").max(14, "Max 14 participants"),
  physical_condition: z.string().trim().min(1, "Required").max(2000, "Max 2000 characters"),
  motivation_text: z.string().trim().min(1, "Required").max(5000, "Max 5000 characters"),
  terms_accepted: z.boolean(),
});

type ExpeditionOption = { id: string; name: string; slug: string; price: number; status: string };

const Apply = () => {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("expedition") || "";
  const preselectedDateId = searchParams.get("date") || "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [expeditionOptions, setExpeditionOptions] = useState<ExpeditionOption[]>([]);
  const [selectedDateLabel, setSelectedDateLabel] = useState("");

  const [turnstileToken, setTurnstileToken] = useState("");

  const [form, setForm] = useState({
    expedition_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    participants: "1",
    physical_condition: "",
    motivation_text: "",
    terms_accepted: false,
  });

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchExpeditions = async () => {
      const { data } = await supabase
        .from("expeditions")
        .select("id, name, slug, price_usd, status")
        .neq("status", "closed");

      if (data && data.length > 0) {
        // Hide any expedition whose every date is cancelled (no bookable date left).
        // Expeditions with no dates at all are kept (status-driven, as before).
        const { data: datesData } = await supabase
          .from("expedition_dates")
          .select("expedition_id, status");
        const withDates = new Set<string>();
        const withBookableDate = new Set<string>();
        (datesData ?? []).forEach((d) => {
          withDates.add(d.expedition_id);
          if (d.status !== "cancelled") withBookableDate.add(d.expedition_id);
        });
        const hasBookableDates = (id: string) => !withDates.has(id) || withBookableDate.has(id);

        const options = data
          .filter((e) => e.status !== "cancelled" && hasBookableDates(e.id))
          .map((e) => ({
            id: e.id,
            name: e.name,
            slug: e.slug,
            price: e.price_usd,
            status: e.status,
          }));
        setExpeditionOptions(options);
        const match = options.find((o) => o.slug === preselectedSlug);
        if (match) setForm((f) => ({ ...f, expedition_id: match.id }));
      } else {
        const options = localExpeditions
          .filter((e) => e.status !== "closed" && e.status !== "cancelled")
          .filter((e) => !e.dates || e.dates.length === 0 || e.dates.some((d) => d.status !== "cancelled"))
          .map((e) => ({
            id: e.id,
            name: e.name,
            slug: e.slug,
            price: e.price_usd,
            status: e.status,
          }));
        setExpeditionOptions(options);
        const match = options.find((o) => o.slug === preselectedSlug);
        if (match) setForm((f) => ({ ...f, expedition_id: match.id }));
      }

      // Fetch date label if date ID is provided
      if (preselectedDateId) {
        const { data: dateData } = await supabase
          .from("expedition_dates")
          .select("start_date, end_date")
          .eq("id", preselectedDateId)
          .single();
        if (dateData) {
          setSelectedDateLabel(
            `${new Date(dateData.start_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })} – ${new Date(dateData.end_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`
          );
        }
      }
    };
    fetchExpeditions();
  }, [preselectedSlug, preselectedDateId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setErrors({});

    const result = applicationSchema.safeParse({
      ...form,
      participants: parseInt(form.participants) || 0,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!result.data.terms_accepted) {
      setErrors((prev) => ({ ...prev, terms_accepted: "You must accept the Terms & Conditions" }));
      return;
    }

    if (!turnstileToken) {
      setSubmitError("Please complete the security verification.");
      return;
    }

    setLoading(true);

    // Verify turnstile token server-side
    try {
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke("verify-turnstile", {
        body: { token: turnstileToken },
      });
      if (verifyError || !verifyData?.success) {
        setSubmitError("Security verification failed. Please try again.");
        setTurnstileToken("");
        setLoading(false);
        return;
      }
    } catch {
      setSubmitError("Security verification failed. Please try again.");
      setTurnstileToken("");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("applications").insert({
      expedition_id: result.data.expedition_id,
      expedition_date_id: preselectedDateId || null,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      email: result.data.email,
      phone: result.data.phone,
      nationality: result.data.nationality,
      linkedin_url: null,
      physical_condition: `[${result.data.participants} participant(s)] ${result.data.physical_condition}`,
      motivation_text: result.data.motivation_text,
      status: "pending",
    } as any);
    setLoading(false);

    if (error) {
      setSubmitError("An error occurred. Please try again later.");
      return;
    }

    // Strongest intent signal — fire ONLY now that the application is stored.
    trackLead(
      "application",
      {
        email: result.data.email,
        phone: result.data.phone,
        firstName: result.data.first_name,
        lastName: result.data.last_name,
      },
      expeditionOptions.find((o) => o.id === result.data.expedition_id)?.name,
    );

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg"
          >
            <div className="h-px w-12 bg-accent mx-auto mb-8" />
            <h1 className="heading-display text-2xl sm:text-3xl mb-6">Application Received</h1>
            <p className="body-text text-muted-foreground mb-4">
              Your application has been registered. Our team will carefully review your profile and assess your eligibility for this expedition.
            </p>
            <p className="body-text text-muted-foreground mb-8">
              Please note that submission does not guarantee acceptance. Each candidacy is evaluated individually based on motivation, fitness, and group compatibility.
            </p>
            <div className="h-px w-8 bg-border mx-auto mb-6" />
            <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-muted-foreground/60">
              Ligne Rouge Tours
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors";

  const errorText = (field: string) =>
    errors[field] ? <p className="text-destructive text-xs mt-1">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px w-12 bg-accent mb-10" />
            <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-4">Application</h1>
            <p className="body-text text-muted-foreground mb-3">
              Participation in our expeditions is not open to all. Each application undergoes a thorough internal review to ensure alignment with the demands of the destination and the cohesion of the group.
            </p>
            <p className="body-text text-muted-foreground/60 text-sm mb-2">
              Incomplete or insufficiently motivated applications will not be considered.
            </p>
            {selectedDateLabel && (
              <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent mb-12">
                Selected date: {selectedDateLabel}
              </p>
            )}
            {!selectedDateLabel && <div className="mb-12" />}

            {submitError && (
              <div className="border border-destructive/50 bg-destructive/10 text-destructive text-sm px-4 py-3 mb-6">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Expedition select */}
              <div>
                <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                  Expedition
                </label>
                <select
                  name="expedition_id"
                  value={form.expedition_id}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select an expedition</option>
                  {expeditionOptions.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} - ${e.price.toLocaleString("en-US")} pp
                    </option>
                  ))}
                </select>
                {errorText("expedition_id")}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    First name
                  </label>
                  <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required className={inputClass} />
                  {errorText("first_name")}
                </div>
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Last name
                  </label>
                  <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required className={inputClass} />
                  {errorText("last_name")}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
                  {errorText("email")}
                </div>
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Phone
                  </label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
                  {errorText("phone")}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Nationality
                  </label>
                  <input type="text" name="nationality" value={form.nationality} onChange={handleChange} required className={inputClass} />
                  {errorText("nationality")}
                </div>
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Number of participants
                  </label>
                  <input
                    type="number"
                    name="participants"
                    value={form.participants}
                    onChange={handleChange}
                    required
                    min={1}
                    max={14}
                    className={inputClass}
                  />
                  {errorText("participants")}
                </div>
              </div>

              <div>
                <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                  Physical condition & relevant experience
                </label>
                <textarea
                  name="physical_condition"
                  value={form.physical_condition}
                  onChange={handleChange}
                  required
                  rows={3}
                  className={inputClass + " resize-none"}
                  placeholder="Current fitness level, sports practice, altitude experience, medical conditions..."
                />
                {errorText("physical_condition")}
              </div>

              <div>
                <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                  What do you expect from this tour?
                </label>
                <textarea
                  name="motivation_text"
                  value={form.motivation_text}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={inputClass + " resize-none"}
                  placeholder="What draws you to this destination? What are you looking to experience?"
                />
                {errorText("motivation_text")}
              </div>

              <div className="flex items-start gap-3 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={form.terms_accepted}
                  onChange={(e) => {
                    setForm({ ...form, terms_accepted: e.target.checked });
                    if (errors.terms_accepted) {
                      setErrors((prev) => { const next = { ...prev }; delete next.terms_accepted; return next; });
                    }
                  }}
                  className="mt-1 h-4 w-4 shrink-0 border border-border accent-accent"
                />
                <label htmlFor="terms" className="body-text text-xs text-muted-foreground cursor-pointer">
                  I have read and understood the{" "}
                  <Link href="/legal" target="_blank" className="text-accent hover:underline">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
              {errorText("terms_accepted")}

              <div className="mt-2">
                <TurnstileWidget onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} />
              </div>

              <button
                type="submit"
                disabled={loading || !turnstileToken}
                className="w-full font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 mt-4 disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit Application"}
              </button>

              <p className="text-center font-heading text-[9px] tracking-[0.15em] uppercase text-muted-foreground/40 mt-4">
                Submitting an application does not guarantee acceptance
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Apply;
