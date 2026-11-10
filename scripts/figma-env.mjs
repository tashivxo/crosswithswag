import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Gitignored sidecar. Cursor often refuses to persist `.env.local`. */
export const FIGMA_TOKEN_FILE = ".figma-token";

/** Marcus CROSSWITHSWAG V4.1 — default file key for REST helpers. */
export const FIGMA_V4_FILE_KEY = "lcZqp5HNaFCPBcWgPzAwUU";

function stripBom(text) {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;
  const eq = trimmed.indexOf("=");
  if (eq <= 0) return null;
  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return { key, value };
}

/** Load `.env.local` then `.env` from repo root (does not override existing process.env). */
export function loadRepoEnv() {
  for (const name of [".env.local", ".env"]) {
    const filePath = path.join(ROOT, name);
    if (!existsSync(filePath)) continue;
    const text = stripBom(readFileSync(filePath, "utf8"));
    for (const line of text.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;
      if (process.env[parsed.key] === undefined || process.env[parsed.key] === "") {
        process.env[parsed.key] = parsed.value;
      }
    }
  }
}

function readTokenFile() {
  const filePath = path.join(ROOT, FIGMA_TOKEN_FILE);
  if (!existsSync(filePath)) return "";
  return stripBom(readFileSync(filePath, "utf8")).trim();
}

export function getFigmaToken() {
  loadRepoEnv();
  const token =
    process.env.FIGMA_TOKEN?.trim() ||
    process.env.FIGMA_ACCESS_TOKEN?.trim() ||
    readTokenFile();
  if (!token) {
    throw new Error(
      "FIGMA_TOKEN is empty. Cursor often cannot save .env.local. Copy the PAT, then run: npm run figma:set-token",
    );
  }
  return token;
}

/** Figma node ids use colons (21:23). Accepts 21-23 from URLs. */
export function normalizeNodeId(id) {
  return id.includes(":") ? id : id.replace(/-/g, ":");
}
