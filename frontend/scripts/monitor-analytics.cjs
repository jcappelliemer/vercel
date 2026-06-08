#!/usr/bin/env node

const DEFAULT_BASE_URL = 'https://www.solarisfilms.it';
const baseUrl = (process.env.SITE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
const expectedMeasurementId = process.env.GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-JVXJ62Q76Z';

const checks = [
  {
    path: '/',
    contains: ['googletagmanager.com/gtag/js', expectedMeasurementId],
  },
  {
    path: '/contatti/',
    contains: ['googletagmanager.com/gtag/js', expectedMeasurementId, 'tel:+390559107621', 'WhatsApp'],
  },
  {
    path: '/preventivo/',
    contains: ['googletagmanager.com/gtag/js', expectedMeasurementId, 'tel:+390559107621', 'Invia richiesta'],
  },
];

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'solaris-analytics-monitor/1.0',
    },
  });
  const text = await response.text();
  return { response, text };
}

async function runCheck(check) {
  const url = `${baseUrl}${check.path}`;
  const { response, text } = await fetchText(url);
  const missing = check.contains.filter((token) => !text.includes(token));

  return {
    path: check.path,
    url,
    status: response.status,
    ok: response.ok && missing.length === 0,
    missing,
  };
}

(async () => {
  const results = [];

  for (const check of checks) {
    results.push(await runCheck(check));
  }

  for (const result of results) {
    const status = result.ok ? 'OK' : 'FAIL';
    console.log(`${status} ${result.status} ${result.path}`);
    if (result.missing.length > 0) {
      console.log(`  missing: ${result.missing.join(', ')}`);
      console.log(`  url: ${result.url}`);
    }
  }

  if (results.some((result) => !result.ok)) {
    process.exitCode = 1;
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
