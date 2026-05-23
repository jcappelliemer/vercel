const normalizePath = (pathname = '') => {
  if (!pathname) return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const titleFromPage = (page = {}) => (
  page.h1
  || page.title?.replace(/\s+-\s+Solaris Films$/i, '').trim()
  || page.route?.label
  || 'Solaris Films'
);

export const SERVICE_FAMILIES = [
  {
    key: 'antisolari',
    route: '/servizi#antisolari',
    ctaRoute: '/focus-tecnico/pellicole-antisolari/',
    livePath: '/pellicole-per-vetri/le-pellicole-antisolari/',
    title: 'Pellicole antisolari',
    menuLabel: 'Pellicole Antisolari',
    eyebrow: 'Controllo solare',
    image: '/assets/generated/home/premium-antisolari.webp',
    headline: 'Riduzione del calore, meno abbagliamento e comfort negli edifici vetrati',
    description: 'La famiglia antisolare raccoglie le pellicole MADICO per schermare energia solare, raggi UV e abbagliamento senza interventi invasivi sui serramenti.',
    metaDescription: 'Pellicole antisolari Solaris Films per controllo solare, riduzione calore, protezione UV e risparmio energetico con prodotti MADICO e posa professionale.',
    menuRole: 'Indicata quando il problema principale è gestire calore, abbagliamento, raggi UV e comfort negli ambienti esposti.',
    productOldPathIncludes: ['/pellicole-per-vetri/le-pellicole-antisolari/'],
    focusPaths: [
      '/focus-tecnico/pellicole-antisolari/',
      '/focus-tecnico/pellicole-antisolari-sputtered/',
      '/focus-tecnico/pellicole-antisolari-sunscape/',
      '/focus-tecnico/pellicole-oscuranti-per-vetri/',
      '/focus-tecnico/pellicole-riflettenti/',
      '/focus-tecnico/pellicole-spettro-selettive/',
    ],
    stats: [
      { value: '99%', label: 'raggi UV schermati' },
      { value: '7/8°C', label: 'riduzione temperatura possibile' },
      { value: '10 anni', label: 'garanzia applicabile' },
      { value: '8', label: 'schede prodotto collegate' },
    ],
    benefits: [
      'Riduce il surriscaldamento degli ambienti esposti al sole.',
      'Limita abbagliamento e scolorimento dovuto ai raggi UV.',
      'Migliora il rendimento energetico senza sostituire i vetri.',
      'Permette di scegliere finiture neutre, riflettenti o selettive.',
    ],
    decisionPoints: [
      'Esposizione e orientamento della facciata.',
      'Necessita di luce naturale o effetto schermante maggiore.',
      'Tipo di vetro e possibilità di posa interna o esterna.',
    ],
  },
  {
    key: 'sicurezza',
    route: '/servizi#sicurezza',
    ctaRoute: '/focus-tecnico/pellicole-di-sicurezza/',
    livePath: '/pellicole-per-vetri/pellicole-di-sicurezza/',
    title: 'Pellicole di sicurezza',
    menuLabel: 'Pellicole di Sicurezza',
    eyebrow: 'Sicurezza vetri',
    image: '/assets/generated/home/premium-sicurezza.webp',
    headline: 'Vetri più sicuri contro rottura, schegge, urti e scenari ad alto rischio',
    description: 'La famiglia sicurezza comprende pellicole antischeggia, antisfondamento, antiesplosione e sistemi di ancoraggio per aumentare la protezione delle superfici vetrate.',
    metaDescription: 'Pellicole di sicurezza Solaris Films per vetri: antischeggia, antisfondamento, antiesplosione, UNI EN 12600 e posa professionale MADICO.',
    menuRole: 'Indicata quando il vetro deve trattenere i frammenti, aumentare la resistenza o rispondere a requisiti di sicurezza.',
    productOldPathIncludes: ['/pellicole-per-vetri/pellicole-di-sicurezza/'],
    focusPaths: [
      '/focus-tecnico/pellicole-di-sicurezza/',
      '/focus-tecnico/pellicole-di-sicurezza-neutre-la-serie-cl/',
      '/focus-tecnico/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/',
      '/focus-tecnico/pellicole-antisolari-di-sicurezza-la-serie-rs/',
      '/focus-tecnico/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/',
    ],
    stats: [
      { value: 'UNI EN 12600', label: 'riferimento sicurezza vetri' },
      { value: '4/8 mil', label: 'spessori ricorrenti' },
      { value: '11', label: 'schede prodotto collegate' },
      { value: 'posa rapida', label: 'non invasiva sui vetri esistenti' },
    ],
    benefits: [
      'Trattiene i frammenti in caso di rottura del vetro.',
      'Aiuta ad adeguare vetri datati o in posizioni pericolose.',
      'Integra soluzioni antisolari dove serve anche controllo termico.',
      'Copre scenari professionali, pubblici, industriali e privati.',
    ],
    decisionPoints: [
      "Classe di rischio del vetro e destinazione d'uso.",
      'Richiesta antischeggia, antisfondamento o antiesplosione.',
      'Compatibilita con telaio, ancoraggi e normative applicabili.',
    ],
  },
  {
    key: 'decorative',
    route: '/servizi#decorative',
    ctaRoute: '/focus-tecnico/pellicole-decorative/',
    livePath: '/pellicole-per-vetri/pellicole-decorative-per-vetri/',
    title: 'Pellicole privacy e design',
    menuLabel: 'Pellicole Privacy & Design',
    eyebrow: 'Privacy e immagine',
    image: '/assets/generated/home/premium-privacy-design.webp',
    headline: 'Discrezione, vetrofanie e superfici vetrate coordinate con il progetto',
    description: 'La famiglia decorativa raccoglie soluzioni satinate, privacy, stampabili e vetrofanie per gestire visibilità, brand e design degli ambienti.',
    metaDescription: 'Pellicole decorative, privacy e vetrofanie Solaris Films per uffici, negozi e ambienti professionali con posa su misura.',
    menuRole: 'Indicata quando servono privacy visiva, immagine coordinata, segnaletica o una finitura decorativa su superfici vetrate.',
    productOldPathIncludes: ['/pellicole-per-vetri/pellicole-decorative-per-vetri/'],
    focusPaths: [
      '/focus-tecnico/pellicole-decorative/',
      '/focus-tecnico/pellicole-decorative-privacy/',
      '/focus-tecnico/pellicole-antisolari-stampabili-e-vetrofanie/',
    ],
    stats: [
      { value: 'privacy', label: 'visiva e funzionale' },
      { value: 'su misura', label: 'grafica e taglio' },
      { value: 'brand', label: 'grafica e segnaletica' },
      { value: '2', label: 'schede prodotto collegate' },
    ],
    benefits: [
      'Aumenta la privacy mantenendo ordine visivo e luminosità.',
      'Permette vetrofanie, loghi e pattern coordinati al brand.',
      'Evita lavori invasivi su pareti o serramenti esistenti.',
      'Chiarisce i limiti reali delle pellicole privacy nelle diverse condizioni di luce.',
    ],
    decisionPoints: [
      'Livello di privacy richiesto di giorno e di sera.',
      'Presenza di grafiche, loghi o segnaletica obbligatoria.',
      'Ambiente di posa: ufficio, negozio, hotel, showroom o abitazione.',
    ],
  },
];

export const getServiceFamilyByPath = (pathname = '') => {
  const normalized = normalizePath(pathname);
  return SERVICE_FAMILIES.find((family) => (
    normalizePath(family.route) === normalized
    || normalizePath(family.livePath) === normalized
  ));
};

export const getServiceFamilyForPage = (page = {}) => (
  getServiceFamilyByPath(page.route?.newPath)
  || getServiceFamilyByPath(page.path)
);

export const getServiceFamilyForProductPage = (page = {}) => {
  if (page.route?.type !== 'product') return null;
  return SERVICE_FAMILIES.find((family) => (
    family.productOldPathIncludes.some((token) => page.path?.includes(token))
  ));
};

export const getServicePageForFamily = (pages = [], family) => {
  if (!family) return null;
  return pages.find((page) => normalizePath(page.route?.newPath) === normalizePath(family.route))
    || pages.find((page) => normalizePath(page.path) === normalizePath(family.livePath));
};

export const getProductsForFamily = (pages = [], family) => {
  if (!family) return [];
  return pages
    .filter((page) => page.route?.type === 'product')
    .filter((page) => family.productOldPathIncludes.some((token) => page.path?.includes(token)))
    .sort((a, b) => titleFromPage(a).localeCompare(titleFromPage(b), 'it'));
};

export const getServiceFamilyForFocusPage = (page = {}) => {
  if (page.route?.type !== 'technical-focus') return null;
  const normalized = normalizePath(page.route?.newPath || page.path);
  return SERVICE_FAMILIES.find((family) => (
    family.focusPaths.some((focusPath) => normalizePath(focusPath) === normalized)
  )) || null;
};

export const getFocusForFamily = (pages = [], family) => {
  if (!family) return [];
  const focusPathSet = new Set(family.focusPaths.map(normalizePath));
  return pages
    .filter((page) => page.route?.type === 'technical-focus')
    .filter((page) => focusPathSet.has(normalizePath(page.route?.newPath)))
    .sort((a, b) => {
      const aIndex = family.focusPaths.indexOf(normalizePath(a.route?.newPath));
      const bIndex = family.focusPaths.indexOf(normalizePath(b.route?.newPath));
      return aIndex - bIndex;
    });
};

export const getServiceFamilyCards = (pages = []) => (
  SERVICE_FAMILIES.map((family) => ({
    ...family,
    page: getServicePageForFamily(pages, family),
    products: getProductsForFamily(pages, family),
    focus: getFocusForFamily(pages, family),
  }))
);

export const getPageTitle = titleFromPage;
