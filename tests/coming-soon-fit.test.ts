import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The poster is scaled to the viewport height so #home fits in one screen and
 * the pin and flight run on laptops and phones. The scaling lives in CSS custom
 * properties on `.cs` (one block for the stacked layout, one for 1100px and
 * up). These tests read those expressions straight out of app/globals.css,
 * evaluate them at a viewport size, and check the poster, the form and the
 * validation-error headroom fit inside it. Real layout is checked in Chrome.
 */

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

const ERROR_HEADROOM = 58;
const LABEL = 13;
const FOOTER = 13;
const MARK_ASPECT = 239.83 / 652;

type Tokens = Record<string, string>;

function blockAfter(marker: RegExp): string {
  const start = css.search(marker);
  expect(start, `missing CSS block: ${marker}`).toBeGreaterThanOrEqual(0);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  throw new Error("unbalanced CSS");
}

function declarations(block: string): Tokens {
  const out: Tokens = {};
  for (const m of block.matchAll(/(--cs-[\w-]+)\s*:\s*([^;]+);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/** Top-level `.cs { ... }` rules (outside media queries) that carry the fit tokens. */
function stackedTokens(): Tokens {
  const out: Tokens = {};
  for (const m of css.matchAll(/(^|\n)\.cs\s*\{/g)) {
    const open = (m.index ?? 0) + m[0].length - 1;
    let depth = 0;
    for (let i = open; i < css.length; i++) {
      if (css[i] === "{") depth++;
      if (css[i] === "}") {
        depth--;
        if (depth === 0) {
          Object.assign(out, declarations(css.slice(open + 1, i)));
          break;
        }
      }
    }
  }
  return out;
}

function desktopTokens(): Tokens {
  const media = blockAfter(/@media \(min-width: 1100px\) \{\s*\.cs \{/);
  return declarations(media);
}

type Env = { vh: number; vars: Tokens };

/** A tiny evaluator for the px / svh / calc / min / max / clamp subset used by the tokens. */
function evaluate(expression: string, env: Env, depth = 0): number {
  if (depth > 20) throw new Error("token cycle");
  let i = 0;
  const src = expression.trim();

  const ws = () => {
    while (i < src.length && /\s/.test(src[i])) i++;
  };

  function primary(): number {
    ws();
    if (src[i] === "(") {
      i++;
      const v = sum();
      ws();
      i++;
      return v;
    }
    if (src[i] === "-") {
      i++;
      return -primary();
    }
    const rest = src.slice(i);
    const fn = /^(calc|min|max|clamp|var)\(/.exec(rest);
    if (fn) {
      i += fn[0].length;
      if (fn[1] === "var") {
        const end = src.indexOf(")", i);
        const name = src.slice(i, end).trim();
        i = end + 1;
        if (name === "--cs-vh") return env.vh;
        const value = env.vars[name];
        if (value === undefined) throw new Error(`unknown token ${name}`);
        return evaluate(value, env, depth + 1);
      }
      const args: number[] = [];
      for (;;) {
        args.push(sum());
        ws();
        if (src[i] === ",") {
          i++;
          continue;
        }
        i++;
        break;
      }
      if (fn[1] === "calc") return args[0];
      if (fn[1] === "min") return Math.min(...args);
      if (fn[1] === "max") return Math.max(...args);
      return Math.min(Math.max(args[1], args[0]), args[2]);
    }
    const num = /^-?\d*\.?\d+/.exec(rest);
    if (!num) throw new Error(`cannot parse "${rest}" in "${src}"`);
    i += num[0].length;
    const unit = /^(px|svh|vh)?/.exec(src.slice(i))![0];
    i += unit.length;
    const n = parseFloat(num[0]);
    if (unit === "svh" || unit === "vh") return (n * env.vh) / 100;
    return n;
  }

  function product(): number {
    let v = primary();
    for (;;) {
      ws();
      if (src[i] === "*") {
        i++;
        v *= primary();
      } else if (src[i] === "/") {
        i++;
        v /= primary();
      } else return v;
    }
  }

  function sum(): number {
    let v = product();
    for (;;) {
      ws();
      if (src[i] === "+") {
        i++;
        v += product();
      } else if (src[i] === "-") {
        i++;
        v -= product();
      } else return v;
    }
  }

  return sum();
}

const val = (tokens: Tokens, name: string, vh: number) =>
  evaluate(`var(${name})`, { vh, vars: tokens });

function narrowTokens(): Tokens {
  return declarations(blockAfter(/@media \(max-width: 389px\) \{\s*\.cs \{/));
}

function tokensFor(width: number): Tokens {
  const base = stackedTokens();
  if (width >= 1100) return { ...base, ...desktopTokens() };
  return width < 390 ? { ...base, ...narrowTokens() } : base;
}

/** Form height without its gaps, measured in Chrome: the consent text wraps on narrow screens. */
function stackedFormBase(width: number): number {
  if (width < 340) return 269;
  if (width < 390) return 251;
  if (width < 600) return 227;
  return 209;
}

/** Height of the poster, form and error headroom, stacked top to bottom. */
function posterHeight(width: number, vh: number, errors: boolean): number {
  const t = tokensFor(width);
  const v = (name: string) => val(t, name, vh);
  const padY = v("--cs-pad-y");
  const markW = Math.min(v("--cs-mark-w"), width >= 1100 ? width - 112 - 480 - 56 : width - 48);
  const markH = markW * MARK_ASPECT;
  const headroom = errors ? ERROR_HEADROOM : 0;

  if (width >= 1100) {
    const formBase = 235;
    const form = formBase + 2 * v("--cs-form-gap") + headroom;
    const left = v("--cs-left-top") + markH + v("--cs-ident-top") + 17 + v("--cs-stmt-top") + 128;
    const right = v("--cs-right-top") + form;
    return 2 * padY + LABEL + Math.max(left, right) + FOOTER + v("--cs-foot-pad");
  }

  const formBase = stackedFormBase(width);
  return (
    2 * padY +
    LABEL +
    v("--cs-left-top") +
    markH +
    v("--cs-ident-top") + 15 +
    v("--cs-stmt-top") + 80 +
    v("--cs-right-top") +
    formBase + 2 * v("--cs-form-gap") + headroom +
    v("--cs-foot-pad") +
    FOOTER
  );
}

const COMMON: Array<[string, number, number]> = [
  ["1366x657 (1366x768 laptop minus browser chrome)", 1366, 657],
  ["1440x800", 1440, 800],
  ["1280x720", 1280, 720],
  ["390x664", 390, 664],
  ["360x640", 360, 640],
  ["375x667", 375, 667],
  ["414x736", 414, 736],
  ["1440x900", 1440, 900],
  ["1920x1080", 1920, 1080],
  ["390x844", 390, 844],
  ["768x1024", 768, 1024],
  ["1024x768", 1024, 768],
  ["1100x621", 1100, 621],
  ["390x621", 390, 621],
];

describe("poster scaled to the viewport height", () => {
  it("sizes from svh with a vh fallback, never plain vh in the expressions", () => {
    expect(css).toMatch(/--cs-vh:\s*100vh;/);
    expect(css).toMatch(/@supports \(height: 100svh\) \{\s*\.cs \{\s*--cs-vh:\s*100svh;/);
    const tokens = { ...stackedTokens(), ...desktopTokens() };
    for (const [name, expression] of Object.entries(tokens)) {
      if (name === "--cs-vh") continue;
      expect(expression, name).not.toMatch(/\d\s*vh\b/);
      expect(expression, name).not.toMatch(/dvh/);
    }
    expect(tokens["--cs-slack"] ?? "").toContain("var(--cs-vh)");
  });

  it("defines every token in both layouts and uses them on the poster", () => {
    const names = [
      "--cs-ref",
      "--cs-k",
      "--cs-pad-y",
      "--cs-left-top",
      "--cs-mark-w",
      "--cs-ident-top",
      "--cs-stmt-top",
      "--cs-right-top",
      "--cs-form-gap",
      "--cs-foot-pad",
    ];
    const merged = { ...stackedTokens(), ...desktopTokens() };
    for (const name of names) {
      expect(stackedTokens()[name], `stacked ${name}`).toBeDefined();
      expect(merged[name], `desktop ${name}`).toBeDefined();
      expect(css, `${name} is consumed`).toMatch(
        new RegExp(`:[^;{}]*var\\(${name}\\)`),
      );
    }
    expect(css).toMatch(/\.cs-wordmark\s*\{[^}]*width:\s*min\(var\(--cs-mark-w\),\s*100%\)/);
  });

  it.each(COMMON)(
    "%s: poster, form and error headroom fit inside the viewport",
    (_name, width, vh) => {
      expect(posterHeight(width, vh, true)).toBeLessThanOrEqual(vh);
      expect(posterHeight(width, vh, false)).toBeLessThanOrEqual(vh);
    },
  );

  it.each([340, 360, 375, 390, 414, 600, 768, 1024, 1099, 1100, 1280, 1440, 1920])(
    "%spx wide: fits at every height above the breakpoint, with errors shown",
    (width) => {
      for (let vh = 621; vh <= 1400; vh++) {
        expect(posterHeight(width, vh, true), `${width}x${vh}`).toBeLessThanOrEqual(vh);
      }
    },
  );

  it("leaves the full-size poster alone on tall screens", () => {
    const desktop = tokensFor(1440);
    const stacked = tokensFor(390);
    expect(val(desktop, "--cs-mark-w", 1000)).toBe(652);
    expect(val(desktop, "--cs-right-top", 1000)).toBe(415);
    expect(val(desktop, "--cs-stmt-top", 1000)).toBe(143);
    expect(val(desktop, "--cs-pad-y", 1000)).toBe(56);
    expect(val(stacked, "--cs-mark-w", 1000)).toBe(342);
    expect(val(stacked, "--cs-right-top", 1000)).toBe(40);
    expect(val(stacked, "--cs-pad-y", 1000)).toBe(28);
  });

  it("shrinks the mark as the screen gets shorter, never grows it", () => {
    for (const width of [390, 1440]) {
      const t = tokensFor(width);
      let previous = 0;
      for (let vh = 621; vh <= 1200; vh += 7) {
        const w = val(t, "--cs-mark-w", vh);
        expect(w).toBeGreaterThanOrEqual(previous);
        previous = w;
      }
      expect(val(t, "--cs-mark-w", 621)).toBeGreaterThanOrEqual(180);
    }
  });

  it("keeps the mark large enough to read at the shortest pinned size", () => {
    expect(val(tokensFor(1366), "--cs-mark-w", 657)).toBeGreaterThanOrEqual(500);
    expect(val(tokensFor(390), "--cs-mark-w", 664)).toBeGreaterThanOrEqual(200);
    expect(val(tokensFor(360), "--cs-mark-w", 640)).toBeGreaterThanOrEqual(180);
  });

  it("turns scaling off where the nav starts docked: reduced motion and the short-screen attribute", () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*\.cs \{\s*--cs-fit:\s*0/,
    );
    expect(css).toMatch(/html\[data-cs-short="1"\] \.cs \{\s*--cs-fit:\s*0/);
    for (const tokens of [stackedTokens(), desktopTokens()]) {
      const merged = { ...stackedTokens(), ...tokens };
      const off = { ...merged, "--cs-fit": "0" };
      expect(val(off, "--cs-mark-w", 640)).toBe(val(off, "--cs-mark-w", 2000));
    }
  });
});
