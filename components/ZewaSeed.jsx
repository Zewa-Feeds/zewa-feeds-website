/**
 * The Zewa Seed mark — the one seed graphic used anywhere Zewa Seeds appear.
 *
 * Two drawings from the same icon family, chosen by size: the detailed "night"
 * master (bright leaves for the site's dark backgrounds) from 32px up, and the
 * family's 32px cut below that, whose bolder "Z" stays legible where the
 * master's hand-drawn stroke blurs into the seed.
 *
 * Decorative by default (empty alt): it always sits beside the words "Zewa
 * Seeds" or a seed amount, so announcing it would read the name twice. Pass
 * `label` where the seed stands alone.
 *
 * Plain <img>, not next/image: these are SVGs, so there is nothing to resize
 * or re-encode, and they stay sharp at every size and pixel density.
 */
export default function ZewaSeed({ size = 16, label, className = "" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={size >= 32 ? "/zewa-seed.svg" : "/zewa-seed-small.svg"}
      width={size}
      height={size}
      alt={label ?? ""}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 select-none ${className}`}
      draggable={false}
    />
  );
}
