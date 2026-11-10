"use client";

import { usePathname } from "next/navigation";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <span key={`bar-${pathname}`} className="route-bar" aria-hidden />
      <div key={pathname} className="route-fade">
        {children}
      </div>
    </>
  );
}
