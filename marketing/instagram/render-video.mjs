/**
 * Keskin Zemin — Reels filmi.
 * reels-film.html içindeki zaman çizelgesini kare kare render eder ve
 * doğrudan ffmpeg'e boru ile aktarıp H.264 MP4 üretir (diske kare yazmaz).
 *
 *   node render-video.mjs              → out/reels-film.mp4
 *   node render-video.mjs --preview    → out/preview/*.png (kilit kareler)
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SRC  = path.join(HERE, 'src', 'reels-film.html');
const OUT  = path.join(HERE, 'out');
const FFMPEG = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';

const W = 1080, H = 1920, FPS = 30;
const PREVIEW = process.argv.includes('--preview');

const browser = await chromium.launch({ args: ['--no-sandbox', '--font-render-hinting=none'] });
const ctx  = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(`file://${SRC}`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);

const DUR = await page.evaluate(() => window.__duration);
const clip = { x: 0, y: 0, width: W, height: H };

if (PREVIEW) {
  const dir = path.join(OUT, 'preview');
  fs.mkdirSync(dir, { recursive: true });
  const marks = [3.4, 7.6, 10.6, 12.8, 14.2, 15.1, 16.6, 18.6, 22.4, 24.4, 25.6, 28.4];
  for (const t of marks) {
    await page.evaluate(([t, f]) => window.__seek(t, f), [t, Math.round(t * FPS)]);
    await page.screenshot({ path: path.join(dir, `t${t.toFixed(1).replace('.', '_')}.png`), clip });
  }
  console.log(`✓ ${marks.length} önizleme karesi → out/preview/`);
  await browser.close();
  process.exit(0);
}

fs.mkdirSync(OUT, { recursive: true });
const dest = path.join(OUT, 'reels-film.mp4');

const ff = spawn(FFMPEG, [
  '-y',
  '-f', 'image2pipe', '-framerate', String(FPS), '-i', 'pipe:0',
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
  '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k', '-shortest',
  '-movflags', '+faststart', '-r', String(FPS),
  dest,
], { stdio: ['pipe', 'ignore', 'pipe'] });

let ffErr = '';
ff.stderr.on('data', d => { ffErr += d.toString(); });
const done = new Promise((res, rej) =>
  ff.on('close', c => c === 0 ? res() : rej(new Error(`ffmpeg ${c}\n${ffErr.slice(-1500)}`))));

const total = Math.round(DUR * FPS);
const write = buf => new Promise(res =>
  ff.stdin.write(buf) ? res() : ff.stdin.once('drain', res));

const t0 = Date.now();
for (let f = 0; f < total; f++) {
  const t = f / FPS;
  await page.evaluate(([t, f]) => window.__seek(t, f), [t, f]);
  await write(await page.screenshot({ clip }));
  if (f % 60 === 0) {
    const pct = ((f / total) * 100).toFixed(0).padStart(3);
    process.stdout.write(`  ${pct}%  ${f}/${total} kare  (${((Date.now() - t0) / 1000).toFixed(0)} sn)\n`);
  }
}
ff.stdin.end();
await done;
await browser.close();

const mb = (fs.statSync(dest).size / 1048576).toFixed(1);
console.log(`✓ reels-film.mp4  ${W}×${H}  ${DUR}s  ${FPS}fps  ${mb} MB`);
