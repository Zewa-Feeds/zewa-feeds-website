import Image from "next/image";

/** Used until a photo is picked in CMS → Website → About → Founder card. */
const BUNDLED_PHOTO = "/team/nik-mulakkal.jpg";

/**
 * The founder's sign-off: photo, name, credentials.
 *
 * One CMS record (about.founderCard) feeds every copy of it — the end of
 * /about, the foot of /letters and under each letter — so they never disagree.
 */
export default function FounderCard({ founder, className = "" }) {
  if (!founder) return null;
  return (
    <div className={`flex items-center gap-5 sm:gap-7 ${className}`}>
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 sm:h-28 sm:w-28">
        <Image
          src={founder.photo?.url ?? BUNDLED_PHOTO}
          alt={founder.alt || founder.name}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="font-display-lg text-[22px] leading-tight text-white sm:text-[30px]">{founder.name}</p>
        {founder.lines.map((line) => (
          <p key={line} className="mt-1 font-body-md text-[13px] italic leading-snug text-white/50 sm:text-[15px]">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
