import Image from "next/image";

/**
 * Renders a letter's block array (see lib/letters.js).
 *
 * Text is rendered as text — segments may be bold or italic, but no markup
 * from the content layer reaches the DOM, the same rule the blog renderer
 * follows.
 */

function Text({ value }) {
  if (typeof value === "string") return value;
  return value.map((seg, i) => {
    if (seg.strong) return <strong key={i} className="font-semibold text-white/85">{seg.text}</strong>;
    if (seg.em) return <em key={i} className="text-white/75">{seg.text}</em>;
    return <span key={i}>{seg.text}</span>;
  });
}

/**
 * One row of images at a common height.
 *
 * Each image's flex-grow is its aspect ratio, so a portrait photo beside a
 * landscape one gets proportionally less width and both rows line up — the
 * way the Word layout placed them side by side. On phones the row stacks.
 * A lone portrait image is capped in width so it does not fill the screen.
 */
function Gallery({ images }) {
  const single = images.length === 1;
  const ratio = single ? images[0].width / images[0].height : 0;
  // Portrait and near-square images are capped; only clearly wide ones span the column.
  const cap = !single ? "" : ratio < 0.9 ? "mx-auto max-w-[480px]" : ratio < 1.3 ? "mx-auto max-w-[600px]" : "";
  return (
    <figure className={`my-9 flex flex-col gap-3 sm:flex-row ${cap}`}>
      {images.map((img) => (
        <div
          key={img.src}
          // Row sizing only from sm up: applied to the stacked phone column, a
          // zero flex-basis collapses every image to nothing.
          className="relative overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] sm:[flex:var(--ratio)_1_0%]"
          style={{ "--ratio": img.width / img.height }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes={single ? "(max-width: 1000px) 100vw, 880px" : "(max-width: 640px) 100vw, 520px"}
            className="h-auto w-full"
          />
        </div>
      ))}
    </figure>
  );
}

function renderBlock(block, i) {
  switch (block.type) {
    case "p":
      return (
        <p key={i} className="mb-5 font-body-md text-[16px] leading-[1.8] text-white/60">
          <Text value={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2 key={i} className="mb-4 mt-14 font-display-lg text-[24px] leading-snug text-white sm:text-[28px]">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={i} className="mb-3 mt-9 font-display-lg text-[19px] leading-snug text-white/90 sm:text-[21px]">
          {block.text}
        </h3>
      );
    case "phase":
      return (
        <div key={i} className="mb-5 mt-16 border-t border-white/8 pt-9">
          <p className="mb-2 font-body-md text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/80">
            Lesson {block.number} · {block.period}
          </p>
          <h2 className="font-display-lg text-[24px] leading-snug text-white sm:text-[30px]">
            {block.text}
          </h2>
        </div>
      );
    case "lesson":
      return (
        <blockquote key={i} className="my-9 rounded-r-xl border-l-[3px] border-primary/60 bg-primary/[0.04] py-5 pl-6 pr-5">
          <p className="mb-2 font-body-md text-[10.5px] font-bold uppercase tracking-[0.2em] text-primary/80">
            The lesson
          </p>
          <p className="font-display-lg text-[17px] italic leading-relaxed text-white/80 sm:text-[18.5px]">
            {block.text}
          </p>
        </blockquote>
      );
    case "ul":
      return (
        <ul key={i} className="mb-6 space-y-2.5 pl-5">
          {block.items.map((item, j) => (
            <li
              key={j}
              className="list-disc font-body-md text-[16px] leading-[1.7] text-white/60 marker:text-primary/60"
            >
              <Text value={item} />
            </li>
          ))}
        </ul>
      );
    case "gallery":
      return <Gallery key={i} images={block.images} />;
    default:
      return null;
  }
}

export default function LetterBody({ blocks }) {
  return <>{blocks.map(renderBlock)}</>;
}
