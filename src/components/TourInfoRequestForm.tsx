"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import TurnstileWidget from "@/components/TurnstileWidget";

const inputCls =
  "w-full px-3 py-2 bg-background border border-border text-foreground text-sm focus:border-accent outline-none transition-colors";
const labelCls =
  "font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground block mb-1";

const TourInfoRequestForm = ({
  expeditionId,
  expeditionName,
}: {
  expeditionId: string;
  expeditionName: string;
}) => {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleVerify = useCallback((token: string) => setTurnstileToken(token), []);
  const handleExpire = useCallback(() => setTurnstileToken(""), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email) {
      toast.error("Please fill in your name and email");
      return;
    }
    if (!turnstileToken) {
      toast.error("Please complete the security verification");
      return;
    }
    setSubmitting(true);

    try {
      const { data: verifyData, error: verifyError } = await supabase.functions.invoke("verify-turnstile", {
        body: { token: turnstileToken },
      });
      if (verifyError || !verifyData?.success) {
        toast.error("Security verification failed. Please try again.");
        setTurnstileToken("");
        setSubmitting(false);
        return;
      }
    } catch {
      toast.error("Security verification failed");
      setTurnstileToken("");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("tour_info_requests").insert({
      expedition_id: expeditionId,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to send your request");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="border border-border bg-card p-8 text-center">
        <p className="heading-display text-lg mb-2">Request sent</p>
        <p className="body-text text-sm text-muted-foreground">
          Thanks — we&apos;ll get back to you shortly about {expeditionName}.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card p-6 sm:p-8">
      <div className="h-px w-12 bg-accent mb-6" />
      <h3 className="heading-display text-lg mb-2">Not ready to apply yet?</h3>
      <p className="body-text text-sm text-muted-foreground mb-6">
        Ask us anything about {expeditionName} and we&apos;ll get back to you.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>First Name</label>
            <input
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Last Name</label>
            <input
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              required
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>
            Phone <span className="text-muted-foreground/50 normal-case">(optional)</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows={4}
            placeholder="What would you like to know about this expedition?"
            className={`${inputCls} resize-none`}
          />
        </div>

        <div className="mt-1">
          <TurnstileWidget onVerify={handleVerify} onExpire={handleExpire} />
        </div>

        <button
          type="submit"
          disabled={submitting || !turnstileToken}
          className="w-full font-heading text-xs tracking-[0.15em] uppercase px-6 py-4 bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send request"}
        </button>
      </form>
    </div>
  );
};

export default TourInfoRequestForm;
