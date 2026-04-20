#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0] || "init";

const cwd = process.cwd();
const templateDir = path.join(__dirname, "..", "templates", "stepper-form");
const demoTemplateDir = path.join(__dirname, "..", "templates", "demo");

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
      continue;
    }

    const content = await fs.readFile(srcPath, "utf8");
    await fs.writeFile(destPath, content, "utf8");
  }
}

function getFlagValue(flagName) {
  const index = args.findIndex((arg) => arg === flagName);
  if (index === -1) return null;
  return args[index + 1] || null;
}

async function resolveBaseDir() {
  const hasSrc = await pathExists(path.join(cwd, "src"));
  const hasSrcComponents = await pathExists(path.join(cwd, "src", "components"));
  const hasRootComponents = await pathExists(path.join(cwd, "components"));

  if (hasSrcComponents) {
    return path.join(cwd, "src");
  }

  if (hasRootComponents) {
    return cwd;
  }

  if (hasSrc) {
    return path.join(cwd, "src");
  }

  return cwd;
}

async function detectPackageManager() {
  if (await pathExists(path.join(cwd, "pnpm-lock.yaml"))) {
    return "pnpm";
  }

  if (await pathExists(path.join(cwd, "yarn.lock"))) {
    return "yarn";
  }

  if (await pathExists(path.join(cwd, "bun.lockb")) || await pathExists(path.join(cwd, "bun.lock"))) {
    return "bun";
  }

  return "npm";
}

function getInstallCommand(pkgManager) {
  if (pkgManager === "pnpm") {
    return "pnpm add";
  }

  if (pkgManager === "yarn") {
    return "yarn add";
  }

  if (pkgManager === "bun") {
    return "bun add";
  }

  return "npm install";
}

function printHelp() {
  console.log(`
Usage:
  stepper-form init
  stepper-form init --demo
  stepper-form init --path components/custom-stepper
  stepper-form --help

Options:
  --demo          Also generate demo files
  --path <path>   Custom target path
  --help          Show help
`);
}

async function main() {
  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    process.exit(0);
  }

  if (command !== "init") {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  }

  const withDemo = args.includes("--demo");
  const customPath = getFlagValue("--path");

  const baseDir = await resolveBaseDir();
  const pkgManager = await detectPackageManager();
  const installCommand = getInstallCommand(pkgManager);

  const stepperTargetDir = customPath
    ? path.join(cwd, customPath)
    : path.join(baseDir, "components", "stepper-form");

  const demoTargetDir = path.join(baseDir, "components", "demo");

  const stepperExists = await pathExists(stepperTargetDir);
  if (stepperExists) {
    console.error(`Target already exists: ${path.relative(cwd, stepperTargetDir)}`);
    console.error("Remove it first or use --path with another location.");
    process.exit(1);
  }

  const templateExists = await pathExists(templateDir);
  if (!templateExists) {
    console.error("Missing template folder:");
    console.error(path.relative(cwd, templateDir));
    process.exit(1);
  }

  await copyDir(templateDir, stepperTargetDir);

  let demoCreated = false;

  if (withDemo) {
    const demoTemplateExists = await pathExists(demoTemplateDir);

    if (!demoTemplateExists) {
      console.warn("Demo template folder not found, skipping demo generation.");
    } else {
      const demoExists = await pathExists(demoTargetDir);

      if (demoExists) {
        console.warn(`Demo folder already exists: ${path.relative(cwd, demoTargetDir)}`);
        console.warn("Skipping demo generation.");
      } else {
        await copyDir(demoTemplateDir, demoTargetDir);
        demoCreated = true;
      }
    }
  }

  const deps = [
    "react-hook-form",
    "zod",
    "@hookform/resolvers",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
    "@countrystatecity/countries-browser",
  ];

  console.log("");
  console.log("✨ Stepper Form installed successfully");
  console.log("");
  console.log(`📁 ${path.relative(cwd, stepperTargetDir)}`);

  if (demoCreated) {
    console.log(`📁 ${path.relative(cwd, demoTargetDir)}`);
  }

  console.log("");
  console.log("Next steps:");
  console.log(`1. ${installCommand} ${deps.join(" ")}`);
  console.log(`2. Import from "@/components/stepper-form"`);
  console.log("3. Start building 🚀");
  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error("Failed to generate stepper-form files.");
  console.error(error);
  process.exit(1);
});