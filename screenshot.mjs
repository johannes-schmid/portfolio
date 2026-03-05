import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const targetUrl = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';
const outDir = path.join(process.cwd(), 'temporary_screenshots');
fs.mkdirSync(outDir, { recursive: true });

const existing = fs
  .readdirSync(outDir)
  .map((f) => {
    const m = /^screenshot-(\d+)/.exec(f);
    return m ? Number(m[1]) : 0;
  })
  .filter(Boolean);

const next = (existing.length ? Math.max(...existing) : 0) + 1;
const outPath = path.join(outDir, `screenshot-${next}${label}.png`);

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 2800, deviceScaleFactor: 1 });
await page.goto(targetUrl, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(outPath);
