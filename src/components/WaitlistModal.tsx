"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { trackLead } from "@/lib/meta";
import { toast } from "sonner";
import TurnstileWidget from "@/components/TurnstileWidget";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
  expeditionId: string;
  expeditionName: string;
  expeditionDateId?: string;
  dateLabel?: string;
}

const WaitlistModal = ({ open, onClose, expeditionId, expeditionName, expeditionDateId, dateLabel }: WaitlistModalProps) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    nationality: "",
    number_of_people: 1,
    terms_accepted: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.nationality) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!form.terms_accepted) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }
    if (!turnstileToken) {
      toast.error("Please complete the security verification");
      return;
    }
    setSubmitting(true);

    // Verify turnstile token server-side
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

    const { error } = await supabase.from("waitlist").insert({
      expedition_id: expeditionId,
      expedition_date_id: expeditionDateId || null,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      nationality: form.nationality.trim(),
      number_of_people: form.number_of_people,
    } as any);
    setSubmitting(false);
    if (error) {
      toast.error("Failed to join waitlist");
      return;
    }

    // Lightest intent signal — fire ONLY now that the row is stored.
    trackLead(
      "waitlist",
      {
        email: form.email.trim(),
        firstName: form.first_name.trim(),
        lastName: form.last_name.trim(),
      },
      expeditionName,
    );

    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setTurnstileToken("");
      setForm({ first_name: "", last_name: "", email: "", nationality: "", number_of_people: 1, terms_accepted: false });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            className="relative w-full max-w-md bg-card border border-border p-8"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="h-px w-12 bg-accent mx-auto mb-6" />
                <h3 className="heading-display text-lg mb-3">You're on the list</h3>
                <p className="body-text text-sm text-muted-foreground mb-6">
                  We'll contact you if a spot opens up for this expedition.
                </p>
                <button
                  onClick={handleClose}
                  className="font-heading text-xs tracking-[0.15em] uppercase px-6 py-3 border border-border hover:border-foreground transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="h-px w-12 bg-accent mb-6" />
                <h3 className="heading-display text-lg mb-2">Join the Waitlist</h3>
                <p className="body-text text-sm text-muted-foreground mb-1">
                  {expeditionName}
                </p>
                {dateLabel && (
                  <p className="font-heading text-[10px] tracking-[0.15em] uppercase text-accent mb-6">
                    {dateLabel}
                  </p>
                )}
                {!dateLabel && <div className="mb-6" />}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground block mb-1">
                        First Name
                      </label>
                      <input
                        value={form.first_name}
                        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm focus:border-accent outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground block mb-1">
                        Last Name
                      </label>
                      <input
                        value={form.last_name}
                        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm focus:border-accent outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm focus:border-accent outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground block mb-1">
                      Nationality
                    </label>
                    <input
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm focus:border-accent outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground block mb-1">
                      Number of People
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={form.number_of_people}
                      onChange={(e) => setForm({ ...form, number_of_people: parseInt(e.target.value) || 1 })}
                      required
                      className="w-full px-3 py-2 bg-background border border-border text-foreground text-sm focus:border-accent outline-none transition-colors"
                    />
                  </div>

                  <div className="flex items-start gap-3 mt-1">
                    <input
                      type="checkbox"
                      id="waitlist-terms"
                      checked={form.terms_accepted}
                      onChange={(e) => setForm({ ...form, terms_accepted: e.target.checked })}
                      className="mt-0.5 h-4 w-4 shrink-0 border border-border accent-accent"
                    />
                    <label htmlFor="waitlist-terms" className="body-text text-[11px] text-muted-foreground cursor-pointer leading-tight">
                      I have read and understood the{" "}
                      <Link href="/legal" target="_blank" className="text-accent hover:underline">
                        Terms & Conditions
                      </Link>
                    </label>
                  </div>

                  <div className="mt-1">
                    <TurnstileWidget onVerify={handleTurnstileVerify} onExpire={handleTurnstileExpire} />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !turnstileToken || !form.terms_accepted}
                    className="w-full font-heading text-xs tracking-[0.15em] uppercase px-6 py-4 bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Join Waitlist"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistModal;
