import type { Metadata } from "next";
import About from "@/views/About";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Who We Are",
  description:
    "Meet the Ligne Rouge Tours team. We design immersive expeditions into the wildest, most demanding landscapes on Earth, built to show you how far you can go.",
  path: "/about",
});

export default function AboutPage() {
  return <About />;
}
