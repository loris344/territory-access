"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { trackLead } from "@/lib/meta";
import { expeditions as localExpeditions } from "@/data/expeditions";
import TurnstileWidget from "@/components/TurnstileWidget";
import CardEntryFormPlaceholder from "@/components/CardEntryFormPlaceholder";

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

type ExpeditionOption = {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  depositRequired: boolean;
  depositAmountUsd: number;
};

type DateOption = {
  id: string;
  label: string;
  remainingSpots: number;
};

interface ApplicationFormProps {
  // Query-param-driven preselection, used on the open /apply page.
  preselectedSlug?: string;
  preselectedDateId?: string;
  // When set, the tour can't be changed: no dropdown, just a fixed label.
  // Used when the form is embedded directly on a tour's landing page.
  lockedExpedition?: { id: string; name: string; price: number; depositRequired?: boolean; depositAmountUsd?: number };
  // Landing page slug — only needed when a deposit flow is in play (Stripe
  // redirect URLs and the sessionStorage retry key are scoped to it).
  slug?: string;
  onSubmitted?: () => void;
}

type DepositStatus = "idle" | "pending_review" | "offer" | "paying" | "confirming" | "paid" | "cancelled";

const ApplicationForm = ({ preselectedSlug = "", preselectedDateId = "", lockedExpedition, slug, onSubmitted }: ApplicationFormProps) => {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [expeditionOptions, setExpeditionOptions] = useState<ExpeditionOption[]>([]);
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [selectedDateId, setSelectedDateId] = useState("");
  // Shown on the confirmation screens (expedition, dates, participants) —
  // set at submit time from local state, or re-fetched via resume-application
  // when the screen is redrawn from a fresh pageview (Stripe redirect / resume link).
  const [summary, setSummary] = useState<{ expeditionName?: string; dateLabel?: string; participants?: number }>({});
  const [turnstileToken, setTurnstileToken] = useState("");
  const [activeApplicationId, setActiveApplicationId] = useState<string>(() => crypto.randomUUID());
  const [depositStatus, setDepositStatus] = useState<DepositStatus>("idle");
  const [depositError, setDepositError] = useState("");
  // Frozen at submit time so it can't change mid-flow even if the dropdown
  // selection would (it's disabled by then anyway, but this is also what
  // survives a fresh pageview after a Stripe redirect, restored from
  // sessionStorage rather than re-derived from props/options).
  const [resolvedDeposit, setResolvedDeposit] = useState<{ required: boolean; amountUsd?: number } | null>(null);
  // Temporary: shows a visual-only card form instead of redirecting to
  // Stripe, per request, while the real payment connection is pending.
  const [showCardForm, setShowCardForm] = useState(false);
  // Resuming from a reminder-email link (?resume=<application_id>): skip the
  // whole form and jump straight to the deposit screen for that application.
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState("");

  const [form, setForm] = useState({
    expedition_id: lockedExpedition?.id || "",
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

  // Where Stripe should redirect back to, and the sessionStorage key scoped
  // to that same route — works whether embedded on a landing page (slug set)
  // or the open /apply page (no slug).
  const returnPath = slug ? `/lp/${slug}` : "/apply";
  const depositStorageKey = `deposit_pending_${slug || "apply"}`;

  const handleTurnstileVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleTurnstileExpire = useCallback(() => setTurnstileToken(""), []);

  // Resume the deposit flow after a Stripe Checkout redirect. On a fresh
  // pageview (not the in-memory state right after submit), so this reads
  // from the URL / sessionStorage rather than component state. Works both
  // embedded on a landing page and on the open /apply page.
  useEffect(() => {
    const depositParam = searchParams.get("deposit");
    const sessionId = searchParams.get("session_id");
    const stored = sessionStorage.getItem(depositStorageKey);
    const pending = stored ? (JSON.parse(stored) as { applicationId: string; amountUsd?: number }) : null;

    // Re-derives the summary (expedition/dates/participants) from the DB on a
    // fresh pageview, since local form state is gone by then — same source
    // resume-application already reads for the deposit fields.
    const fetchSummary = (applicationId: string) => {
      supabase.functions.invoke("resume-application", { body: { application_id: applicationId } }).then(({ data, error }) => {
        if (!error && data && !data.error) {
          setSummary({ expeditionName: data.expedition_name, dateLabel: data.date_label, participants: data.participants });
        }
      });
    };

    if (depositParam === "success" && sessionId) {
      if (pending) {
        setActiveApplicationId(pending.applicationId);
        setResolvedDeposit({ required: true, amountUsd: pending.amountUsd });
        fetchSummary(pending.applicationId);
      }
      setSubmitted(true);
      setDepositStatus("confirming");
      supabase.functions.invoke("confirm-deposit", { body: { session_id: sessionId } }).then(({ data, error }) => {
        if (!error && data?.paid) {
          setDepositStatus("paid");
          sessionStorage.removeItem(depositStorageKey);
        } else {
          setDepositStatus("cancelled");
          setDepositError("We couldn't confirm your payment yet. If you completed checkout, contact us and we'll verify it manually.");
        }
      });
    } else if (depositParam === "cancelled" && pending) {
      setActiveApplicationId(pending.applicationId);
      setResolvedDeposit({ required: true, amountUsd: pending.amountUsd });
      setSubmitted(true);
      setDepositStatus("cancelled");
      fetchSummary(pending.applicationId);
    } else {
      const resumeId = searchParams.get("resume");
      if (resumeId) {
        setResumeLoading(true);
        supabase.functions.invoke("resume-application", { body: { application_id: resumeId } }).then(({ data, error }) => {
          setResumeLoading(false);
          if (error || !data || data.error || !data.deposit_required) {
            setResumeError("We couldn't find that application. Please contact us directly, or start a new one below.");
            return;
          }
          setActiveApplicationId(resumeId);
          setResolvedDeposit({ required: true, amountUsd: data.deposit_amount_usd });
          setSummary({ expeditionName: data.expedition_name, dateLabel: data.date_label, participants: data.participants });
          setSubmitted(true);
          setDepositStatus(data.deposit_paid ? "paid" : "offer");
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // The real Stripe Checkout flow — currently not wired to any button while
  // CardEntryFormPlaceholder stands in for it, but left intact to reconnect
  // later (swap the button below back to calling this).
  const handlePayDeposit = async () => {
    setDepositStatus("paying");
    setDepositError("");
    try {
      const { data, error } = await supabase.functions.invoke("create-deposit-checkout", {
        body: { application_id: activeApplicationId, return_path: returnPath },
      });
      if (error || !data?.url) {
        setDepositError("Could not start payment. Please try again.");
        setDepositStatus("offer");
        return;
      }
      sessionStorage.setItem(depositStorageKey, JSON.stringify({ applicationId: activeApplicationId, amountUsd: resolvedDeposit?.amountUsd }));
      window.location.href = data.url;
    } catch {
      setDepositError("Could not start payment. Please try again.");
      setDepositStatus("offer");
    }
  };

  useEffect(() => {
    if (lockedExpedition) return; // tour is fixed, nothing to fetch/preselect

    const fetchExpeditions = async () => {
      const { data } = await supabase
        .from("expeditions")
        .select("id, name, slug, price_usd, status, deposit_required, deposit_amount_usd")
        .neq("status", "closed");

      if (data && data.length > 0) {
        // Hide any expedition whose every date is cancelled (no bookable date left).
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
            depositRequired: e.deposit_required,
            depositAmountUsd: e.deposit_amount_usd,
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
            depositRequired: false,
            depositAmountUsd: 420,
          }));
        setExpeditionOptions(options);
        const match = options.find((o) => o.slug === preselectedSlug);
        if (match) setForm((f) => ({ ...f, expedition_id: match.id }));
      }
    };
    fetchExpeditions();
  }, [preselectedSlug, lockedExpedition]);

  // Departure date is chosen inside the form itself (not fixed to whatever
  // link the visitor arrived from) — refetch whenever the expedition in play
  // changes, whether that's the locked tour or the open /apply dropdown.
  const currentExpeditionId = lockedExpedition?.id || form.expedition_id;
  useEffect(() => {
    if (!currentExpeditionId) {
      setDateOptions([]);
      setSelectedDateId("");
      return;
    }
    const fetchDates = async () => {
      const { data } = await supabase
        .from("expedition_dates")
        .select("id, start_date, end_date, capacity_max, spots_taken, status")
        .eq("expedition_id", currentExpeditionId)
        .order("start_date", { ascending: true });

      const today = new Date().toISOString().split("T")[0];
      const options: DateOption[] = (data || [])
        .filter((d) => (d.status === "open" || d.status === "limited") && d.end_date >= today)
        .map((d) => ({
          id: d.id,
          label: `${new Date(d.start_date).toLocaleDateString("en-US", { day: "numeric", month: "short" })} - ${new Date(d.end_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`,
          remainingSpots: d.capacity_max - d.spots_taken,
        }));

      setDateOptions(options);
      const preselectedStillValid = options.some((o) => o.id === preselectedDateId);
      setSelectedDateId(preselectedStillValid ? preselectedDateId : options[0]?.id || "");
    };
    fetchDates();
  }, [currentExpeditionId, preselectedDateId]);

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

    // Computed before the insert (not after) so deposit_required/
    // deposit_amount_usd are correct on the row from the moment it's
    // created — they used to only get set later by create-deposit-checkout,
    // the real Stripe path, which nothing currently calls (CardEntryFormPlaceholder
    // stands in for it), so every application was silently stored as
    // deposit_required=false regardless of the tour's actual requirement.
    const matchedOption = expeditionOptions.find((o) => o.id === result.data.expedition_id);
    const depositRequired = lockedExpedition?.depositRequired ?? matchedOption?.depositRequired ?? false;
    // depositAmountUsd on the expedition is a per-person figure (30% of the
    // per-person price) — scale it by how many travelers this application
    // covers. The real charge is re-derived the same way server-side in
    // create-deposit-checkout, this is just for the immediate on-screen offer.
    const perPersonDepositUsd = lockedExpedition?.depositAmountUsd ?? matchedOption?.depositAmountUsd;
    const depositAmountUsd = perPersonDepositUsd != null ? perPersonDepositUsd * result.data.participants : undefined;

    const { error } = await supabase.from("applications").insert({
      id: activeApplicationId,
      expedition_id: result.data.expedition_id,
      expedition_date_id: selectedDateId || null,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      email: result.data.email,
      phone: result.data.phone,
      nationality: result.data.nationality,
      linkedin_url: null,
      participants: result.data.participants,
      physical_condition: result.data.physical_condition,
      motivation_text: result.data.motivation_text,
      status: "pending",
      deposit_required: depositRequired,
      deposit_amount_usd: depositRequired ? depositAmountUsd ?? null : null,
    } as any);
    setLoading(false);

    if (error) {
      setSubmitError("An error occurred. Please try again later.");
      return;
    }

    setSummary({
      expeditionName: lockedExpedition?.name || matchedOption?.name,
      dateLabel: dateOptions.find((d) => d.id === selectedDateId)?.label,
      participants: result.data.participants,
    });

    // Strongest intent signal — fire ONLY now that the application is stored.
    trackLead(
      "application",
      {
        email: result.data.email,
        phone: result.data.phone,
        firstName: result.data.first_name,
        lastName: result.data.last_name,
      },
      lockedExpedition?.name || matchedOption?.name,
    );

    setSubmitted(true);
    if (depositRequired) {
      setResolvedDeposit({ required: true, amountUsd: depositAmountUsd });
      // Don't ask for the deposit yet — the team reviews the file first.
      // send_deposit_reminders (pg_cron) emails the deposit link a couple
      // hours later, once availability is confirmed; that link resumes the
      // form straight into "offer" (see the resume-application branch above).
      setDepositStatus("pending_review");
    } else {
      // No deposit gate for this tour: the application is complete as-is.
      supabase.functions.invoke("notify-application", { body: { application_id: activeApplicationId } }).catch(() => {});
    }
    onSubmitted?.();
  };

  const inputClass =
    "w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors";

  const errorText = (field: string) =>
    errors[field] ? <p className="text-destructive text-xs mt-1">{errors[field]}</p> : null;

  // Shown across the confirmation screens below so applicants can double-check
  // what they applied for without scrolling back up.
  const summaryBlock =
    summary.expeditionName || summary.dateLabel || summary.participants != null ? (
      <div className="border border-border bg-secondary/40 px-5 py-4 mb-6 text-left">
        <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">Your Application</p>
        {summary.expeditionName && (
          <p className="body-text text-sm">
            <span className="text-muted-foreground">Expedition — </span>
            {summary.expeditionName}
          </p>
        )}
        {summary.dateLabel && (
          <p className="body-text text-sm">
            <span className="text-muted-foreground">Dates — </span>
            {summary.dateLabel}
          </p>
        )}
        {summary.participants != null && (
          <p className="body-text text-sm">
            <span className="text-muted-foreground">Participants — </span>
            {summary.participants}
          </p>
        )}
      </div>
    ) : null;

  if (resumeLoading) {
    return (
      <div className="border border-border bg-card p-8 text-center">
        <div className="h-px w-12 bg-accent mx-auto mb-6" />
        <p className="body-text text-sm text-muted-foreground">Loading your application…</p>
      </div>
    );
  }

  if (submitted) {
    if (depositStatus !== "idle") {
      const amountLabel = resolvedDeposit?.amountUsd?.toLocaleString("en-US");
      return (
        <div className="border border-border bg-card p-8 text-center">
          <div className="h-px w-12 bg-accent mx-auto mb-6" />

          {depositStatus === "confirming" && (
            <>
              <h3 className="heading-display text-lg mb-3">Confirming your payment...</h3>
              <p className="body-text text-sm text-muted-foreground">Please wait a moment.</p>
            </>
          )}

          {depositStatus === "pending_review" && (
            <>
              <h3 className="heading-display text-lg mb-3">Application Received</h3>
              {summaryBlock}
              <p className="body-text text-sm text-muted-foreground mb-2">
                Thank you for applying. Our team is reviewing your file now — within the next few hours you&apos;ll
                receive an email confirming availability for your selected dates.
              </p>
              <p className="body-text text-sm text-muted-foreground">
                From there, you&apos;ll be invited to secure your spot with a refundable deposit. Once it&apos;s
                received, a member of our team will personally reach out to you.
              </p>
            </>
          )}

          {depositStatus === "paid" && (
            <>
              <h3 className="heading-display text-lg mb-3">Deposit Received</h3>
              {summaryBlock}
              <p className="body-text text-sm text-muted-foreground mb-2">
                Your ${amountLabel} USD deposit (30% of the total price) has been received. Your application is now registered.
              </p>
              <p className="body-text text-sm text-muted-foreground mb-2">
                The remaining balance (70%) is due between 30 and 45 days before departure. Our team will contact you within 48 hours to confirm the details of your file.
              </p>
              <p className="body-text text-sm text-muted-foreground">
                Fully refundable if your application isn&apos;t accepted, or if we&apos;re ever unable to run this departure.
              </p>
            </>
          )}

          {(depositStatus === "offer" || depositStatus === "paying" || depositStatus === "cancelled") && (
            <>
              <h3 className="heading-display text-lg mb-3">
                {depositStatus === "cancelled" ? "Payment Not Completed" : "One Last Step"}
              </h3>
              {summaryBlock}
              <p className="body-text text-sm text-muted-foreground mb-2">
                Your application isn&apos;t registered yet. Paying the ${amountLabel} USD deposit (30% of the total price) is required now to confirm it.
              </p>
              <p className="body-text text-sm text-muted-foreground mb-2">
                The remaining balance (70%) will be due between 30 and 45 days before departure, once your deposit is received and your file is reviewed. Our team will then contact you within 48 hours with more information.
              </p>
              <p className="body-text text-sm text-muted-foreground mb-4">
                The deposit is fully refundable if your application isn&apos;t accepted, or if we&apos;re ever unable to run this departure.
              </p>
              <div className="flex flex-col items-center gap-2 pt-5 mb-5 border-t border-border">
                <div className="flex items-center -space-x-2 mt-4">
                  <img src="/assets/founder.webp" alt="Loris" className="w-9 h-9 rounded-full border-2 border-card object-cover" />
                  <img src="/assets/lea.webp" alt="Léa" className="w-9 h-9 rounded-full border-2 border-card object-cover" />
                  <img src="/assets/rym.webp" alt="Rym" className="w-9 h-9 rounded-full border-2 border-card object-cover" />
                </div>
                <p className="body-text text-xs text-muted-foreground">
                  Talk to us directly, we&apos;re here to help.
                </p>
                <a
                  href="https://wa.me/33767135458"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 mt-1 bg-[#25D366] text-white font-heading text-[10px] tracking-[0.15em] uppercase hover:bg-[#20bd5a] transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contact us on WhatsApp
                </a>
              </div>
              {depositStatus === "cancelled" && (
                <p className="body-text text-sm text-muted-foreground mb-4">
                  Your payment wasn&apos;t completed. You can try again below.
                </p>
              )}
              {depositError && <p className="text-destructive text-sm mb-4">{depositError}</p>}
              {showCardForm ? (
                <CardEntryFormPlaceholder amountLabel={amountLabel} applicationId={activeApplicationId} onCancel={() => setShowCardForm(false)} />
              ) : (
                <button
                  onClick={() => setShowCardForm(true)}
                  className="w-full font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 mt-4 disabled:opacity-50"
                >
                  {`Pay $${amountLabel} USD Deposit`}
                </button>
              )}
            </>
          )}
        </div>
      );
    }

    return (
      <div className="border border-border bg-card p-8 text-center">
        <div className="h-px w-12 bg-accent mx-auto mb-6" />
        <h3 className="heading-display text-lg mb-3">Application Received</h3>
        {summaryBlock}
        <p className="body-text text-sm text-muted-foreground mb-2">
          Your application has been registered. Our team will carefully review your profile and assess your eligibility for this expedition.
        </p>
        <p className="body-text text-sm text-muted-foreground">
          Submission does not guarantee acceptance. Each candidacy is evaluated individually based on motivation, fitness, and group compatibility.
        </p>
      </div>
    );
  }

  return (
    <>
      {resumeError && (
        <div className="border border-destructive/50 bg-destructive/10 text-destructive text-sm px-4 py-3 mb-6">
          {resumeError}
        </div>
      )}
      {submitError && (
        <div className="border border-destructive/50 bg-destructive/10 text-destructive text-sm px-4 py-3 mb-6">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {lockedExpedition ? (
          <div className="border border-border bg-secondary px-4 py-3">
            <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-1">Expedition</p>
            <p className="font-heading text-sm">
              {lockedExpedition.name} - ${lockedExpedition.price.toLocaleString("en-US")} / pers.
            </p>
          </div>
        ) : (
          <div>
            <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
              Expedition
            </label>
            <select name="expedition_id" value={form.expedition_id} onChange={handleChange} required className={inputClass}>
              <option value="">Select an expedition</option>
              {expeditionOptions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} - ${e.price.toLocaleString("en-US")} pp
                </option>
              ))}
            </select>
            {errorText("expedition_id")}
          </div>
        )}

        {dateOptions.length > 0 && (
          <div>
            <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
              Departure date
            </label>
            <select
              name="expedition_date_id"
              value={selectedDateId}
              onChange={(e) => setSelectedDateId(e.target.value)}
              required
              className={inputClass}
            >
              {dateOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label} · {d.remainingSpots} spots left
                </option>
              ))}
            </select>
          </div>
        )}

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
            Physical condition
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
    </>
  );
};

export default ApplicationForm;
