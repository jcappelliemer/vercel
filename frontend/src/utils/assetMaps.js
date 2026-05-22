const pathSlug = (page = {}) => {
  const value = page.route?.newPath || page.path || '';
  return value.split('/').filter(Boolean).pop() || '';
};

const productAsset = (slug, label = 'Scheda prodotto MADICO') => ({
  src: `/assets/imported/products/${slug}.webp`,
  alt: `${slug.replace(/-/g, ' ')} Solaris Films`,
  label,
  caption: 'Immagine prodotto recuperata dagli asset Solaris per orientare meglio la scheda tecnica.',
});

export const PRODUCT_VISUALS = {
  madicosb20epssr: productAsset('madicosb20epssr'),
  madicosb35epssr: productAsset('madicosb35epssr'),
  madicosg20epssr: productAsset('madicosg20epssr'),
  madicosl8epssr: productAsset('madicosl8epssr'),
  'madico-rs-20-e-ps-sr': productAsset('madico-rs-20-e-ps-sr'),
  'madico-rs-40-e-ps-sr': productAsset('madico-rs-40-e-ps-sr'),
  'madico-rs-20-ps-sr-4mil': productAsset('madico-rs-20-ps-sr-4mil'),
  'madico-rs-20-ps-sr-8-mil': productAsset('madico-rs-20-ps-sr-8-mil'),
  'madico-rs-40-ps-sr-4-mil': productAsset('madico-rs-40-ps-sr-4-mil'),
  'madico-rs-40-ps-sr-8-mil': productAsset('madico-rs-40-ps-sr-8-mil'),
  'madico-safetyshield-800': productAsset('madico-safetyshield-800', 'Scheda prodotto SafetyShield'),
  'madico-safetyshield-1500': productAsset('madico-safetyshield-1500', 'Scheda prodotto SafetyShield'),
  'madico-cl-400-e-ps-sr': productAsset('madico-cl-400-e-ps-sr'),
  'madico-cl-400-ps-sr': productAsset('madico-cl-400-ps-sr'),
  'madico-cl-700-e-ps-sr': productAsset('madico-cl-700-e-ps-sr'),
  'madico-cl-700-ps-sr': productAsset('madico-cl-700-ps-sr'),
  'madico-gullwing': productAsset('madico-gullwing', 'Sistema di ancoraggio'),
  'madico-mt-200-xw': productAsset('madico-mt-200-xw', 'Scheda privacy e design'),
  vetrofanie: {
    src: '/assets/imported/products/vetrofanie-optimized.webp',
    alt: 'Vetrofanie Solaris',
    label: 'Vetrofanie Solaris',
    caption: 'Immagine prodotto ottimizzata per migliorare velocita di caricamento e resa visiva della scheda.',
  },
};

export const LOCAL_SERVICE_LOGOS = {
  bologna: { src: '/assets/imported/local-logos/bologna.webp', alt: 'Solaris Bologna' },
  cosenza: { src: '/assets/imported/local-logos/cosenza.webp', alt: 'Solaris Cosenza' },
  milano: { src: '/assets/imported/local-logos/milano.webp', alt: 'Solaris Milano' },
  napoli: { src: '/assets/imported/local-logos/napoli.webp', alt: 'Solaris Napoli' },
  perugia: { src: '/assets/imported/local-logos/perugia.webp', alt: 'Solaris Perugia' },
  roma: { src: '/assets/imported/local-logos/roma.webp', alt: 'Solaris Roma' },
  udine: { src: '/assets/imported/local-logos/udine.webp', alt: 'Solaris Udine' },
};

export const getProductVisual = (page = {}) => PRODUCT_VISUALS[pathSlug(page)] || null;

export const getLocalServiceLogo = (page = {}) => LOCAL_SERVICE_LOGOS[pathSlug(page)] || null;
