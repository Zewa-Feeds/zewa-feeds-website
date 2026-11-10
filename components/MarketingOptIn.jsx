"use client";

/**
 * The "send me founder's letters and offers" box, at signup and checkout.
 *
 * Unticked by default, deliberately: consent has to be given, not assumed.
 * The server stamps the customer's marketingOptInAt when it is ticked, and
 * every marketing email carries an unsubscribe link (Backend
 * modules/customers/marketing.ts). Order and delivery emails are not
 * marketing and are sent either way.
 */
export default function MarketingOptIn({ checked, onChange, className = "" }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 font-[Montserrat] text-[12.5px] leading-relaxed text-white/60 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-[3px] h-4 w-4 shrink-0 cursor-pointer accent-[#44e5c2]"
      />
      <span>
        Send me the founder&apos;s letters, new products and offers by email. Unsubscribe any time.
      </span>
    </label>
  );
}
