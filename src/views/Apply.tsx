"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationForm from "@/components/ApplicationForm";

const Apply = () => {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("expedition") || "";
  const preselectedDateId = searchParams.get("date") || "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="h-px w-12 bg-accent mb-10" />
            <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-4">Application</h1>
            <p className="body-text text-muted-foreground mb-12">
              Participation in our expeditions is not open to all. Each application undergoes a thorough internal review to ensure alignment with the demands of the destination and the cohesion of the group.
            </p>

            <ApplicationForm
              preselectedSlug={preselectedSlug}
              preselectedDateId={preselectedDateId}
            />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Apply;
