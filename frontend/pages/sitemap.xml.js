import livePagesIndex from '../public/wp-data/live-pages-index.json';

const DEFAULT_SITE_ORIGIN = 'https://www.solarisfilms.it';

const SITEMAP_PATH_ALIASES = {
  '/prodotti/madicosb20epssr/': '/prodotti/madico-sb-20-e-ps-sr/',
  '/prodotti/madicosb35epssr/': '/prodotti/madico-sb-35-e-ps-sr/',
  '/prodotti/madicosg20epssr/': '/prodotti/madico-sg-20-e-ps-sr/',
  '/prodotti/madicosl8epssr/': '/prodotti/madico-sl-8-e-ps-sr/',
  '/prodotti/tecnosolarssn50tesr/': '/prodotti/ssn-70-te-sr/',
  '/prodotti/ssn-50-te-sr/': '/prodotti/ssn-70-te-sr/',
  '/prodotti/madico-rs-20-ps-sr-8-mil/': '/prodotti/madico-rs-20-ps-sr-8mil/',
  '/prodotti/madico-rs-40-ps-sr-4-mil/': '/prodotti/madico-rs-40-ps-sr-4mil/',
  '/prodotti/madico-rs-40-ps-sr-8-mil/': '/prodotti/madico-rs-40-ps-sr-8mil/',
  '/focus-tecnico/pellicole-termoisolanti/': '/focus-tecnico/pellicole-antisolari/',
  '/servizi/pellicole-antisolari/': '/servizi/',
  '/servizi/pellicole-sicurezza/': '/servizi/',
  '/servizi/pellicole-decorative/': '/servizi/',
};

const APP_ONLY_SITEMAP_PATHS = [
  '/prodotti/ssn-70-te-sr/',
  '/prodotti/madico-rs-30-e-ps-sr/',
  '/focus-tecnico/safetyshield/',
];

const EXCLUDED_SOLARIS_TERMS = [
  /\blcd\b/i,
  /\bstratum\b/i,
  /\bstartum\b/i,
  /fotocromatic/i,
  /\bcromia\b/i,
  /\bserie\s*nt\b/i,
  /\bnt[\s-]*20\b/i,
  /\bnt[\s-]*35\b/i,
  /tecnosolarnt20/i,
  /tecnosolarnt35/i,
];

const EXCLUDED_PRODUCT_SLUGS = [
  'pellicole-lcd-switch',
  'stratum',
  'startum',
  'tecnosolarnt20epssr',
  'tecnosolarnt35epssr',
  'tecnosolarssn50tesr',
  'tecnosolar-ssn-50-te-sr',
];

function normalizeOrigin(value, fallback = DEFAULT_SITE_ORIGIN) {
  const raw = String(value || fallback || '').trim().replace(/\/+$/, '');
  if (!raw) return DEFAULT_SITE_ORIGIN;
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function getSiteOrigin() {
  return normalizeOrigin(
    process.env.NEXT_PUBLIC_SITE_URL
      || process.env.NEXT_PUBLIC_SITE_ORIGIN
      || process.env.REACT_APP_SITE_ORIGIN
      || process.env.SITE_ORIGIN,
    DEFAULT_SITE_ORIGIN
  );
}

function normalizeAppPath(pathname) {
  if (!pathname || pathname === '/') return '/';
  const clean = String(pathname).split('?')[0].split('#')[0];
  return clean.endsWith('/') ? clean : `${clean}/`;
}

function hasExcludedProductReference(value = '') {
  const text = String(value || '');
  const lower = text.toLowerCase();
  return EXCLUDED_SOLARIS_TERMS.some((term) => term.test(text))
    || EXCLUDED_PRODUCT_SLUGS.some((slug) => lower.includes(slug));
}

function isExcludedProductUrl(value = '') {
  const lower = String(value || '').toLowerCase();
  return EXCLUDED_PRODUCT_SLUGS.some((slug) => lower.includes(slug))
    || hasExcludedProductReference(lower);
}

function canonicalSitemapPath(pathname) {
  const normalized = normalizeAppPath(pathname);
  const aliased = SITEMAP_PATH_ALIASES[normalized] || normalized;
  return aliased === '/' ? '/' : aliased.replace(/\/+$/, '');
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(siteOrigin) {
  const pages = livePagesIndex.pages || [];
  const sitemapPaths = Array.from(new Set([
    ...pages
      .filter((page) => !/noindex/i.test(page?.robots || page?.seo?.robots || ''))
      .filter((page) => page?.route?.type !== 'knowledge-index')
      .map((page) => {
        const routeType = page?.route?.type;
        return routeType === 'product'
          ? page?.route?.newPath
          : page?.path;
      }),
    ...APP_ONLY_SITEMAP_PATHS,
  ].map(canonicalSitemapPath).filter((newPath) => !isExcludedProductUrl(newPath))));

  const urls = sitemapPaths
    .map((newPath) => `  <url><loc>${escapeXml(`${siteOrigin}${newPath}`)}</loc></url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const SitemapXml = () => null;

export async function getServerSideProps({ res }) {
  const body = buildSitemap(getSiteOrigin());

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.write(body);
  res.end();

  return { props: {} };
}

export default SitemapXml;
