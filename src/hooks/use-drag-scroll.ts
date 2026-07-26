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

export function useDragScroll(
  scrollRef: RefObject<HTMLDivElement>,
  scrollPosRef: MutableRefObject<number>
) {
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startPos = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const container = scrollRef.current;
      if (!container) return;
      isDraggingRef.current = true;
      setIsDragging(true);
      startX.current = e.clientX;
      startPos.current = scrollPosRef.current;
      container.setPointerCapture(e.pointerId);
    },
    [scrollRef, scrollPosRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const container = scrollRef.current;
      if (!isDraggingRef.current || !container) return;
      const delta = (e.clientX - startX.current) * DRAG_SPEED;
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
      if (scrollRef.current?.hasPointerCapture(e.pointerId)) {
        scrollRef.current.releasePointerCapture(e.pointerId);
      }
    },
    [scrollRef]
  );

  return {
    isDraggingRef,
    isDragging,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
    },
  };
}
