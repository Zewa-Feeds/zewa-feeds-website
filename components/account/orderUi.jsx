"use client";

/**
 * Order presentation shared by the overview, the list and the detail page.
 *
 * Status colour lives here rather than in each screen so a "Cancelled" badge is
 * the same red everywhere. The backend already sends a human `statusLabel`, so
 * these helpers never translate status text — only how it looks.
 */

/** Tone per order status. Keys match the Prisma OrderStatus enum. */
export const STATUS_TONE = {
  PENDING: "border-amber-500/25 bg-amber-500/[0.07] text-amber-300",
  PROCESSING: "border-sky-500/25 bg-sky-500/[0.07] text-sky-300",
  SHIPPED: "border-primary/30 bg-primary/[0.08] text-primary",
  DELIVERED: "border-primary/30 bg-primary/[0.08] text-primary",
  CANCELLED: "border-red-500/25 bg-red-500/[0.07] text-red-300",
  RETURNED: "border-white/15 bg-white/[0.04] text-white/50",
};

/** Payment status tone — paid reads calm, unpaid reads as needing attention. */
export const PAYMENT_TONE = {
  PAID: "text-primary",
  UNPAID: "text-amber-300",
  REFUNDED: "text-white/45",
  FAILED: "text-red-300",
};

export const STATUS_DOT = {
  PENDING: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
  PROCESSING: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]",
  SHIPPED: "bg-[#44e5c2] shadow-[0_0_8px_rgba(68,229,194,0.6)]",
  DELIVERED: "bg-[#44e5c2] shadow-[0_0_8px_rgba(68,229,194,0.6)]",
  CANCELLED: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]",
  RETURNED: "bg-white/40",
};

export function OrderStatusPill({ status, label }) {
  const tone = STATUS_TONE[status] ?? "border-white/15 bg-white/[0.04] text-white/50";
  const dot = STATUS_DOT[status] ?? "bg-white/40";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-[Montserrat] text-[10px] font-bold uppercase tracking-[0.12em] ${tone}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label ?? status}
    </span>
  );
}

/**
 * "12 Aug 2026" — day-first, matching how dates are written in India and how
 * the invoices already render them.
 */
export function formatOrderDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Longer form with the time, for the detail header. */
export function formatOrderDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return `${formatOrderDate(value)}, ${d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}
