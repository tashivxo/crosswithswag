type Env = { NEXT_PUBLIC_COMING_SOON?: string };

/**
 * V3.3.3 Jotform coming-soon poster (`ComingSoonChapter`).
 *
 * V4_branch `/` is Figma 21:277 (docked mark + shop). Runtime always returns
 * false so a leftover `NEXT_PUBLIC_COMING_SOON=1` (Vercel / Playwright / local)
 * cannot replace Marcus's landing. Vitest still reads the flag so dock/veil
 * unit tests keep working.
 */
export function comingSoonEnabled(
  env: Env = { NEXT_PUBLIC_COMING_SOON: process.env.NEXT_PUBLIC_COMING_SOON },
): boolean {
  if (process.env.VITEST !== "true") {
    return false;
  }
  return env.NEXT_PUBLIC_COMING_SOON === "1";
}
