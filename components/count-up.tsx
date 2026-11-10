"use client";

import { useEffect, useRef, useState } from "react";
import { formatCompactMoney, formatMoney } from "@/lib/money";

type Kind = "compact-money" | "money" | "percent" | "number";

export function CountUp({
  value,
  kind = "number",
  duration = 900,
  className = "",
}: {
  value: number;
  kind?: Kind;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(value);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    setDisplay(0);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, duration]);

  const text =
    kind === "compact-money"
      ? formatCompactMoney(display)
      : kind === "money"
        ? formatMoney(display)
        : kind === "percent"
          ? `${display}%`
          : String(display);

  return <span className={`tabular-nums ${className}`}>{text}</span>;
}
