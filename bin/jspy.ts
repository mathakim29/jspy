#!/usr/bin/env node
import { execSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const pkgPath = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

// 1. Check if uv exists
try {
  execSync("which uv", { stdio: "ignore" });
} catch {
  console.error("Error: 'uv' executable not found in PATH.");
  process.exit(1);
}

// 2. Ensure .venv exists
const pyVer = pkg.python_version || "3.11";
execSync(`uv venv --python ${pyVer} --allow-existing .venv`, { stdio: "ignore" });

const args = process.argv.slice(2);

// 3. Custom 'install' / 'i' subcommand
if (args[0] === "install" || args[0] === "i") {
  const newPkgs = args.slice(1);
  if (newPkgs.length === 0) {
    console.error("Error: Specify at least one package to install.");
    process.exit(1);
  }

  execSync(`uv pip install ${newPkgs.join(" ")} --python .venv`, { stdio: "inherit" });

  const currentDeps = new Set(pkg.python_deps || []);
  newPkgs.forEach((p) => currentDeps.add(p));
  pkg.python_deps = Array.from(currentDeps);

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`Updated package.json python_deps: [${pkg.python_deps.join(", ")}]`);
  process.exit(0);
}

// 4. Fallback: Sync dependencies if no args provided
if (args.length === 0) {
  if (pkg.python_deps?.length) {
    console.log("Syncing python_deps from package.json...");
    execSync(`uv pip install ${pkg.python_deps.join(" ")} --python .venv`, { stdio: "inherit" });
  } else {
    console.log("No arguments provided and no python_deps found in package.json.");
  }
  process.exit(0);
}

// 5. Standard uv passthrough
const result = spawnSync("uv", [...args, "--python", ".venv"], { stdio: "inherit" });
process.exit(result.status ?? 0);