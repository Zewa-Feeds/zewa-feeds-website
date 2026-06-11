import Image from "next/image";
import Reveal from "./Reveal";
import { products } from "@/lib/content";

export default function ProductShowcase() {
  return (
    <Reveal
      id="products"
      className="bg-[#f8faf9]"
    >
      {/* Section header */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 pt-20 sm:pt-28 mb-10 sm:mb-14">
        <div className="flex items-end gap-3 mb-3">
          <div className="w-6 h-px bg-primary mt-1" />
          <span className="font-label-caps text-label-caps text-primary tracking-[0.18em]">
            OUR RANGE
          </span>
        </div>
        <h2 className="font-display-lg text-[28px] sm:text-[36px] text-gray-900 mb-3 leading-tight">
          Engineered Formulas.
        </h2>
        <p className="font-body-md text-gray-500 text-sm sm:text-base max-w-md">
          Precision nutrition tailored by species and life stage.
        </p>
      </div>

      {/* Responsive grid — 1 col → 2 col → 3 col */}
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-white border border-gray-100 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/8 hover:border-primary/20 flex flex-col"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden relative w-full">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.badge && (
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 font-label-caps text-label-caps text-on-primary z-10 tracking-widest">
                    {product.badge}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <h3 className="font-headline-sm text-[18px] sm:text-[20px] font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="font-body-md text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                  {product.blurb}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="font-headline-sm text-[20px] text-primary font-semibold">
                    {product.price}
                  </span>
                  <button
                    aria-label={`Add ${product.name} to cart`}
                    className="material-symbols-outlined text-primary p-2 border border-primary/25 rounded-full hover:bg-primary hover:text-on-primary transition-all duration-200 text-[20px] leading-none"
                  >
                    add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all CTA */}
        <div className="flex justify-center mt-10 sm:mt-14">
          <a
            href="/shop"
            className="group flex items-center gap-2 font-button text-button text-on-surface-variant hover:text-primary transition-colors duration-200 border-b border-on-surface-variant/30 hover:border-primary pb-1"
          >
            VIEW ALL PRODUCTS
            <span className="material-symbols-outlined text-[16px] transition-transform duration-200 group-hover:translate-x-1">
              arrow_forward
            </span>
          </a>
        </div>

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-1 mt-10 sm:mt-12" style={{ animation: "scrollBounce 2s ease-in-out infinite" }}>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-gray-300">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className="text-primary/40">
            <path d="M1 1L7 7L13 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50%       { transform: translateY(4px); opacity: 0.5; }
        }
      `}</style>
    </Reveal>
  );
}
