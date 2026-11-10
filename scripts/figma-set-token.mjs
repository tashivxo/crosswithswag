#!/usr/bin/env node
/**
 * Persist FIGMA_TOKEN without relying on Cursor saving .env.local.
 *
 *   Copy the PAT, then: npm run figma:set-token
 *   Or paste in the terminal: npm run figma:set-token -- --prompt
 */
import { execSync } from "node:child_process";
import { createInterface } from "node:readline";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FIGMA_TOKEN_FILE } from "./figma-env.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function cleanToken(raw) {
  return raw
    .trim()
    .replace(/^FIGMA_TOKEN\s*=\s*/i, "")
    .replace(/^FIGMA_ACCESS_TOKEN\s*=\s*/i, "")
    .replace(/^["']|["']$/g, "");
}

function fromClipboard() {
  const clip = execSync("powershell -NoProfile -Command Get-Clipboard", {
    encoding: "utf8",
  });
  return cleanToken(clip);
}

function fromPrompt() {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question("Paste Figma PAT and press Enter: ", (answer) => {
      rl.close();
      resolve(cleanToken(answer));
    });
  });
}

function looksLikePat(token) {
  return /^figd_[A-Za-z0-9_-]{20,}$/.test(token);
}

function describe(token) {
  const prefix = token.slice(0, 4).replace(/[^\x20-\x7E]/g, "?");
  return `${token.length} chars, starts with "${prefix}…"`;
}

function writeToken(token) {
  if (!token) {
    console.error("No token. Copy the full figd_… string, then retry.");
    process.exit(1);
  }
  if (!looksLikePat(token)) {
    console.error(
      `Not a Figma PAT (${describe(token)}). Copy the full token from Figma → Settings → Security → Personal access tokens. It starts with figd_ and is much longer than 20 characters.`,
    );
    process.exit(1);
  }
  const dest = path.join(ROOT, FIGMA_TOKEN_FILE);
  writeFileSync(dest, `${token}\n`, "utf8");
  console.log(`Wrote ${FIGMA_TOKEN_FILE} (${token.length} chars). Run npm run figma:whoami`);
}

const usePrompt = process.argv.includes("--prompt");
if (usePrompt) {
  const token = await fromPrompt();
  writeToken(token);
} else {
  writeToken(fromClipboard());
}
