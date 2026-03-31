import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Solaris Films';
const BASE_URL = 'https://www.solarisfilms.it';
const DEFAULT_IMAGE = `${BASE_URL}/og-solaris.jpg`;

const SEO = ({ title, description, path = '', image, type = 'website', noIndex = false }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Distributore Esclusivo MADICO USA | Pellicole per Vetri`;
  const fullUrl = `${BASE_URL}${path}`;
  const metaDesc = description || 'Solaris Films, distributore esclusivo MADICO USA per l\'Italia. Pellicole antisolari, di sicurezza, anti-esplosione e privacy per vetri. 40 anni di esperienza, oltre 45.000 edifici trattati.';
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={fullUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
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
    </Helmet>
  );
};

export default SEO;
