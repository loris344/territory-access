import type { Metadata } from "next";
import { Suspense } from "react";
import Apply from "@/views/Apply";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Apply",
  description:
    "Apply for a Ligne Rouge Tours expedition. Participation is by application only, reviewed individually.",
  path: "/apply",
});

export default function ApplyPage() {
  // <Apply> uses useSearchParams(), which must sit under a Suspense boundary.
  return (
    <Suspense>
      <Apply />
    </Suspense>
  );
}
