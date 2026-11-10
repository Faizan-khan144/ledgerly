"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { CommandPalette } from "./command-palette";

const sectionLabels: Record<string, string> = {
  dashboard: "Overview",
  invoices: "Invoices",
  clients: "Clients",
  settings: "Settings",
};

export function AppTopbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const section = segments[0] ?? "dashboard";
  const label = sectionLabels[section] ?? "Workspace";
  const detail = segments.length > 1;

  return (
    <header className="app-topbar no-print">
      <div className="app-crumbs">
        <span className="app-crumb">Workspace</span>
        <span className="app-crumb-sep">/</span>
        <Link href={`/${section}`} className="app-crumb app-crumb-active">
          {label}
        </Link>
        {detail ? (
          <>
            <span className="app-crumb-sep">/</span>
            <span className="app-crumb">Detail</span>
          </>
        ) : null}
      </div>

      <div className="app-topbar-actions">
        <CommandPalette />
        <Link href="/invoices/new" className="btn btn-sm btn-primary app-topbar-new" data-magnetic>
          <Plus size={13} />
          <span>New invoice</span>
        </Link>
      </div>
    </header>
  );
}
