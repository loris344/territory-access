"use client";

import { useEffect } from "react";

const POS_KEY = "homeScrollY";
const FLAG_KEY = "restoreHomeScroll";

/**
 * Remembers the home page scroll position and restores it when the visitor
 * comes back from a tour via the "All expeditions" link — instead of jumping to
 * the top (which ScrollToTop would otherwise force). Mounted only on the home
 * page. The restore re-pins for a short window (the grid grows as data/images
 * settle) and bails the instant the user scrolls themselves.
 */
const HomeScrollMemory = () => {
  useEffect(() => {
    let restoringUntil = 0;
    let rafSave = 0;
    let rafRestore = 0;
    const cleanups: Array<() => void> = [];

    // Continuously remember the latest home scroll position.
    const save = () => {
      if (rafSave || performance.now() < restoringUntil) return;
      rafSave = requestAnimationFrame(() => {
        rafSave = 0;
        if (performance.now() < restoringUntil) return; // don't clobber mid-restore
        try {
          sessionStorage.setItem(POS_KEY, String(Math.round(window.scrollY)));
        } catch {
          /* ignore */
        }
      });
    };

    // Restore only when returning via the "All expeditions" button.
    try {
      if (sessionStorage.getItem(FLAG_KEY)) {
        sessionStorage.removeItem(FLAG_KEY);
        const y = parseInt(sessionStorage.getItem(POS_KEY) || "", 10);
        if (!Number.isNaN(y) && y > 0) {
          const start = performance.now();
          restoringUntil = start + 1500;
          let bailed = false;
          const bail = () => {
            bailed = true;
            restoringUntil = 0;
          };
          window.addEventListener("wheel", bail, { passive: true });
          window.addEventListener("touchstart", bail, { passive: true });
          window.addEventListener("keydown", bail);
          cleanups.push(() => {
            window.removeEventListener("wheel", bail);
            window.removeEventListener("touchstart", bail);
            window.removeEventListener("keydown", bail);
          });
          const tick = () => {
            if (bailed) return;
            window.scrollTo(0, y);
            if (performance.now() - start < 1500) {
              rafRestore = requestAnimationFrame(tick);
            } else {
              restoringUntil = 0;
            }
          };
          rafRestore = requestAnimationFrame(tick);
        }
      }
    } catch {
      /* ignore */
    }

    window.addEventListener("scroll", save, { passive: true });
    return () => {
      window.removeEventListener("scroll", save);
      if (rafSave) cancelAnimationFrame(rafSave);
      if (rafRestore) cancelAnimationFrame(rafRestore);
      cleanups.forEach((c) => c());
    };
  }, []);

  return null;
};

export default HomeScrollMemory;
