"use client";

import { MessageCircle } from "lucide-react";

export const CommunityButton = () => {
  return (
    <a
      href="https://chat.whatsapp.com/EXhzjmIUmck984ghsMaaiZ"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 font-heading text-[10px] sm:text-xs tracking-[0.15em] uppercase px-4 sm:px-6 py-2 sm:py-3 bg-[#25D366] text-white hover:bg-[#1fa855] transition-all duration-300 relative"
    >
      <MessageCircle size={16} />
      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        NEW
      </span>
      Join our community
    </a>
  );
};

export default CommunityButton;
