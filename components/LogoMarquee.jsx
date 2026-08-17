import Image from "next/image";

/**
 * Continuously scrolling row of institution logos.
 *
 * WHY THE LIST IS RENDERED TWICE: the track slides by exactly -50%, so at the
 * end of the cycle the duplicate copy sits precisely where the original
 * started and the restart is invisible. Sliding a single copy to -100% would
 * scroll the row off the screen and snap back.
 *
 * The duplicate is aria-hidden and marked data-marquee-clone, so screen readers
 * announce each logo once and the reduced-motion rule in globals.css can drop it.
 *
 * `fadeColor` must match the section behind it — the edge fades blend into the
 * page, so a mismatch draws two visible dark bands instead of disappearing.
 * Defaults to the About page's base surface.
 *
 * WHY EACH LOGO SITS ON A WHITE TILE: six of the seven files are dark artwork
 * on a transparent background (measured: average luminance 38–128 of 255), and
 * this section is near-black. Dropped straight onto it they would be all but
 * invisible — the same problem the product cards had. A white tile is also how
 * these marks are meant to be reproduced.
 */
export default function LogoMarquee({ logos, className = "", fadeColor = "#06080f" }) {
  if (!logos?.length) return null;

  const row = (clone) => (
    <ul
      className="flex shrink-0 items-center gap-4 pr-4 sm:gap-6 sm:pr-6"
      aria-hidden={clone || undefined}
      data-marquee-clone={clone ? "true" : undefined}
    >
      {logos.map((logo) => (
        <li key={`${clone ? "clone" : "main"}-${logo.src}`} className="shrink-0">
          <div className="flex h-20 w-[132px] items-center justify-center rounded-xl bg-white px-4 sm:h-24 sm:w-[156px] sm:px-5">
            <Image
              src={logo.src}
              alt={clone ? "" : logo.alt}
              width={156}
              height={96}
              /*
               * contain, not cover: these are wordmarks and seals. Cropping one
               * to fill the tile would cut the mark itself.
               */
              className="h-full w-full object-contain"
              sizes="156px"
            />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    /*
       w-full matters: the track inside is 2500px wide, and without an explicit
       width this wrapper stretched to fit it — 2072px on a 390px phone, which
       made the whole PAGE scroll sideways. overflow-hidden alone does not cap a
       block's own width, it only clips what spills out of the width it has.
    */
    <div className={`zewa-marquee relative w-full max-w-full overflow-hidden ${className}`}>
      {/*
        Edge fades, so logos enter and leave rather than being chopped off at
        the container edge. Pointer-events-none keeps them off the hover pause.
      */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-20"
        style={{ background: `linear-gradient(to right, ${fadeColor}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-20"
        style={{ background: `linear-gradient(to left, ${fadeColor}, transparent)` }}
      />

      <div className="zewa-marquee-track flex">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
