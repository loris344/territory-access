import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.nationality) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
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
    setSubmitted(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setForm({ first_name: "", last_name: "", email: "", nationality: "", number_of_people: 1 });
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

                  <button
                    type="submit"
                    disabled={submitting}
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
