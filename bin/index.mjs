#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execSync } from "node:child_process";
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

  const nextValue = args[index + 1];
  if (!nextValue || nextValue.startsWith("--")) return null;

  return nextValue;
}

async function resolveBaseDir() {
  const hasSrc = await pathExists(path.join(cwd, "src"));
  const hasSrcComponents = await pathExists(
    path.join(cwd, "src", "components"),
  );
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

  if (
    (await pathExists(path.join(cwd, "bun.lockb"))) ||
    (await pathExists(path.join(cwd, "bun.lock")))
  ) {
    return "bun";
  }

  return "npm";
}

function getInstallCommand(pkgManager, isDev = false) {
  if (pkgManager === "pnpm") {
    return isDev ? "pnpm add -D" : "pnpm add";
  }

  if (pkgManager === "yarn") {
    return isDev ? "yarn add -D" : "yarn add";
  }

  if (pkgManager === "bun") {
    return isDev ? "bun add -d" : "bun add";
  }

  return isDev ? "npm install -D" : "npm install";
}

async function readPackageJson() {
  const packageJsonPath = path.join(cwd, "package.json");

  if (!(await pathExists(packageJsonPath))) {
    return null;
  }

  try {
    const content = await fs.readFile(packageJsonPath, "utf8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function isTypeScriptProject() {
  const tsconfigExists =
    (await pathExists(path.join(cwd, "tsconfig.json"))) ||
    (await pathExists(path.join(cwd, "tsconfig.base.json")));

  if (tsconfigExists) {
    return true;
  }

  const packageJson = await readPackageJson();

  if (!packageJson) {
    return false;
  }

  const deps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  return Boolean(deps.typescript);
}

function getMissingPackages(packageJson, packages, isDev = false) {
  const existing = {
    ...(packageJson?.dependencies || {}),
    ...(packageJson?.devDependencies || {}),
    ...(packageJson?.peerDependencies || {}),
  };

  return packages.filter((pkg) => !existing[pkg]);
}

function installPackages(pkgManager, packages, isDev = false) {
  if (!packages.length) return;

  const commandToRun = `${getInstallCommand(pkgManager, isDev)} ${packages.join(" ")}`;

  console.log("");
  console.log(
    isDev ? "Installing dev dependencies..." : "Installing dependencies...",
  );
  console.log(commandToRun);
  console.log("");

  execSync(commandToRun, {
    cwd,
    stdio: "inherit",
  });
}

function printHelp() {
  console.log(`
Usage:
  stepper-form init
  stepper-form init --demo
  stepper-form init --path components/custom-stepper
  stepper-form --help

Options:
  --demo             Also generate demo files
  --path <path>      Custom target path
  --skip-install     Skip dependency installation
  --help             Show help
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
  const skipInstall = args.includes("--skip-install");
  const customPath = getFlagValue("--path");

  const baseDir = await resolveBaseDir();
  const pkgManager = await detectPackageManager();
  const packageJson = await readPackageJson();
  const tsProject = await isTypeScriptProject();

  const stepperTargetDir = customPath
    ? path.join(cwd, customPath)
    : path.join(baseDir, "components", "stepper-form");

  const demoTargetDir = path.join(baseDir, "components", "demo");

  const stepperExists = await pathExists(stepperTargetDir);
  if (stepperExists) {
    console.error(
      `Target already exists: ${path.relative(cwd, stepperTargetDir)}`,
    );
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
        console.warn(
          `Demo folder already exists: ${path.relative(cwd, demoTargetDir)}`,
        );
        console.warn("Skipping demo generation.");
      } else {
        await copyDir(demoTemplateDir, demoTargetDir);
        demoCreated = true;
      }
    }
  }

  const runtimeDeps = [
    "react-hook-form",
    "zod",
    "@hookform/resolvers",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
    "@countrystatecity/countries-browser",
    "country-data",
  ];

  const tsDevDeps = tsProject
    ? ["typescript", "@types/react", "@types/react-dom", "@types/node"]
    : [];

  const missingRuntimeDeps = getMissingPackages(
    packageJson,
    runtimeDeps,
    false,
  );
  const missingTsDevDeps = getMissingPackages(packageJson, tsDevDeps, true);

  if (!skipInstall) {
    try {
      installPackages(pkgManager, missingRuntimeDeps, false);
      installPackages(pkgManager, missingTsDevDeps, true);
    } catch (error) {
      console.warn("");
      console.warn("Dependency installation failed.");
      console.warn("You can install them manually:");
      if (missingRuntimeDeps.length) {
        console.warn(
          `${getInstallCommand(pkgManager, false)} ${missingRuntimeDeps.join(" ")}`,
        );
      }
      if (missingTsDevDeps.length) {
        console.warn(
          `${getInstallCommand(pkgManager, true)} ${missingTsDevDeps.join(" ")}`,
        );
      }
      console.warn("");
    }
  }

  console.log("");
  console.log("✨ Stepper Form installed successfully");
  console.log("");
  console.log(`${path.relative(cwd, stepperTargetDir)}`);

  if (demoCreated) {
    console.log(`${path.relative(cwd, demoTargetDir)}`);
  }

  console.log("");
  console.log(`Package manager: ${pkgManager}`);
  console.log(`TypeScript project: ${tsProject ? "yes" : "no"}`);

  if (skipInstall) {
    console.log("");
    console.log("Install required dependencies:");
    if (missingRuntimeDeps.length) {
      console.log(
        `${getInstallCommand(pkgManager, false)} ${missingRuntimeDeps.join(" ")}`,
      );
    }
    if (missingTsDevDeps.length) {
      console.log(
        `${getInstallCommand(pkgManager, true)} ${missingTsDevDeps.join(" ")}`,
      );
    }
  }

  console.log("");
  console.log("Next steps:");
  console.log(`1. Import from "@/components/stepper-form"`);
  console.log("2. Start building");
  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error("Failed to generate stepper-form files.");
  console.error(error);
  process.exit(1);
});
