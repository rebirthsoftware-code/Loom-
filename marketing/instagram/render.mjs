/**
 * Keskin Zemin — HTML kanvasları PNG'ye basar.
 * 2x süper-örnekleme ile render alıp Instagram ölçüsüne indirger.
 *
 *   node render.mjs               → hepsi
 *   node render.mjs story-1       → tek dosya
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SRC = path.join(HERE, 'src');
const OUT = path.join(HERE, 'out');

const JOBS = [
  { name: 'story-1',    w: 1080, h: 1920 },
  { name: 'story-2',    w: 1080, h: 1920 },
  { name: 'reels-kapak', w: 1080, h: 1920 },
  { name: 'feed-4x5',   w: 1080, h: 1350 },
];

const only = process.argv.slice(2);
const jobs = only.length ? JOBS.filter(j => only.includes(j.name)) : JOBS;

const browser = await chromium.launch({ args: ['--no-sandbox', '--font-render-hinting=none'] });

for (const j of jobs) {
  const ctx = await browser.newContext({
    viewport: { width: j.w, height: j.h },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`file://${path.join(SRC, j.name + '.html')}`, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const big = path.join(OUT, `${j.name}@2x.png`);
  await page.screenshot({ path: big, clip: { x: 0, y: 0, width: j.w, height: j.h } });
  await ctx.close();

  // 2x → 1x LANCZOS küçültme (kenar yumuşatma kalitesi için)
  execFileSync('python3', ['-c', `
from PIL import Image
im = Image.open(${JSON.stringify(big)}).convert('RGB')
im.resize((${j.w}, ${j.h}), Image.LANCZOS).save(${JSON.stringify(path.join(OUT, j.name + '.png'))},
    optimize=True)
`]);
  fs.unlinkSync(big); // ara dosyayı sil
  console.log(`✓ ${j.name}.png  ${j.w}×${j.h}`);
}

await browser.close();
