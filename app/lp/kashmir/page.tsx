import type { Metadata } from "next";
import KashmirLanding from "@/views/KashmirLanding";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Kashmir Expedition - Line of Control",
  description:
    "7-day expedition in Indian Kashmir. Trek high-security border mountains, meet locals under tension, observe the Line of Control. Limited spots.",
  path: "/lp/kashmir",
  noIndex: true,
});

export default function KashmirLandingPage() {
  return <KashmirLanding />;
}
