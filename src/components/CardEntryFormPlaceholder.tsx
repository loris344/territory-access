"use client";

import { useState } from "react";

/**
 * Visual-only placeholder card form: NOT a real payment processor. Card
 * field values never leave this component (no fetch/Supabase call, no
 * storage, no logging) — submitting always ends in a fake decline message.
 * Standing in for the real Stripe flow until it's reconnected.
 */
interface CardEntryFormPlaceholderProps {
  amountLabel: string | undefined;
  onCancel: () => void;
}

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const CardEntryFormPlaceholder = ({ amountLabel, onCancel }: CardEntryFormPlaceholderProps) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");

  const inputClass =
    "w-full bg-secondary border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("processing");
    setTimeout(() => setStatus("error"), 1400);
  };

  if (status === "error") {
    return (
      <div className="text-center">
        <p className="body-text text-sm text-destructive mb-2">
          There was a problem processing your payment.
        </p>
        <p className="body-text text-sm text-muted-foreground mb-6">
          Your card has not been charged. Please try again later, or contact us directly.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setCardNumber("");
            setExpiry("");
            setCvc("");
            setCardName("");
          }}
          className="w-full font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
          Card number
        </label>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="1234 1234 1234 1234"
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
            Expiry
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
            CVC
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground mb-2 block">
          Name on card
        </label>
        <input
          type="text"
          autoComplete="cc-name"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        disabled={status === "processing"}
        className="w-full font-heading text-xs tracking-[0.15em] uppercase px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 mt-2 disabled:opacity-50"
      >
        {status === "processing" ? "Processing..." : `Pay $${amountLabel}`}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="w-full font-heading text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
      >
        Cancel
      </button>
    </form>
  );
};

export default CardEntryFormPlaceholder;
