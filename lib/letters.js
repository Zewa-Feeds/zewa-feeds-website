/**
 * Founder's letters.
 *
 * Kept out of the Knowledge Hub on purpose: the blog is search-led feeding and
 * nutrition content, and a reflective letter about the company would bury
 * (and be buried by) it. Letters use the same idea as lib/articles.js — static
 * entries rendered from a block array — but have their own pages at /letters
 * and their own preview on the About page.
 *
 * TO ADD A LETTER: add an entry to LETTERS with a later `date`. The About page
 * always previews the newest one, and every letter page lists the others.
 * Images live in public/letters/<letter>/.
 *
 * Block types: p, h2, h3, phase, lesson, ul, gallery. A `text` (or list item)
 * is either a string or an array of { text, strong?, em? } segments.
 */
export const LETTERS = [
  {
    "slug": "5-years-5-lessons-zewa-day-2026",
    "title": "5 Years and 5 Lessons – Zewa Day 2026",
    "subtitle": "From Zero Waste to science-backed nutrition",
    "date": "2026-10-01",
    "dateLabel": "October 2026",
    "author": "Nik Mulakkal",
    "authorRole": "Founder & CEO",
    "authorOrg": "ZEWA Ecosystems Pvt Ltd",
    "excerpt": "This month we celebrate our 5th Zewa Day. When we started in 2021, the name itself was our mission: Zewa, for Zero Waste. Five years later, the same Black Soldier Fly larva that started as a waste solution sits at the heart of a science-backed nutrition company.",
    "cover": {
      "src": "/letters/zewa-day-2026/five-years-collage.jpg",
      "alt": "Five years of Zewa: a collage of team photos",
      "width": 931,
      "height": 1513
    },
    "blocks": [
      {
        "type": "p",
        "text": "Hi All,"
      },
      {
        "type": "p",
        "text": "This month we celebrate our 5th Zewa Day. When we started in 2021, the name itself was our mission: Zewa, for Zero Waste. Five years later, the same Black Soldier Fly larva that started as a waste solution sits at the heart of a science-backed nutrition company."
      },
      {
        "type": "p",
        "text": "To those who don’t know why we exist: our vision is to innovate feed systems that make animal nutrition superior, sustainable and future-ready. We do this by advancing insect protein technology to develop and commercialise functional, scientifically validated feed formulations."
      },
      {
        "type": "p",
        "text": "Where we stand today:"
      },
      {
        "type": "ul",
        "items": [
          "500+ retail outlets and growing, across 8 states",
          "Amazon, Flipkart, Blinkit and our own D2C store",
          "₹1 Cr annual revenue run-rate, fully bootstrapped",
          "Research collaborations with ICAR-CIFT, ICAR-IARI and Kerala Agricultural University",
          "Backed by KSUM, KSIDC, AgHub-PJTAU, ICAR-IARI and NABARD"
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/range-banner.jpg",
            "alt": "Zewa Feeds range banner: Discover a diverse range of feeds to nourish every species of fish",
            "width": 1584,
            "height": 672
          }
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/customer-story.jpg",
            "alt": "A customer's Instagram story featuring a bottle of Guppy Bites",
            "width": 454,
            "height": 744
          },
          {
            "src": "/letters/zewa-day-2026/cartons.jpg",
            "alt": "Stacked Zewa Feeds cartons ready for dispatch",
            "width": 988,
            "height": 741
          }
        ]
      },
      {
        "type": "p",
        "text": "Looking at the last five years together, each phase taught us one lesson that shaped who we are today. Here are the five."
      },
      {
        "type": "phase",
        "number": 1,
        "period": "2021–22",
        "text": "Starting from Zero Waste"
      },
      {
        "type": "p",
        "text": "Zewa began as an insect-based biowaste management company. Our first waste-to-protein pilots in 2021 won the UNDP Green Innovation Fund. By 2022, we had our first commercial plant converting municipal waste into insect protein, India’s first data-centric insect farm. The same year, we were named EY Climathon Champion and Kerala’s nominee for the Swachh Technology Challenge, and “Zewa” became our registered trademark."
      },
      {
        "type": "p",
        "text": "But the real story of those years came from our customers. Fish farmers and retailers who tried our larvae kept coming back and asking us to produce more. The results in aqua were clear to them before they were clear to us. Through general trade, word spread from shop to shop, and by January 2023 we had dispatched our 100th B2B order."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/insect-farm.jpg",
            "alt": "Rows of rearing crates inside Zewa's insect farm",
            "width": 1600,
            "height": 900
          }
        ]
      },
      {
        "type": "lesson",
        "text": "Customer satisfaction is the first sign of market fit. We were building a waste solution, but our customers were asking for protein. When customers come back on their own and ask for more, they are telling you what your business really is."
      },
      {
        "type": "phase",
        "number": 2,
        "period": "2023",
        "text": "The pivot to formulation science"
      },
      {
        "type": "p",
        "text": "2023 was a year of running two tracks. We were one of 7 teams selected globally for the Australian Alumni Grant Scheme, receiving the award from Hon. Tim Watts, Australian Assistant Minister for Foreign Affairs, in Kolkata. The grant supported the development of the Zewapod biowaste converters. Alongside this, we began our formulation research: an MoU with ICAR-CIFT, product development support from KVASU, and field trials with farmers."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/australian-alumni-grant.jpg",
            "alt": "Zewa receiving the Australian Alumni Grant Scheme award",
            "width": 800,
            "height": 533
          },
          {
            "src": "/letters/zewa-day-2026/ready-to-ship.jpg",
            "alt": "A packed Zewa Feeds order in front of the Ready to Ship wall",
            "width": 1200,
            "height": 1200
          }
        ]
      },
      {
        "type": "p",
        "text": "By the end of the year, the numbers made the decision for us. Early adoption of our feeds was far higher than the number of people who cared about buying a waste management solution. Later, our trials with ICAR-IARI support showed better growth rates in aqua farms, confirming what our customers had been telling us all along. We moved from producing insect protein to formulating with it, building feeds designed for the biology of each species."
      },
      {
        "type": "p",
        "text": "Support came from many sides that year:"
      },
      {
        "type": "ul",
        "items": [
          "KSUM’s Market Acceleration Grant",
          "Incubation at IKP Eden’s BioNest in Bangalore",
          "The EY Wavespace global accelerator",
          "TechnoServe’s GreenR 2023 cohort"
        ]
      },
      {
        "type": "p",
        "text": "It was also a year on stage. We joined the national panel at PJTSAU’s Waste 2 Wealth consortium in Telangana and shared the stage at Kerala Global Expo. We were one of 25 startups selected nationally to exhibit at the Grand StartUp Conclave on Animal Husbandry & Dairying in Hyderabad."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/bsf-farming-panel.jpg",
            "alt": "Panel discussion on Black Soldier Fly farming",
            "width": 1280,
            "height": 590
          },
          {
            "src": "/letters/zewa-day-2026/expo-stage.jpg",
            "alt": "Zewa on a panel at an expo stage",
            "width": 800,
            "height": 533
          }
        ]
      },
      {
        "type": "lesson",
        "text": "A good idea earns recognition, but only customers can tell you where the business is. We chose to follow the adoption, and to build the science where our customers were already pulling us."
      },
      {
        "type": "phase",
        "number": 3,
        "period": "2024",
        "text": "Rebuilding Zewa"
      },
      {
        "type": "p",
        "text": "A pivot in strategy needs a pivot in people. In 2024, we rebuilt our facility and our team. The results came through that year:"
      },
      {
        "type": "ul",
        "items": [
          [
            {
              "text": "First species-specific range.",
              "strong": true
            },
            {
              "text": " We launched Micro Pellets, Guppy Bites, Betta Bites, Cichlid Bites and Tetra Pellets, with new packaging from October."
            }
          ],
          [
            {
              "text": "Hatchery feeds.",
              "strong": true
            },
            {
              "text": " Our Hatch’E feeds went through trials with ICAR-IARI support and feedback from partner hatcheries."
            }
          ],
          [
            {
              "text": "Distribution.",
              "strong": true
            },
            {
              "text": " We onboarded region-wise distributors and partnered with the Aquarium and Pet Shop Association, Kerala, through its district chapters."
            }
          ],
          [
            {
              "text": "Recognition.",
              "strong": true
            },
            {
              "text": " We won the ICAR Pusa Krishi UPJA award and received seed support from AgHub, PJTSAU."
            }
          ]
        ]
      },
      {
        "type": "p",
        "text": "We also took Zewa to our first international stage at Agri-Food Tech Expo Asia 2024 in Singapore, and joined the KSUM pavilion at the TiE Global Summit in Bangalore."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/international-expo.jpg",
            "alt": "A presentation session at an international agri-food expo",
            "width": 1600,
            "height": 976
          },
          {
            "src": "/letters/zewa-day-2026/expo-stall.jpg",
            "alt": "Zewa Feeds stall at an expo",
            "width": 705,
            "height": 935
          }
        ]
      },
      {
        "type": "lesson",
        "text": "At the core of success can only be one thing: a strong team, built to evolve as the demand changes. Every stage of the business needs a different shape, and the right team moulds into it. That includes the founder. Founder moulting is something I have gone through and will keep going through. It means challenging your own beliefs, pushing your limits, and setting goals that disturb your sleep. Today our team works across four states, and most of us have rarely met in person. It works because every role here is built to evolve."
      },
      {
        "type": "phase",
        "number": 4,
        "period": "2025",
        "text": "Going omnichannel"
      },
      {
        "type": "p",
        "text": "2025 was the year of national expansion. We went live on Amazon, Flipkart, Blinkit and our own D2C store, while growing to 500+ retail outlets across 8 states, and still growing."
      },
      {
        "type": "p",
        "text": "We learnt quickly that each channel has a different fit. A retail shelf in Kerala, an Amazon listing and a Blinkit order each need different SKU variants, pack sizes, pricing and targeting. One of our pleco feeds started as a 45g bottle and now also sells as a 500g pack, because our repeat buyers asked for it."
      },
      {
        "type": "p",
        "text": [
          {
            "text": "What we value most is how our customers speak about us. Serious keepers who had used imported feeds for two decades switched to Zewa, and did it happily, writing to tell us about the difference they saw in their fish. Reviews like "
          },
          {
            "text": "“Best pleco food available in India”",
            "em": true
          },
          {
            "text": " and "
          },
          {
            "text": "“My flowerhorn is absolutely loving this!”",
            "em": true
          },
          {
            "text": " come from keepers who moved away from imported brands. Today we hold a 4.5-star rating across 469 reviews, and we read every one of them as closely as our sales reports."
          }
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/betta-bites-shelf.jpg",
            "alt": "Betta Bites on a retail shelf",
            "width": 528,
            "height": 705
          },
          {
            "src": "/letters/zewa-day-2026/tetra-pellets-shelf.jpg",
            "alt": "Tetra Pellets bottles stocked on a retail shelf",
            "width": 528,
            "height": 705
          },
          {
            "src": "/letters/zewa-day-2026/blinkit-chennai.jpg",
            "alt": "Zewa Feeds on Blinkit: Vanakam, Chennai!",
            "width": 544,
            "height": 544
          }
        ]
      },
      {
        "type": "lesson",
        "text": "Product is only half the story in sales. It decides whether a customer comes back. Channel is the rest of the game: do you have the muscle to reach your customer? India is a huge market. In any segment you target, ₹100 Cr is doable without channel conflicts. The question is purely how you reach the customer. And top line is never the full story. A customer who switches from a brand they trusted for twenty years tells you more about market fit than any sales number."
      },
      {
        "type": "phase",
        "number": 5,
        "period": "2025–26",
        "text": "Science and market in one loop"
      },
      {
        "type": "p",
        "text": "Our most important scientific milestone came in 2025. In a feeding trial at Kerala Agricultural University, our formulation delivered 2.2× the weight gain of imported feed. We presented this research at MECOS 4. Independent NABL-accredited testing confirmed 88% pepsin digestibility for our insect protein, against 75% for soy meal."
      },
      {
        "type": "p",
        "text": "What makes this work is the loop between the market and the lab. Questions from keepers, retailers and hatcheries become our research questions. Research becomes products. Products go back to the market and return as data for the next round."
      },
      {
        "type": "p",
        "text": "Today this loop runs every three months, with a new batch of products entering the market each quarter. Our latest set, Shrimp Grazers, reached the top 50 in Aquarium food on Amazon within 3 months of launch."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/shrimp-grazers-amazon.jpg",
            "alt": "Shrimp Grazers product listing on Amazon",
            "width": 1552,
            "height": 1006
          }
        ]
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/kau-research-paper.jpg",
            "alt": "Research abstract: comparative evaluation of black soldier fly larvae-based sustainable feed in oscar and guppy",
            "width": 1600,
            "height": 1113
          }
        ]
      },
      {
        "type": "p",
        "text": "Alongside the science, the recognition kept coming. I was named a Temasek Foundation Ecosphere NextGen Leader in 2025, and this year Zewa received KSIDC scale-up support."
      },
      {
        "type": "lesson",
        "text": "Time doesn’t wait for anyone. Innovation has to stay our top priority, and it has to be rounded: from the market to the science and back. Our science is the one thing that cannot be copied quickly, and by the time anyone tries, the next set of formulations should already be on its way. We need to keep evolving faster than the market around us."
      },
      {
        "type": "h2",
        "text": "Achievements & Recognition – 2026"
      },
      {
        "type": "p",
        "text": "This year has also been one of our proudest so far. A few moments I would like to share with all of you:"
      },
      {
        "type": "h3",
        "text": "Vande Bharatam – National Finalist"
      },
      {
        "type": "p",
        "text": "Zewa was selected among the top 54 national finalists at Vande Bharatam, India’s largest grassroots innovation movement, an initiative by Gautam Adani, from more than 26,000 applications across the country. It was a privilege to present our journey on that stage and to stand alongside some of the most promising innovators in India. For a bootstrapped company that started with a small pilot in Thrissur, this recognition means a lot, and it belongs to every team member, partner and customer who has walked this journey with us."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/vande-bharatam-stage.jpg",
            "alt": "Nik Mulakkal presenting at Vande Bharatam",
            "width": 796,
            "height": 1000
          },
          {
            "src": "/letters/zewa-day-2026/vande-bharatam-finalists.jpg",
            "alt": "Vande Bharatam national finalists group photo",
            "width": 1600,
            "height": 610
          }
        ]
      },
      {
        "type": "h3",
        "text": "Launch of our new website"
      },
      {
        "type": "p",
        "text": "We launched our new dynamic website, zewafeeds.com. Built around functional nutrition, it brings our full product range, a Knowledge Hub for keepers, a dealer locator and direct ordering together in one place, making it easier than ever for customers to find us, learn from us and buy from us."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/new-website.jpg",
            "alt": "The new zewafeeds.com homepage",
            "width": 1600,
            "height": 808
          }
        ]
      },
      {
        "type": "h3",
        "text": "Introducing Zewa Coins"
      },
      {
        "type": "p",
        "text": "We are also happy to announce Zewa Coins, our loyalty programme for the customers who have stood by us. Zewa Coins are now live on our website, rewarding our loyal customers for every purchase. It is our way of saying thank you to the keepers who have made Zewa a part of their routine."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/zewa-coins.jpg",
            "alt": "Zewa Coins announcement graphic",
            "width": 1600,
            "height": 1000
          }
        ]
      },
      {
        "type": "h2",
        "text": "Coming full circle"
      },
      {
        "type": "p",
        "text": "Five years ago, we started as Zero Waste, and we still are. Our larvae still feed on organic waste, and their frass still goes back to the soil. Waste in, protein out, fertiliser back. What has changed is everything we have built on top of that larva: the science, the products, the channels and the team."
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/five-years-collage.jpg",
            "alt": "Five years of Zewa: a collage of team photos",
            "width": 931,
            "height": 1513
          }
        ]
      },
      {
        "type": "h2",
        "text": "Focus areas for the next phase"
      },
      {
        "type": "p",
        "text": "This year, our focus is clear: national expansion, new IP and building the team that takes Zewa to its next stage."
      },
      {
        "type": "ul",
        "items": [
          "Deepening our national footprint across retail, e-commerce and quick commerce",
          "Building new IP in product and process: Breakthrough compounds in gut health under clinical studies",
          "Growing the team: Operations, Marketing & Design, R&D roles",
          "More trials and publications with our research partners",
          "Quarterly launches of new formulations",
          "Extending into new animal nutrition categories"
        ]
      },
      {
        "type": "p",
        "text": "If you want to work where biology meets business, whether in R&D, operations, or marketing and design, write to us at info@zewafeeds.com."
      },
      {
        "type": "p",
        "text": "To our research partners, incubators, mentors, distributors, retailers, and every keeper who trusted a new name: thank you for walking with us for five years. Here’s to the next five!"
      },
      {
        "type": "gallery",
        "images": [
          {
            "src": "/letters/zewa-day-2026/zewa-day-cake.jpg",
            "alt": "Zewa Day cake topped with the number 5",
            "width": 1024,
            "height": 921
          }
        ]
      }
    ]
  }
];

/** Newest first. */
export const LETTERS_BY_DATE = [...LETTERS].sort((a, b) => b.date.localeCompare(a.date));

export const latestLetter = () => LETTERS_BY_DATE[0] ?? null;

export const findLetter = (slug) => LETTERS.find((l) => l.slug === slug) ?? null;
