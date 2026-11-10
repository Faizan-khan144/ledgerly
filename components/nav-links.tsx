"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Settings,
  Lightbulb,
  Users,
  type LucideIcon,
} from "lucide-react";

export const navItems: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 space-y-1">
      <p className="mono mb-3 px-3 text-[8.5px] uppercase tracking-[0.14em] text-[#6f6c62]">
        Workspace
      </p>
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} className="nav-link" data-active={active}>
            <item.icon size={16} strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
      <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-3.5">
        <div className="mono flex items-center gap-2 text-[8.5px] uppercase tracking-[0.12em] text-[#d8451b]">
          <Lightbulb size={12} />
          Pro tip
        </div>
        <p className="mt-2 text-[11px] leading-5 text-[#a6a297]">
          Send an invoice, then mark it paid from the detail page to keep your
          revenue view accurate.
        </p>
      </div>
    </nav>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav lg:hidden">
      {navItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} data-active={active}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
