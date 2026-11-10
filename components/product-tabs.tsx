"use client";

import { useState } from "react";
import { BarChart3, FileText, Users } from "lucide-react";
import { LogoMark } from "./logo";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "invoice", label: "Invoice", icon: FileText },
  { id: "clients", label: "Clients", icon: Users },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ProductTabs() {
  const [active, setActive] = useState<TabId>("overview");

  return (
    <div>
      <div className="tab-list" role="tablist" aria-label="Product views">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            data-active={active === tab.id}
            className="tab-btn"
            onClick={() => setActive(tab.id)}
          >
            <tab.icon size={13} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="browser-frame mt-5">
        <div className="browser-bar">
          <span className="browser-dot" />
          <span className="browser-dot" />
          <span className="browser-dot" />
          <span className="browser-url">
            ledgerly.app/{active === "overview" ? "dashboard" : active}
          </span>
        </div>

        {active === "overview" ? (
          <div className="tab-panel">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
                  November overview
                </p>
                <p className="mt-1 text-[22px] font-extrabold tracking-[-0.05em]">
                  A calm month so far.
                </p>
              </div>
              <span className="rounded-full bg-[#f9e5db] px-2.5 py-1 text-[9px] font-bold text-[#d8451b]">
                100% healthy
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-4">
              {[
                ["Collected", "$9,555", "+18.4%"],
                ["Outstanding", "$3,150", "2 invoices"],
                ["Overdue", "$1,200", "1 invoice"],
                ["Collection", "72%", "+6 pts"],
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-xl border border-[#e5e1d6] bg-white p-3">
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                    {label}
                  </p>
                  <p className="mt-1.5 text-[18px] font-extrabold tracking-[-0.05em]">{value}</p>
                  <p className="mt-0.5 text-[8px] text-[#d8451b]">{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-2 lg:grid-cols-[1.4fr_0.6fr]">
              <div className="rounded-xl border border-[#e5e1d6] bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold">Revenue rhythm</p>
                  <p className="text-[8px] text-[#928f84]">Last 6 months</p>
                </div>
                <div className="mt-5 flex h-28 items-end gap-2">
                  {[32, 48, 38, 61, 55, 74, 68, 88, 79, 96].map((height, index) => (
                    <div
                      key={index}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                    >
                      <div
                        className="chart-bar w-full rounded-t-[4px]"
                        style={{
                          height: `${height}%`,
                          maxHeight: "calc(100% - 18px)",
                          background:
                            index > 7
                              ? "linear-gradient(180deg,#d8451b,#d8451b)"
                              : "#f0ded3",
                        }}
                      />
                      <span className="text-[6.5px] text-[#a5a196]">
                        {index % 3 === 0 ? ["Aug", "Sep", "Oct", "Nov"][index / 3] : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-[#e5e1d6] bg-white p-4">
                <p className="text-[10px] font-bold">Activity</p>
                <div className="mt-3 space-y-3">
                  {[
                    ["Payment received", "Northwind · $3,150"],
                    ["Invoice sent", "Aperture · $3,150"],
                    ["Client added", "Paper Kite"],
                  ].map(([title, note], index) => (
                    <div key={title} className="flex gap-2">
                      <span
                        className={`mt-1 h-1.5 w-1.5 flex-none rounded-full ${
                          index === 0 ? "bg-[#d8451b]" : "bg-[#cfcabe]"
                        }`}
                      />
                      <div>
                        <p className="text-[8px] font-semibold">{title}</p>
                        <p className="text-[7px] text-[#928f84]">{note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {active === "invoice" ? (
          <div className="tab-panel">
            <div className="mx-auto max-w-2xl rounded-xl border border-[#dad6ca] bg-white p-5">
              <div className="flex items-start justify-between border-b border-[#e5e1d6] pb-4">
                <div className="flex items-center gap-2.5">
                  <LogoMark className="!h-9 !w-9 !rounded-lg" />
                  <div>
                    <p className="text-[11px] font-bold">Faizan Studio</p>
                    <p className="text-[8px] text-[#928f84]">Karachi, Pakistan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[7px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
                    Invoice
                  </p>
                  <p className="text-[12px] font-extrabold">INV-2026-014</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-[9px]">
                <div>
                  <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                    Billed to
                  </p>
                  <p className="mt-1 font-bold">Aperture Labs</p>
                  <p className="mt-0.5 text-[#6b6960]">Daniel Reed · London</p>
                </div>
                <div className="text-right">
                  <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                    Amount due
                  </p>
                  <p className="mt-1 text-[17px] font-extrabold tracking-[-0.04em]">$3,150.00</p>
                  <p className="mt-0.5 text-[#6b6960]">Due Nov 16, 2026</p>
                </div>
              </div>
              <div className="mt-4 border-t border-[#e5e1d6] pt-2">
                {[
                  ["Design retainer — Q4", "1", "$3,000.00"],
                  ["Extra review session", "1", "$150.00"],
                ].map(([description, qty, amount]) => (
                  <div
                    key={description}
                    className="flex items-center justify-between border-b border-[#f2efe7] py-2 text-[8.5px] last:border-0"
                  >
                    <span className="flex-1 text-[#55534a]">{description}</span>
                    <span className="w-8 text-center text-[#928f84]">{qty}</span>
                    <span className="w-16 text-right font-semibold">{amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-[#f6f4ed] px-3 py-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                  Total due
                </span>
                <span className="text-[14px] font-extrabold tracking-[-0.04em]">$3,150.00</span>
              </div>
              <p className="mt-4 text-center text-[7.5px] text-[#928f84]">
                Thank you for working with Faizan Studio.
              </p>
            </div>
          </div>
        ) : null}

        {active === "clients" ? (
          <div className="tab-panel">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
                  People, not rows
                </p>
                <p className="mt-1 text-[21px] font-extrabold tracking-[-0.05em]">
                  Six relationships.
                </p>
              </div>
              <span className="rounded-lg bg-[#14140f] px-2.5 py-1.5 text-[8.5px] font-bold text-white">
                + Add client
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                ["Northwind Trading", "Ayesha Siddiqui", "$3,150", "2 invoices"],
                ["Aperture Labs", "Daniel Reed", "$3,150", "2 invoices"],
                ["Cinder Studio", "Sara Malik", "$2,100", "2 invoices"],
                ["Paper Kite", "Omar Farooq", "$2,104", "1 invoice"],
              ].map(([company, contact, value, count]) => (
                <div
                  key={company}
                  className="flex items-center justify-between rounded-xl border border-[#e5e1d6] bg-white p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ece7dc] text-[8px] font-bold text-[#55534a]">
                      {company.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-[9.5px] font-bold">{company}</p>
                      <p className="text-[7.5px] text-[#928f84]">
                        {contact} · {count}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] font-extrabold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
