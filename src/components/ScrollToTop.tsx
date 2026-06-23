"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const ScrollToTop = () => {
  const pathname = usePathname();
  const firstRun = useRef(true);

  useEffect(() => {
    // On the very first load, honor a deep-link anchor (e.g. /#expeditions)
    // instead of yanking back to the top. Later path changes still reset.
    if (firstRun.current) {
      firstRun.current = false;
      if (window.location.hash) return;
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
