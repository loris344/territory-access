"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackLead } from "@/lib/meta";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Collects newsletter emails into the public.newsletter_subscribers table.
// `source` records where the signup happened (e.g. "footer", "home-community").
export const NewsletterForm = ({
  source = "site",
  align = "center",
}: {
  source?: string;
  align?: "center" | "left";
}) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = firstName.trim();
    const value = email.trim().toLowerCase();
    if (!name) {
      toast.error("Please enter your first name.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("newsletter_subscribers" as any)
      .insert({ email: value, first_name: name, source } as any);
    setSubmitting(false);
    // 23505 = unique violation -> already subscribed, treat as success.
    if (error && (error as { code?: string }).code !== "23505") {
      toast.error("Subscription failed. Please try again.");
      return;
    }
    // Fire the Meta signal only on a genuinely NEW subscriber (no error), never
    // on a duplicate re-submit, so we don't inflate conversions.
    if (!error) {
      trackLead("newsletter", { email: value, firstName: name }, source);
    }
    setDone(true);
    setFirstName("");
    setEmail("");
    toast.success("You're on the list.");
  };

  if (done) {
    return (
      <p className="font-heading text-[10px] sm:text-xs tracking-[0.15em] uppercase text-muted-foreground">
        Thank you. You are subscribed.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 w-full max-w-md ${align === "center" ? "mx-auto" : ""}`}
    >
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          aria-label="First name"
          className="w-full sm:flex-1 bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          className="w-full sm:flex-1 bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="font-heading text-[10px] sm:text-xs tracking-[0.15em] uppercase px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 whitespace-nowrap w-full"
      >
        {submitting ? "..." : "Subscribe"}
      </button>
    </form>
  );
};

export default NewsletterForm;
