"use client";

const testimonials = [
  {
    quote: "Switched to Zewa six months ago. My discus colony has never looked this vibrant — colour saturation is night and day compared to what I was using before.",
    name: "Rahul Menon",
    role: "Discus Breeder, Kochi",
    initials: "RM",
  },
  {
    quote: "The science behind this is real. My guppies are growing faster, the water stays cleaner longer, and mortality in my fry tanks dropped noticeably within weeks.",
    name: "Ananya Krishnan",
    role: "Ornamental Fish Farmer, Thrissur",
    initials: "AK",
  },
  {
    quote: "I was sceptical about insect protein at first. Three months in, I'm a convert. My flowerhorn has put on more mass and the aggression stress is visibly lower.",
    name: "Deepak Varma",
    role: "Cichlid Enthusiast, Bangalore",
    initials: "DV",
  },
  {
    quote: "As a hatchery operator the reduced ammonia output alone justifies the price. Less water changes means lower overhead. This product pays for itself.",
    name: "Suresh Pillai",
    role: "Hatchery Operator, Alappuzha",
    initials: "SP",
  },
  {
    quote: "My betta's fins have fully recovered and his colour is phenomenal. I've tried every premium brand out there — Zewa is genuinely different.",
    name: "Priya Nair",
    role: "Betta Collector, Chennai",
    initials: "PN",
  },
  {
    quote: "Recommended Zewa to my entire aquarium club. Everyone who tried it has reordered. The digestibility difference is something you can see in the tank.",
    name: "Mohammed Iqbal",
    role: "Aquarium Club Lead, Calicut",
    initials: "MI",
  },
];

// Duplicate for seamless infinite loop
const doubled = [...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section className="bg-[#f8faf9] py-20 sm:py-28 overflow-hidden">
      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-primary" />
              <span className="font-label-caps text-label-caps text-primary tracking-[0.18em]">
                WHAT KEEPERS SAY
              </span>
            </div>
            <h2 className="font-display-lg text-[28px] sm:text-[36px] text-gray-900 leading-tight">
              Trusted by serious aquarists.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <span key={`header-star-${i}`} className="text-primary text-lg">★</span>
            ))}
            <span className="font-body-md text-[13px] text-gray-400 ml-2">
              4.9 / 5 across 200+ reviews
            </span>
          </div>
        </div>
      </div>

      {/* Marquee track */}
      <div
        className="flex gap-5 w-max"
        style={{
          animation: "marquee 40s linear infinite",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
      >
        {doubled.map((t, i) => (
          <div
            key={i}
            className="w-[340px] sm:w-[380px] shrink-0 bg-white border border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 p-7 flex flex-col justify-between gap-6"
          >
            {/* Quote mark */}
            <div>
              <div className="text-primary text-[40px] font-display-lg leading-none mb-4 opacity-50">"</div>
              <p className="font-body-md text-[14px] sm:text-[15px] text-gray-600 leading-relaxed">
                {t.quote}
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                <span className="font-label-caps text-[11px] text-primary font-bold">
                  {t.initials}
                </span>
              </div>
              <div>
                <div className="font-button text-[13px] text-gray-800 tracking-wide">
                  {t.name}
                </div>
                <div className="font-body-md text-[11px] text-gray-400 mt-0.5">
                  {t.role}
                </div>
              </div>
              {/* Stars */}
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <span key={`card-star-${i}-${s}`} className="text-primary text-[12px]">★</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
      `}</style>
    </section>
  );
}
