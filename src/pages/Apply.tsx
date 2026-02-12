import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { expeditions } from "@/data/expeditions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Apply = () => {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("expedition") || "";

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    expedition_slug: preselected,
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    linkedin_url: "",
    physical_condition: "",
    motivation_text: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Insert into Supabase applications table
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Expedition select */}
              <div>
                <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                  Expedition
                </label>
                <select
                  name="expedition_slug"
                  value={form.expedition_slug}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select an expedition</option>
                  {expeditions
                    .filter((e) => e.status !== "closed")
                    .map((e) => (
                      <option key={e.id} value={e.slug}>
                        {e.name} — {e.price_eur.toLocaleString("fr-FR")} €
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    First name
                  </label>
                  <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Last name
                  </label>
                  <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Email
                  </label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Phone
                  </label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    Nationality
                  </label>
                  <input type="text" name="nationality" value={form.nationality} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
                    LinkedIn URL
                  </label>
                  <input type="url" name="linkedin_url" value={form.linkedin_url} onChange={handleChange} className={inputClass} placeholder="https://" />
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
              </div>

              <button
                type="submit"
                className="w-full font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 mt-4"
              >
                Submit Application
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
