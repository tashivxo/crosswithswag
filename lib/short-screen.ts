import { comingSoonEnabled } from "@/lib/coming-soon";

/**
 * Screens this short (or shorter) get no pin and no flight: the nav starts
 * docked and the poster mark and label are collapsed. This is the floor of the
 * poster's scaling, not the poster's natural height: above it the poster, the
 * form and 58px of validation-error headroom are fitted into the viewport with
 * `svh` (the --cs-* tokens in app/globals.css), so the pin and flight run on
 * laptops and phones. Below it the scaled mark gets too small to fly, which in
 * practice means phones held sideways.
 *
 * ONE decision drives both CSS and JS: the query is evaluated once, by the
 * inline head script, into the data-cs-short attribute on <html>. The CSS keys
 * off that attribute (never a live max-height media query, which would follow
 * the mobile URL bar immediately) and the dock reads and updates the same one.
 */
export const SHORT_SCREEN_MAX_HEIGHT = 620;
export const SHORT_SCREEN_QUERY = `(max-height: ${SHORT_SCREEN_MAX_HEIGHT}px)`;

/**
 * On <html>: the coming-soon dock's state, "idle" or "flying" (absent when
 * there is no pin). Defined here so the head script and the dock share it.
 */
export const COMING_SOON_DOCK_ATTR = "data-cs-dock";

/** On <html>: "1" when the nav starts docked because the screen is short, "0" otherwise. */
export const SHORT_SCREEN_ATTR = "data-cs-short";

/**
 * The mobile URL bar showing or hiding changes the viewport height by 50 to
 * 100px without any real change of screen. The decision is only re-evaluated
 * when the width changes, or when the height moves by MORE than this from the
 * height it was last evaluated at.
 */
export const SHORT_SCREEN_REEVALUATE_PX = 100;

type EvaluatedAt = { width: number; height: number };

declare global {
  interface Window {
    __csShortEval?: EvaluatedAt;
  }
}

/**
 * The inline script for the document head. It runs before first paint, so the
 * CSS that keys off the attribute is right from the first frame, and it records
 * the size it evaluated at for the re-evaluation rule above. On the home route,
 * when the nav does not start docked, it also sets the dock attribute to
 * "idle" (exactly what the dock sets when it builds the pin), so the header
 * mark is hidden and only the poster mark shows before any app script runs. Self-contained:
 * it is serialised into the HTML, so it cannot reference anything in this file.
 */
export function shortScreenInitScript() {
  const attr = JSON.stringify(SHORT_SCREEN_ATTR);
  const query = JSON.stringify(SHORT_SCREEN_QUERY);
  const dock = JSON.stringify(COMING_SOON_DOCK_ATTR);
  const reduced = JSON.stringify("(prefers-reduced-motion: reduce)");
  return `(function(w,d){try{var r=d.documentElement,s=w.matchMedia(${query}).matches;r.setAttribute(${attr},s?"1":"0");w.__csShortEval={width:w.innerWidth,height:w.innerHeight};if(!s&&!w.matchMedia(${reduced}).matches&&w.location.pathname==="/")r.setAttribute(${dock},"idle")}catch(e){}})(window,document);`;
}

/** Evaluate the shared query now and store the result as the one decision. */
function evaluateShortScreen() {
  const short = window.matchMedia(SHORT_SCREEN_QUERY).matches;
  document.documentElement.setAttribute(SHORT_SCREEN_ATTR, short ? "1" : "0");
  window.__csShortEval = { width: window.innerWidth, height: window.innerHeight };
  return short;
}

/**
 * The decision, as the head script (or the first caller, if it did not run)
 * made it. It never follows the live media query, so the URL bar cannot flip it.
 */
export function isShortScreen() {
  const value = document.documentElement.getAttribute(SHORT_SCREEN_ATTR);
  return value === null ? evaluateShortScreen() : value === "1";
}

/** Re-evaluate only on a width change, or a height change of more than the threshold. */
function syncShortScreen() {
  const value = document.documentElement.getAttribute(SHORT_SCREEN_ATTR);
  const last = window.__csShortEval;
  if (
    value === null ||
    !last ||
    window.innerWidth !== last.width ||
    Math.abs(window.innerHeight - last.height) > SHORT_SCREEN_REEVALUATE_PX
  ) {
    return evaluateShortScreen();
  }
  return value === "1";
}

/** useSyncExternalStore subscribe: re-run the dock when the decision changes. */
export function subscribeShortScreen(callback: () => void) {
  if (!comingSoonEnabled()) return () => {};
  let current = isShortScreen();
  const onResize = () => {
    const next = syncShortScreen();
    if (next === current) return;
    current = next;
    callback();
  };
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}

/** Always false with the flag off, so the legacy home never re-runs its effects. */
export function getShortScreenSnapshot() {
  return comingSoonEnabled() && isShortScreen();
}
