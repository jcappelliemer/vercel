const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/focus-tecnico/pellicole-termoisolanti',
        destination: '/focus-tecnico/pellicole-antisolari/',
        permanent: true,
      },
      {
        source: '/focus-tecnico/pellicole-termoisolanti/',
        destination: '/focus-tecnico/pellicole-antisolari/',
        permanent: true,
      },
      {
        source: '/prodotti/tecnosolarssn50tesr',
        destination: '/servizi#antisolari',
        permanent: true,
      },
      {
        source: '/prodotti/madico-sb-20-e-ps-sr',
        destination: '/prodotti/madicosb20epssr/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-sb-35-e-ps-sr',
        destination: '/prodotti/madicosb35epssr/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-sg-20-e-ps-sr',
        destination: '/prodotti/madicosg20epssr/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-sl-8-e-ps-sr',
        destination: '/prodotti/madicosl8epssr/',
        permanent: true,
      },
      {
        source: '/prodotti/ssn-50-te-sr',
        destination: '/servizi#antisolari',
        permanent: true,
      },
      {
        source: '/prodotti/madico-rs-20-ps-sr-8mil',
        destination: '/prodotti/madico-rs-20-ps-sr-8-mil/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-rs-40-ps-sr-4mil',
        destination: '/prodotti/madico-rs-40-ps-sr-4-mil/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-rs-40-ps-sr-8mil',
        destination: '/prodotti/madico-rs-40-ps-sr-8-mil/',
        permanent: true,
      },
      {
        source: '/prodotti/tecnosolarssn50tesr/',
        destination: '/servizi#antisolari',
        permanent: true,
      },
      {
        source: '/prodotti/madico-sb-20-e-ps-sr/',
        destination: '/prodotti/madicosb20epssr/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-sb-35-e-ps-sr/',
        destination: '/prodotti/madicosb35epssr/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-sg-20-e-ps-sr/',
        destination: '/prodotti/madicosg20epssr/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-sl-8-e-ps-sr/',
        destination: '/prodotti/madicosl8epssr/',
        permanent: true,
      },
      {
        source: '/prodotti/ssn-50-te-sr/',
        destination: '/servizi#antisolari',
        permanent: true,
      },
      {
        source: '/prodotti/madico-rs-20-ps-sr-8mil/',
        destination: '/prodotti/madico-rs-20-ps-sr-8-mil/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-rs-40-ps-sr-4mil/',
        destination: '/prodotti/madico-rs-40-ps-sr-4-mil/',
        permanent: true,
      },
      {
        source: '/prodotti/madico-rs-40-ps-sr-8mil/',
        destination: '/prodotti/madico-rs-40-ps-sr-8-mil/',
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
        source: '/pellicole-termoisolanti',
        destination: '/focus-tecnico/pellicole-antisolari/',
        permanent: true,
      },
      {
        source: '/pellicole-termoisolanti/',
        destination: '/focus-tecnico/pellicole-antisolari/',
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
      {
        source: '/info/certificazione-nfrc',
        destination: '/info/garanzie-clienti/',
        permanent: true,
      },
      {
        source: '/info/certificazione-nfrc/',
        destination: '/info/garanzie-clienti/',
        permanent: true,
      },
      {
        source: '/pagina-info/garanzie',
        destination: '/info/garanzie-clienti/',
        permanent: true,
      },
      {
        source: '/pagina-info/garanzie/',
        destination: '/info/garanzie-clienti/',
        permanent: true,
      },
      {
        source: '/info/garanzie',
        destination: '/info/garanzie-clienti/',
        permanent: true,
      },
      {
        source: '/info/garanzie/',
        destination: '/info/garanzie-clienti/',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/lo-sapevi-che',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/lo-sapevi-che/:slug*',
        permanent: true,
      },
    ];
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
