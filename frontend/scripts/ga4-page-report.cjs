#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');

const propertyId = process.env.GA4_PROPERTY_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const startDate = getArg('--start-date') || process.env.GA4_START_DATE || '7daysAgo';
const endDate = getArg('--end-date') || process.env.GA4_END_DATE || 'today';
const rowLimit = Number(getArg('--limit') || process.env.GA4_REPORT_LIMIT || 15);

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

function printUsage() {
  console.log(`Usage:
  GA4_PROPERTY_ID=123456789 \\
  GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \\
  yarn report:analytics

Options:
  --start-date  Date accepted by GA4 Data API, default 7daysAgo
  --end-date    Date accepted by GA4 Data API, default today
  --limit       Rows per report, default 15
`);
}

function base64url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function signJwt(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsigned)
    .sign(serviceAccount.private_key);
  return `${unsigned}.${base64url(signature)}`;
}

async function getAccessToken() {
  const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
  const assertion = signJwt(serviceAccount);
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`OAuth token request failed: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function runReport(accessToken, body) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`GA4 report failed: ${JSON.stringify(data)}`);
  }
  return data;
}

function rows(report) {
  return report.rows || [];
}

function value(row, index, type) {
  const source = type === 'metric' ? row.metricValues : row.dimensionValues;
  return source?.[index]?.value || '';
}

function printTable(title, headers, bodyRows) {
  console.log(`\n${title}`);
  console.log(headers.join(' | '));
  console.log(headers.map(() => '---').join(' | '));
  for (const row of bodyRows) {
    console.log(row.join(' | '));
  }
}

function number(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value || '0';
  return Math.round(parsed * 100) / 100;
}

function percent(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return value || '0%';
  return `${Math.round(parsed * 10000) / 100}%`;
}

async function main() {
  if (process.argv.includes('--help')) {
    printUsage();
    return;
  }

  if (!propertyId || !credentialsPath) {
    printUsage();
    throw new Error('Missing GA4_PROPERTY_ID or GOOGLE_APPLICATION_CREDENTIALS.');
  }

  const accessToken = await getAccessToken();
  const dateRanges = [{ startDate, endDate }];

  const pageReport = await runReport(accessToken, {
    dateRanges,
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' },
      { name: 'engagementRate' },
      { name: 'keyEvents' },
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: rowLimit,
  });

  const landingReport = await runReport(accessToken, {
    dateRanges,
    dimensions: [{ name: 'landingPage' }],
    metrics: [
      { name: 'sessions' },
      { name: 'engagedSessions' },
      { name: 'engagementRate' },
      { name: 'keyEvents' },
    ],
    orderBys: [{ metric: { metricName: 'keyEvents' }, desc: true }],
    limit: rowLimit,
  });

  const sourceReport = await runReport(accessToken, {
    dateRanges,
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [
      { name: 'sessions' },
      { name: 'engagedSessions' },
      { name: 'engagementRate' },
      { name: 'keyEvents' },
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: rowLimit,
  });

  console.log(`# GA4 Solaris Films report (${startDate} to ${endDate})`);

  printTable(
    'Top pages by traffic',
    ['Page', 'Title', 'Views', 'Users', 'Engagement', 'Key events'],
    rows(pageReport).map((row) => [
      value(row, 0, 'dimension'),
      value(row, 1, 'dimension').replace(/\|/g, '/'),
      number(value(row, 0, 'metric')),
      number(value(row, 1, 'metric')),
      percent(value(row, 2, 'metric')),
      number(value(row, 3, 'metric')),
    ]),
  );

  printTable(
    'Landing pages by lead value',
    ['Landing page', 'Sessions', 'Engaged sessions', 'Engagement', 'Key events'],
    rows(landingReport).map((row) => [
      value(row, 0, 'dimension'),
      number(value(row, 0, 'metric')),
      number(value(row, 1, 'metric')),
      percent(value(row, 2, 'metric')),
      number(value(row, 3, 'metric')),
    ]),
  );

  printTable(
    'Traffic sources',
    ['Source / medium', 'Sessions', 'Engaged sessions', 'Engagement', 'Key events'],
    rows(sourceReport).map((row) => [
      value(row, 0, 'dimension'),
      number(value(row, 0, 'metric')),
      number(value(row, 1, 'metric')),
      percent(value(row, 2, 'metric')),
      number(value(row, 3, 'metric')),
    ]),
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

