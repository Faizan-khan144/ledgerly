"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LogoMark } from "./logo";

const links = [
  { href: "#features", label: "Features" },
  { href: "#product", label: "Product", badge: "Live" },
  { href: "#workflow", label: "Workflow" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function LandingNav({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="landing-nav-shell">
      <nav className="landing-nav" data-scrolled={scrolled}>
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="leading-none">
            <span className="block text-[17px] font-extrabold tracking-[-0.045em]">Ledgerly</span>
            <span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.2em] text-[#928f84]">
              Studio finance
            </span>
          </span>
        </Link>

        <div className="nav-center">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-center-link">
              {link.label}
              {link.badge ? <span className="nav-badge">{link.badge}</span> : null}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login" className="nav-login">
            {loggedIn ? "Open workspace" : "Log in"}
          </Link>
          <Link href={loggedIn ? "/dashboard" : "/signup"} className="nav-cta" data-magnetic>
            {loggedIn ? "Dashboard" : "Get started"}
            <ArrowUpRight size={14} />
          </Link>
          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="mobile-menu">
          <div className="mobile-menu-links">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="mobile-menu-link"
                style={{ animationDelay: `${index * 35}ms` }}
              >
                <span className="flex items-center gap-2">
                  {link.label}
                  {link.badge ? <span className="nav-badge">{link.badge}</span> : null}
                </span>
                <ArrowUpRight size={15} className="text-[#928f84]" />
              </a>
            ))}
          </div>
          <div className="mobile-menu-actions">
            <Link href="/login" onClick={() => setOpen(false)} className="hero-secondary w-full">
              {loggedIn ? "Open workspace" : "Log in"}
            </Link>
            <Link href={loggedIn ? "/dashboard" : "/signup"} onClick={() => setOpen(false)} className="hero-primary w-full">
              {loggedIn ? "Go to dashboard" : "Get started"}
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
