import { useSyncExternalStore } from "react";
import {
  getShortScreenSnapshot,
  subscribeShortScreen,
} from "@/lib/coming-soon-dock";

/**
 * True when the coming-soon dock is switched off by the short-screen query.
 * Always false with the flag off. Used as an effect dependency so crossing the
 * breakpoint tears the dock down or rebuilds it, in step with the CSS.
 */
export function useShortScreen() {
  return useSyncExternalStore(
    subscribeShortScreen,
    getShortScreenSnapshot,
    () => false,
  );
}
