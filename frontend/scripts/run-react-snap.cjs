#!/usr/bin/env node

const { spawnSync } = require("node:child_process");

if (process.env.SKIP_REACT_SNAP === "1") {
  console.log("Skipping react-snap (SKIP_REACT_SNAP=1).");
  process.exit(0);
}

function resolveExecutablePath() {
  try {
    const puppeteer = require("puppeteer");
    if (typeof puppeteer.executablePath === "function") {
      return puppeteer.executablePath();
    }
  } catch (error) {
    console.warn("Unable to resolve modern Puppeteer executable:", error.message);
  }
  return process.env.PUPPETEER_EXECUTABLE_PATH || "";
}

const executablePath = resolveExecutablePath();

if (executablePath) {
  process.env.PUPPETEER_EXECUTABLE_PATH = executablePath;
  console.log(`Using Chromium for react-snap: ${executablePath}`);
}

const result = spawnSync("npx", ["react-snap"], {
  stdio: "inherit",
  shell: true,
  env: process.env
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
