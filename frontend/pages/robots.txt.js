const productionHosts = new Set(['www.solarisfilms.it', 'solarisfilms.it']);

const RobotsTxt = () => null;

export async function getServerSideProps({ req, res }) {
  const host = (req.headers.host || '').split(':')[0].toLowerCase();
  const isProductionDomain = productionHosts.has(host);
  const origin = isProductionDomain
    ? `https://${host}`
    : 'https://solarisfilms.vercel.app';

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
