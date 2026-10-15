import { chromium } from 'playwright';
import { createPreviewServer } from '../tools/preview-server.mjs';

const server = createPreviewServer();
await new Promise((resolve, reject) => {
  server.listen(4175, '127.0.0.1', (error) => (error ? reject(error) : resolve()));
});

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

try {
  await page.goto('http://127.0.0.1:4175/preview/index.html', { waitUntil: 'networkidle' });
  await page.waitForSelector('#character:not([disabled])');
  const options = await page.$eval('#character', (sel) => [...sel.options].map((option) => ({
    value: option.value,
    text: option.textContent,
  })));
  console.log('skins', options.map((option) => option.text));
  const hit = options.find((option) => /^Hitman$/i.test(option.text.trim()) || /Hitman/i.test(option.text));
  const coral = options.find((option) => /Coral/i.test(option.text));
  if (!hit) throw new Error('Hitman skin missing from dropdown');
  if (!coral) throw new Error('Coral Striker skin missing from dropdown');
  await page.selectOption('#character', hit.value);
  const waitReady = async (label) => {
    const deadline = Date.now() + 15000;
    while (Date.now() < deadline) {
      const name = await page.$eval('#name', (el) => el.textContent);
      const status = await page.$eval('#status', (el) => el.textContent);
      if (new RegExp(label, 'i').test(name) && /Spine/i.test(status) && !/Unable to load/i.test(status)) return { name, status };
      if (/Unable to load/i.test(status) || /Import unavailable/i.test(name)) {
        throw new Error(`${label} failed to load: ${name} / ${status}`);
      }
      await page.waitForTimeout(200);
    }
    throw new Error(`${label} load timed out`);
  };
  console.log('hitman', await waitReady('Hitman'));
  await page.selectOption('#character', coral.value);
  console.log('coral', await waitReady('Coral'));
  const animCount = await page.$eval('#animation', (sel) => sel.options.length);
  console.log({ animCount, errors });
  if (errors.length) {
    console.error('PAGE ERRORS', errors);
    process.exitCode = 1;
  } else {
    console.log('SMOKE OK');
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
