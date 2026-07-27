"use client";

import { useCallback, useRef, useState, type RefObject, type MutableRefObject } from "react";

// Pointer-driven drag-scroll for carousels whose track is `overflow-hidden`
// (auto-scroll runs via rAF setting scrollLeft directly, so native touch/
// trackpad scrolling on the container doesn't do anything on its own).
// Lets a visitor grab the strip with a finger or cursor and fling through it
// faster than the ambient auto-scroll speed. scrollPosRef is the same ref
// the auto-scroll loop reads/writes, so dragging and auto-scroll never
// fight over position and resuming after a drag is seamless.
const DRAG_SPEED = 2.4;

const wrap = (pos: number, half: number) => {
  if (half <= 0) return 0;
  let p = pos % half;
  if (p < 0) p += half;
  return p;
};

// A drag that moves past this many px is treated as an actual scroll, not a
// click - used to suppress the click a <Link>/<a> card would otherwise fire
// on release.
const CLICK_SUPPRESS_THRESHOLD = 5;

export function useDragScroll(
  scrollRef: RefObject<HTMLDivElement>,
  scrollPosRef: MutableRefObject<number>
) {
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startPos = useRef(0);
  const hasDraggedRef = useRef(false);
  const hasCapturedRef = useRef(false);
  const pointerIdRef = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const container = scrollRef.current;
      if (!container) return;
      isDraggingRef.current = true;
      hasDraggedRef.current = false;
      hasCapturedRef.current = false;
      pointerIdRef.current = e.pointerId;
      setIsDragging(true);
      startX.current = e.clientX;
      startPos.current = scrollPosRef.current;
      // Pointer capture is NOT taken here on purpose: capturing immediately
      // makes the browser redirect the eventual synthesized `click` to the
      // capturing container instead of whatever card is under the cursor,
      // so plain clicks on a <Link> card would stop navigating even without
      // any real drag. Only capture once movement past the threshold proves
      // this is an actual drag, not a click.
    },
    [scrollRef, scrollPosRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const container = scrollRef.current;
      if (!isDraggingRef.current || !container) return;
      const rawDelta = e.clientX - startX.current;
      if (Math.abs(rawDelta) > CLICK_SUPPRESS_THRESHOLD) {
        hasDraggedRef.current = true;
        if (!hasCapturedRef.current) {
          container.setPointerCapture(pointerIdRef.current);
          hasCapturedRef.current = true;
        }
      }
      const delta = rawDelta * DRAG_SPEED;
      const half = container.scrollWidth / 2;
      const next = wrap(startPos.current - delta, half);
      scrollPosRef.current = next;
      container.scrollLeft = next;
    },
    [scrollRef, scrollPosRef]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      if (hasCapturedRef.current && scrollRef.current?.hasPointerCapture(e.pointerId)) {
        scrollRef.current.releasePointerCapture(e.pointerId);
      }
      hasCapturedRef.current = false;
    },
    [scrollRef]
  );

  // Attach to clickable children (e.g. Link cards) so a drag-release
  // doesn't also trigger navigation.
  const onClickCapture = useCallback((e: React.MouseEvent) => {
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return {
    isDraggingRef,
    isDragging,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
    },
  };
}
