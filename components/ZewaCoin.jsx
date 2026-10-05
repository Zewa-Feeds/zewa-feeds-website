import Image from "next/image";

/**
 * The Zewa Coin mark — the one coin graphic used anywhere coins appear.
 *
 * Decorative by default (empty alt): it always sits beside the words "Zewa
 * Coins" or a coin amount, so announcing it would read the name twice. Pass
 * `label` where the coin stands alone.
 *
 * public/zewa-coin.png is 192px, crisp up to 96px on 2× screens.
 */
export default function ZewaCoin({ size = 16, label, className = "" }) {
  return (
    <Image
      src="/zewa-coin.png"
      width={size}
      height={size}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
}
