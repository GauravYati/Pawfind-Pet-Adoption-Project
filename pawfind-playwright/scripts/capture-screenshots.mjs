import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const screenshotsDir = path.resolve("../pawfind-mern/docs/screenshots");
await fs.mkdir(screenshotsDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

await page.route("**/api/pets**", (route) => route.abort());
await page.goto("http://127.0.0.1:5173");
await page.waitForLoadState("networkidle");
await page.screenshot({ path: path.join(screenshotsDir, "dashboard.png"), fullPage: true });

await page.locator(".species-tabs").getByRole("button", { name: "Rabbit" }).click();
await page.screenshot({ path: path.join(screenshotsDir, "rabbit-filter.png"), fullPage: true });

await browser.close();
