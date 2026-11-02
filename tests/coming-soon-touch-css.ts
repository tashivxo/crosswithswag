import { readFileSync } from "node:fs";

export const globalsCss = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);

export function coarsePointerBlocks(source: string) {
  const blocks: string[] = [];
  const re = /@media\s*\(\s*pointer:\s*coarse\s*\)\s*\{/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    let depth = 1;
    let i = match.index + match[0].length;
    const start = i;
    while (i < source.length && depth > 0) {
      if (source[i] === "{") depth += 1;
      else if (source[i] === "}") depth -= 1;
      i += 1;
    }
    blocks.push(source.slice(start, i - 1));
  }
  return blocks;
}

export function comingSoonCss(source = globalsCss) {
  const start = source.indexOf("Coming soon poster");
  if (start < 0) return "";
  const end = source.indexOf("/* end docked: short screen */");
  if (end < start) return source.slice(start);
  return source.slice(start, end + "/* end docked: short screen */".length);
}

export function coarseComingSoonRules(source = globalsCss) {
  return coarsePointerBlocks(comingSoonCss(source)).join("\n");
}

export function touchComingSoonHomeUsesSvh(source = globalsCss) {
  const coarse = coarseComingSoonRules(source);
  return /html:has\(\.cs\)\s*#home\s*\{[^}]*min-height:\s*100svh\s*;/.test(coarse);
}

/** Stable .cs box height when touch layout uses svh, not innerHeight. */
export const TOUCH_COMING_SOON_STABLE_SVH_PX = 844;

export function posterHeightAfterAddressBarToggle(
  innerHeight: number,
  homeUsesSvh: boolean,
) {
  return homeUsesSvh ? TOUCH_COMING_SOON_STABLE_SVH_PX : innerHeight;
}
