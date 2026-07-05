"use client";

import Lenis from "lenis";
import { ReactNode, useEffect } from "react";
import { motion } from "@/lib/motion.config";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: motion.lenisDuration,
      easing: motion.lenisEasing,
      smoothWheel: true,
    });

    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return children;
}
