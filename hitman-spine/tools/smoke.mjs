import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const playwrightRoot = path.resolve(fileURLToPath(new URL('../..', import.meta.url)), 'mugenSkel', 'node_modules', 'playwright');
const { chromium } = require(playwrightRoot);

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
const logs = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => logs.push(`${m.type()}: ${m.text()}`));
page.on('response', (r) => {
  if (r.status() >= 400) logs.push(`HTTP ${r.status()} ${r.url()}`);
});

await page.goto('http://127.0.0.1:5180/', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2500);

const readout = await page.$eval('#readout', (el) => el.textContent);
const category = await page.$eval('#category', (el) => ({
  disabled: el.disabled,
  count: el.options.length,
  text: el.options[el.selectedIndex]?.textContent,
  value: el.value,
}));
const anim = await page.$eval('#animation', (el) => ({
  disabled: el.disabled,
  count: el.options.length,
  text: el.options[el.selectedIndex]?.textContent,
}));
await page.selectOption('#category', 'attack');
await page.waitForTimeout(400);
const attack = await page.$eval('#animation', (el) => ({
  count: el.options.length,
  labels: [...el.options].map((option) => option.textContent),
}));
await page.check('#skeleton-only');
await page.waitForTimeout(200);
const skeletonOnly = await page.$eval('#readout', (el) => el.textContent);

console.log(JSON.stringify({ readout, category, anim, attack, skeletonOnly, errors, logs }, null, 2));
await browser.close();
process.exit(
  errors.length
  || /Failed/i.test(readout)
  || attack.count < 3
  || !/SKELETON ONLY/.test(skeletonOnly)
    ? 1
    : 0,
);
