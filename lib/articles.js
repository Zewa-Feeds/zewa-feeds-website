export const ARTICLES = [
  {
    slug: "fish-meal-vs-soy-vs-insect-protein",
    tag: "FEED SCIENCE",
    tagColor: "#5BA8FF",
    tagBg: "rgba(91,168,255,0.10)",
    readTime: "9 min",
    date: "5 August 2026",
    isoDate: "2026-08-05",
    author: "Zewa Research Team",
    featured: true,
    title: "Fish meal vs soy vs insect protein: the complete feed comparison.",
    shortTitle: "Fish Meal vs Soy vs Insect Protein",
    excerpt:
      "Feed is 50–70% of aquaculture production cost, and protein is the most expensive line in any formulation. A side-by-side look at four protein sources on nutrition, digestibility, cost and sustainability.",
    image:
      "https://images.unsplash.com/photo-1544552866-d3ed42536cfd?auto=format&fit=crop&w=2000&q=80",
    imageAlt:
      "Close-up of formulated aquaculture feed pellets, illustrating protein sources compared in this guide",
    stat: "88%",
    statLabel: "pepsin digestibility",
    seo: {
      title: "Fish Meal vs Soy vs Insect Protein: Complete Aquafeed Comparison",
      description:
        "Compare fish meal, soybean meal, plant protein and BSF insect meal on crude protein, digestibility, cost and sustainability. Evidence-based guide for aquafeed formulators.",
      focusKeyword: "fish meal alternatives",
      keywords: [
        "insect protein aquafeed",
        "black soldier fly larvae meal",
        "soybean meal fish feed",
        "BSF protein digestibility",
        "sustainable aquaculture feed",
        "fish meal replacement",
      ],
      ogTitle: "Fish Meal vs Soy vs Insect Protein — The Complete Feed Comparison",
      ogDescription:
        "Four aquafeed proteins compared on nutrition, digestibility, cost and sustainability, with peer-reviewed sources.",
    },
    toc: [
      { id: "fish-meal", label: "What is fish meal?" },
      { id: "soybean-meal", label: "Why soybean meal is everywhere" },
      { id: "plant-protein", label: "The role of plant protein" },
      { id: "insect-protein", label: "What makes insect protein different" },
      { id: "comparison", label: "Head-to-head comparison" },
      { id: "choosing", label: "Choosing for your operation" },
      { id: "faq", label: "Frequently asked questions" },
      { id: "bottom-line", label: "The bottom line" },
      { id: "references", label: "References" },
    ],
    content: [
      {
        type: "lead",
        text: "Feed accounts for 50–70% of total aquaculture production costs, and protein is the single most expensive component in any formulation. Formulators today can choose from a wider range of protein sources than at any point in the industry's history — fish meal, soybean meal, plant protein blends and insect protein each bring genuinely different strengths. This guide compares all four on nutrition, digestibility, cost and sustainability.",
      },
      {
        type: "stat-block",
        items: [
          { val: "50–70%", label: "of production cost is feed" },
          { val: "4", label: "protein sources compared" },
          { val: "5", label: "peer-reviewed sources" },
        ],
      },

      { type: "h2", id: "fish-meal", text: "What is fish meal, and where is it used?" },
      {
        type: "p",
        text: "Fish meal is produced by cooking, pressing and drying whole fish or fish by-products. It delivers 60–72% crude protein with a complete essential amino acid profile rich in lysine and methionine. Its omega-3 content (EPA and DHA) supports neural and immune function, and it carries a long track record in carnivorous aquafeed and early-life-stage nutrition for shrimp, salmon and marine finfish.",
      },
      {
        type: "callout",
        variant: "info",
        title: "The supply constraint",
        text: "Fish meal supply is governed by fishing quotas. Global production has stayed broadly flat since the early 2000s even as aquaculture has grown substantially — which is precisely what drove the search for complementary and alternative proteins.",
      },

      { type: "h2", id: "soybean-meal", text: "Why soybean meal is used so widely" },
      {
        type: "p",
        text: "Soybean meal contains 44–48% crude protein and accounts for more than 70% of global protein meal consumption in animal feed. Consistent worldwide supply and stable pricing make it a practical backbone for poultry, swine and herbivorous aquafeed formulations.",
      },
      {
        type: "p",
        text: "Protein digestibility in fish ranges from roughly 73–87% depending on processing. In carnivorous species, soy is typically used as part of a multi-source blend rather than a sole protein, because methionine supplementation is usually needed to meet those species' amino acid demands.",
      },

      { type: "h2", id: "plant-protein", text: "What role does plant protein play?" },
      {
        type: "p",
        text: "Beyond soy, formulators draw on pea protein concentrate (50–90% crude protein), canola meal (around 36–38%), sunflower meal (28–40%) and spirulina (55–70%). These are increasingly blended to build more complete amino acid profiles.",
      },
      {
        type: "p",
        text: "Plant blends suit livestock and herbivorous aquaculture well, and they let formulators diversify supply across several crops and growing regions — a meaningful hedge when any single commodity market tightens.",
      },

      { type: "h2", id: "insect-protein", text: "What makes insect protein a strong alternative?" },
      {
        type: "p",
        text: "Black soldier fly larvae (BSF, Hermetia illucens) meal delivers 40–55% crude protein depending on processing, with an amino acid profile that matches or exceeds soybean meal across key amino acids. What sets it apart is the combination of high digestibility, functional bioactives and sustainability in a single ingredient.",
      },
      {
        type: "pullquote",
        text: "Higher digestibility means more nutrition absorbed per feeding, less metabolic waste in the water, and better feed conversion — healthier animals and cleaner tanks from the same input.",
      },
      {
        type: "p",
        text: "BSF-based feeds achieve 88% pepsin digestibility, well above the 70–75% typical of conventional soy-based feeds. That gap compounds across a production cycle: every percentage point of protein that is absorbed rather than excreted is protein you do not have to buy twice.",
      },
      {
        type: "didyouknow",
        title: "Two compounds you only get from insects",
        text: "Lauric acid (C12:0), naturally abundant in BSF, has demonstrated antibacterial and antiviral activity. Chitin, the polysaccharide in the larval exoskeleton, stimulates innate immune responses and supports gut microbiota balance. Both are peer-reviewed, replicated findings — and neither is available from fish meal, soy or plant blends.",
      },
      {
        type: "p",
        text: "Regulation has kept pace with the science. The EU authorised insect protein for aquafeed in 2017 and extended approval to poultry and swine in 2021. Production is scaling quickly and cost per tonne is falling as the global BSF farming industry matures.",
      },

      { type: "h2", id: "comparison", text: "Head-to-head comparison" },
      {
        type: "table",
        caption: "Four aquafeed proteins compared across the factors that drive formulation decisions.",
        headers: ["Factor", "Fish meal", "Soybean meal", "Plant protein", "BSF insect meal"],
        highlightColumn: 4,
        rows: [
          ["Crude protein", "60–72%", "44–48%", "28–90% (varies)", "40–55%"],
          ["Digestibility", "High", "73–87%", "Variable", "88% (pepsin)"],
          ["Functional bioactives", "Omega-3s", "Limited", "Limited", "Lauric acid + chitin"],
          ["Cost trend", "High", "Low, stable", "Low–moderate", "Moderate, falling"],
          ["Supply outlook", "Quota-governed", "Abundant", "Abundant", "Scaling rapidly"],
          ["Sustainability", "Moderate", "Moderate", "Favourable", "Highly favourable"],
        ],
      },

      { type: "h2", id: "choosing", text: "Choosing for your operation" },
      {
        type: "proscons",
        items: [
          {
            name: "Fish meal",
            pros: ["Highest crude protein (60–72%)", "Complete amino acid profile", "Native EPA/DHA omega-3s", "Proven in early-life-stage feeds"],
            cons: ["Quota-governed supply", "Highest and most volatile cost", "Flat global production"],
          },
          {
            name: "Soybean meal",
            pros: ["Stable, predictable pricing", "Abundant global supply", "Well understood by formulators"],
            cons: ["Methionine supplementation often needed", "Anti-nutritional factors", "Rarely a sole protein for carnivores"],
          },
          {
            name: "Plant blends",
            pros: ["Diversifies supply across crops", "Low to moderate cost", "Good fit for herbivorous species"],
            cons: ["Variable digestibility", "Needs careful blending for amino acid balance", "Limited functional compounds"],
          },
          {
            name: "BSF insect meal",
            pros: ["88% pepsin digestibility", "Lauric acid and chitin included", "Lowest environmental footprint", "Cost declining as production scales"],
            cons: ["Moderate crude protein (40–55%)", "Newer supply chain than commodity proteins"],
          },
        ],
      },
      {
        type: "takeaways",
        title: "Key takeaways",
        items: [
          "No single protein wins outright — the right answer depends on species, life stage and what you are optimising for.",
          "Digestibility often matters more than headline crude protein: 88% of 45% beats 75% of 60% in absorbed terms.",
          "Insect protein is the only major source that adds functional bioactives alongside protein.",
          "Blending is now standard practice; most modern formulations use several sources deliberately.",
        ],
      },

      { type: "h2", id: "faq", text: "Frequently asked questions" },
      {
        type: "faq",
        items: [
          {
            q: "What is the best protein source for fish feed?",
            a: "It depends on the species, life stage and what you are optimising for. Each source has distinct strengths. For sustainability, digestibility and functional health benefits combined, BSF insect protein offers the strongest all-round profile. Fish meal provides excellent amino acid density. Soybean meal offers cost stability and scale.",
          },
          {
            q: "Can different protein sources be combined in aquafeed?",
            a: "Yes, and this is increasingly the industry standard. Modern formulations blend multiple sources to optimise amino acid balance, cost efficiency and sustainability. Insect protein, fish meal, soy and plant proteins complement each other effectively when ratios are tailored to species and life stage.",
          },
          {
            q: "What are the most sustainable fish meal alternatives?",
            a: "BSF insect protein offers the lowest environmental footprint — minimal land and water use, low emissions, and organic waste conversion. It is also the only major alternative that adds functional bioactive compounds (lauric acid, chitin) alongside protein. Plant blends and fermented soy are also viable sustainable options.",
          },
        ],
      },

      { type: "h2", id: "bottom-line", text: "The bottom line" },
      {
        type: "p",
        text: "The future of aquafeed protein is not about choosing one source over another. It is about selecting the right combination for your species, life stage and market goals. Fish meal, soybean meal and plant protein each play a valuable role.",
      },
      {
        type: "p",
        text: "Insect protein adds something none of the others can: high digestibility at 88% pepsin, natural immune-support compounds, and the strongest sustainability credentials of any major feed protein — with costs declining as production scales. For formulators building toward 2030, it is the fish meal alternative with the most strategic upside.",
      },
      {
        type: "callout",
        variant: "brand",
        title: "About Zewa Feeds",
        text: "Zewa Feeds is an Indian aquafeed company building premium ornamental fish nutrition on BSF insect protein. Products include Betta Bites, Guppy Bites, Dried BSF Larvae and Hatch'E hatchery feed — all formulated with ICAR-supported research and verified at 88% pepsin digestibility.",
      },

      { type: "h2", id: "references", text: "References" },
      {
        type: "references",
        items: [
          { n: 1, text: "FAO (2022). The State of World Fisheries and Aquaculture 2022. Rome: Food and Agriculture Organization of the United Nations.", href: "https://www.fao.org/3/cc0461en/cc0461en.pdf" },
          { n: 2, text: "Ma, S., Wang, H., Dou, Y., Liang, X., Zheng, Y. & Wu, X. (2022). Anti-nutritional factors and protein dispersibility index as principal quality indicators for soybean meal in diet of Nile tilapia. Animals, 12(14), 1831.", href: "https://www.mdpi.com/2076-2615/12/14/1831" },
          { n: 3, text: "Caimi, C., Biasato, I., Chemello, G., Oddon, S.B., Lussiana, C., Malfatto, V.M. et al. (2021). Dietary inclusion of a partially defatted black soldier fly larva meal in low fishmeal-based diets for rainbow trout. Journal of Animal Science and Biotechnology, 12, 50.", href: "https://jasbsci.biomedcentral.com/articles/10.1186/s40104-021-00575-1" },
          { n: 4, text: "Lauric acid from the black soldier fly (Hermetia illucens) and its potential applications (2023). Sustainability, 15(13), 10383.", href: "https://www.mdpi.com/2071-1050/15/13/10383" },
          { n: 5, text: "Chitinase and insect meal in aquaculture nutrition: a comprehensive overview of the latest achievements (2023). Fishes, 8(12), 607.", href: "https://www.mdpi.com/2410-3888/8/12/607" },
        ],
      },
    ],
  },
  {
    slug: "microbiome-health-insect-chitin",
    tag: "BIOLOGY",
    tagColor: "#44e5c2",
    tagBg: "rgba(68,229,194,0.10)",
    readTime: "6 min",
    title: "Microbiome health and the impact of insect chitin.",
    shortTitle: "Microbiome Health & Insect Chitin",
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
    shortTitle: "Reducing Ammonia Output",
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
    shortTitle: "Carotenoids & Natural Color",
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
