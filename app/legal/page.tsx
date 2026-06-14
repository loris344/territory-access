import type { Metadata } from "next";
import LegalNotice from "@/views/LegalNotice";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Legal Notice & Terms",
  description:
    "Legal notice, terms and conditions, and cancellation policy for Ligne Rouge Tours expeditions.",
  path: "/legal",
});

export default function LegalPage() {
  return <LegalNotice />;
}
