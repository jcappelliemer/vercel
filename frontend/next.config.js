const path = require('path');

const withSlashVariants = (paths) => paths.flatMap((source) => [
  source.replace(/\/$/, ''),
  source.endsWith('/') ? source : `${source}/`,
]);

const gonePaths = withSlashVariants([
  '/approfondimenti/pellicole-fotocromatiche',
  '/approfondimenti/guida-pellicola-lcd-switch-installazione',
  '/pellicole-per-vetri/pellicole-lcd-switch',
  '/pellicole-per-vetri/pellicole-per-vetri/pellicole-lcd-switch',
  '/pellicole-per-vetri/zoho-callback',
  '/pellicole-per-vetri/false-parent',
  '/pellicole-per-vetri/anagrafica-privati-v2',
  '/pellicole-per-vetri/anagrafica-aziende-enti-operativa',
  '/pellicole-per-vetri/anagrafica-tributaria-aziende-enti',
  '/pellicole-per-vetri/battle-plan-mensile-tc-2025',
  '/pellicole-per-vetri/line-up-settimanale-tc-2025',
  '/pellicole-per-vetri/chiusura-lavori',
  '/pellicole-per-vetri/false-parent/battle-plan-mensile-tc-2025',
  '/pellicole-per-vetri/false-parent/line-up-settimanale-tc-2025',
  '/pellicole-per-vetri/llms-txt',
  '/pellicole-per-vetri/thank-you',
  '/grazie',
  '/approfondimenti/author/davide-belli',
  '/approfondimenti/author/fabio-meucci',
  '/approfondimenti/author/j-cappelli',
  '/approfondimenti/author/martina-giardi',
  '/approfondimenti/author/site-admin',
  '/approfondimenti/davide-belli',
  '/approfondimenti/fabio-meucci',
  '/approfondimenti/j-cappelli',
  '/approfondimenti/martina-giardi',
  '/approfondimenti/site-admin',
]);

const wordpressProxyRewrites = [
  {
    source: '/llms.txt',
    destination: 'https://wordpress-jc4e.srv1502079.hstgr.cloud/llms.txt',
  },
  {
    source: '/llms-full.txt',
    destination: 'https://wordpress-jc4e.srv1502079.hstgr.cloud/llms-full.txt',
  },
  {
    source: '/seo-aeo-sitemap.xml',
    destination: 'https://wordpress-jc4e.srv1502079.hstgr.cloud/seo-aeo-sitemap.xml',
  },
];

const editorialArchiveRedirects = [
  ['/approfondimenti/tipo-pellicola/sputtered', '/pellicole-antisolari-sputtered/'],
  ['/approfondimenti/tipo-pellicola/sunscape', '/pellicole-antisolari-sunscape/'],
  ['/approfondimenti/tipo-pellicola/spettroselettive', '/pellicole-spettro-selettive/'],
  ['/approfondimenti/tipo-pellicola/riflettenti', '/pellicole-riflettenti/'],
  ['/approfondimenti/tipo-pellicola/antiesplosione', '/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/'],
  ['/approfondimenti/tipo-pellicola/antisfondamento', '/pellicole-di-sicurezza/'],
  ['/approfondimenti/category/approfondimenti', '/approfondimenti/'],
  ['/pellicole-per-vetri/lo-sapevi-che', '/approfondimenti/'],
  ['/pellicole-per-vetri/pellicole-per-vetri/lo-sapevi-che', '/approfondimenti/'],
].flatMap(([source, destination]) => withSlashVariants([source]).map((variant) => ({
  source: variant,
  destination,
  statusCode: 301,
})));

const technicalFocusAliasRedirects = [
  ['/focus-tecnico/pellicole-antisolari', '/pellicole-antisolari/'],
  ['/focus-tecnico/pellicole-di-sicurezza', '/pellicole-di-sicurezza/'],
  ['/focus-tecnico/pellicole-antisolari-sputtered', '/pellicole-antisolari-sputtered/'],
  ['/focus-tecnico/pellicole-antisolari-sunscape', '/pellicole-antisolari-sunscape/'],
  ['/focus-tecnico/pellicole-oscuranti-per-vetri', '/pellicole-oscuranti-per-vetri/'],
  ['/focus-tecnico/pellicole-riflettenti', '/pellicole-riflettenti/'],
  ['/focus-tecnico/pellicole-spettro-selettive', '/pellicole-spettro-selettive/'],
  ['/focus-tecnico/pellicole-di-sicurezza-neutre-la-serie-cl', '/pellicole-di-sicurezza-neutre-la-serie-cl/'],
  ['/focus-tecnico/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield', '/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/'],
  ['/focus-tecnico/pellicole-antisolari-di-sicurezza-la-serie-rs', '/pellicole-antisolari-di-sicurezza-la-serie-rs/'],
  ['/focus-tecnico/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free', '/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/'],
  ['/focus-tecnico/pellicole-decorative', '/pellicole-decorative/'],
  ['/focus-tecnico/pellicole-antisolari-stampabili-e-vetrofanie', '/pellicole-antisolari-stampabili-e-vetrofanie/'],
  ['/focus-tecnico/pellicole-decorative-privacy', '/pellicole-decorative-privacy/'],
  ['/focus-tecnico/pellicole-termoisolanti', '/pellicole-termoisolanti/'],
].flatMap(([source, destination]) => withSlashVariants([source]).map((variant) => ({
  source: variant,
  destination,
  statusCode: 301,
})));

const legacyUtilityRedirects = [
  ['/pellicole-per-vetri/certificato-di-sicurezza', '/certificato-di-sicurezza/'],
].flatMap(([source, destination]) => withSlashVariants([source]).map((variant) => ({
  source: variant,
  destination,
  statusCode: 301,
})));

const infoAliasRedirects = [
  ['/pagina-info', '/pellicole-per-vetri/pellicole-per-vetri/faq/'],
  ['/pagina-info/garanzie-clienti', '/pagina-info/garanzie/'],
  ['/info/norme', '/pagina-info/norme/'],
  ['/info/norme-di-riferimento', '/pagina-info/norme/'],
  ['/info/norma-brc', '/pagina-info/norma-brc/'],
  ['/info/sicurezza-a-norma-di-legge', '/pagina-info/sicurezza-a-norma-di-legge/'],
  ['/info/testo-unico-sulla-salute-e-sicurezza-sul-lavoro', '/pagina-info/testo-unico-sulla-salute-e-sicurezza-sul-lavoro/'],
  ['/info/sistemi-filtranti-dpr-59-09', '/pagina-info/sistemi-filtranti-dpr-59-09/'],
  ['/info/certificazione-nfrc', '/pagina-info/certificazione-nfrc/'],
  ['/info/garanzie-clienti', '/pagina-info/garanzie/'],
  ['/info/garanzie', '/pagina-info/garanzie/'],
  ['/info/i-punti-di-forza', '/pagina-info/i-punti-di-forza/'],
  ['/info/istruzioni-e-manutenzione', '/pagina-info/istruzioni-e-manutenzione/'],
  ['/info/glossario-termini', '/pagina-info/glossario-termini/'],
].flatMap(([source, destination]) => withSlashVariants([source]).map((variant) => ({
  source: variant,
  destination,
  statusCode: 301,
})));

const shortLegacyAliasRedirects = [
  ['/faq', '/pellicole-per-vetri/pellicole-per-vetri/faq/'],
  ['/company', '/company-profile/'],
  ['/contattaci', '/contatti/'],
  ['/contatto', '/contatti/'],
].flatMap(([source, destination]) => withSlashVariants([source]).map((variant) => ({
  source: variant,
  destination,
  statusCode: 301,
})));

const articleAliasRedirects = [
  {
    source: '/lo-sapevi-che/:slug',
    destination: '/approfondimenti/:slug/',
    statusCode: 301,
  },
  {
    source: '/lo-sapevi-che/:slug/',
    destination: '/approfondimenti/:slug/',
    statusCode: 301,
  },
];

const localShortAliasRedirects = [
  'ancona',
  'aosta',
  'bari',
  'bologna',
  'campobasso',
  'catanzaro',
  'cosenza',
  'firenze',
  'genova',
  'laquila',
  'milano',
  'napoli',
  'palermo',
  'perugia',
  'potenza',
  'roma',
  'romagna',
  'torino',
  'trento',
  'trieste',
  'udine',
  'venezia',
].flatMap((city) => withSlashVariants([`/servizio-locale/${city}`]).map((source) => ({
  source,
  destination: `/servizio-locale/pellicole-per-vetri-${city}/`,
  statusCode: 301,
})));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      ...wordpressProxyRewrites,
      ...gonePaths.map((source) => ({
        source,
        destination: '/api/gone',
      })),
    ];
  },
  async redirects() {
    const redirects = [
      ...editorialArchiveRedirects,
      ...technicalFocusAliasRedirects,
      ...legacyUtilityRedirects,
      ...infoAliasRedirects,
      ...shortLegacyAliasRedirects,
      ...articleAliasRedirects,
      ...localShortAliasRedirects,
      {
        source: '/blog',
        destination: '/approfondimenti/',
        statusCode: 301,
      },
      {
        source: '/blog/',
        destination: '/approfondimenti/',
        statusCode: 301,
      },
      {
        source: '/blog/:slug*',
        destination: '/approfondimenti/:slug*',
        statusCode: 301,
      },
      {
        source: '/pellicole-per-vetri/profilo-solaris',
        destination: '/company-profile/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/profilo-solaris/',
        destination: '/company-profile/',
        permanent: true,
      },
      {
        source: '/prodotti/madicosb20epssr',
        destination: '/prodotti/madico-sb-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/madicosb35epssr',
        destination: '/prodotti/madico-sb-35-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/madicosg20epssr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/madicosl8epssr',
        destination: '/prodotti/madico-sl-8-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/madicosb20epssr/',
        destination: '/prodotti/madico-sb-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/madicosb35epssr/',
        destination: '/prodotti/madico-sb-35-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/madicosg20epssr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/madicosl8epssr/',
        destination: '/prodotti/madico-sl-8-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/ssn-50-te-sr',
        destination: '/prodotti/ssn-70-te-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/ssn-50-te-sr/',
        destination: '/prodotti/ssn-70-te-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/tecnosolarssn50tesr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/prodotti/tecnosolarssn50tesr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/prodotti/tecnosolarnt20epssr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/prodotti/tecnosolarnt20epssr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/prodotti/tecnosolar-nt-20-e-ps-sr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/prodotti/tecnosolar-nt-20-e-ps-sr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/prodotti/tecnosolar-ssn-50-te-sr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/prodotti/tecnosolar-ssn-50-te-sr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/tecnosolarnt20epssr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/tecnosolarnt20epssr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/tecnosolarssn50tesr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/tecnosolarssn50tesr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        statusCode: 301,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/ssn-70-te-sr',
        destination: '/prodotti/ssn-70-te-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/ssn-70-te-sr/',
        destination: '/prodotti/ssn-70-te-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-30-e-ps-sr',
        destination: '/prodotti/madico-rs-30-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-30-e-ps-sr/',
        destination: '/prodotti/madico-rs-30-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/madicosb20epssr',
        destination: '/prodotti/madico-sb-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/madicosb20epssr/',
        destination: '/prodotti/madico-sb-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/madicosb35epssr',
        destination: '/prodotti/madico-sb-35-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/madicosb35epssr/',
        destination: '/prodotti/madico-sb-35-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/madicosg20epssr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/madicosg20epssr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/madicosl8epssr',
        destination: '/prodotti/madico-sl-8-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/madicosl8epssr/',
        destination: '/prodotti/madico-sl-8-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madicosb20epssr',
        destination: '/prodotti/madico-sb-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madicosb20epssr/',
        destination: '/prodotti/madico-sb-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madicosb35epssr',
        destination: '/prodotti/madico-sb-35-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madicosb35epssr/',
        destination: '/prodotti/madico-sb-35-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madicosg20epssr',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madicosg20epssr/',
        destination: '/prodotti/madico-sg-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madicosl8epssr',
        destination: '/prodotti/madico-sl-8-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madicosl8epssr/',
        destination: '/prodotti/madico-sl-8-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-20-e-ps-sr',
        destination: '/prodotti/madico-rs-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-20-e-ps-sr/',
        destination: '/prodotti/madico-rs-20-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-40-e-ps-sr',
        destination: '/prodotti/madico-rs-40-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-40-e-ps-sr/',
        destination: '/prodotti/madico-rs-40-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-20-ps-sr-4mil',
        destination: '/prodotti/madico-rs-20-ps-sr-4mil/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-20-ps-sr-4mil/',
        destination: '/prodotti/madico-rs-20-ps-sr-4mil/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-20-ps-sr-8-mil',
        destination: '/prodotti/madico-rs-20-ps-sr-8mil/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-20-ps-sr-8-mil/',
        destination: '/prodotti/madico-rs-20-ps-sr-8mil/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-40-ps-sr-4-mil',
        destination: '/prodotti/madico-rs-40-ps-sr-4mil/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-40-ps-sr-4-mil/',
        destination: '/prodotti/madico-rs-40-ps-sr-4mil/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-40-ps-sr-8-mil',
        destination: '/prodotti/madico-rs-40-ps-sr-8mil/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-40-ps-sr-8-mil/',
        destination: '/prodotti/madico-rs-40-ps-sr-8mil/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-800',
        destination: '/prodotti/madico-safetyshield-800/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-800/',
        destination: '/prodotti/madico-safetyshield-800/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-1500',
        destination: '/prodotti/madico-safetyshield-1500/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-1500/',
        destination: '/prodotti/madico-safetyshield-1500/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-400-e-ps-sr',
        destination: '/prodotti/madico-cl-400-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-400-e-ps-sr/',
        destination: '/prodotti/madico-cl-400-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-400-ps-sr',
        destination: '/prodotti/madico-cl-400-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-400-ps-sr/',
        destination: '/prodotti/madico-cl-400-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-700-e-ps-sr',
        destination: '/prodotti/madico-cl-700-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-700-e-ps-sr/',
        destination: '/prodotti/madico-cl-700-e-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-700-ps-sr',
        destination: '/prodotti/madico-cl-700-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-700-ps-sr/',
        destination: '/prodotti/madico-cl-700-ps-sr/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-gullwing',
        destination: '/prodotti/madico-gullwing/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-gullwing/',
        destination: '/prodotti/madico-gullwing/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-decorative-per-vetri/madico-mt-200-xw',
        destination: '/prodotti/madico-mt-200-xw/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-decorative-per-vetri/madico-mt-200-xw/',
        destination: '/prodotti/madico-mt-200-xw/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-decorative-per-vetri/vetrofanie',
        destination: '/prodotti/vetrofanie/',
        permanent: true,
      },
      {
        source: '/pellicole-per-vetri/pellicole-decorative-per-vetri/vetrofanie/',
        destination: '/prodotti/vetrofanie/',
        permanent: true,
      },
      {
        source: '/servizi/pellicole-antisolari',
        destination: '/servizi#antisolari',
        permanent: true,
      },
      {
        source: '/servizi/pellicole-antisolari/',
        destination: '/servizi#antisolari',
        permanent: true,
      },
      {
        source: '/servizi/pellicole-sicurezza',
        destination: '/servizi#sicurezza',
        permanent: true,
      },
      {
        source: '/servizi/pellicole-sicurezza/',
        destination: '/servizi#sicurezza',
        permanent: true,
      },
      {
        source: '/servizi/pellicole-decorative',
        destination: '/servizi#decorative',
        permanent: true,
      },
      {
        source: '/servizi/pellicole-decorative/',
        destination: '/servizi#decorative',
        permanent: true,
      },
    ];

    return redirects.map((redirect) => {
      if (!redirect.destination?.startsWith('/prodotti/')) {
        return redirect;
      }

      const { permanent, ...productRedirect } = redirect;
      return {
        ...productRedirect,
        statusCode: redirect.statusCode || 301,
      };
    });
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src/next/router-shim.js');
    config.resolve.alias['react-helmet-async'] = path.resolve(__dirname, 'src/next/helmet-shim.js');
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
