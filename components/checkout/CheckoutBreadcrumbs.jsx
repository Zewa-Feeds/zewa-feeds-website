"use client";

import React from "react";

export default function CheckoutBreadcrumbs({ currentStep = "checkout" }) {
  const steps = [
    { id: "cart", label: "Cart", href: "/cart" },
    { id: "checkout", label: "Shipping & Contact" },
    { id: "payment", label: "Payment Method" },
    { id: "confirmation", label: "Confirmation" },
  ];

  return (
    <nav aria-label="Checkout Progress" className="w-full">
      <ol className="flex items-center gap-1.5 sm:gap-3 text-[11px] sm:text-[12px] font-medium font-[Montserrat] overflow-x-auto no-scrollbar py-1">
        {steps.map((step, idx) => {
          const isCurrent =
            (currentStep === "form" && (step.id === "checkout" || step.id === "payment")) ||
            (currentStep === "paying" && step.id === "payment") ||
            (currentStep === "success" && step.id === "confirmation");

          const isCheckoutActive = step.id === "checkout" && (currentStep === "form" || currentStep === "paying" || currentStep === "success");
          const isPaymentActive = (step.id === "payment" && (currentStep === "paying" || currentStep === "success")) || (step.id === "checkout" && currentStep === "form");
          const isCompleted =
            (currentStep === "paying" && step.id === "checkout") ||
            (currentStep === "success" && step.id !== "confirmation");

          const isActiveStep =
            (currentStep === "form" && step.id === "checkout") ||
            (currentStep === "paying" && step.id === "payment") ||
            (currentStep === "success" && step.id === "confirmation");

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <li className="flex items-center text-white/20 shrink-0" aria-hidden="true">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </li>
              )}
              <li className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <span
                  className={`flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full text-[10px] sm:text-[11px] font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : isActiveStep
                      ? "bg-primary text-[#00382d] shadow-[0_0_12px_rgba(68,229,194,0.35)]"
                      : "bg-white/5 text-white/30 border border-white/10"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </span>
                <span
                  className={`transition-colors duration-200 ${
                    isActiveStep
                      ? "font-semibold text-white tracking-wide"
                      : isCompleted
                      ? "text-primary/90"
                      : "text-white/35"
                  }`}
                >
                  {step.label}
                </span>
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
