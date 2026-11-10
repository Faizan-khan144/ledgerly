"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function AppMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: (() => void)[] = [];
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt-card]"));
    const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));

    for (const card of cards) {
      const move = (event: PointerEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        card.style.setProperty("--ry", `${(x * 2.4).toFixed(2)}deg`);
        card.style.setProperty("--rx", `${(-y * 2).toFixed(2)}deg`);
      };
      const leave = () => {
        card.style.setProperty("--ry", "0deg");
        card.style.setProperty("--rx", "0deg");
      };

      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
        card.style.removeProperty("--ry");
        card.style.removeProperty("--rx");
      });
    }

    for (const magnet of magnets) {
      const move = (event: PointerEvent) => {
        const rect = magnet.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        magnet.style.setProperty("--tx", `${(x * 3).toFixed(2)}px`);
        magnet.style.setProperty("--ty", `${(y * 2.5).toFixed(2)}px`);
      };
      const leave = () => {
        magnet.style.setProperty("--tx", "0px");
        magnet.style.setProperty("--ty", "0px");
      };

      magnet.addEventListener("pointermove", move);
      magnet.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        magnet.removeEventListener("pointermove", move);
        magnet.removeEventListener("pointerleave", leave);
      });
    }

    return () => {
      for (const cleanup of cleanups) cleanup();
    };
  }, [pathname]);

  return null;
}
