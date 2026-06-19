const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: '/approfondimenti/pellicole-fotocromatiche',
        destination: '/api/gone',
      },
      {
        source: '/approfondimenti/pellicole-fotocromatiche/',
        destination: '/api/gone',
      },
      {
        source: '/approfondimenti/guida-pellicola-lcd-switch-installazione',
        destination: '/api/gone',
      },
      {
        source: '/approfondimenti/guida-pellicola-lcd-switch-installazione/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/pellicole-per-vetri/pellicole-lcd-switch',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/pellicole-per-vetri/pellicole-lcd-switch/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/false-parent/battle-plan-mensile-tc-2025',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/false-parent/battle-plan-mensile-tc-2025/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/chiusura-lavori',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/chiusura-lavori/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/false-parent/line-up-settimanale-tc-2025',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/false-parent/line-up-settimanale-tc-2025/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/false-parent',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/false-parent/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/llms-txt',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/llms-txt/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/zoho-callback',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/zoho-callback/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/anagrafica-privati-v2',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/anagrafica-privati-v2/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/anagrafica-aziende-enti-operativa',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/anagrafica-aziende-enti-operativa/',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/anagrafica-tributaria-aziende-enti',
        destination: '/api/gone',
      },
      {
        source: '/pellicole-per-vetri/anagrafica-tributaria-aziende-enti/',
        destination: '/api/gone',
      },
    ];
  },
  async redirects() {
    const redirects = [
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
        source: '/info/norme-di-riferimento',
        destination: '/info/norme/',
        permanent: true,
      },
      {
        source: '/info/norme-di-riferimento/',
        destination: '/info/norme/',
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
