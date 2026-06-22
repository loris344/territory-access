"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const logoDark = "/assets/logo-dark.webp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const scrollToExpeditions = () => {
    setIsOpen(false);
    if (pathname === "/") {
      document.getElementById("expeditions")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
      setTimeout(() => {
        document.getElementById("expeditions")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-17">
          <Link href="/" className="flex items-center">
            <img src={logoDark} alt="Ligne Rouge Tours" className="h-14 sm:h-16 w-auto" />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={scrollToExpeditions}
              className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Expeditions
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-8 h-8 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <span
              className={`absolute block w-5 h-px bg-foreground transition-all duration-300 ${isOpen ? "rotate-45" : "-translate-y-[5px]"}`}
            />
            <span className={`absolute block w-5 h-px bg-foreground transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
            <span
              className={`absolute block w-5 h-px bg-foreground transition-all duration-300 ${isOpen ? "-rotate-45" : "translate-y-[5px]"}`}
            />
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-6 flex flex-col gap-6">
            <button
              onClick={scrollToExpeditions}
              className="font-heading text-xs tracking-[0.15em] uppercase text-muted-foreground text-left"
            >
              Expeditions
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
