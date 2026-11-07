#!/usr/bin/env node
import { execSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const pkgPath = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const run = (cmd, opts = { stdio: "inherit" }) => execSync(cmd, opts);

run(`uv venv --python ${pkg.python_version || "3.11"} --allow-existing .venv`, { stdio: "ignore" });

const args = process.argv.slice(2);
const isInstall = args[0] === "install" || args[0] === "i";

if (isInstall) {
  const newPkgs = args.slice(1);
  if (!newPkgs.length) (console.error("Error: Specify packages to install."), process.exit(1));

  run(`uv pip install ${newPkgs.join(" ")} --python .venv`);
  pkg.python_deps = [...new Set([...(pkg.python_deps || []), ...newPkgs])];
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`Updated package.json python_deps: [${pkg.python_deps.join(", ")}]`);
} else if (!args.length) {
  pkg.python_deps?.length
    ? run(`uv pip install ${pkg.python_deps.join(" ")} --python .venv`)
    : console.log("No python_deps found in package.json.");
} else {
  const { status } = spawnSync("uv", [...args, "--python", ".venv"], { stdio: "inherit" });
  process.exit(status ?? 0);
}