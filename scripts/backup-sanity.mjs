// Full backup of the Sanity content (portraits, photos, submissions,
// signups) into ./backups/roots-sanity-YYYY-MM-DD.tar.gz.
//
//   npm run backup
//
// Uses SANITY_API_TOKEN from .env.local, so no separate Sanity login is
// needed. ./backups is git-ignored on purpose: it contains submitters'
// contact details and must never be committed.
import { readFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);
if (!env.SANITY_API_TOKEN) {
  console.error("SANITY_API_TOKEN is missing from .env.local");
  process.exit(1);
}

const date = new Date().toISOString().slice(0, 10);
const out = `backups/roots-sanity-${date}.tar.gz`;
mkdirSync("backups", { recursive: true });

const result = spawnSync(
  "npx",
  ["--yes", "sanity", "dataset", "export", env.NEXT_PUBLIC_SANITY_DATASET || "production", out, "--overwrite"],
  { stdio: "inherit", shell: true, env: { ...process.env, SANITY_AUTH_TOKEN: env.SANITY_API_TOKEN } }
);
if (result.status === 0) console.log(`\nBackup saved to ${out}`);
process.exit(result.status ?? 1);
