export const LIVE_GROUPS = [
  {
    key: 'services',
    label: 'Servizi',
    path: '/servizi',
    types: ['category', 'service-index'],
  },
  {
    key: 'products',
    label: 'Prodotti',
    path: '/prodotti',
    types: ['product'],
  },
  {
    key: 'blog',
    label: 'Approfondimenti',
    path: '/blog',
    types: ['article', 'blog-category', 'film-type', 'author'],
  },
  {
    key: 'knowledge',
    label: 'Lo sapevi che?',
    path: '/lo-sapevi-che',
    types: ['knowledge-index'],
  },
  {
    key: 'info',
    label: 'Info',
    path: '/info',
    types: ['info'],
  },
  {
    key: 'focus',
    label: 'Focus tecnico',
    path: '/focus-tecnico',
    types: ['technical-focus'],
  },
  {
    key: 'local',
    label: 'Localita',
    path: '/servizio-locale',
    types: ['local-service'],
  },
];

export const DIRECTORY_CONFIG = {
  products: {
    title: 'Catalogo prodotti',
    highlight: 'MADICO',
    eyebrow: 'Prodotti',
    description: 'Tutte le schede prodotto importate dal sito live, ordinate nella nuova struttura URL.',
    path: '/prodotti',
    types: ['product'],
    emptyText: 'Nessun prodotto importato.',
  },
  blog: {
    title: 'Approfondimenti',
    highlight: 'tecnici',
    eyebrow: 'Blog',
    description: 'Guide, articoli e archivi presenti sul sito live, senza importare per ora le immagini editoriali.',
    path: '/blog',
    types: ['article'],
    secondaryTypes: ['blog-category', 'film-type', 'author'],
    emptyText: 'Nessun approfondimento importato.',
  },
  knowledge: {
    title: 'Lo sapevi che?',
    highlight: 'Solaris',
    eyebrow: 'Approfondimenti',
    description: 'Raccolta degli articoli e delle guide importate dal sito live, mantenendo una route dedicata per la sezione storica Lo sapevi che?.',
    path: '/lo-sapevi-che',
    types: ['article'],
    secondaryTypes: ['blog-category', 'film-type'],
    emptyText: 'Nessun articolo importato.',
  },
  info: {
    title: 'Informazioni',
    highlight: 'utili',
    eyebrow: 'Normative e supporto',
    description: 'Norme, garanzie, istruzioni, certificazioni e pagine informative presenti sul sito live.',
    path: '/info',
    types: ['info'],
    emptyText: 'Nessuna pagina informativa importata.',
  },
  focus: {
    title: 'Focus',
    highlight: 'tecnico',
    eyebrow: 'Tecnologia pellicole',
    description: 'Approfondimenti sulle famiglie di pellicole, le serie e le caratteristiche tecniche.',
    path: '/focus-tecnico',
    types: ['technical-focus'],
    emptyText: 'Nessun focus tecnico importato.',
  },
  local: {
    title: 'Servizio',
    highlight: 'locale',
    eyebrow: 'Copertura territoriale',
    description: 'Pagine locali importate dal sito live per mantenere il posizionamento geografico esistente.',
    path: '/servizio-locale',
    types: ['local-service'],
    emptyText: 'Nessuna pagina locale importata.',
  },
};

export const normalizePath = (pathname) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

export const cleanTitle = (title = '') => title
  .replace(/\s+-\s+Solaris Films$/i, '')
  .replace(/\s+–\s+Solaris Films$/i, '')
  .replace(/\s+/g, ' ')
  .trim();

export const getLiveTitle = (page = {}) => {
  const title = page.h1 || cleanTitle(page.title) || cleanTitle(page.seo?.title);
  return title || page.route?.label || 'Solaris Films';
};

export const getLiveDescription = (page = {}) => page.description || page.seo?.description || '';

export const getLivePath = (page = {}) => page.route?.newPath || page.path || '/';

export const byTitle = (a, b) => getLiveTitle(a).localeCompare(getLiveTitle(b), 'it');

export const filterByTypes = (pages = [], types = []) => (
  pages.filter((page) => types.includes(page.route?.type))
);

export const productGroupLabel = (page = {}) => {
  const oldPath = page.path || '';
  if (oldPath.includes('/le-pellicole-antisolari/')) return 'Pellicole antisolari';
  if (oldPath.includes('/pellicole-di-sicurezza/')) return 'Pellicole di sicurezza';
  if (oldPath.includes('/pellicole-decorative-per-vetri/')) return 'Pellicole decorative e privacy';
  return 'Altri prodotti';
};

export const liveGroupLabel = (page = {}, kind = '') => {
  if (kind === 'products') return productGroupLabel(page);
  if (kind === 'local') return 'Citta e aree servite';
  if (kind === 'info') return 'Pagine informative';
  if (kind === 'focus') return 'Focus tecnici';
  if (kind === 'knowledge') return 'Articoli Lo sapevi che?';
  if (kind === 'blog') return 'Articoli';
  return page.route?.label || 'Pagine';
};

export const groupPages = (pages = [], kind = '') => (
  pages.reduce((groups, page) => {
    const label = liveGroupLabel(page, kind);
    if (!groups[label]) groups[label] = [];
    groups[label].push(page);
    return groups;
  }, {})
);

export const getMenuPreview = (pages = [], types = [], limit = 6) => (
  filterByTypes(pages, types).sort(byTitle).slice(0, limit)
);
