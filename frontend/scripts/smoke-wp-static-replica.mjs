#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

const base = String(process.env.STATIC_REPLICA_BASE || 'https://wordpress-jc4e.srv1502079.hstgr.cloud').replace(/\/+$/, '');
const screenshot = process.env.STATIC_REPLICA_SCREENSHOT || '';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });

const sameOriginFailures = [];
const nextDataResponses = [];
page.on('response', (response) => {
  const url = new URL(response.url());
  if (url.origin === new URL(base).origin && response.status() >= 400) {
    sameOriginFailures.push({ status: response.status(), path: `${url.pathname}${url.search}` });
  }
  if (url.origin === new URL(base).origin && url.pathname.startsWith('/_next/data/')) {
    nextDataResponses.push({ status: response.status(), path: url.pathname });
  }
});

async function verifyPage(pathname) {
  const response = await page.goto(`${base}${pathname}`, { waitUntil: 'domcontentloaded', timeout: 45000 });
  assert(response && response.status() === 200, `${pathname}: expected HTTP 200`);
  await delay(350);
  const state = await page.evaluate(() => ({
    h1: document.querySelectorAll('h1').length,
    badge: document.querySelectorAll('.aeo-orchestra-badge').length,
    authority: document.querySelectorAll('[data-testid="authority-section"]').length,
    missing: document.body.innerText.includes('Pagina non trovata'),
  }));
  assert(state.h1 === 1, `${pathname}: expected one H1, got ${state.h1}`);
  assert(state.badge === 1, `${pathname}: expected one Orchestra badge, got ${state.badge}`);
  assert(state.authority === 1, `${pathname}: expected one authority section, got ${state.authority}`);
  assert(!state.missing, `${pathname}: rendered the not-found state`);
  return state;
}

const checks = {};
checks.home = await verifyPage('/');

const knowledgeLink = await page.$('a[href="/lo-sapevi-che"], a[href="/lo-sapevi-che/"]');
assert(knowledgeLink, 'Home: missing the Lo sapevi che link');
await knowledgeLink.click();
await page.waitForFunction(() => window.location.pathname.replace(/\/+$/, '') === '/lo-sapevi-che', { timeout: 30000 });
await delay(500);
checks.clientNavigation = {
  pathname: await page.evaluate(() => window.location.pathname),
  h1: await page.$$eval('h1', (items) => items.length),
};
assert(checks.clientNavigation.h1 === 1, 'Client navigation: expected one H1');

checks.canonicalArticle = await verifyPage('/lo-sapevi-che/approfondimenti-antisolare/');
checks.wordpressArticle = await verifyPage('/approfondimenti/approfondimenti-antisolare/');
checks.faq = await verifyPage('/faq/');
checks.product = await verifyPage('/prodotti/madico-sg-20-e-ps-sr/');

if (screenshot) {
  fs.mkdirSync(path.dirname(path.resolve(screenshot)), { recursive: true });
  await page.screenshot({ path: screenshot, fullPage: true });
}

await browser.close();

const uniqueFailures = Array.from(new Map(
  sameOriginFailures.map((item) => [`${item.status}:${item.path}`, item])
).values());
assert(uniqueFailures.length === 0, `Same-origin HTTP failures: ${JSON.stringify(uniqueFailures)}`);
assert(nextDataResponses.every((item) => item.status === 200), `Next data failures: ${JSON.stringify(nextDataResponses)}`);

console.log(JSON.stringify({
  base,
  checks,
  nextDataResponses,
  sameOriginFailures: uniqueFailures,
}, null, 2));
