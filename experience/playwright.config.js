import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
const mac13Chromium = `${homedir()}/Library/Caches/ms-playwright/chromium-1161/chrome-mac/Chromium.app/Contents/MacOS/Chromium`;
const executablePath =
  process.env.CHROMIUM_EXECUTABLE ||
  (process.platform === "darwin" && existsSync(mac13Chromium)
    ? mac13Chromium
    : undefined);
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.js",
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:5173",
    browserName: "chromium",
    headless: true,
    launchOptions: { executablePath },
  },
  reporter: "list",
  workers: 1,
});
