import { chromium } from '../../node_modules/playwright/index.mjs';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));

await page.goto('http://127.0.0.1:5180/preview/index.html', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(1500);

const skins = await page.$eval('#skin', (sel) => [...sel.options].map((o) => ({ id: o.value, name: o.textContent })));
console.log({ skins });

await page.selectOption('#skin', 'coral_striker');
await page.waitForTimeout(1200);
const coral = await page.$eval('#readout', (el) => el.textContent);
await page.selectOption('#skin', 'hitman');
await page.waitForTimeout(1200);
const hit = await page.$eval('#readout', (el) => el.textContent);

console.log({ coral, hit, errors });
await browser.close();

if (skins.length < 2 || errors.length || /Failed|Skin failed/i.test(coral + hit)) {
  process.exitCode = 1;
} else {
  console.log('SMOKE OK — shared rig, PNG skins only');
}
