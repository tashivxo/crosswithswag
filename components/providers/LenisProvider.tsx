"use client";

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactNode, useEffect } from "react";
import { motion } from "@/lib/motion.config";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    ScrollTrigger.config({ ignoreMobileResize: true });

    if (reduceMotion || coarsePointer) {
      requestAnimationFrame(() => ScrollTrigger.refresh());
      return;
    }

    const lenis = new Lenis({
      duration: motion.lenisDuration,
      easing: motion.lenisEasing,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
      autoRaf: false,
    });

    setLenis(lenis);

    lenis.on("scroll", (event) => {
      ScrollTrigger.update();
      window.dispatchEvent(
        new CustomEvent("swag:scroll", {
          detail: { scroll: event.scroll, direction: event.direction },
        }),
      );
    });

    ScrollTrigger.refresh();

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return children;
}
