import type { Metadata } from "next";
import About from "@/views/About";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Who We Are",
  description:
    "Meet the Ligne Rouge Tours team. We design structured immersions in conflict zones, disputed territories, and extreme environments.",
  path: "/about",
});

export default function AboutPage() {
  return <About />;
}
