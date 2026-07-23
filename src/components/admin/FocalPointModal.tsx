"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";

interface FocalPointModalProps {
  imageUrl: string;
  position: string;
  onSave: (position: string) => void;
  onClose: () => void;
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));

// Preview at a phone-like portrait ratio since object-cover's crop only
// really becomes a problem once the container gets narrower/taller than
// the source photo, i.e. on mobile.
const FocalPointModal = ({ imageUrl, position, onSave, onClose }: FocalPointModalProps) => {
  const [pos, setPos] = useState(position);
  const containerRef = useRef<HTMLDivElement>(null);
  const [x, y] = pos.split(" ").map((v) => parseFloat(v) || 50);

  const pick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const newX = clamp(Math.round(((e.clientX - rect.left) / rect.width) * 100));
    const newY = clamp(Math.round(((e.clientY - rect.top) / rect.height) * 100));
    setPos(`${newX}% ${newY}%`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-sm bg-card border border-border p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>

        <p className="font-heading text-xs tracking-wider uppercase mb-1">Adjust framing</p>
        <p className="text-xs text-muted-foreground mb-4">
          Click where the important part of the photo is. This preview is shaped like a phone screen, where the crop is tightest.
        </p>

        <div
          ref={containerRef}
          onClick={pick}
          className="relative w-full aspect-[9/16] max-h-[55vh] mx-auto overflow-hidden border border-border cursor-crosshair"
        >
          <img src={imageUrl} alt="" className="w-full h-full object-cover" style={{ objectPosition: pos }} />
          <div
            className="absolute w-5 h-5 rounded-full border-2 border-white bg-accent/70 shadow pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onSave(pos)}
            className="flex-1 font-heading text-[10px] tracking-wider uppercase px-4 py-2.5 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="font-heading text-[10px] tracking-wider uppercase px-4 py-2.5 border border-border text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocalPointModal;
