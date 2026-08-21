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
    slug: "insect-chitin-prebiotic-fish-food-gut-health",
    tag: "BIOLOGY",
    tagColor: "#44e5c2",
    tagBg: "rgba(68,229,194,0.10)",
    readTime: "7 min",
    title: "Chitin, gut health, and colour: the hidden role of insect protein.",
    shortTitle: "Chitin, Gut Health & Colour",
    excerpt:
      "How insect chitin supports gut health, immunity, and colour in ornamental fish — and where the evidence is strong, where it is still emerging.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCiYflndevKu4513c5n5GkXHFV-EvpSb6E9OSZRVKqujnzd9U7Xr_tIQy1kZHY11LNO5o8ODPGnM7Uvjja23suH7GPK-dMUN_aGIElLrm9UAkN7J-JYLp6TB2KnCjyNC91mmNoJYjrvollwE4zRkORRW9hr6aCvp7d1ohugUA--vy5EOb_Sso9ji_7HDoVXfj-my9H-K_9o2lzEmMNnv69QLJcVl_KvFqOXEv3TWYfAOUiD9gRx4hZcKB50ZWvRf8lW-gEhQVgcHy_M",
    imageAlt:
      "Close-up of Black Soldier Fly larvae used as insect protein in Zewa ornamental fish food",
    stat: "88%",
    statLabel: "pepsin digestibility",
    seo: {
      title: "Chitin, Gut Health & Colour: The Hidden Role of Insect Protein",
      description:
        "How insect chitin supports gut health, immunity, and colour in ornamental fish. Science-backed guide to natural prebiotics in aquafeed.",
      focusKeyword: "insect chitin fish food",
      keywords: [
        "insect chitin fish food",
        "chitin prebiotic ornamental fish",
        "BSF larvae gut health",
        "insect protein aquafeed",
        "microbiome fish nutrition",
      ],
      ogTitle: "Chitin, Gut Health, and Colour: The Hidden Role of Insect Protein",
      ogDescription:
        "Chitin is not just structure — it is a prebiotic. What the microbiome research shows, and what it does not.",
    },
    featured: true,
    author: "Zewa Research Team",
    date: "10 June 2026",
    isoDate: "2026-06-10",
    toc: [
      { id: "what-is-chitin", label: "What is insect chitin?" },
      { id: "vs-synthetic", label: "Chitin vs synthetic supplements" },
      { id: "practical-benefits", label: "Practical benefits" },
      { id: "why-zewa-uses-bsf", label: "Why Zewa uses BSF protein" },
    ],
    content: [
      {
        type: "lead",
        text: "The gut microbiome of ornamental fish is one of the least explored frontiers in aquaculture nutrition. A growing body of research shows that the composition of beneficial bacteria in a fish's digestive tract directly influences immunity, nutrient absorption, colour expression, and stress tolerance. What a fish eats determines which microbial populations thrive in its gut, and that makes feed selection one of the most consequential decisions a hobbyist or breeder can make.",
      },
      {
        type: "h2",
        id: "what-is-chitin",
        text: "What is insect chitin, and why does it matter for fish nutrition?",
      },
      {
        type: "p",
        text: "Chitin is the structural polysaccharide that forms the exoskeleton of insects. In Black Soldier Fly larvae (BSFL), chitin content ranges from approximately 5% to 12% by dry weight, depending on the larval stage and processing method. When consumed by fish, chitin functions as a prebiotic fibre. It is not fully digested in the way proteins or fats are. Instead, it selectively promotes the growth of beneficial bacterial populations in the hindgut.",
      },
      {
        type: "p",
        text: "Research on Atlantic salmon has shown that dietary chitin at moderate inclusion levels increases beneficial bacteria such as Lactobacillus, Carnobacterium, and Bacillus, while reducing the relative abundance of potentially harmful genera like Vibrio and Aeromonas. Similar microbiome shifts have been observed in rainbow trout, tilapia, and Japanese seabass fed insect-based diets. Importantly, these effects are dose-dependent and species-specific. Some fish species digest chitin more efficiently than others, which means the results vary with formulation.",
      },
      {
        type: "p",
        text: "Unlike isolated synthetic prebiotics such as FOS (fructooligosaccharides), which deliver a single compound in a carrier matrix, chitin in insect meal arrives alongside lauric acid (a medium-chain fatty acid with natural antimicrobial properties), a complete amino acid profile, and essential fatty acids. This co-delivery of prebiotic fibre with macro nutrition is what makes insect-based feeds nutritionally distinctive. For a source-by-source breakdown, see Fish Meal vs Soy vs Insect Protein.",
        links: [
          {
            text: "Fish Meal vs Soy vs Insect Protein",
            href: "/blog/fish-meal-vs-soy-vs-insect-protein",
          },
        ],
      },
      {
        type: "stat-block",
        items: [
          { val: "88%", label: "In vitro pepsin digestibility of Zewa insect protein (NABL-accredited lab, 2024)" },
          { val: "5–12%", label: "Chitin content range in BSF larvae by dry weight (published literature)" },
        ],
      },
      {
        type: "h2",
        id: "vs-synthetic",
        text: "How does chitin support the fish gut differently from synthetic supplements?",
      },
      {
        type: "p",
        text: "Most commercially available gut supplements isolate a single prebiotic compound. The limitation of this approach is that it bypasses the matrix effect: the way nutrients interact synergistically within a whole food source. Insect chitin is not an isolated compound. It exists within a protein matrix that includes lauric acid, branched-chain amino acids, and bioactive lipids. Published research suggests this matrix stimulates a broader, more diverse microbiome response compared to single-compound delivery, though direct head-to-head studies comparing chitin to synthetic prebiotics in ornamental fish are still limited.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Chitin is not chitosan",
        text: "Much of the published research on prebiotic and immunostimulatory benefits refers to chitosan, the deacetylated derivative of chitin. Raw chitin and chitosan have different bioactivities. The prebiotic value of chitin in whole insect meal is real, but should not be conflated with the more extensively studied properties of purified chitosan.",
      },
      {
        type: "h2",
        id: "practical-benefits",
        text: "What are the practical benefits for hobbyists and breeders?",
      },
      {
        type: "p",
        text: "For betta keepers, the downstream effects of a healthier gut microbiome are visible over time: improved colour vibrancy (emerging research links gut microbiota composition to carotenoid assimilation in fish skin), reduced stress responses during transport, and stronger overall condition. For breeding operations, the modulation of pathogenic bacteria such as Aeromonas species through insect-based diets can contribute to improved fry survival in the critical first 72 hours post-hatch, though outcomes depend on species, water quality, and overall husbandry.",
      },
      {
        type: "p",
        text: "The practical takeaway is straightforward: choose a feed that lists insect meal, specifically Black Soldier Fly larvae (BSFL), as a primary protein ingredient. Look for feeds where the insect protein source has verified digestibility data, since digestibility determines how much of the nutrition actually reaches the fish rather than passing through as waste.",
      },
      {
        type: "h2",
        id: "why-zewa-uses-bsf",
        text: "Why does Zewa use BSF insect protein as the foundation of its feeds?",
      },
      {
        type: "p",
        text: "Zewa Feeds is a Kerala-based insect protein aquafeed company that formulates Black Soldier Fly based ornamental fish feeds with ICAR-supported research. Every Zewa formulation, from Betta Bites at 46% protein to Hatch'E hatchery feed at 50% protein, is built on an insect meal base that delivers verified 88% pepsin digestibility (tested at a NABL-accredited laboratory). This means more nutrition absorbed per feeding, less ammonia waste in the tank, and a natural source of chitin working as a prebiotic with every meal. No synthetic gut supplements needed.",
        links: [
          { text: "Betta Bites", href: "/products/betta-bites" },
          { text: "Explore the range", href: "/products" },
        ],
      },
      {
        type: "faq",
        items: [
          {
            q: "Is chitin safe for all ornamental fish species?",
            a: "Chitin is a natural component of insect-based feeds and is generally well tolerated at the inclusion levels found in commercial ornamental fish food. However, chitin digestibility varies between species. Carnivorous and omnivorous species that naturally consume insects tend to process chitin more effectively than strict herbivores.",
          },
          {
            q: "Does insect chitin replace the need for separate probiotic supplements?",
            a: "Insect chitin acts as a prebiotic, meaning it feeds beneficial bacteria already present in the fish gut. It does not introduce new bacteria the way a probiotic supplement does. In a well-formulated insect protein feed, the prebiotic effect of chitin supports gut health as part of daily nutrition rather than requiring a separate supplement.",
          },
          {
            q: "What chitin content should I look for in fish food?",
            a: "Published research reports BSF larvae chitin content ranging from approximately 5% to 12% by dry weight depending on life stage and processing. Effective prebiotic benefits have been observed at moderate dietary inclusion levels. Rather than targeting a specific chitin percentage, look for feeds where insect meal is listed as a primary ingredient.",
          },
        ],
      },
    ],
  },

  {
    slug: "carotenoids-natural-color-enhancement",
    tag: "NUTRITION",
    tagColor: "#fb923c",
    tagBg: "rgba(251,146,60,0.10)",
    readTime: "5 min",
    title: "Why natural carotenoids deliver better colour than synthetic dyes.",
    shortTitle: "Carotenoids & Natural Color",
    excerpt:
      "Science-backed methods for achieving stage-ready vibrancy without synthetic dyes. Natural carotenoids shown to outperform synthetic astaxanthin in bioavailability and pigment deposition.",
    image: "/Bottles/Betta/Betta 01.png",
    imageAlt:
      "Zewa Feeds Betta Bites F3, a natural-carotenoid betta feed formulated without synthetic dyes",
    stat: "2×",
    statLabel: "higher bioavailability",
    seo: {
      title: "Natural vs Synthetic Astaxanthin: Better Colour in Ornamental Fish",
      description:
        "Why natural carotenoids outperform synthetic astaxanthin in ornamental fish. Isomer profile, the lipid matrix effect, and what the published studies actually report.",
      focusKeyword: "natural carotenoids fish food",
      keywords: [
        "natural carotenoids fish food",
        "natural vs synthetic astaxanthin",
        "betta colour enhancing food",
        "astaxanthin ornamental fish",
        "colour enhancing fish food without dyes",
      ],
      ogTitle: "Why Natural Carotenoids Deliver Better Colour Than Synthetic Dyes",
      ogDescription:
        "Colour is nutrition made visible. How carotenoid source, lipid matrix and gut health together determine pigment expression.",
    },
    featured: false,
    author: "Zewa Research Team",
    date: "22 April 2026",
    isoDate: "2026-04-22",
    toc: [
      { id: "how-fish-produce-colour", label: "How fish produce colour" },
      { id: "natural-vs-synthetic", label: "Why natural carotenoids outperform synthetic ones" },
      { id: "in-practice", label: "What this means in practice" },
    ],
    content: [
      {
        type: "lead",
        text: "The vivid reds, electric blues, and iridescent greens of show-quality bettas are not genetic luck — they are the direct result of what those fish were fed. Carotenoid metabolism is the bridge between diet and colour expression, and it is entirely controllable.",
      },
      {
        type: "h2",
        id: "how-fish-produce-colour",
        text: "How fish produce colour.",
      },
      {
        type: "p",
        text: "Fish cannot synthesise carotenoids endogenously — they must acquire them through diet. Once ingested, carotenoids are transported to chromatophores (pigment cells) in the dermis, where they are deposited and expressed as visible colour. The efficiency of this process depends on two factors: the bioavailability of the carotenoid source and the health of the gut lining responsible for absorption.",
      },
      {
        type: "stat-block",
        items: [
          { val: "2×", label: "Higher pigment bioavailability vs. synthetic astaxanthin (published studies)" },
          { val: "21", label: "Days to visible colour change in internal betta feeding observations" },
          { val: "0", label: "Synthetic dyes in Zewa formulas" },
        ],
      },
      {
        type: "h2",
        id: "natural-vs-synthetic",
        text: "Why natural carotenoids outperform synthetic ones.",
      },
      {
        type: "p",
        text: "Synthetic astaxanthin — the most common colour-enhancing additive in commercial fish food — contains a mixture of three optical isomers (3S,3'S; 3R,3'S; and 3R,3'R in a 1:2:1 ratio). Natural carotenoid sources, by contrast, are dominated by the 3S,3'S isomer, which research has shown to exhibit higher antioxidant activity and more efficient absorption in aquatic organisms.",
      },
      {
        type: "p",
        text: "The advantage of natural carotenoids extends beyond isomer profile. When carotenoids are delivered within a lipid-rich matrix — such as the insect oils and fish oils present in Zewa formulas — they are co-packaged with the fatty acids and phospholipids that the gut uses to solubilise and absorb fat-soluble compounds. This matrix effect significantly improves the fraction of carotenoid that actually reaches the chromatophores. Published studies on ornamental fish have demonstrated that natural astaxanthin produces measurably superior coloration compared to synthetic astaxanthin at equivalent doses, with one peer-reviewed study recording a 15% higher colour intensity value in fish fed natural sources.",
      },
      {
        type: "callout",
        variant: "info",
        title: "Where the pigment actually comes from",
        text: "In Zewa formulas the carotenoid system is built from multiple natural sources working together: spirulina provides phycocyanin and beta-carotene; paprica essence delivers natural astaxanthin and canthaxanthin; and the insect-oil and fish-oil base ensures these fat-soluble pigments are delivered in the lipid carriers needed for efficient gut absorption. BSF larvae are the protein foundation, not the pigment source — this multi-source approach creates a broader pigment spectrum than any single synthetic additive can achieve.",
      },
      {
        type: "pullquote",
        text: "Colour is nutrition made visible. Every shade of red in a show betta is a direct measurement of what it ate six weeks ago.",
      },
      {
        type: "h2",
        id: "in-practice",
        text: "What this means in practice.",
      },
      {
        type: "p",
        text: "In internal feeding observations over 21 days, bettas fed Betta Bites F3 showed noticeable improvement in scale iridescence and fin colour saturation within the first two weeks — without any synthetic pigment additives. The mechanism is not colour enhancement in the cosmetic sense; it is simply removing the nutritional bottleneck that was preventing full genetic expression.",
      },
      {
        type: "p",
        text: "Betta Bites F3 delivers 46% insect protein with 88% pepsin digestibility, meaning more nutrients are absorbed per feeding and less metabolic waste is produced. The high digestibility of the protein base also supports a healthier gut lining — the very tissue responsible for absorbing carotenoids in the first place. A fish with poor gut health wastes even the best pigment sources. A fish on a highly digestible, nutrient-dense diet absorbs more of everything, carotenoids included.",
      },
      {
        type: "p",
        text: "This is why colour outcomes in ornamental fish are inseparable from overall feed quality. Protein digestibility, lipid matrix, carotenoid source, and gut health are not separate variables — they are parts of a single nutritional system. Zewa formulas are designed to optimise that entire system, not just add pigment on top of an otherwise deficient diet.",
      },
      {
        type: "references",
        items: [
          {
            n: 1,
            text: "Mutale-Joan, C. & El Arroussi, H. (2023). Comparative effects of natural astaxanthin from Haematococcus pluvialis and synthetic astaxanthin on pigmentation in ornamental fish at 100 mg/kg inclusion.",
          },
          {
            n: 2,
            text: "EFSA FEEDAP Panel (2014). Scientific Opinion on the safety and efficacy of synthetic astaxanthin as a feed additive — optical isomer composition (3S,3'S : 3R,3'S : 3R,3'R in a 1:2:1 ratio).",
            href: "https://www.efsa.europa.eu/en/efsajournal/pub/3724",
          },
        ],
      },
    ],
  },
];
