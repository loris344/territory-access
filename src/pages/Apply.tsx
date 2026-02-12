import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { expeditions as localExpeditions } from "@/data/expeditions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const applicationSchema = z.object({
  expedition_id: z.string().min(1, "Please select an expedition"),
  first_name: z.string().trim().min(1, "Required").max(100, "Max 100 characters"),
  last_name: z.string().trim().min(1, "Required").max(100, "Max 100 characters"),
  email: z.string().trim().email("Invalid email").max(255, "Max 255 characters"),
  phone: z.string().trim().min(5, "Invalid phone number").max(30, "Max 30 characters"),
  nationality: z.string().trim().min(1, "Required").max(100, "Max 100 characters"),
  physical_condition: z.string().trim().min(10, "Min 10 characters").max(2000, "Max 2000 characters"),
  motivation_text: z.string().trim().min(20, "Min 20 characters").max(5000, "Max 5000 characters"),
});

type ExpeditionOption = { id: string; name: string; slug: string; price: number; status: string };

const Apply = () => {
  const [searchParams] = useSearchParams();
  const preselectedSlug = searchParams.get("expedition") || "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [expeditionOptions, setExpeditionOptions] = useState<ExpeditionOption[]>([]);

  const [form, setForm] = useState({
    expedition_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    physical_condition: "",
    motivation_text: "",
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch expeditions from DB, fallback to local data
  useEffect(() => {
    const fetchExpeditions = async () => {
      const { data, error } = await supabase
        .from("expeditions")
        .select("id, name, slug, price_eur, status")
        .neq("status", "closed");

      if (data && data.length > 0) {
        const options = data.map((e) => ({
          id: e.id,
          name: e.name,
          slug: e.slug,
          price: e.price_eur,
          status: e.status,
        }));
        setExpeditionOptions(options);
        // Preselect if slug matches
        const match = options.find((o) => o.slug === preselectedSlug);
        if (match) setForm((f) => ({ ...f, expedition_id: match.id }));
      } else {
        // Fallback to local data (IDs won't work for DB insert but form is usable)
        const options = localExpeditions
          .filter((e) => e.status !== "closed")
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
    };
    fetchExpeditions();
  }, [preselectedSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear field error on change
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

    // Validate
    const result = applicationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("applications").insert({
      expedition_id: result.data.expedition_id,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      email: result.data.email,
      phone: result.data.phone,
      nationality: result.data.nationality,
      linkedin_url: null,
      physical_condition: result.data.physical_condition,
      motivation_text: result.data.motivation_text,
      status: "pending",
    });
    setLoading(false);

    if (error) {
      setSubmitError("An error occurred. Please try again later.");
      return;
    }

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
            <p className="body-text text-muted-foreground">
              Our team reviews within 72 hours.
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
            <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-4">Apply</h1>
            <p className="body-text text-muted-foreground mb-12">
              Participation is subject to review. Selection is confirmed after internal validation.
            </p>

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
                      {e.name} — €{e.price.toLocaleString("en-US")}
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

              <div>
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Nationality
                  </label>
                  <input type="text" name="nationality" value={form.nationality} onChange={handleChange} required className={inputClass} />
                  {errorText("nationality")}
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
                  placeholder="Describe your physical condition and relevant experience"
                />
                {errorText("physical_condition")}
              </div>

              <div>
                <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                  Why do you want to join this expedition?
                </label>
                <textarea
                  name="motivation_text"
                  value={form.motivation_text}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={inputClass + " resize-none"}
                />
                {errorText("motivation_text")}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 mt-4 disabled:opacity-50"
              >
                {loading ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Apply;
