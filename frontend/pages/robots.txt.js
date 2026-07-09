const productionHosts = new Set(['www.solarisfilms.it', 'solarisfilms.it']);
const DEFAULT_SITE_ORIGIN = 'https://www.solarisfilms.it';

function normalizeOrigin(value, fallback = DEFAULT_SITE_ORIGIN) {
  const raw = String(value || fallback || '').trim().replace(/\/+$/, '');
  if (!raw) return DEFAULT_SITE_ORIGIN;
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

const RobotsTxt = () => null;

export async function getServerSideProps({ req, res }) {
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  const isProductionDomain = productionHosts.has(host);
  const configuredOrigin = normalizeOrigin(
    process.env.NEXT_PUBLIC_SITE_URL
      || process.env.NEXT_PUBLIC_SITE_ORIGIN
      || process.env.REACT_APP_SITE_ORIGIN
      || process.env.SITE_ORIGIN
  );
  const origin = isProductionDomain
    ? `https://${host}`
    : configuredOrigin;

  const body = isProductionDomain
    ? `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`
    : `User-agent: *
Disallow: /

Sitemap: ${origin}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.write(body);
  res.end();

  return { props: {} };
}

export default RobotsTxt;
