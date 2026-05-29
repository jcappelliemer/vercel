const pathSlug = (page = {}) => {
  const value = page.route?.newPath || page.path || '';
  return value.split('/').filter(Boolean).pop() || '';
};

const productAsset = (slug, label = 'Scheda prodotto MADICO') => ({
  src: `/assets/imported/products/${slug}.webp`,
  alt: `${slug.replace(/-/g, ' ')} Solaris Films`,
  label,
  caption: 'Visuale prodotto per una lettura rapida della soluzione prima dei dettagli tecnici.',
});

export const PRODUCT_VISUALS = {
  'madico-sb-20-e-ps-sr': productAsset('madicosb20epssr'),
  madicosb20epssr: productAsset('madicosb20epssr'),
  'madico-sb-35-e-ps-sr': productAsset('madicosb35epssr'),
  madicosb35epssr: productAsset('madicosb35epssr'),
  'madico-sg-20-e-ps-sr': productAsset('madicosg20epssr'),
  madicosg20epssr: productAsset('madicosg20epssr'),
  'madico-sl-8-e-ps-sr': productAsset('madicosl8epssr'),
  madicosl8epssr: productAsset('madicosl8epssr'),
  'ssn-50-te-sr': productAsset('tecnosolarssn50tesr'),
  'ssn-70-te-sr': productAsset('tecnosolarssn50tesr'),
  'madico-rs-20-e-ps-sr': productAsset('madico-rs-20-e-ps-sr'),
  'madico-rs-40-e-ps-sr': {
    src: '/assets/imported/products/RS40EPSSR.jpg',
    alt: 'Madico RS 40 E PS SR riflettente argento chiaro',
    label: 'Scheda prodotto MADICO',
    caption: 'Visuale prodotto per una lettura rapida della soluzione prima dei dettagli tecnici.',
  },
  'madico-rs-20-ps-sr-4mil': productAsset('madico-rs-20-ps-sr-4mil'),
  'madico-rs-20-ps-sr-8mil': productAsset('madico-rs-20-ps-sr-8-mil'),
  'madico-rs-20-ps-sr-8-mil': productAsset('madico-rs-20-ps-sr-8-mil'),
  'madico-rs-40-ps-sr-4mil': productAsset('madico-rs-40-ps-sr-4-mil'),
  'madico-rs-40-ps-sr-4-mil': productAsset('madico-rs-40-ps-sr-4-mil'),
  'madico-rs-40-ps-sr-8mil': productAsset('madico-rs-40-ps-sr-8-mil'),
  'madico-rs-40-ps-sr-8-mil': productAsset('madico-rs-40-ps-sr-8-mil'),
  'madico-safetyshield-800': productAsset('madico-safetyshield-800', 'Prodotto SafetyShield'),
  'madico-safetyshield-1500': productAsset('madico-safetyshield-1500', 'Prodotto SafetyShield'),
  'madico-cl-400-e-ps-sr': productAsset('madico-cl-400-e-ps-sr'),
  'madico-cl-400-ps-sr': productAsset('madico-cl-400-ps-sr'),
  'madico-cl-700-e-ps-sr': productAsset('madico-cl-700-e-ps-sr'),
  'madico-cl-700-ps-sr': productAsset('madico-cl-700-ps-sr'),
  'madico-gullwing': productAsset('madico-gullwing', 'Sistema di ancoraggio'),
  'madico-mt-200-xw': productAsset('madico-mt-200-xw', 'Prodotto privacy e design'),
  vetrofanie: {
    src: '/assets/imported/products/vetrofanie-optimized.webp',
    alt: 'Vetrofanie Solaris',
    label: 'Vetrofanie Solaris',
    caption: 'Immagine prodotto ottimizzata per migliorare velocita di caricamento e resa visiva della scheda.',
  },
};

export const LOCAL_SERVICE_LOGOS = {
  ancona: { src: '/assets/imported/local-logos/ancona.webp', alt: 'Solaris Ancona' },
  aosta: { src: '/assets/imported/local-logos/aosta.webp', alt: 'Solaris Aosta' },
  bari: { src: '/assets/imported/local-logos/bari.webp', alt: 'Solaris Bari' },
  bologna: { src: '/assets/imported/local-logos/bologna.webp', alt: 'Solaris Bologna' },
  campobasso: { src: '/assets/imported/local-logos/campobasso.webp', alt: 'Solaris Campobasso' },
  catanzaro: { src: '/assets/imported/local-logos/catanzaro.webp', alt: 'Solaris Catanzaro' },
  cosenza: { src: '/assets/imported/local-logos/cosenza.webp', alt: 'Solaris Cosenza' },
  firenze: { src: '/assets/imported/local-logos/firenze.webp', alt: 'Solaris Firenze' },
  genova: { src: '/assets/imported/local-logos/genova.webp', alt: 'Solaris Genova' },
  laquila: { src: '/assets/imported/local-logos/laquila.webp', alt: "Solaris L'Aquila" },
  milano: { src: '/assets/imported/local-logos/milano.webp', alt: 'Solaris Milano' },
  napoli: { src: '/assets/imported/local-logos/napoli.webp', alt: 'Solaris Napoli' },
  palermo: { src: '/assets/imported/local-logos/palermo.webp', alt: 'Solaris Palermo' },
  perugia: { src: '/assets/imported/local-logos/perugia.webp', alt: 'Solaris Perugia' },
  potenza: { src: '/assets/imported/local-logos/potenza.webp', alt: 'Solaris Potenza' },
  roma: { src: '/assets/imported/local-logos/roma.webp', alt: 'Solaris Roma' },
  romagna: { src: '/assets/imported/local-logos/romagna.webp', alt: 'Solaris Romagna' },
  torino: { src: '/assets/imported/local-logos/torino.webp', alt: 'Solaris Torino' },
  trento: { src: '/assets/imported/local-logos/trento.webp', alt: 'Solaris Trento' },
  trieste: { src: '/assets/imported/local-logos/trieste.webp', alt: 'Solaris Trieste' },
  udine: { src: '/assets/imported/local-logos/udine.webp', alt: 'Solaris Udine' },
  venezia: { src: '/assets/imported/local-logos/venezia.webp', alt: 'Solaris Venezia' },
};

export const getProductVisual = (page = {}) => PRODUCT_VISUALS[pathSlug(page)] || null;

export const getLocalServiceLogo = (page = {}) => LOCAL_SERVICE_LOGOS[pathSlug(page)] || null;
