type Env = { NEXT_PUBLIC_COMING_SOON?: string };

export function comingSoonEnabled(
  env: Env = { NEXT_PUBLIC_COMING_SOON: process.env.NEXT_PUBLIC_COMING_SOON },
): boolean {
  return env.NEXT_PUBLIC_COMING_SOON === "1";
}
