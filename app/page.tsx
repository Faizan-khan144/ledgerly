import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Clock3,
  Database,
  FileText,
  Layers,
  LayoutDashboard,
  LockKeyhole,
  Printer,
  ShieldCheck,
  SquareTerminal,
  Users,
  Zap,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { LandingMotion } from "@/components/landing-motion";
import { LogoMark } from "@/components/logo";
import { LandingNav } from "@/components/landing-nav";
import { StatCounter } from "@/components/stat-counter";
import { ProductTabs } from "@/components/product-tabs";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";

const features = [
  {
    icon: FileText,
    title: "Invoices in minutes",
    copy: "A focused composer with line items, tax, due dates, and a live total. No spreadsheet gymnastics.",
  },
  {
    icon: Users,
    title: "Clients with context",
    copy: "Every contact, invoice, and collected amount lives together so the next conversation starts informed.",
  },
  {
    icon: BarChart3,
    title: "Revenue you can read",
    copy: "A six-month paid-revenue view, outstanding balance, and collection rate at a glance.",
  },
  {
    icon: Clock3,
    title: "Status that means something",
    copy: "Draft, sent, paid, and overdue are first-class states — with an activity trail behind each move.",
  },
  {
    icon: Printer,
    title: "Print-ready by default",
    copy: "A clean invoice document that looks considered on screen and on paper. Save it as a PDF instantly.",
  },
  {
    icon: ShieldCheck,
    title: "Safe by design",
    copy: "Salted password hashes, signed HTTP-only sessions, server-side validation, and a local SQLite core.",
  },
];

const tech = [
  "Next.js 15",
  "TypeScript",
  "Server Actions",
  "SQLite",
  "Tailwind CSS 4",
  "Node 24",
  "Print-ready",
  "Responsive",
];

const comparison = [
  {
    label: "The default",
    title: "Spreadsheet",
    rows: [
      "Free, but you build every template",
      "Manual formatting and totals",
      "Client history scattered across tabs",
      "Print layout breaks on a whim",
      "Best for one-off admin",
    ],
    featured: false,
  },
  {
    label: "The calm middle",
    title: "Ledgerly",
    rows: [
      "Live in under two minutes",
      "Invoices composed for you",
      "One connected client history",
      "Designed for screen and paper",
      "Built for studios that bill monthly",
    ],
    featured: true,
  },
  {
    label: "The heavy option",
    title: "Enterprise suite",
    rows: [
      "Weeks of onboarding",
      "Powerful, but overbuilt for a studio",
      "Deep reporting after configuration",
      "Custom print work as a project",
      "Best for large finance teams",
    ],
    featured: false,
  },
];

const infrastructure = [
  {
    icon: Layers,
    title: "Server-first rendering",
    copy: "Next.js App Router with server components, streaming, and no wasted client JavaScript.",
  },
  {
    icon: Database,
    title: "SQLite core",
    copy: "A small relational schema, cent-accurate totals, and real queries — not a mock array.",
  },
  {
    icon: LockKeyhole,
    title: "Auth done properly",
    copy: "Salted scrypt hashes, signed HTTP-only sessions, and validation on every mutation.",
  },
  {
    icon: Zap,
    title: "Server actions",
    copy: "Typed mutations that keep credentials and business rules off the browser.",
  },
];

function Shape({ className, parallax = 0 }: { className: string; parallax?: number }) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      aria-hidden
      data-parallax={parallax}
      className={`pointer-events-none absolute hidden text-[#d8451b]/20 lg:block ${className}`}
    >
      <g stroke="currentColor" strokeWidth="0.8">
        <circle cx="110" cy="110" r="88" />
        <ellipse cx="110" cy="110" rx="42" ry="88" />
        <ellipse cx="110" cy="110" rx="88" ry="42" />
        <ellipse cx="110" cy="110" rx="88" ry="42" transform="rotate(45 110 110)" />
        <ellipse cx="110" cy="110" rx="88" ry="42" transform="rotate(-45 110 110)" />
        <ellipse cx="110" cy="110" rx="24" ry="88" />
        <line x1="22" y1="110" x2="198" y2="110" />
        <line x1="110" y1="22" x2="110" y2="198" />
      </g>
    </svg>
  );
}

export default async function LandingPage() {
  const user = await getCurrentUser();

  return (
    <main className="landing">
      <LandingMotion />
      <LandingNav loggedIn={Boolean(user)} />

      <section className="hero">
        <div className="hero-aurora" aria-hidden>
          <span className="aurora-blob aurora-one" />
          <span className="aurora-blob aurora-two" />
          <span className="aurora-blob aurora-three" />
        </div>
        <div className="orbital orbital-spin left-[-90px] top-[120px] hidden h-[260px] w-[260px] lg:block" />
        <div className="orbital orbital-spin-reverse right-[-70px] top-[180px] hidden h-[210px] w-[210px] lg:block" />
        <div className="landing-wrap">
          <div className="hero-badge">
            <span className="hero-badge-dot">
              <SquareTerminal size={10} />
            </span>
            Full-stack studio finance · zero setup
          </div>

          <h1 className="hero-title">
            Invoices that feel
            <br />
            as <span className="gradient-text">considered as the work.</span>
          </h1>

          <p className="hero-copy">
            Ledgerly is a quiet, complete workspace for independent studios — clients,
            invoices, payments, and a live revenue view without the enterprise clutter.
          </p>

          <div className="hero-actions">
            <Link href={user ? "/dashboard" : "/signup"} className="hero-primary" data-magnetic>
              {user ? "Open your workspace" : "Start your workspace"}
              <ArrowRight size={16} />
            </Link>
            <a href="#product" className="hero-secondary" data-magnetic>
              See the product
              <ArrowUpRight size={15} />
            </a>
          </div>

          <p className="hero-note">
            No credit card. No setup wizard. Start with a seeded studio workspace.
          </p>

          <div className="hero-stage" id="product">
            <Shape className="-left-16 top-10 h-48 w-48 opacity-70" parallax={0.05} />
            <Shape className="-right-14 top-24 h-40 w-40 opacity-60" parallax={-0.04} />
            <div className="hero-glow" />

            <div className="floating-card right-[1%] bottom-[18%] hidden xl:block">
              <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#9a5b00]">
                <Clock3 size={9} />
                Gentle nudge
              </p>
              <p className="mt-1.5 text-[12px] font-bold">Reminder sent</p>
              <p className="mt-0.5 text-[9px] text-[#928f84]">Aperture Labs · 2m ago</p>
            </div>

            <div className="floating-card left-[1%] top-[14%] hidden xl:block" style={{ animationDelay: "-3.2s" }}>
              <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#1f6f4f]">
                <Check size={9} />
                Payment received
              </p>
              <p className="mt-1.5 text-[12px] font-bold">$3,150.00</p>
              <p className="mt-0.5 text-[9px] text-[#928f84]">Northwind · just now</p>
            </div>

            <div className="browser-frame text-left">
              <div className="browser-bar">
                <span className="browser-dot" />
                <span className="browser-dot" />
                <span className="browser-dot" />
                <span className="browser-url">ledgerly.app/dashboard</span>
              </div>

              <div className="product-mini">
                <aside className="product-mini-side">
                  <div className="flex items-center gap-2 px-2">
                    <LogoMark className="!h-7 !w-7 !rounded-md" />
                    <span className="text-[11px] font-extrabold tracking-[-0.03em]">Ledgerly</span>
                  </div>
                  <div className="mt-5 space-y-0.5">
                    {[
                      { icon: LayoutDashboard, label: "Overview", active: true },
                      { icon: FileText, label: "Invoices" },
                      { icon: Users, label: "Clients" },
                      { icon: BarChart3, label: "Settings" },
                    ].map((item) => (
                      <div key={item.label} className="mini-nav" data-active={item.active}>
                        <item.icon size={11} />
                        {item.label}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl border border-[#e5e1d6] bg-white p-2.5">
                    <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                      This month
                    </p>
                    <p className="mt-1 text-[16px] font-extrabold tracking-[-0.05em]">$9,555</p>
                    <p className="mt-0.5 text-[8px] text-[#d8451b]">+18% vs last month</p>
                  </div>
                </aside>

                <div className="product-mini-main">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
                        Tuesday, November 2
                      </p>
                      <p className="mt-1 text-[15px] font-extrabold tracking-[-0.04em]">
                        Good morning, Faizan.
                      </p>
                    </div>
                    <span className="rounded-lg bg-[#14140f] px-2.5 py-1.5 text-[8.5px] font-bold text-white">
                      + New invoice
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      ["Collected", "$9.5k", "10 paid"],
                      ["Outstanding", "$3.1k", "2 sent"],
                      ["Overdue", "$1.2k", "Needs a nudge"],
                    ].map(([label, value, note]) => (
                      <div key={label} className="mini-stat">
                        <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                          {label}
                        </p>
                        <p className="mt-1 text-[14px] font-extrabold tracking-[-0.05em]">{value}</p>
                        <p className="mt-0.5 text-[7px] text-[#928f84]">{note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 grid grid-cols-[1.35fr_0.65fr] gap-2">
                    <div className="mini-stat">
                      <div className="flex items-center justify-between">
                        <p className="text-[8px] font-bold text-[#3a3931]">Revenue rhythm</p>
                        <p className="text-[7px] text-[#928f84]">6 months</p>
                      </div>
                      <div className="mt-3 flex h-[66px] items-end gap-1.5">
                        {[42, 58, 36, 72, 64, 88, 76, 96].map((height, index) => (
                          <div
                            key={index}
                            className="chart-bar flex-1 rounded-t-[3px]"
                            style={{
                              height: `${height}%`,
                              background:
                                index === 7
                                  ? "linear-gradient(180deg,#d8451b,#d8451b)"
                                  : "#f0ded3",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="mini-stat">
                      <p className="text-[8px] font-bold text-[#3a3931]">Top client</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-[#ece7dc] text-[7px] font-bold text-[#55534a]">
                          NT
                        </span>
                        <div>
                          <p className="text-[8px] font-bold">Northwind</p>
                          <p className="text-[7px] text-[#928f84]">$3,150.00</p>
                        </div>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-[#e5e1d6]">
                        <div className="h-full w-[78%] rounded-full bg-[#d8451b]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-xl border border-[#e5e1d6]">
                    <div className="flex items-center justify-between border-b border-[#e5e1d6] px-2.5 py-2">
                      <p className="text-[8px] font-bold text-[#3a3931]">Recent invoices</p>
                      <p className="text-[7px] font-semibold text-[#d8451b]">View all</p>
                    </div>
                    {[
                      ["INV-2026-014", "Aperture Labs", "Paid", "$3,150.00"],
                      ["INV-2026-013", "Northwind", "Draft", "$2,012.50"],
                      ["INV-2026-012", "Paper Kite", "Sent", "$2,104.00"],
                    ].map(([number, client, status, amount]) => (
                      <div
                        key={number}
                        className="flex items-center justify-between border-b border-[#f2efe7] px-2.5 py-1.5 last:border-0"
                      >
                        <p className="w-[74px] text-[7.5px] font-semibold text-[#d8451b]">{number}</p>
                        <p className="flex-1 text-[7.5px] text-[#55534a]">{client}</p>
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[6.5px] font-bold uppercase tracking-[0.04em]"
                          style={{
                            background:
                              status === "Paid"
                                ? "#f9e5db"
                                : status === "Sent"
                                  ? "#eef3ef"
                                  : "#efebe2",
                            color:
                              status === "Paid"
                                ? "#d8451b"
                                : status === "Sent"
                                  ? "#b93a13"
                                  : "#6b6960",
                          }}
                        >
                          {status}
                        </span>
                        <p className="ml-3 w-[42px] text-right text-[7.5px] font-bold">{amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tech-strip" id="stack">
        <div className="tech-track">
          {[...tech, ...tech].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <section className="landing-section !pb-8 !pt-10">
        <div className="landing-wrap">
          <div className="stats-band" data-reveal>
            <div className="stat-cell">
              <p className="stat-number gradient-text">
                <StatCounter value={14} />
              </p>
              <p className="stat-caption">Seeded invoices</p>
            </div>
            <div className="stat-cell">
              <p className="stat-number gradient-text">
                <StatCounter value={6} />
              </p>
              <p className="stat-caption">Studio clients</p>
            </div>
            <div className="stat-cell">
              <p className="stat-number gradient-text">
                <StatCounter value={4} />
              </p>
              <p className="stat-caption">Invoice statuses</p>
            </div>
            <div className="stat-cell">
              <p className="stat-number gradient-text">
                <StatCounter value={100} suffix="%" />
              </p>
              <p className="stat-caption">Light by design</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section features-band" id="features">
        <div className="landing-wrap">
          <p className="section-kicker">A quieter back office</p>
          <h2 className="section-title">Everything you need. Nothing you have to configure.</h2>
          <p className="section-copy">
            The business side of a studio, reduced to the few things that actually matter —
            then finished with care.
          </p>

          <div className="feature-grid" data-reveal data-stagger>
            {features.map((feature, index) => (
              <article key={feature.title} className="feature-card" data-tilt-card data-spotlight>
                <span className="feature-icon">
                  <feature.icon size={16} strokeWidth={1.9} />
                </span>
                <h3 className="mt-4 text-[14px] font-bold tracking-[-0.02em]">{feature.title}</h3>
                <p className="mt-2 max-w-[30rem] text-[11.5px] leading-6 text-[#6b6960]">
                  {feature.copy}
                </p>
                {index < 2 ? (
                  <div className="feature-mini" aria-hidden>
                    <div className="feature-mini-bar" />
                    <div className="feature-mini-bar" />
                    <div className="feature-mini-bar" />
                    <p className="feature-mini-amount">
                      {index === 0 ? "$3,150.00" : "$9,555.00"}
                    </p>
                    <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#928f84]">
                      {index === 0 ? "Paid invoice" : "Collected"}
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section !pt-0">
        <div className="landing-wrap">
          <div data-reveal>
            <p className="section-kicker">Three views</p>
            <h2 className="section-title">Look closer. It stays calm at every depth.</h2>
            <p className="section-copy">
              The dashboard, the invoice document, and the client list share one visual
              language — so the product feels like a single, considered object.
            </p>
          </div>
          <div className="mt-8" data-reveal>
            <ProductTabs />
          </div>
        </div>
      </section>

      <section className="landing-section !pt-0">
        <div className="landing-wrap space-y-24" id="ledger">
          <div className="split" data-reveal>
            <div>
              <p className="section-kicker !text-left">The ledger</p>
              <h2 className="split-title">A view of the studio that reads like a story.</h2>
              <p className="mt-3 text-[13px] leading-7 text-[#6b6960]">
                Collected, outstanding, overdue, and drafts are separated without judgment.
                You always know what is moving and what needs a nudge.
              </p>
              {[
                "Six-month revenue rhythm with real paid invoices",
                "Collection rate and lifetime client value",
                "A small activity trail so nothing feels mysterious",
              ].map((item) => (
                <div key={item} className="check-row">
                  <span className="check-dot">
                    <Check size={10} />
                  </span>
                  {item}
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#928f84]">
                    November overview
                  </p>
                  <p className="mt-1 text-[20px] font-extrabold tracking-[-0.05em]">$9,555.00</p>
                  <p className="mt-0.5 text-[10px] text-[#d8451b]">+18.4% collected this month</p>
                </div>
                <span className="rounded-full bg-[#f9e5db] px-2.5 py-1 text-[9px] font-bold text-[#d8451b]">
                  Live
                </span>
              </div>
              <div className="mt-6 flex h-28 items-end gap-2">
                {[34, 48, 42, 64, 58, 76, 70, 92, 84, 100].map((height, index) => (
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
                          index > 7 ? "linear-gradient(180deg,#d8451b,#d8451b)" : "#f0ded3",
                      }}
                    />
                    <span className="text-[7px] font-semibold text-[#a5a196]">
                      {index % 3 === 0 ? ["Aug", "Sep", "Oct", "Nov"][index / 3] : ""}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  ["10", "Paid"],
                  ["2", "Sent"],
                  ["1", "Draft"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-xl bg-[#f6f4ed] p-3 text-center">
                    <p className="text-[18px] font-extrabold tracking-[-0.04em]">{value}</p>
                    <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="split reverse" data-reveal>
            <div className="panel order-2 md:order-1">
              <div className="flex items-start justify-between border-b border-[#e5e1d6] pb-4">
                <div className="flex items-center gap-2.5">
                  <LogoMark className="!h-9 !w-9 !rounded-lg" />
                  <div>
                    <p className="text-[12px] font-bold tracking-[-0.02em]">Faizan Studio</p>
                    <p className="text-[9px] text-[#928f84]">Invoice INV-2026-014</p>
                  </div>
                </div>
                <span className="pill pill-paid">
                  <span className="pill-dot" />
                  Paid
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-[10px]">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                    Billed to
                  </p>
                  <p className="mt-1 font-bold">Aperture Labs</p>
                  <p className="mt-0.5 text-[#6b6960]">Daniel Reed · London</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                    Total
                  </p>
                  <p className="mt-1 text-[19px] font-extrabold tracking-[-0.05em]">$3,150.00</p>
                  <p className="mt-0.5 text-[#6b6960]">Due Nov 16, 2026</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-[#e5e1d6] pt-3">
                {[
                  ["Design retainer — Q4", "1 × $3,000.00"],
                  ["Extra review session", "1 × $150.00"],
                ].map(([label, amount]) => (
                  <div key={label} className="flex items-center justify-between text-[10px]">
                    <span className="text-[#55534a]">{label}</span>
                    <span className="font-semibold">{amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f6f4ed] px-3 py-2.5">
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#928f84]">
                  Total paid
                </span>
                <span className="text-[15px] font-extrabold tracking-[-0.04em]">$3,150.00</span>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <p className="section-kicker !text-left">The document</p>
              <h2 className="split-title">Send something you are proud to put your name on.</h2>
              <p className="mt-3 text-[13px] leading-7 text-[#6b6960]">
                A real invoice document, not a screenshot of a form. Studio identity, client
                details, line items, tax, notes, and payment terms — then print or save as PDF.
              </p>
              {[
                "Studio details pulled from settings",
                "Tax calculated on every subtotal",
                "A dedicated print layout with zero clutter",
              ].map((item) => (
                <div key={item} className="check-row">
                  <span className="check-dot">
                    <Check size={10} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section workflow-band border-y border-[#ded9cd]" id="workflow">
        <div className="landing-wrap">
          <p className="section-kicker">The rhythm</p>
          <h2 className="section-title">Three steps. Then back to the work.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Add the client",
                copy: "A name, a company, an email if you have it. That is enough to start.",
              },
              {
                title: "Build the invoice",
                copy: "Pick the work, set the dates, let tax and totals take care of themselves.",
              },
              {
                title: "Send and settle",
                copy: "Move it from draft to sent to paid, with a quiet activity trail behind it.",
              },
            ].map((step, index) => (
              <article key={step.title} className="step-card" data-reveal data-tilt-card data-spotlight>
                <span className="step-number">0{index + 1}</span>
                <h3 className="mt-4 text-[15px] font-bold tracking-[-0.03em]">{step.title}</h3>
                <p className="mt-2 text-[11.5px] leading-6 text-[#6b6960]">{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section principles-band">
        <div className="landing-wrap">
          <div data-reveal>
            <p className="section-kicker">The design brief</p>
            <h2 className="section-title">Quiet software. Loud attention to detail.</h2>
            <p className="section-copy">
              Ledgerly is built around three principles that show up in every screen, state,
              and printed invoice.
            </p>
          </div>

          <div className="principles">
            {[
              {
                index: "01",
                title: "Calm by default",
                copy: "A warm white canvas, one accent, and generous space. Nothing shouts for attention unless it truly needs you.",
              },
              {
                index: "02",
                title: "Detail is the product",
                copy: "Cents never drift. Statuses tell the truth. Print layouts are treated as carefully as the dashboard.",
              },
              {
                index: "03",
                title: "Light, fast, legible",
                copy: "A light theme with real hierarchy, system-level performance, and no decorative noise between you and the work.",
              },
            ].map((item) => (
              <article key={item.index} className="principle-card" data-reveal data-tilt-card data-spotlight>
                <p className="principle-index">{item.index}</p>
                <h3 className="principle-title">{item.title}</h3>
                <p className="principle-copy">{item.copy}</p>
              </article>
            ))}
          </div>

          <div className="builder-note mt-12" data-reveal>
            <div className="builder-quote">
              “I wanted the business side of a creative studio to feel as considered as the
              work itself — not another dashboard to fight.”
            </div>
            <div className="builder-signature">
              <span className="builder-avatar">FK</span>
              <div>
                <p className="text-[11.5px] font-bold">Faizan Khan</p>
                <p className="text-[10px] text-[#928f84]">Full-stack builder · Karachi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section compare-band border-y border-[#ded9cd]" id="compare">
        <div className="landing-wrap">
          <div data-reveal>
            <p className="section-kicker">The honest comparison</p>
            <h2 className="section-title">Most tools do more. Ledgerly does enough.</h2>
            <p className="section-copy">
              You do not need a finance department to send a beautiful invoice. You need
              a small, well-made system that gets out of the way.
            </p>
          </div>

          <div className="compare-grid" data-reveal data-stagger>
            {comparison.map((option) => (
              <article
                key={option.title}
                className={`compare-card${option.featured ? " featured" : ""}`}
                data-tilt-card
                data-spotlight
              >
                <p className="compare-label">{option.label}</p>
                <h3 className="compare-title">{option.title}</h3>
                <div className="mt-4">
                  {option.rows.map((row) => (
                    <div key={row} className="compare-row">
                      <span className="compare-dot">
                        {option.featured ? <Check size={8} /> : "—"}
                      </span>
                      <span>{row}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section infra-band" id="under-the-hood">
        <div className="landing-wrap">
          <div className="grid items-end gap-8 lg:grid-cols-[0.95fr_1.05fr]" data-reveal>
            <div>
              <p className="section-kicker">Under the hood</p>
              <h2 className="section-title !mx-0 !max-w-none !text-left">
                A small system, built properly.
              </h2>
            </div>
            <p className="max-w-xl text-[12.5px] leading-7 text-[#6b6960] lg:pb-1">
              The interface is quiet on purpose. Behind it is a real full-stack build:
              relational data, server-side mutations, sessions, validation, and a
              print pipeline that stays faithful to the screen.
            </p>
          </div>

          <div className="infra-grid" data-reveal data-stagger>
            {infrastructure.map((item) => (
              <article key={item.title} className="infra-card" data-tilt-card data-spotlight>
                <span className="infra-icon">
                  <item.icon size={15} strokeWidth={1.9} />
                </span>
                <h3 className="infra-title">{item.title}</h3>
                <p className="infra-copy">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section border-y border-[#ded9cd] bg-white/45" id="pricing">
        <div className="landing-wrap">
          <div data-reveal>
            <p className="section-kicker">Simple plans</p>
            <h2 className="section-title">Start small. Grow when the studio does.</h2>
            <p className="section-copy">
              No setup fees, no surprise line items. Pick a rhythm that matches the work.
            </p>
          </div>
          <div data-reveal>
            <Pricing />
          </div>
        </div>
      </section>

      <section className="landing-section" id="faq">
        <div className="landing-wrap">
          <div data-reveal>
            <p className="section-kicker">Questions</p>
            <h2 className="section-title">The details, answered.</h2>
            <p className="section-copy">
              A few honest notes about the build, the data, and what is deliberately missing.
            </p>
          </div>
          <div data-reveal>
            <Faq />
          </div>
        </div>
      </section>

      <section className="landing-section !pt-0">
        <div className="landing-wrap">
          <div className="cta-band" data-reveal>
            <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ffd7c9]">
              Your studio, in order
            </p>
            <h2 className="relative z-10 mx-auto mt-4 max-w-2xl text-[clamp(32px,4.5vw,50px)] font-extrabold leading-[1.04] tracking-[-0.05em]">
              Spend less time chasing invoices.
            </h2>
            <p className="relative z-10 mx-auto mt-4 max-w-lg text-[13px] leading-7 text-white/70">
              Create a workspace, add a client, and send the first invoice in a few quiet
              minutes. No setup wizard, no card required.
            </p>
            <div className="relative z-10 mt-7 flex flex-wrap justify-center gap-2">
              <Link
                href={user ? "/dashboard" : "/signup"}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-5 text-[12.5px] font-bold text-[#14140f]"
              >
                {user ? "Open your workspace" : "Create your workspace"}
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 px-5 text-[12.5px] font-semibold text-white"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-wrap flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <LogoMark className="!h-8 !w-8 !rounded-lg" />
            <div>
              <p className="text-[13px] font-extrabold tracking-[-0.03em]">Ledgerly</p>
              <p className="text-[9px] text-[#928f84]">Studio finance, without the noise.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-[10.5px] text-[#6b6960]">
            <a href="#features" className="hover:text-[#14140f]">
              Features
            </a>
            <a href="#product" className="hover:text-[#14140f]">
              Product
            </a>
            <Link href="/login" className="hover:text-[#14140f]">
              Sign in
            </Link>
            <a
              href="https://github.com/Faizan-khan144"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#14140f]"
            >
              GitHub
            </a>
          </div>
          <p className="text-[9.5px] text-[#928f84]">
            Built by Faizan Khan · Next.js + SQLite
          </p>
        </div>
      </footer>
    </main>
  );
}
