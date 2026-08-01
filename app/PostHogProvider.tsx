"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    // Init once, browser only. (App Router < 15.3 — no instrumentation-client.ts.)
    if (!key || (posthog as any).__loaded) return;
    // PostHog's own init pulls in its session-recorder + surveys sub-bundles
    // (~90KB, ~750ms main-thread eval) — deferring init to idle time keeps
    // that off the critical path so it doesn't compete with LCP/hydration.
    // Nothing tracking-wise changes: same config, just started a beat later.
    const init = () =>
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
        // Pageviews are captured manually below so client-side route changes count.
        capture_pageview: false,
        capture_pageleave: true,
      });
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(init, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(init, 1);
    return () => clearTimeout(id);
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;
    let url = window.origin + pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    ph.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, ph]);

  return null;
}
