import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Solaris Films';
const BASE_URL = 'https://www.solarisfilms.it';
const DEFAULT_IMAGE = `${BASE_URL}/og-solaris.jpg`;
const LIVE_HOSTS = new Set(['solarisfilms.it', 'www.solarisfilms.it']);

const getRuntimeLocation = () => {
  if (typeof window === 'undefined') return null;
  return window.location;
};

const SEO = ({ title, description, path = '', image, type = 'website', noIndex = false, jsonLd }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Distributore Esclusivo MADICO USA | Pellicole per Vetri`;
  const location = getRuntimeLocation();
  const isLiveHost = location ? LIVE_HOSTS.has(location.hostname) : true;
  const canonicalBase = isLiveHost ? BASE_URL : location?.origin || BASE_URL;
  const canonicalPath = path || location?.pathname || '';
  const fullUrl = `${canonicalBase}${canonicalPath}`;
  const metaDesc = description || 'Solaris Films, distributore esclusivo MADICO USA per l\'Italia. Pellicole antisolari, di sicurezza, anti-esplosione e privacy per vetri. 40 anni di esperienza, oltre 45.000 edifici trattati.';
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
  url: BASE_URL,
  logo: `${BASE_URL}/logo-solaris.png`,
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
  url: `${BASE_URL}/prodotti/${prodotto.slug}`,
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
  url: `${BASE_URL}/servizio-locale/${citta.slug}`,
  areaServed: { '@type': 'City', name: citta.nome },
  parentOrganization: { '@type': 'Organization', name: 'Solaris Films', url: BASE_URL },
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
    item: `${BASE_URL}${item.path}`,
  })),
});

export default SEO;
