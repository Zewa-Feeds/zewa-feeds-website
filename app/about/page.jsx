import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
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

/** Rule-plus-caps eyebrow, matching Science and ClinicalProof. */
function Eyebrow({ children }) {
  return (
    <div className="mb-7 flex items-center gap-3">
      <div className="h-px w-6 bg-primary" />
      <span className="font-label-caps text-label-caps tracking-[0.2em] text-primary">{children}</span>
    </div>
  );
}

/**
 * Section shell.
 *
 * One place owns vertical rhythm, so no section can drift. Generous by default
 * — the previous version stacked nine dense blocks with too little air between
 * them, which is what made the page feel heavy.
 */
function Section({ children, tone = "dark", className = "" }) {
  const bg = tone === "raised" ? "bg-[#0a1220]" : "bg-[#06080f]";
  return (
    <Reveal className={`${bg} ${className}`}>
      <div className="mx-auto max-w-[1240px] px-6 py-28 sm:px-10 sm:py-36 lg:py-44">{children}</div>
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
          <div className="relative mx-auto max-w-[1240px] px-6 pb-32 pt-40 sm:px-10 sm:pb-40 sm:pt-52">
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
            <ul className="mx-auto mt-24 grid max-w-[820px] grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
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

        {/* ── OUR STORY ─────────────────────────────────────────────── */}
        <Section tone="raised" className="border-y border-white/5">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
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

        {/* ── MISSION & VISION ──────────────────────────────────────── */}
        <Section>
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            {PURPOSE.map((item) => (
              <div key={item.label}>
                <Eyebrow>{item.label}</Eyebrow>
                <p
                  className="font-display-lg leading-[1.3] text-white/90"
                  style={{ fontSize: "clamp(22px, 2.4vw, 30px)" }}
                >
                  {item.text}
                </p>
              </div>
            ))}
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
          <ol className="relative mx-auto mt-24 grid max-w-[980px] gap-14 sm:grid-cols-3 sm:gap-8">
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

        {/* ── FOUNDER SPOTLIGHT ─────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#06080f]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 60% at 22% 45%, rgba(68,229,194,0.09), transparent 65%)",
            }}
          />
          <Reveal className="relative">
            <div className="mx-auto max-w-[1240px] px-6 py-28 sm:px-10 sm:py-36 lg:py-44">
              <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-24">
                {/* Portrait */}
                <div className="relative mx-auto w-full max-w-[380px] lg:mx-0">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-4 rounded-[2rem] opacity-60"
                    style={{
                      background:
                        "linear-gradient(150deg, rgba(68,229,194,0.16), transparent 60%)",
                    }}
                  />
                  {/*
                    The source JPEG has thin black bars baked into all four
                    edges (and is very slightly rotated, so they are wedge-
                    shaped). Scaling to 108% inside a fixed-aspect, overflow-
                    hidden frame pushes them outside the visible area — the
                    subject is centred with headroom, so nothing meaningful is
                    lost. Fixing the asset itself would be cleaner; this keeps
                    the original file untouched.
                  */}
                  <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-white/10">
                    <Image
                      src={FOUNDER.portrait}
                      alt={FOUNDER.portraitAlt}
                      fill
                      sizes="(max-width: 1024px) 380px, 420px"
                      className="scale-[1.08] object-cover object-center"
                    />
                  </div>
                </div>

                {/* Statement */}
                <div>
                  <Eyebrow>{FOUNDER.eyebrow}</Eyebrow>

                  <blockquote
                    className="font-display-lg leading-[1.35] text-white/90"
                    style={{ fontSize: "clamp(21px, 2.5vw, 31px)" }}
                  >
                    &ldquo;{FOUNDER.statement}&rdquo;
                  </blockquote>

                  <div className="mt-10 flex items-baseline gap-3">
                    <span className="font-headline-sm text-[17px] text-white">{FOUNDER.name}</span>
                    <span className="font-body-md text-[13px] text-white/35">{FOUNDER.role}</span>
                  </div>

                  <p className="font-body-md mt-6 max-w-[520px] text-[14.5px] leading-[1.8] text-white/42">
                    {FOUNDER.bio}
                  </p>

                  <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/8 pt-10 sm:grid-cols-4">
                    {FOUNDER.credentials.map((c) => (
                      <div key={c.label}>
                        <dt className="font-headline-sm text-[13.5px] text-primary">{c.label}</dt>
                        <dd className="font-body-md mt-1 text-[12px] leading-snug text-white/32">
                          {c.detail}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-10 space-y-2.5">
                    {FOUNDER.honours.map((honour) => (
                      <li key={honour} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-primary/50"
                        />
                        <span className="font-body-md text-[13px] leading-snug text-white/38">
                          {honour}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── VALUES ────────────────────────────────────────────────── */}
        <Section tone="raised" className="border-y border-white/5">
          <div className="max-w-[560px]">
            <Eyebrow>{VALUES.eyebrow}</Eyebrow>
            <h2
              className="font-display-lg leading-[1.15] text-white"
              style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
            >
              {VALUES.title}
            </h2>
          </div>

          <ul className="mt-20 grid gap-x-16 gap-y-14 sm:grid-cols-2">
            {VALUES.items.map((value, i) => (
              <li key={value.title}>
                <span className="font-label-caps text-[10px] tracking-[0.2em] text-primary/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-headline-sm mt-4 text-[19px] leading-snug text-white">
                  {value.title}
                </h3>
                <p className="font-body-md mt-3 max-w-[400px] text-[14px] leading-[1.75] text-white/42">
                  {value.detail}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        {/* ── TRUST ─────────────────────────────────────────────────── */}
        <Section>
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-24">
            <div>
              <Eyebrow>{TRUST.eyebrow}</Eyebrow>
              <h2
                className="font-display-lg leading-[1.15] text-white"
                style={{ fontSize: "clamp(28px, 3.6vw, 44px)" }}
              >
                {TRUST.title}
              </h2>
              <p className="font-body-md mt-8 max-w-[520px] text-[15.5px] leading-[1.8] text-white/45">
                {TRUST.body}
              </p>

              <div className="mt-12 flex gap-16">
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
                8-week controlled feeding trial vs a leading premium brand. NABL lab certified.
              </p>
            </div>

            <div className="lg:pt-16">
              <p className="font-label-caps mb-6 text-[10px] tracking-[0.2em] text-white/25">
                BACKED BY
              </p>
              <ul className="flex flex-wrap gap-x-6 gap-y-3.5">
                {TRUST.institutions.map((name) => (
                  <li key={name} className="font-body-md text-[13.5px] text-white/45">
                    {name}
                  </li>
                ))}
              </ul>

              <p className="font-label-caps mb-6 mt-12 text-[10px] tracking-[0.2em] text-white/25">
                RECOGNITION
              </p>
              <ul className="space-y-2.5">
                {TRUST.recognition.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="mt-[3px] h-3.5 w-3.5 shrink-0 text-primary/60"
                    >
                      <path
                        d="M3.5 8.5L6.5 11.5L12.5 5"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-body-md text-[13.5px] leading-snug text-white/40">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* ── RANGE ─────────────────────────────────────────────────── */}
        <Section tone="raised" className="border-t border-white/5">
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
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>

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
