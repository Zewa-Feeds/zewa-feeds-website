import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import LogoMarquee from "@/components/LogoMarquee";
import { catalog } from "@/lib/api";
import {
  FOUNDER,
  HEADLINE_STATS,
  HERO,
  PURPOSE,
  RANGE,
  REGISTERED_ADDRESS,
  STORY,
  TRUST,
  VALUES,
  WHY,
} from "@/lib/about";

/**
 * Rule-plus-caps eyebrow, matching Science and ClinicalProof.
 *
 * `onLight` swaps the brand mint for a darker green: #44e5c2 on white is about
 * 1.6:1, far below the 4.5:1 needed to be readable.
 */
function Eyebrow({ children, onLight = false }) {
  const color = onLight ? "text-[#00755f]" : "text-primary";
  const rule = onLight ? "bg-[#00755f]" : "bg-primary";
  return (
    <div className="mb-7 flex items-center gap-3">
      <div className={`h-px w-6 ${rule}`} />
      <span className={`font-label-caps text-label-caps tracking-[0.2em] ${color}`}>{children}</span>
    </div>
  );
}

/**
 * Section shell — one place owns vertical rhythm, so no section can drift.
 *
 * Vertical rhythm was py-28 / sm:py-36 / lg:py-44 — 112px, 144px, then 176px
 * top AND bottom. Two adjacent sections therefore put ~350px of empty space
 * between their content on desktop, so the page read as mostly gaps with
 * occasional text. Roughly two-thirds of that still separates the sections
 * clearly without making the reader scroll through emptiness.
 *
 * Tones:
 *   dark   — the page default
 *   raised — a slightly lifted dark panel
 *   light  — an inverted white band, used to break up a long dark page
 *
 * `light` sets a base text colour on the wrapper, but Reveal forwards only
 * className — so children carrying an explicit `text-white` must still be
 * overridden at the call site.
 */
/**
 * Is the founder section shown?
 *
 * Hidden for now at the team's request. The block and its content are left
 * intact — flip this to true to bring it back.
 */
const SHOW_FOUNDER = false;

function Section({ children, tone = "dark", className = "" }) {
  const bg =
    tone === "light"
      ? "bg-white text-[#0b1220]"
      : tone === "raised"
      ? "bg-[#0a1220]"
      : "bg-[#06080f]";
  return (
    <Reveal className={`${bg} ${className}`}>
      <div className="mx-auto max-w-[1240px] px-6 py-16 sm:px-10 sm:py-20 lg:py-24">{children}</div>
    </Reveal>
  );
}

export default async function AboutPage() {
  /*
   * Which products are publicly live. Cards link only to published products —
   * a DRAFT slug 404s, so linking to it would ship dead links. They begin
   * linking automatically as each product is published.
   */
  const liveSlugs = new Set();
  try {
    const list = await catalog.products();
    list.forEach((p) => liveSlugs.add(p.slug));
  } catch {
    /* catalogue unavailable — cards render unlinked */
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#06080f] text-[#dde2f6]">
        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% -10%, rgba(68,229,194,0.13), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-[1240px] px-6 pb-20 pt-32 sm:px-10 sm:pb-24 sm:pt-36">
            <div className="mx-auto max-w-[900px] text-center">
              <div className="mb-8 flex items-center justify-center gap-3">
                <div className="h-px w-6 bg-primary" />
                <span className="font-label-caps text-label-caps tracking-[0.2em] text-primary">
                  {HERO.eyebrow}
                </span>
                <div className="h-px w-6 bg-primary" />
              </div>

              <h1
                className="font-display-lg leading-[1.05] text-white"
                style={{ fontSize: "clamp(38px, 7vw, 82px)" }}
              >
                {HERO.title}
              </h1>

              <p className="font-body-lg mx-auto mt-10 max-w-[620px] text-[17px] leading-relaxed text-white/50 sm:text-[19px]">
                {HERO.lead}
              </p>
              <p className="font-body-md mx-auto mt-5 max-w-[560px] text-[15px] leading-relaxed text-white/35">
                {HERO.sub}
              </p>
            </div>

            {/* Three figures, generously spaced — the credibility argument in one row. */}
            <ul className="mx-auto mt-16 grid max-w-[820px] grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
              {HEADLINE_STATS.map((stat) => (
                <li key={stat.label} className="text-center">
                  <div
                    className="font-display-lg leading-none text-primary"
                    style={{ fontSize: "clamp(40px, 5vw, 56px)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-headline-sm mt-4 text-[14px] text-white/70">{stat.label}</div>
                  <div className="font-body-md mt-1.5 text-[12.5px] text-white/30">{stat.note}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/*
          ── MISSION & VISION ────────────────────────────────────────

          Keeps the LIGHT treatment it was designed for: the eyebrow renders
          onLight and the copy is #0b1220 ink. Moving this above Our Story
          earlier swapped the tones to preserve the light/dark alternation, which
          left dark ink on a dark panel here and white text on white below.
        */}
        <Section tone="light">
          <div className="grid gap-10 md:grid-cols-2 md:gap-14">
            {PURPOSE.map((item) => (
              <div key={item.label}>
                <Eyebrow onLight>{item.label}</Eyebrow>
                <p
                  className="font-display-lg leading-[1.3] text-[#0b1220]/90"
                  style={{ fontSize: "clamp(22px, 2.4vw, 30px)" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── OUR STORY — dark, matching its text-white copy ────────── */}
        <Section tone="raised" className="border-y border-white/5">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div>
              <Eyebrow>{STORY.eyebrow}</Eyebrow>
              <h2
                className="font-display-lg leading-[1.15] text-white"
                style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
              >
                {STORY.title}
              </h2>
            </div>

            <div className="lg:pt-16">
              {STORY.paragraphs.map((para) => (
                <p key={para} className="font-body-md mb-6 text-[15.5px] leading-[1.8] text-white/50">
                  {para}
                </p>
              ))}
              <ul className="mt-10 space-y-4 border-l border-primary/30 pl-7">
                {STORY.outcomes.map((line) => (
                  <li key={line} className="font-body-lg text-[16px] leading-snug text-white/75">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── WHY ZEWA EXISTS ───────────────────────────────────────── */}
        <Section tone="raised" className="border-y border-white/5">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="mb-7 flex items-center justify-center gap-3">
              <div className="h-px w-6 bg-primary" />
              <span className="font-label-caps text-label-caps tracking-[0.2em] text-primary">
                {WHY.eyebrow}
              </span>
            </div>
            <h2
              className="font-display-lg leading-[1.15] text-white"
              style={{ fontSize: "clamp(28px, 3.8vw, 46px)" }}
            >
              {WHY.title}
            </h2>
            <p className="font-body-md mx-auto mt-8 max-w-[620px] text-[15.5px] leading-[1.8] text-white/45">
              {WHY.body}
            </p>
          </div>

          {/* Closed loop — three steps, connected on desktop. */}
          <ol className="relative mx-auto mt-16 grid max-w-[980px] gap-14 sm:grid-cols-3 sm:gap-8">
            <div
              aria-hidden="true"
              className="absolute left-[16%] right-[16%] top-6 hidden h-px sm:block"
              style={{
                background:
                  "linear-gradient(to right, transparent, rgba(68,229,194,0.35), transparent)",
              }}
            />
            {WHY.loop.map((stage, i) => (
              <li key={stage.step} className="relative text-center">
                <span className="font-display-lg relative mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/30 bg-[#0a1220] text-[16px] text-primary">
                  {i + 1}
                </span>
                <h3 className="font-headline-sm mt-6 text-[17px] text-white">{stage.step}</h3>
                <p className="font-body-md mx-auto mt-2.5 max-w-[240px] text-[13.5px] leading-relaxed text-white/38">
                  {stage.detail}
                </p>
              </li>
            ))}
          </ol>

          <p
            className="font-display-lg mx-auto mt-20 max-w-[640px] text-center italic leading-snug text-white/70"
            style={{ fontSize: "clamp(20px, 2.4vw, 28px)" }}
          >
            &ldquo;{WHY.quote}&rdquo;
          </p>
        </Section>

        {/* ── VALUES ────────────────────────────────────────────────── */}
        <Section tone="light" className="border-y border-black/5">
          <div className="max-w-[560px]">
            <Eyebrow onLight>{VALUES.eyebrow}</Eyebrow>
            <h2
              className="font-display-lg leading-[1.15] text-[#0b1220]"
              style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
            >
              {VALUES.title}
            </h2>
          </div>

          <ul className="mt-14 grid gap-x-16 gap-y-12 sm:grid-cols-2">
            {VALUES.items.map((value, i) => (
              <li key={value.title}>
                <span className="font-label-caps text-[10px] tracking-[0.2em] text-[#00755f]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-headline-sm mt-4 text-[19px] leading-snug text-[#0b1220]">
                  {value.title}
                </h3>
                <p className="font-body-md mt-3 max-w-[400px] text-[14px] leading-[1.75] text-[#0b1220]/60">
                  {value.detail}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/*
          ── TRUST ───────────────────────────────────────────────────

          Restructured into a single column plus its own logo band, rather than
          a two-column split with the logos and the awards stacked in the right
          half. The claim is "validated by institutions", so the proof reads
          better across the full width than squeezed beside the copy.
        */}
        <Section>
          <div className="max-w-[720px]">
            <Eyebrow>{TRUST.eyebrow}</Eyebrow>
            <h2
              className="font-display-lg leading-[1.15] text-white"
              style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
            >
              {TRUST.title}
            </h2>
            <p className="font-body-md mt-8 text-[15.5px] leading-[1.8] text-white/45">
              {TRUST.body}
            </p>

            <div className="mt-10 flex gap-12">
              {TRUST.trialStats.map((stat) => (
                <div key={stat.label}>
                  <div
                    className="font-display-lg leading-none text-primary"
                    style={{ fontSize: "clamp(34px, 4vw, 46px)" }}
                  >
                    {stat.value}
                  </div>
                  <div className="font-body-md mt-3 max-w-[150px] text-[13px] leading-snug text-white/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="font-body-md mt-8 text-[12px] text-white/25">
              Based on studies and trials conducted with leading research institutes. NABL lab certified.
            </p>
          </div>

          {/*
            Logo band, full width beneath the copy.

            min-w-0 is required, not cosmetic: a grid or flex item defaults to
            min-width:auto and grows to its content's intrinsic width, so the
            2500px marquee track would drag its column open and make the whole
            page scroll sideways. overflow-hidden cannot cap a block's own width.
          */}
          <div className="min-w-0 mt-16 border-t border-white/5 pt-12">
            <p className="font-label-caps mb-7 text-[10px] tracking-[0.2em] text-white/25">
              BACKED BY
            </p>
            <LogoMarquee logos={TRUST.institutionLogos} />

            {/* Backers with no logo file supplied — still named, not dropped. */}
            {TRUST.institutionsTextOnly?.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {TRUST.institutionsTextOnly.map((name) => (
                  <li key={name} className="font-body-md text-[13px] text-white/40">
                    {name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>

        {/*
          ── AWARDS & RECOGNITION ────────────────────────────────────

          Its own section rather than a list tucked under the logos. These are
          separate claims — who backs the company versus what it has won — and
          burying the awards in a column made them read as a footnote.

          Cards on the raised surface so each award is a discrete item, and the
          alternation with the section above is preserved.
        */}
        <Section tone="raised" className="border-y border-white/5">
          <Eyebrow>AWARDS &amp; RECOGNITION</Eyebrow>
          <h2
            className="font-display-lg leading-[1.15] text-white"
            style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}
          >
            Recognised by the people who fund and judge this work.
          </h2>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.recognition.map((item) => (
              <li
                key={item}
                className="flex h-full flex-col gap-4 rounded-xl border border-white/8 bg-white/[0.02] p-6"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="h-6 w-6 shrink-0 text-primary/70"
                >
                  <path
                    d="M12 15a5 5 0 100-10 5 5 0 000 10z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8.5 14L7 22l5-2.5L17 22l-1.5-8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-body-lg text-[14.5px] leading-snug text-white/70">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── RANGE ─────────────────────────────────────────────────── */}
        {/*
          Base tone, not raised: the Awards section above is raised, and two
          adjacent raised blocks merge into one continuous panel. The copy here
          is white either way.
        */}
        <Section className="border-t border-white/5">
          <div className="max-w-[560px]">
            <Eyebrow>{RANGE.eyebrow}</Eyebrow>
            <h2
              className="font-display-lg leading-[1.15] text-white"
              style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
            >
              {RANGE.title}
            </h2>
            <p className="font-body-md mt-7 text-[15px] leading-[1.8] text-white/45">{RANGE.body}</p>
          </div>

          <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
            {RANGE.products.map((product) => {
              const live = liveSlugs.has(product.slug);
              const Card = live ? "a" : "div";
              return (
                <li key={product.name}>
                  <Card
                    {...(live ? { href: `/products/${product.slug}` } : {})}
                    className={`group flex h-full flex-col justify-between bg-[#0a1220] p-8 transition-colors duration-300 ${
                      live ? "hover:bg-[#0d1728]" : ""
                    }`}
                  >
                    <h3
                      className={`font-headline-sm text-[17px] text-white transition-colors duration-200 ${
                        live ? "group-hover:text-primary" : ""
                      }`}
                    >
                      {product.name}
                    </h3>
                    <p className="font-body-md mt-8 text-[12.5px] tracking-wide text-white/35">
                      {product.spec}
                    </p>
                    {/*
                      Unpublished lines were rendered as dead cards, visually
                      identical to the ones that navigate. Saying so turns a
                      broken-looking tile into a deliberate one.
                    */}
                    {!live && (
                      <span className="font-label-caps mt-4 inline-block self-start rounded-full border border-white/15 px-2.5 py-1 text-[9px] tracking-[0.16em] text-white/40">
                        COMING SOON
                      </span>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>

        {/*
          ── FOUNDER ─────────────────────────────────────────────────

          HIDDEN FOR NOW. Kept in place rather than deleted: the content is
          finished and the portrait exists, so bringing it back is a one-line
          change — flip SHOW_FOUNDER to true.
        */}
        {SHOW_FOUNDER && (
        <Section tone="raised" className="border-y border-white/5">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
            <div>
              <div className="relative aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-xl bg-white/5">
                <Image
                  src={FOUNDER.portrait}
                  alt={FOUNDER.portraitAlt}
                  fill
                  sizes="(max-width: 1024px) 80vw, 320px"
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <Eyebrow>{FOUNDER.eyebrow}</Eyebrow>
              <h2
                className="font-display-lg leading-[1.15] text-white"
                style={{ fontSize: "clamp(26px, 3.2vw, 38px)" }}
              >
                {FOUNDER.name}
              </h2>
              <p className="font-label-caps mt-3 text-[11px] tracking-[0.16em] text-primary">
                {FOUNDER.role}
              </p>

              <blockquote className="mt-8 border-l border-primary/30 pl-7">
                <p className="font-body-lg text-[16.5px] leading-[1.75] text-white/75">
                  {FOUNDER.statement}
                </p>
              </blockquote>

              <p className="font-body-md mt-8 text-[15.5px] leading-[1.8] text-white/50">
                {FOUNDER.bio}
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="font-label-caps text-[10px] tracking-[0.18em] text-white/35">
                    EDUCATION
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {FOUNDER.credentials.map((c) => (
                      <li key={c.label} className="font-body-md text-[14px] leading-snug text-white/60">
                        <span className="text-white/85">{c.label}</span>
                        <span className="text-white/35"> · {c.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-label-caps text-[10px] tracking-[0.18em] text-white/35">
                    RECOGNITION
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {FOUNDER.honours.map((h) => (
                      <li key={h} className="font-body-md text-[14px] leading-snug text-white/60">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>
        )}

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <Section className="border-t border-white/5">
          <div className="mx-auto max-w-[720px] text-center">
            <h2
              className="font-display-lg leading-[1.15] text-white"
              style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
            >
              Feed built on evidence, not marketing.
            </h2>
            <p className="font-body-md mx-auto mt-6 max-w-[460px] text-[15px] leading-relaxed text-white/40">
              Explore the range, or read the research behind every formulation.
            </p>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <a
                href="/products"
                className="font-button rounded-full bg-primary px-9 py-4 text-[12px] uppercase tracking-[0.18em] text-on-primary transition-opacity duration-200 hover:opacity-85"
              >
                Explore products
              </a>
              <a
                href="/blog"
                className="font-button rounded-full border border-white/15 px-9 py-4 text-[12px] uppercase tracking-[0.18em] text-white/70 transition-colors duration-200 hover:border-primary/50 hover:text-primary"
              >
                Knowledge Hub
              </a>
            </div>

            <p className="font-body-md mt-20 text-[12px] leading-relaxed text-white/20">
              {REGISTERED_ADDRESS}
            </p>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
