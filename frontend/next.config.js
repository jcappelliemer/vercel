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
        destination: '/prodotti/ssn-70-te-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/tecnosolarssn50tesr/',
        destination: '/prodotti/ssn-70-te-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/tecnosolar-ssn-50-te-sr',
        destination: '/prodotti/ssn-70-te-sr/',
        permanent: true,
      },
      {
        source: '/prodotti/tecnosolar-ssn-50-te-sr/',
        destination: '/prodotti/ssn-70-te-sr/',
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
        source: '/info/certificazione-nfrc',
        destination: '/info/garanzie/',
        permanent: true,
      },
      {
        source: '/info/certificazione-nfrc/',
        destination: '/info/garanzie/',
        permanent: true,
      },
      {
        source: '/pagina-info/garanzie',
        destination: '/info/garanzie/',
        permanent: true,
      },
      {
        source: '/pagina-info/garanzie/',
        destination: '/info/garanzie/',
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
        source: '/blog',
        destination: '/lo-sapevi-che',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/lo-sapevi-che/:slug*',
        permanent: true,
      },
      {
        source: '/approfondimenti/guida-conformita-vetri-luoghi-pubblici',
        destination: '/lo-sapevi-che/guida-conformita-vetri-luoghi-pubblici/',
        permanent: true,
      },
      {
        source: '/approfondimenti/guida-conformita-vetri-luoghi-pubblici/',
        destination: '/lo-sapevi-che/guida-conformita-vetri-luoghi-pubblici/',
        permanent: true,
      },
      {
        source: '/approfondimenti/installatore-pellicole-vetri-nord-italia',
        destination: '/lo-sapevi-che/installatore-pellicole-vetri-nord-italia/',
        permanent: true,
      },
      {
        source: '/approfondimenti/installatore-pellicole-vetri-nord-italia/',
        destination: '/lo-sapevi-che/installatore-pellicole-vetri-nord-italia/',
        permanent: true,
      },
      {
        source: '/approfondimenti/migliori-pellicole-anti-uv-finestre',
        destination: '/lo-sapevi-che/migliori-pellicole-anti-uv-finestre/',
        permanent: true,
      },
      {
        source: '/approfondimenti/migliori-pellicole-anti-uv-finestre/',
        destination: '/lo-sapevi-che/migliori-pellicole-anti-uv-finestre/',
        permanent: true,
      },
      {
        source: '/approfondimenti/pellicola-privacy-vs-vetro-satinato',
        destination: '/lo-sapevi-che/pellicola-privacy-vs-vetro-satinato/',
        permanent: true,
      },
      {
        source: '/approfondimenti/pellicola-privacy-vs-vetro-satinato/',
        destination: '/lo-sapevi-che/pellicola-privacy-vs-vetro-satinato/',
        permanent: true,
      },
      {
        source: '/approfondimenti/pellicole-vetri-interne-o-esterne-cosa-scegliere',
        destination: '/lo-sapevi-che/pellicole-vetri-interne-o-esterne-cosa-scegliere/',
        permanent: true,
      },
      {
        source: '/approfondimenti/pellicole-vetri-interne-o-esterne-cosa-scegliere/',
        destination: '/lo-sapevi-che/pellicole-vetri-interne-o-esterne-cosa-scegliere/',
        permanent: true,
      },
      {
        source: '/approfondimenti/privacy-vetri-uffici-soluzioni-criteri',
        destination: '/lo-sapevi-che/privacy-vetri-uffici-soluzioni-criteri/',
        permanent: true,
      },
      {
        source: '/approfondimenti/privacy-vetri-uffici-soluzioni-criteri/',
        destination: '/lo-sapevi-che/privacy-vetri-uffici-soluzioni-criteri/',
        permanent: true,
      },
      {
        source: '/approfondimenti/pulizia-manutenzione-pellicole-vetri',
        destination: '/info/istruzioni-e-manutenzione/',
        permanent: true,
      },
      {
        source: '/approfondimenti/pulizia-manutenzione-pellicole-vetri/',
        destination: '/info/istruzioni-e-manutenzione/',
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
