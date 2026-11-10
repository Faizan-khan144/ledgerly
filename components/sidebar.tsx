import Link from "next/link";
import { LogOut } from "lucide-react";
import type { User } from "@/lib/db";
import { logoutAction } from "@/actions/auth";
import { LogoMark } from "./logo";
import { NavLinks } from "./nav-links";

export function Sidebar({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="sidebar hidden lg:flex">
      <Link href="/dashboard" className="flex items-center gap-3 px-2">
        <LogoMark />
        <span>
          <span className="serif block text-[20px] leading-none">Ledgerly</span>
          <span className="mono mt-1 block text-[8px] uppercase tracking-[0.16em] text-[#928f84]">
            Studio finance
          </span>
        </span>
      </Link>

      <NavLinks />

      <div className="mt-auto">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-2.5">
            <span className="avatar bg-[#d8451b] text-white">{initials}</span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#f6f4ed]">{user.name}</p>
              <p className="truncate text-[10px] text-[#a6a297]">{user.company_name}</p>
            </div>
          </div>
          <form action={logoutAction} className="mt-3">
            <button className="btn btn-sm btn-ghost w-full justify-start text-[#a6a297] hover:bg-white/[0.06] hover:text-[#f6f4ed]">
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
        <p className="mono mt-3 px-2 text-[8px] uppercase tracking-[0.12em] text-[#6f6c62]">
          v1.0 · Local-first
        </p>
      </div>
    </aside>
  );
}
