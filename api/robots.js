const LIVE_HOSTS = new Set(['solarisfilms.it', 'www.solarisfilms.it']);

function hostnameFromRequest(req) {
  return String(req.headers['x-forwarded-host'] || req.headers.host || '')
    .split(',')[0]
    .trim()
    .replace(/:\d+$/, '')
    .toLowerCase();
}

function sendText(res, body) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(body);
}

module.exports = function handler(req, res) {
  const hostname = hostnameFromRequest(req);
  const isLive = LIVE_HOSTS.has(hostname);
  const origin = isLive ? `https://${hostname}` : `https://${hostname || 'solarisfilms.vercel.app'}`;

  if (!isLive) {
    return sendText(res, [
      'User-agent: *',
      'Disallow: /',
      '',
      `Sitemap: ${origin}/sitemap.xml`,
      '',
    ].join('\n'));
  }

  return sendText(res, [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n'));
};
