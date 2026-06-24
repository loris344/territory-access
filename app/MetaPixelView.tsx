"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// The base Pixel script (in layout <head>) fires the initial PageView. This
// mirrors a PageView on every subsequent client-side route change, so SPA
// navigations are counted too — matching how PostHog pageviews are captured.
function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      // Skip the first run — the base code already fired the initial PageView.
      first.current = false;
      return;
    }
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixelView() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
