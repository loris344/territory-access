"use client";

import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Email capture shown under the cancellation reason on a cancelled expedition.
// Stores the email in newsletter_subscribers tagged with the destination, via
// the register_destination_interest RPC (which also notifies the team).
export const NotifyDestinationForm = ({ destination }: { destination: string }) => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_RE.test(value)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    const { error } = await (supabase as any).rpc("register_destination_interest", {
      p_email: value,
      p_destination: destination,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
      return;
    }
    setDone(true);
    setEmail("");
    toast.success("You're on the list for this expedition.");
  };

  if (done) {
    return (
      <p className="body-text text-sm text-muted-foreground mt-3">
        Thank you. We'll email you the moment this expedition is back on the calendar.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2">
        Want to be notified if this expedition returns?
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2 max-w-md">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          className="w-full sm:flex-1 bg-transparent border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={submitting}
          className="font-heading text-[10px] tracking-[0.15em] uppercase px-5 py-2 bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 disabled:opacity-50 whitespace-nowrap"
        >
          {submitting ? "..." : "Notify me"}
        </button>
      </form>
    </div>
  );
};

export default NotifyDestinationForm;
