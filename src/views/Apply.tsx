"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";

const Apply = () => {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("expedition") || "";
  const preselectedDateId = searchParams.get("date") || "";
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-lg">
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="h-px w-12 bg-accent mb-10" />
            <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-4">Application</h1>
            <p className="body-text text-muted-foreground mb-3">
              Participation in our expeditions is not open to all. Each application undergoes a thorough internal review to ensure alignment with the demands of the destination and the cohesion of the group.
            </p>
            <p className="body-text text-muted-foreground/60 text-sm mb-12">
              Incomplete or insufficiently motivated applications will not be considered.
            </p>

            <ApplicationForm
              preselectedSlug={preselectedSlug}
              preselectedDateId={preselectedDateId}
              onSubmitted={() => setSubmitted(true)}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Apply;
