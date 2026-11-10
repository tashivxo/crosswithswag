#!/usr/bin/env node
/**
 * Figma REST API helper — bypasses official MCP when View-seat rate limits apply.
 * Auth: FIGMA_TOKEN in .env.local or the process environment (never commit).
 *
 * Examples:
 *   node scripts/figma-rest.mjs whoami
 *   node scripts/figma-rest.mjs file
 *   node scripts/figma-rest.mjs nodes --ids 21:23,21:277
 *   node scripts/figma-rest.mjs images --ids 21:277,21:964 --out marcus-assets/figma-v4/exports
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FIGMA_V4_FILE_KEY,
  getFigmaToken,
  normalizeNodeId,
} from "./figma-env.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.figma.com/v1";

function usage() {
  console.error(`Usage:
  node scripts/figma-rest.mjs whoami
  node scripts/figma-rest.mjs file [--key FILE_KEY] [--depth N] [--out path.json]
  node scripts/figma-rest.mjs nodes --ids 21:23,21:277 [--key FILE_KEY] [--out path.json]
  node scripts/figma-rest.mjs images --ids 21:277 [--key FILE_KEY] [--scale 2] [--format png] [--out dir]

Default file key: ${FIGMA_V4_FILE_KEY} (CROSSWITHSWAG V4.1)`);
}

async function figmaFetch(pathname, { searchParams } = {}) {
  const token = getFigmaToken();
  const url = new URL(pathname, API);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text };
  }
  if (!res.ok) {
    const detail = body.err || body.message || res.statusText;
    throw new Error(`Figma API ${res.status} ${pathname}: ${detail}`);
  }
  return body;
}

function parseArgs(argv) {
  const command = argv[0];
  const flags = { key: FIGMA_V4_FILE_KEY, depth: 2, scale: 2, format: "png" };
  const positional = [];
  let ids = [];

  for (let i = 1; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--key" && argv[i + 1]) {
      flags.key = argv[++i];
    } else if (arg === "--depth" && argv[i + 1]) {
      flags.depth = Number(argv[++i]);
    } else if (arg === "--ids" && argv[i + 1]) {
      ids = argv[++i].split(",").map((s) => normalizeNodeId(s.trim()));
    } else if (arg === "--scale" && argv[i + 1]) {
      flags.scale = Number(argv[++i]);
    } else if (arg === "--format" && argv[i + 1]) {
      flags.format = argv[++i];
    } else if (arg === "--out" && argv[i + 1]) {
      flags.out = argv[++i];
    } else {
      positional.push(arg);
    }
  }

  return { command, flags, positional, ids };
}

async function cmdWhoami() {
  const me = await figmaFetch("/v1/me");
  console.log(JSON.stringify({ handle: me.handle, email: me.email, id: me.id }, null, 2));
}

async function cmdFile(flags) {
  const data = await figmaFetch(`/v1/files/${flags.key}`, {
    searchParams: { depth: flags.depth },
  });
  const summary = {
    name: data.name,
    lastModified: data.lastModified,
    version: data.version,
    pages: (data.document?.children ?? []).map((p) => ({ id: p.id, name: p.name })),
  };
  if (flags.out) {
    const outPath = path.resolve(ROOT, flags.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`Wrote full file JSON → ${flags.out}`);
  }
  console.log(JSON.stringify(summary, null, 2));
}

async function cmdNodes(flags, ids) {
  if (ids.length === 0) throw new Error("nodes requires --ids (comma-separated, e.g. 21:23,21:277)");
  const data = await figmaFetch(`/v1/files/${flags.key}/nodes`, {
    searchParams: { ids: ids.join(",") },
  });
  if (flags.out) {
    const outPath = path.resolve(ROOT, flags.out);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, JSON.stringify(data, null, 2), "utf8");
    console.log(`Wrote nodes JSON → ${flags.out}`);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

async function cmdImages(flags, ids) {
  if (ids.length === 0) throw new Error("images requires --ids");
  const rendered = await figmaFetch(`/v1/images/${flags.key}`, {
    searchParams: {
      ids: ids.join(","),
      format: flags.format,
      scale: flags.scale,
    },
  });
  const outDir = path.resolve(ROOT, flags.out ?? "marcus-assets/figma-v4/exports");
  await mkdir(outDir, { recursive: true });
  const saved = [];
  for (const [nodeId, imageUrl] of Object.entries(rendered.images ?? {})) {
    if (!imageUrl) {
      saved.push({ nodeId, status: "empty" });
      continue;
    }
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error(`Download failed for ${nodeId}: ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const fileName = `${nodeId.replace(/:/g, "-")}@${flags.scale}x.${flags.format}`;
    const filePath = path.join(outDir, fileName);
    await writeFile(filePath, buf);
    saved.push({ nodeId, file: path.relative(ROOT, filePath) });
  }
  console.log(JSON.stringify({ outDir: path.relative(ROOT, outDir), saved }, null, 2));
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    usage();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const { command, flags, ids } = parseArgs(argv);

  switch (command) {
    case "whoami":
      await cmdWhoami();
      break;
    case "file":
      await cmdFile(flags);
      break;
    case "nodes":
      await cmdNodes(flags, ids);
      break;
    case "images":
      await cmdImages(flags, ids);
      break;
    default:
      usage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
