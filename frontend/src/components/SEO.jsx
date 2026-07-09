import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Solaris Films';
const PUBLIC_SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_URL
  || process.env.NEXT_PUBLIC_SITE_ORIGIN
  || process.env.REACT_APP_SITE_ORIGIN
  || process.env.SITE_ORIGIN
  || 'https://www.solarisfilms.it'
).replace(/\/+$/, '');
const BASE_URL = PUBLIC_SITE_ORIGIN;
const DEFAULT_IMAGE = `${PUBLIC_SITE_ORIGIN}/og-solaris.jpg`;
const LIVE_HOSTS = new Set(['solarisfilms.it', 'www.solarisfilms.it']);

const getRuntimeLocation = () => {
  if (typeof window === 'undefined') return null;
  return window.location;
};

const SEO = ({ title, description, path = '', image, type = 'website', noIndex = false, jsonLd }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Distributore Esclusivo MADICO USA | Pellicole per Vetri`;
  const location = getRuntimeLocation();
  const isLiveHost = location ? LIVE_HOSTS.has(location.hostname) : LIVE_HOSTS.has(new URL(PUBLIC_SITE_ORIGIN).hostname);
  const canonicalBase = location ? (isLiveHost ? BASE_URL : location.origin) : PUBLIC_SITE_ORIGIN;
  const canonicalPath = path || location?.pathname || '';
  const fullUrl = `${canonicalBase}${canonicalPath}`;
  const metaDesc = description || 'Solaris Films, distributore esclusivo MADICO USA per l\'Italia. Pellicole antisolari, di sicurezza, anti-esplosione e privacy per vetri. 30+ anni di esperienza, +45k edifici trattati.';
  const ogImage = image || DEFAULT_IMAGE;
  const shouldNoIndex = noIndex || !isLiveHost;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={fullUrl} />
      {shouldNoIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="it_IT" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={ogImage} />
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

// JSON-LD Schema Builders
export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Solaris Films',
  url: PUBLIC_SITE_ORIGIN,
  logo: `${PUBLIC_SITE_ORIGIN}/logo-solaris.png`,
  description: 'Distributore esclusivo MADICO USA per l\'Italia. Pellicole antisolari, di sicurezza, anti-esplosione e privacy per vetri.',
  foundingDate: '1985',
  areaServed: { '@type': 'Country', name: 'Italy' },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    telephone: '+39-055-9107621',
    availableLanguage: 'Italian',
  },
  sameAs: [],
});

export const buildProductSchema = (prodotto) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: prodotto.nome,
  description: prodotto.descrizione,
  url: `${PUBLIC_SITE_ORIGIN}/prodotti/${prodotto.slug}`,
  brand: { '@type': 'Brand', name: 'MADICO' },
  manufacturer: { '@type': 'Organization', name: 'Madico Inc.' },
  category: `Pellicole ${prodotto.categoria}`,
  ...(prodotto.datiTecnici && {
    additionalProperty: [
      ...(prodotto.datiTecnici.luceVisibile?.trasmessa ? [{
        '@type': 'PropertyValue', name: 'VLT (Visible Light Transmittance)', value: prodotto.datiTecnici.luceVisibile.trasmessa,
      }] : []),
      ...(prodotto.datiTecnici.infrarossiRespinti ? [{
        '@type': 'PropertyValue', name: 'Infrared Rejection', value: prodotto.datiTecnici.infrarossiRespinti,
      }] : []),
      ...(prodotto.datiTecnici.uvTrasmessi ? [{
        '@type': 'PropertyValue', name: 'UV Transmission', value: prodotto.datiTecnici.uvTrasmessi,
      }] : []),
      ...(prodotto.datiTecnici.energiaRespinta ? [{
        '@type': 'PropertyValue', name: 'Total Solar Energy Rejected', value: prodotto.datiTecnici.energiaRespinta,
      }] : []),
    ],
  }),
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'EUR',
    seller: { '@type': 'Organization', name: 'Solaris Films' },
  },
});

export const buildLocalBusinessSchema = (citta) => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: `Solaris Films - ${citta.nome}`,
  description: `Installazione pellicole per vetri MADICO a ${citta.nome}, ${citta.regione}. Sopralluogo e preventivo gratuiti.`,
  url: `${PUBLIC_SITE_ORIGIN}/servizio-locale/${citta.slug}`,
  areaServed: { '@type': 'City', name: citta.nome },
  parentOrganization: { '@type': 'Organization', name: 'Solaris Films', url: PUBLIC_SITE_ORIGIN },
});

export const buildFAQSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
});

export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${PUBLIC_SITE_ORIGIN}${item.path}`,
  })),
});

export default SEO;
