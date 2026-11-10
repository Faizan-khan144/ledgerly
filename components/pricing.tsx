"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, CircleDot } from "lucide-react";

const plans = [
  {
    name: "Solo",
    tagline: "For the first few invoices.",
    monthly: 0,
    yearly: 0,
    features: ["3 clients", "10 invoices", "Print-ready documents", "Revenue overview"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Studio",
    tagline: "For a working studio rhythm.",
    monthly: 18,
    yearly: 14,
    features: [
      "Unlimited clients",
      "Unlimited invoices",
      "Full revenue + activity views",
      "CSV export",
      "Print / PDF invoices",
    ],
    cta: "Start with Studio",
    featured: true,
  },
  {
    name: "Studio Plus",
    tagline: "For a growing practice.",
    monthly: 39,
    yearly: 31,
    features: [
      "Everything in Studio",
      "Multiple workspaces",
      "Custom studio branding",
      "Priority support",
      "Early access features",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      <div className="mt-7 flex justify-center">
        <div className="billing-toggle">
          <button type="button" data-active={!annual} onClick={() => setAnnual(false)}>
            Monthly
          </button>
          <button type="button" data-active={annual} onClick={() => setAnnual(true)}>
            Yearly
            <span>save 20%</span>
          </button>
        </div>
      </div>

      <div className="pricing-grid" data-stagger>
        {plans.map((plan) => {
          const price = annual ? plan.yearly : plan.monthly;
          return (
            <article
              key={plan.name}
              className={`pricing-card ${plan.featured ? "pricing-featured" : ""}`}
              data-tilt-card
              data-spotlight
            >
              {plan.featured ? (
                <span className="pricing-badge">
                  <CircleDot size={11} />
                  Most popular
                </span>
              ) : null}
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b6960]">
                {plan.name}
              </p>
              <p className="mt-1.5 text-[11.5px] text-[#6b6960]">{plan.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-[42px] font-extrabold leading-none tracking-[-0.06em]">
                  ${price}
                </span>
                <span className="mb-1 text-[11px] text-[#928f84]">
                  {price === 0 ? "forever" : "/ month"}
                </span>
              </div>
              <p className="mt-1 text-[9.5px] text-[#928f84]">
                {price === 0 ? "No card required" : annual ? "Billed yearly" : "Billed monthly"}
              </p>

              <div className="my-5 h-px bg-[#e5e1d6]" />

              <div className="space-y-2.5">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-[11px] text-[#55534a]">
                    <span className="mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-full bg-[#f9e5db] text-[#d8451b]">
                      <Check size={9} />
                    </span>
                    {feature}
                  </div>
                ))}
              </div>

              <Link
                href="/signup"
                className={`mt-6 flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl text-[11.5px] font-bold transition ${
                  plan.featured
                    ? "bg-[#14140f] text-white hover:bg-[#2b2a24]"
                    : "border border-[#dad6ca] bg-white text-[#3a3931] hover:border-[#c6c1b3]"
                }`}
              >
                {plan.cta}
                <ArrowRight size={13} />
              </Link>
            </article>
          );
        })}
      </div>
      <p className="mt-5 text-center text-[10px] text-[#928f84]">
        Pricing is illustrative for this portfolio build. Every feature is available in the
        live demo.
      </p>
    </div>
  );
}
