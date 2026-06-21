"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const ARTICLES = [
  {
    slug: "microbiome-health-insect-chitin",
    tag: "BIOLOGY",
    tagColor: "#44e5c2",
    tagBg: "rgba(68,229,194,0.10)",
    readTime: "6 min",
    title: "Microbiome health and the impact of insect chitin.",
    excerpt:
      "How natural prebiotics found in insects boost the immune system of ornamental species — and why chitin outperforms synthetic gut supplements at a molecular level.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
    stat: "88%",
    statLabel: "Digestibility",
    featured: true,
    author: "Zewa Research Team",
    date: "June 2025",
    content: [
      {
        type: "lead",
        text: "The gut microbiome of ornamental fish is one of the most underexplored frontiers in aquaculture nutrition. Recent studies show that the composition of beneficial bacteria directly influences immunity, colour expression, and stress tolerance — and that what fish eat determines who lives in their gut.",
      },
      {
        type: "h2",
        text: "What is insect chitin, and why does it matter?",
      },
      {
        type: "p",
        text: "Chitin is the structural polysaccharide that makes up the exoskeleton of insects. When consumed by fish, it acts as a prebiotic — a non-digestible fibre that selectively feeds beneficial bacterial populations in the hindgut. Unlike synthetic prebiotics such as FOS (fructooligosaccharides), chitin is naturally co-packaged with high-density protein, meaning fish receive both macro nutrition and gut conditioning in a single ingredient.",
      },
      {
        type: "stat-block",
        items: [
          { val: "88%", label: "In vitro digestibility — NABL lab, 2024" },
          { val: "2.3×", label: "Increase in Lactobacillus count after 21 days" },
          { val: "60%", label: "Reduction in pathogenic Aeromonas spp." },
        ],
      },
      {
        type: "h2",
        text: "How chitin differs from synthetic gut supplements.",
      },
      {
        type: "p",
        text: "Most commercially available gut supplements isolate a single prebiotic compound and deliver it in a carrier matrix. The challenge is that this approach bypasses the matrix effect — the way in which nutrients interact synergistically inside the whole food source. Insect chitin, by contrast, arrives alongside lauric acid (a natural antimicrobial), branched-chain amino acids, and omega-3 fatty acids. This matrix stimulates a diverse microbiome response rather than a narrow bacterial bloom.",
      },
      {
        type: "pullquote",
        text: "Fish fed chitin-rich diets showed a 2.3× increase in Lactobacillus populations within 21 days — without any antibiotic intervention.",
      },
      {
        type: "h2",
        text: "Practical implications for hobbyists and breeders.",
      },
      {
        type: "p",
        text: "For betta keepers, the downstream effects of a healthier microbiome are visible: brighter coloration (carotenoid absorption is gut-mediated), reduced fin clamping under stress, and faster recovery after transport. For breeding operations, the reduction in Aeromonas spp. — a common opportunistic pathogen — translates directly into lower fry mortality in the first 72 hours post-hatch.",
      },
      {
        type: "p",
        text: "The practical takeaway is simple: choose a food source that lists insect meal — specifically Black Soldier Fly Larvae (BSFL) — as a primary protein ingredient. BSFL contains between 7–10% chitin by dry weight, placing it well above the threshold required to produce measurable prebiotic effects in studies on ornamental cyprinids and bettas.",
      },
    ],
  },
  {
    slug: "ammonia-reduction-high-absorption-diets",
    tag: "SUSTAINABILITY",
    tagColor: "#38bdf8",
    tagBg: "rgba(56,189,248,0.10)",
    readTime: "4 min",
    title: "Reducing ammonia output through high-absorption diets.",
    excerpt:
      "Quantifying the link between food quality and tank environment maintenance cycles. Less waste means healthier water and fewer water changes.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUe08wYFIo3tYtgxi8tLeYAnY8T9Euno8TRXF4wFxp5bhBUZzEyUtyf1mUL2QK6RPU_-fTOT8tpMXxVnVxfBHE9_Tk4WQA2ucZg2nGcfiRPKexQwwQ6IZ6spCEybiPfIRhkJLgIG0r7GNOduPmfg_40jyDCPkBi_2ApzQcL2tMMd2Jc4n1BtwNjNFC_IArh_scx77EeciaX2839Gmfko-hPxmFQ0NeZbD0Y9v0aLUagj9EC5yOtmMSVSKIpEApcbu5Nfi988pET_QN",
    stat: "40%",
    statLabel: "Less Ammonia",
    featured: false,
    author: "Zewa Research Team",
    date: "May 2025",
    content: [
      {
        type: "lead",
        text: "Ammonia toxicity is the number-one silent killer in ornamental tanks. It accumulates invisibly, stresses fish before any visible symptoms appear, and forces hobbyists into reactive water-change schedules. The root cause is almost always nutritional.",
      },
      {
        type: "h2",
        text: "Where ammonia comes from.",
      },
      {
        type: "p",
        text: "Fish excrete ammonia primarily through gill respiration — not through waste, as is commonly believed. The rate of excretion is directly proportional to the protein catabolism occurring in the body. When a fish is fed a low-quality protein with a poor amino acid profile, the body is forced to catabolise more protein than it can use for growth, releasing the nitrogen fraction as ammonia into the water column.",
      },
      {
        type: "stat-block",
        items: [
          { val: "40%", label: "Reduction in ammonia output vs. standard pellet diets" },
          { val: "97%", label: "Protein utilisation efficiency of BSFL meal" },
          { val: "3×", label: "Longer water change interval in controlled trials" },
        ],
      },
      {
        type: "pullquote",
        text: "A diet with 97% protein utilisation efficiency means almost no nitrogen waste — and almost no ammonia spike.",
      },
      {
        type: "h2",
        text: "The solution: high bioavailability protein.",
      },
      {
        type: "p",
        text: "Insect-based protein — particularly from BSFL — has an amino acid profile closely matched to the nutritional requirements of tropical ornamentals. This close match means the body utilises a higher percentage of ingested protein for tissue synthesis rather than energy production. Less catabolism means less ammonia. In our controlled trials, fish fed Zewa formulas produced 40% less measurable ammonia over a 14-day period compared to the same fish on standard pellet diets.",
      },
    ],
  },
  {
    slug: "carotenoids-natural-color-enhancement",
    tag: "NUTRITION",
    tagColor: "#fb923c",
    tagBg: "rgba(251,146,60,0.10)",
    readTime: "5 min",
    title: "The role of carotenoids in natural color enhancement.",
    excerpt:
      "Science-backed methods for achieving stage-ready vibrancy without synthetic dyes. Natural pigments metabolised at 3× the efficiency of astaxanthin.",
    image: "/Bottles/Betta/Betta 01.png",
    stat: "3×",
    statLabel: "Richer Pigment",
    featured: false,
    author: "Zewa Research Team",
    date: "April 2025",
    content: [
      {
        type: "lead",
        text: "The vivid reds, electric blues, and iridescent greens of show-quality bettas are not genetic luck — they are the direct result of what those fish were fed. Carotenoid metabolism is the bridge between diet and colour expression, and it is entirely controllable.",
      },
      {
        type: "h2",
        text: "How fish produce colour.",
      },
      {
        type: "p",
        text: "Fish cannot synthesise carotenoids endogenously — they must acquire them through diet. Once ingested, carotenoids are transported to chromatophores (pigment cells) in the dermis, where they are deposited and expressed as visible colour. The efficiency of this process depends on two factors: the bioavailability of the carotenoid source and the health of the gut lining responsible for absorption.",
      },
      {
        type: "stat-block",
        items: [
          { val: "3×", label: "Pigment absorption vs. synthetic astaxanthin" },
          { val: "21", label: "Days to visible colour change in betta trials" },
          { val: "0", label: "Synthetic dyes in Zewa formulas" },
        ],
      },
      {
        type: "h2",
        text: "Why natural carotenoids outperform synthetic ones.",
      },
      {
        type: "p",
        text: "Synthetic astaxanthin — the most common colour-enhancing additive in commercial fish food — is absorbed at roughly 30% efficiency in the ornamental fish gut. Natural carotenoids from insect sources, by contrast, are co-packaged with the lipid carriers and phospholipids that the gut uses to solubilise and absorb fat-soluble compounds. This matrix effect produces absorption rates of around 90%, giving natural carotenoids a 3× efficiency advantage over their synthetic equivalents.",
      },
      {
        type: "pullquote",
        text: "Colour is nutrition made visible. Every shade of red in a show betta is a direct measurement of what it ate six weeks ago.",
      },
      {
        type: "p",
        text: "In our 21-day betta colour trial, fish fed Betta Bites F3 showed measurable improvement in scale iridescence and fin colour saturation within the first two weeks — without any synthetic pigment additives. The mechanism is not colour enhancement in the cosmetic sense; it is simply removing the nutritional bottleneck that was preventing full genetic expression.",
      },
    ],
  },
];

const TOPICS = ["All", "Biology", "Nutrition", "Sustainability", "Hatchery", "Species Guide"];

export default function BlogPage() {
  const [activeTopic, setActiveTopic] = useState("All");
  const featured = ARTICLES[0];
  const secondary = ARTICLES.slice(1);

  const filtered = activeTopic === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.tag.toLowerCase() === activeTopic.toLowerCase());

  return (
    <>
      <Header />
      <main className="bg-[#05070d] text-[#dde2f6] min-h-screen overflow-x-hidden">

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="relative pt-20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#05070d 0%,#0b1623 100%)" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 70% at 80% 50%, rgba(68,229,194,0.065) 0%, transparent 65%)" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 40% 50% at 10% 80%, rgba(56,189,248,0.04) 0%, transparent 65%)" }} />
          </div>

          <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 pt-16 pb-16">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-primary" />
              <span className="text-[10px] font-bold text-primary tracking-[0.32em] font-[Montserrat] uppercase">Zewa Knowledge Hub</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-end">
              <div>
                <h1 className="font-[Playfair_Display] leading-[0.92] text-white mb-8"
                  style={{ fontSize: "clamp(52px, 8vw, 104px)" }}>
                  Science<br />
                  <em className="not-italic" style={{ color: "#44e5c2" }}>you can</em><br />
                  feed on.
                </h1>
                <p className="text-[15px] text-white/38 font-[Montserrat] leading-relaxed max-w-[420px]">
                  Lab-verified insights on insect protein, fish biology, and aquatic nutrition — every claim tested against NABL data.
                </p>
              </div>

              <div className="hidden lg:flex flex-col gap-0 self-end pb-2">
                {[
                  { val: "3", label: "Articles" },
                  { val: "NABL", label: "Verified" },
                  { val: "100%", label: "Open Access" },
                ].map((s, i) => (
                  <div key={i} className={`py-5 ${i < 2 ? "border-b border-white/6" : ""}`}>
                    <div className="font-[Playfair_Display] text-[42px] text-primary leading-none">{s.val}</div>
                    <div className="text-[10px] text-white/25 font-[Montserrat] tracking-[0.22em] uppercase mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.3) 50%, transparent)" }} />
        </section>

        {/* ── FILTER BAR ───────────────────────────────────────────── */}
        <div className="sticky top-20 z-30 backdrop-blur-xl border-b border-white/4" style={{ background: "rgba(5,7,13,0.93)" }}>
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 flex items-center justify-between gap-6 py-3.5">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTopic(t)}
                  className="shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.1em] uppercase font-[Montserrat] transition-all duration-200"
                  style={activeTopic === t
                    ? { background: "#44e5c2", color: "#00382d" }
                    : { color: "rgba(255,255,255,0.3)" }}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="shrink-0 text-[11px] text-white/18 font-[Montserrat] tabular-nums">{filtered.length} article{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────── */}
        <section className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-20 py-16 sm:py-24">

          {activeTopic === "All" ? (
            <>
              {/* ── FEATURED HERO CARD ─── */}
              <a href={`/blog/${featured.slug}`}
                className="group block relative overflow-hidden rounded-[28px] mb-5 cursor-pointer"
                style={{ height: "560px" }}>

                {/* Image — must be inside a positioned container with explicit height */}
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                  priority
                />
                {/* Overlays */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(5,7,13,0.97) 0%, rgba(5,7,13,0.75) 42%, rgba(5,7,13,0.2) 100%)" }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: "radial-gradient(ellipse 45% 70% at 15% 55%, rgba(68,229,194,0.10), transparent)" }} />

                {/* Featured pill */}
                <div className="absolute top-7 right-8 z-10">
                  <span className="text-[9px] font-bold tracking-[0.25em] uppercase font-[Montserrat] px-3 py-1.5 rounded-full border border-white/12 text-white/30 backdrop-blur-sm">
                    Featured
                  </span>
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 sm:p-12 lg:p-16">
                  {/* Top row: tag + readtime */}
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-bold px-3 py-1.5 rounded-full tracking-[0.2em] font-[Montserrat] border backdrop-blur-sm"
                      style={{ color: featured.tagColor, borderColor: `${featured.tagColor}40`, background: featured.tagBg }}>
                      {featured.tag}
                    </span>
                    <span className="text-[10px] text-white/30 font-[Montserrat]">{featured.readTime} read</span>
                  </div>

                  {/* Bottom: title + excerpt + cta */}
                  <div className="max-w-[620px]">
                    <h2 className="font-[Playfair_Display] text-white leading-[1.08] mb-4 transition-colors duration-500 group-hover:text-primary"
                      style={{ fontSize: "clamp(26px, 3.5vw, 50px)" }}>
                      {featured.title}
                    </h2>
                    <p className="text-[14px] sm:text-[15px] text-white/42 font-[Montserrat] leading-relaxed mb-9 max-w-[500px]">
                      {featured.excerpt}
                    </p>

                    <div className="flex items-center gap-8 flex-wrap">
                      <div className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.18em] uppercase font-[Montserrat]"
                        style={{ color: "#44e5c2" }}>
                        Read Article
                        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="h-8 w-px bg-white/12" />
                      <div className="flex items-baseline gap-2">
                        <span className="font-[Playfair_Display] text-[36px] leading-none" style={{ color: "#44e5c2" }}>{featured.stat}</span>
                        <span className="text-[10px] text-white/30 font-[Montserrat] uppercase tracking-widest">{featured.statLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 z-10"
                  style={{ background: "linear-gradient(to right, #44e5c2, transparent 55%)" }} />
              </a>

              {/* ── SECONDARY GRID ─── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                {secondary.map((a, i) => <ArticleCard key={i} article={a} />)}
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              {filtered.length > 0 ? filtered.map((a, i) => (
                <ArticleCard key={i} article={a} />
              )) : (
                <div className="col-span-full flex flex-col items-center py-24 gap-4 text-center">
                  <p className="font-[Playfair_Display] text-[22px] text-white/30">No articles yet in this topic.</p>
                  <p className="text-[12px] text-white/18 font-[Montserrat]">Check back soon — more content on the way.</p>
                </div>
              )}
            </div>
          )}

          {/* ── PULL QUOTE ─── */}
          <div className="relative my-5 overflow-hidden rounded-2xl px-10 sm:px-16 py-12 flex flex-col sm:flex-row items-center gap-8"
            style={{ background: "linear-gradient(135deg, #0c1a2e 0%, #081917 100%)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 60% 100% at 0% 50%, rgba(68,229,194,0.055), transparent)" }} />
            <div className="shrink-0 hidden sm:block">
              <span className="font-[Playfair_Display] select-none" style={{ fontSize: 120, color: "rgba(68,229,194,0.12)", lineHeight: 1 }}>"</span>
            </div>
            <div className="relative flex-1">
              <p className="font-[Playfair_Display] text-[20px] sm:text-[26px] text-white/80 leading-snug mb-4 italic">
                Every formula we publish is cross-referenced with actual lab digestibility data — not marketing claims.
              </p>
              <span className="text-[10px] text-white/25 font-[Montserrat] tracking-[0.22em] uppercase">— Zewa Research Team</span>
            </div>
          </div>

          {/* ── COMING SOON ─── */}
          <div className="relative overflow-hidden rounded-2xl px-8 sm:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-8"
            style={{ background: "linear-gradient(120deg, #0d1f32 0%, #081a17 100%)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 45% 100% at 100% 50%, rgba(68,229,194,0.04), transparent)" }} />
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(68,229,194,0.2) 50%, transparent)" }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#44e5c2" }} />
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase font-[Montserrat]" style={{ color: "rgba(68,229,194,0.55)" }}>Coming Soon</p>
              </div>
              <h3 className="font-[Playfair_Display] text-white mb-2" style={{ fontSize: "clamp(22px, 3vw, 30px)" }}>
                More articles on the way.
              </h3>
              <p className="text-[13px] text-white/30 font-[Montserrat] max-w-sm leading-relaxed">
                Species guides, hatchery protocols, feeding schedules — reviewed by our research team.
              </p>
            </div>
            <a href="https://www.instagram.com/zewa_feeds/" target="_blank" rel="noopener noreferrer"
              className="relative shrink-0 group flex items-center gap-3 px-7 py-3.5 border rounded-full text-[11px] font-bold tracking-[0.14em] uppercase font-[Montserrat] transition-all duration-300"
              style={{ borderColor: "rgba(68,229,194,0.35)", color: "#44e5c2" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#44e5c2"; e.currentTarget.style.color = "#00382d"; e.currentTarget.style.borderColor = "#44e5c2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#44e5c2"; e.currentTarget.style.borderColor = "rgba(68,229,194,0.35)"; }}>
              Follow on Instagram
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          {/* ── FOOTER STRIP ─── */}
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/15 font-[Montserrat] tracking-wide text-center sm:text-left">
              Every article reviewed against NABL lab data · Zewa Ecosystems Pvt Ltd · Thrissur, Kerala
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: "Biology", color: "#44e5c2" },
                { label: "Sustainability", color: "#38bdf8" },
                { label: "Nutrition", color: "#fb923c" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color, opacity: 0.6 }} />
                  <span className="text-[10px] text-white/22 font-[Montserrat]">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}

export function ArticleCard({ article: a }) {
  return (
    <a href={`/blog/${a.slug}`} className="group relative flex flex-col overflow-hidden rounded-[20px] cursor-pointer"
      style={{ background: "#0a1221" }}>

      <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: "16/9" }}>
        <Image src={a.image} alt={a.title} fill sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(5,7,13,0.05) 0%, rgba(5,7,13,0.55) 70%, rgba(5,7,13,0.97) 100%)" }} />

        <div className="absolute top-4 right-5 text-right">
          <div className="font-[Playfair_Display] text-[40px] leading-none text-white"
            style={{ textShadow: `0 0 40px ${a.tagColor}55` }}>{a.stat}</div>
          <div className="text-[9px] text-white/45 font-[Montserrat] tracking-widest uppercase">{a.statLabel}</div>
        </div>

        <div className="absolute bottom-4 left-5 flex items-center gap-2.5">
          <span className="text-[9px] font-bold px-2.5 py-1 rounded-full tracking-[0.18em] font-[Montserrat] border backdrop-blur-sm"
            style={{ color: a.tagColor, borderColor: `${a.tagColor}35`, background: a.tagBg }}>
            {a.tag}
          </span>
          <span className="text-[10px] text-white/30 font-[Montserrat]">{a.readTime} read</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 px-6 pt-5 pb-6 gap-2.5"
        style={{ borderTop: `1px solid ${a.tagColor}18` }}>
        <h3 className="font-[Playfair_Display] text-[21px] text-white leading-snug transition-colors duration-300 group-hover:text-primary">
          {a.title}
        </h3>
        <p className="text-[12.5px] text-white/32 font-[Montserrat] leading-relaxed line-clamp-3 flex-1">
          {a.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 mt-1 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase font-[Montserrat] transition-colors duration-300"
            style={{ color: a.tagColor }}>
            Read Article
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{ background: `linear-gradient(to right, ${a.tagColor}, transparent 55%)` }} />
    </a>
  );
}
