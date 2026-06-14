"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const sections = [
  {
    title: "1. LEGAL INFORMATION",
    content: `Company Name: Ligne Rouge Tours\nEmail: contact@lignerougetours.com\nPhone: +33 7 67 13 54 58\n\nFor all inquiries, bookings, complaints, or legal matters, please contact us via the details above.`,
  },
  {
    title: "2. DEFINITIONS",
    content: `In these Terms and Conditions:\n\n"We", "Us", "Our" refer to Ligne Rouge Tours.\n"You", "Client", "Traveller" refer to any person booking or participating in a tour.\n"Tour", "Trip", "Expedition", or "Travel Services" refer to the services provided by Ligne Rouge Tours.\n"High-Risk Destination" refers to countries or regions subject to government travel warnings, sanctions, political instability, or security risks.`,
  },
  {
    title: "3. CONTRACT FORMATION",
    content: `A binding contract is formed once:\n\n• We issue written confirmation of your booking; and\n• The required deposit has been received.\n\nThe person making the booking confirms:\n• They are at least 18 years old.\n• They are authorized to accept these Terms on behalf of all participants.\n• They are responsible for all payments related to the booking.`,
  },
  {
    title: "4. BOOKING POLICY",
    content: `4.1 Deposit\nA deposit of 30% to 50% of the total tour price is required at the time of booking, depending on the destination.\n\n4.2 Balance Payment\nThe remaining balance must be paid no later than 45 days before departure, unless otherwise specified in your booking confirmation. Failure to pay the balance on time may result in cancellation without refund of the deposit.\n\n4.3 Payment Methods\nWe accept: Bank transfer, Credit/Debit card, and other methods specified at booking. All bank charges and transaction fees are the responsibility of the client.`,
  },
  {
    title: "5. CANCELLATION BY THE CLIENT",
    content: `All cancellations must be made in writing via email.\n\nCancellation fees apply as follows:\n• More than 60 days before departure: 20% of total price\n• 59–30 days: 50%\n• 29–15 days: 75%\n• 14–0 days: 100%\n\nNon-refundable costs already incurred (flights, permits, visas, local services) will be deducted. Banking and transaction fees are non-refundable.`,
  },
  {
    title: "6. CANCELLATION OR MODIFICATION BY LIGNE ROUGE TOURS",
    content: `We reserve the right to cancel or modify a tour due to: security concerns, government restrictions, insufficient participants, force majeure, or operational constraints beyond our control.\n\nIf we cancel a tour before departure, you will receive a full refund of payments made. No additional compensation shall be payable.`,
  },
  {
    title: "7. FORCE MAJEURE",
    content: `Force majeure includes, but is not limited to: war or armed conflict, civil unrest or riots, terrorism, natural disasters, pandemics, border closures, government sanctions, and political decisions beyond our control.\n\nIn such cases, we shall not be liable for compensation or additional costs.`,
  },
  {
    title: "8. HIGH-RISK DESTINATIONS – ASSUMPTION OF RISK",
    content: `Ligne Rouge Tours specializes in travel to politically sensitive or high-risk destinations.\n\nBy booking with us, you acknowledge:\n• You are aware of the risks involved.\n• You voluntarily assume all personal risk associated with travel to such destinations.\n• You accept that local authorities have sovereign power and ultimate decision-making authority.\n\nWe are not responsible for: arrest, detention, or deportation; entry refusal; confiscation of materials; government actions; or changes in political or security conditions.`,
  },
  {
    title: "9. VISAS AND ENTRY REQUIREMENTS",
    content: `You are solely responsible for: holding a valid passport, obtaining all required visas, and meeting health and vaccination requirements.\n\nWe may provide supporting documentation but cannot guarantee visa approval. Visa refusal does not automatically entitle you to a full refund. Non-refundable expenses remain payable.`,
  },
  {
    title: "10. MANDATORY TRAVEL INSURANCE",
    content: `Comprehensive travel insurance is mandatory.\n\nYour policy must include: medical coverage, emergency evacuation, repatriation, personal liability, and trip cancellation/interruption.\n\nFor high-risk destinations, we strongly recommend a minimum emergency evacuation coverage of EUR 100,000.\n\nLigne Rouge Tours is not responsible for medical, evacuation, or repatriation costs.`,
  },
  {
    title: "11. CODE OF CONDUCT",
    content: `Travelers must: respect local laws and customs, follow instructions from guides at all times, respect photography restrictions, avoid political demonstrations or unauthorized interactions, and remain with the group unless authorized.\n\nWe reserve the right to remove any participant whose behavior endangers the group, violates local laws, disrespects local partners or authorities, or is disruptive or unsafe.\n\nRemoval from a tour results in no refund.`,
  },
  {
    title: "12. JOURNALISTS AND MEDIA PROFESSIONALS",
    content: `Some destinations prohibit journalists or media professionals from entering on tourist visas.\n\nFailure to declare professional status may result in: immediate removal from the tour, loss of payments, and permanent ban from future travel with us.`,
  },
  {
    title: "13. ITINERARY CHANGES",
    content: `Itineraries are subject to change due to: local authority decisions, security developments, transport disruptions, or government instructions.\n\nNo refund shall be issued for modifications made due to circumstances beyond our control.`,
  },
  {
    title: "14. LIMITATION OF LIABILITY",
    content: `To the maximum extent permitted by law:\n• Our liability is limited to the total amount paid for the tour.\n• We are not liable for indirect or consequential losses.\n• We are not responsible for services booked independently by the client.\n• Nothing in these Terms excludes liability where exclusion is unlawful.`,
  },
  {
    title: "15. HEALTH AND FITNESS",
    content: `You must ensure that you are physically and mentally fit to participate. You must inform us of any medical condition that could affect your safety or the safety of others. We reserve the right to refuse participation if health concerns pose a risk.`,
  },
  {
    title: "16. USE OF IMAGES",
    content: `Unless you notify us in writing before departure, you consent to the use of photos and videos taken during the tour for promotional purposes.`,
  },
  {
    title: "17. DATA PROTECTION",
    content: `We collect personal data necessary for: booking management, travel documentation, and legal compliance.\n\nWe do not sell personal data.\n\nYou have the right to: access your data, request correction, request deletion (where legally possible), and object to processing.\n\nRequests can be sent to: contact@lignerougetours.com`,
  },
  {
    title: "18. COMPLAINTS",
    content: `Any issue must be reported immediately during the tour. Formal complaints must be submitted in writing within 30 days of tour completion.`,
  },
  {
    title: "19. GOVERNING LAW",
    content: `These Terms shall be governed by applicable international private law principles and the jurisdiction determined by the company's legal registration.`,
  },
];

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="h-px w-12 bg-accent mb-10" />
            <h1 className="heading-display text-2xl sm:text-3xl md:text-4xl mb-4">
              Legal Notice & Terms and Conditions
            </h1>
            <p className="font-heading text-sm tracking-[0.1em] uppercase text-muted-foreground mb-16">
              Ligne Rouge Tours
            </p>
          </motion.div>

          <div className="space-y-12">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.02 }}
              >
                <h2 className="font-heading text-sm tracking-[0.1em] uppercase text-foreground mb-4">
                  {section.title}
                </h2>
                <p className="body-text text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LegalNotice;
