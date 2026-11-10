"use client";

import { useEffect } from "react";

export function LandingMotion() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    document.querySelectorAll("[data-reveal], [data-stagger]").forEach((element) => {
      observer.observe(element);
    });

    const hero = document.querySelector<HTMLElement>(".hero");
    const stage = document.querySelector<HTMLElement>(".hero-stage");
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const tilts = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt-card]"));

    const onPointer = (event: PointerEvent) => {
      if (hero) {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        hero.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }

      if (stage) {
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
        stage.style.setProperty("--tiltY", `${Math.max(-4, Math.min(4, x * 6))}deg`);
        stage.style.setProperty("--tiltX", `${Math.max(-3, Math.min(3, -y * 5))}deg`);
      }
    };

    const resetTilt = () => {
      stage?.style.setProperty("--tiltX", "0deg");
      stage?.style.setProperty("--tiltY", "0deg");
    };

    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      root.style.setProperty("--scroll-progress", String(progress));

      for (const element of parallax) {
        const speed = Number(element.dataset.parallax ?? 0);
        const rect = element.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        element.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    type Binding = {
      el: HTMLElement;
      move: (event: PointerEvent) => void;
      leave: () => void;
    };

    const magnetBindings: Binding[] = [];
    const tiltBindings: Binding[] = [];

    if (!reduced) {
      for (const el of magnets) {
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          el.style.setProperty("--tx", `${(x * 5).toFixed(2)}px`);
          el.style.setProperty("--ty", `${(y * 4).toFixed(2)}px`);
        };
        const leave = () => {
          el.style.setProperty("--tx", "0px");
          el.style.setProperty("--ty", "0px");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        magnetBindings.push({ el, move, leave });
      }

      for (const el of tilts) {
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
          const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
          el.style.setProperty("--ry", `${(x * 4).toFixed(2)}deg`);
          el.style.setProperty("--rx", `${(-y * 3.5).toFixed(2)}deg`);
          el.style.setProperty("--sx", `${event.clientX - rect.left}px`);
          el.style.setProperty("--sy", `${event.clientY - rect.top}px`);
        };
        const leave = () => {
          el.style.setProperty("--ry", "0deg");
          el.style.setProperty("--rx", "0deg");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        tiltBindings.push({ el, move, leave });
      }

      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", resetTilt);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", resetTilt);
      for (const binding of [...magnetBindings, ...tiltBindings]) {
        binding.el.removeEventListener("pointermove", binding.move);
        binding.el.removeEventListener("pointerleave", binding.leave);
      }
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden>
      <span />
    </div>
  );
}
