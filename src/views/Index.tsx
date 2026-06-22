"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrailerSection from "@/components/TrailerSection";
import PhilosophySection from "@/components/PhilosophySection";
import WorldMap from "@/components/WorldMap";
import ExpeditionsGrid from "@/components/ExpeditionsGrid";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommunitySection from "@/components/CommunitySection";
import EthicalSection from "@/components/EthicalSection";
import FAQSection from "@/components/FAQSection";
import ContactBubbles from "@/components/ContactBubbles";
import Footer from "@/components/Footer";

const Index = () => {
  // Deep-links like /#expeditions: the browser scrolls to the anchor before the
  // hero image / world map / expeditions data above it finish loading, so the
  // target shifts down and we land too high. Re-assert the scroll for a short
  // window while layout settles, but bail the instant the user takes over.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    let done = false;
    const stop = () => {
      done = true;
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      window.removeEventListener("keydown", stop);
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("keydown", stop);

    // Land a bit lower than the section's very top. Tweak this single value:
    // larger = lower, smaller = higher.
    const EXTRA_OFFSET = 120;
    const start = Date.now();
    const tick = () => {
      if (done) return;
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "auto", block: "start" });
        if (EXTRA_OFFSET) window.scrollBy(0, EXTRA_OFFSET);
      }
      if (Date.now() - start < 1500) {
        requestAnimationFrame(tick);
      } else {
        stop();
      }
    };
    requestAnimationFrame(tick);

    return stop;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <PhilosophySection />
      <TrailerSection />
      <WorldMap />
      <ExpeditionsGrid />
      <TestimonialsSection />
      <CommunitySection />
      <EthicalSection />
      <FAQSection />
      <ContactBubbles />
      <Footer />
    </div>
  );
};

export default Index;
