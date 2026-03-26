#!/usr/bin/env node
/**
 * Bump the project version across all config files that require manual sync:
 *   - package.json          (source of truth)
 *   - src-tauri/Cargo.toml  (Rust crate version)
 *
 * tauri.conf.json reads from package.json automatically ("version": "../package.json").
 * The frontend reads via getVersion() from the Tauri runtime — no change needed there.
 *
 * Usage:
 *   bun run bump <new-version>
 *   bun run bump 0.3.0
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const newVersion = process.argv[2];

if (!newVersion) {
  console.error("❌  Usage: bun run bump <version>  (e.g. bun run bump 0.3.0)");
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+/.test(newVersion)) {
  console.error(`❌  Invalid version format: "${newVersion}". Expected semver (e.g. 1.2.3)`);
  process.exit(1);
}

// ── package.json ─────────────────────────────────────────────────────────────
const pkgPath = resolve(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const prevVersion = pkg.version;
pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`✓  package.json         ${prevVersion} → ${newVersion}`);

// ── src-tauri/Cargo.toml ─────────────────────────────────────────────────────
const cargoPath = resolve(root, "src-tauri", "Cargo.toml");
const cargo = readFileSync(cargoPath, "utf8");
// Replace only the first `version = "..."` line (the [package] version)
const updatedCargo = cargo.replace(/^version = ".*"$/m, `version = "${newVersion}"`);
if (updatedCargo === cargo) {
  console.warn("⚠️   Cargo.toml version not updated — pattern not found");
} else {
  writeFileSync(cargoPath, updatedCargo);
  console.log(`✓  src-tauri/Cargo.toml ${prevVersion} → ${newVersion}`);
}

console.log(`\n🚀  Done! Next steps:`);
console.log(`    git add package.json src-tauri/Cargo.toml`);
console.log(`    git commit -m "chore: bump version to ${newVersion}"`);
console.log(`    git tag v${newVersion} && git push origin v${newVersion}`);
