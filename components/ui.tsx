import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { InvoiceStatus } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const labels: Record<InvoiceStatus, string> = {
    paid: "Paid",
    sent: "Sent",
    draft: "Draft",
    overdue: "Overdue",
  };

  return (
    <span className={`pill pill-${status}`}>
      <span className="pill-dot" />
      {labels[status]}
    </span>
  );
}

export function StatCard({
  label,
  value,
  note,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  note: string;
  tone?: "default" | "accent" | "warn";
}) {
  const toneClass =
    tone === "accent" ? "text-[#d8451b]" : tone === "warn" ? "text-[#b3261e]" : "text-[#14140f]";

  return (
    <div className="stat-card" data-tilt-card>
      <div className="relative z-10">
        <p className="stat-label">{label}</p>
        <p className={`stat-value ${toneClass}`}>{value}</p>
        <p className="mt-1.5 text-[11.5px] text-[#6b6960]">{note}</p>
      </div>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="serif text-[24px] leading-tight">{title}</h2>
        {subtitle ? <p className="mt-1 text-[12px] text-[#6b6960]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Money({ cents, className = "" }: { cents: number; className?: string }) {
  return <span className={`tabular-nums ${className}`}>{formatMoney(cents)}</span>;
}

export function ViewAll({ href, label = "View all" }: { href: string; label?: string }) {
  return (
    <a href={href} className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#d8451b]">
      {label}
      <ArrowUpRight size={12} />
    </a>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-5">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2 no-print">{children}</div> : null}
    </div>
  );
}
