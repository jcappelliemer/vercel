export const LIVE_GROUPS = [
  {
    key: 'services',
    label: 'Funzioni e servizi',
    path: '/servizi',
    types: ['category', 'service-index'],
  },
  {
    key: 'products',
    label: 'Catalogo prodotti',
    path: '/prodotti',
    types: ['product'],
  },
  {
    key: 'blog',
    label: 'Articoli e approfondimenti',
    path: '/blog',
    types: ['article', 'film-type'],
  },
  {
    key: 'knowledge',
    label: 'Lo sapevi che?',
    path: '/lo-sapevi-che',
    types: ['knowledge-index'],
  },
  {
    key: 'info',
    label: 'Pagine informative',
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
    label: 'Pagine locali',
    path: '/servizio-locale',
    types: ['local-service'],
  },
];

export const DIRECTORY_CONFIG = {
  products: {
    title: 'Catalogo prodotti',
    highlight: 'MADICO',
    eyebrow: 'Prodotti',
    description: 'Schede prodotto MADICO ordinate per funzione, prestazioni e collegamento alle soluzioni Solaris.',
    path: '/prodotti',
    types: ['product'],
    emptyText: 'Nessun prodotto disponibile.',
  },
  blog: {
    title: 'Guide e approfondimenti',
    highlight: 'tecnici',
    eyebrow: 'Blog',
    description: 'Guide Solaris per orientarsi tra controllo solare, sicurezza vetri, privacy e posa professionale.',
    path: '/blog',
    types: ['article'],
    secondaryTypes: ['film-type'],
    emptyText: 'Nessun approfondimento disponibile.',
  },
  knowledge: {
    title: 'Lo sapevi che?',
    highlight: 'Solaris',
    eyebrow: 'Domande pratiche',
    description: 'Risposte pratiche ai dubbi più frequenti su comfort, sicurezza, privacy e scelta della pellicola corretta.',
    path: '/lo-sapevi-che',
    types: ['article'],
    secondaryTypes: ['film-type'],
    emptyText: 'Nessun articolo disponibile.',
  },
  info: {
    title: 'Informazioni',
    highlight: 'utili',
    eyebrow: 'Normative e supporto',
    description: 'Norme, garanzie e istruzioni lette in funzione del vetro reale, della posa e della scelta Solaris.',
    path: '/info',
    types: ['info', 'faq'],
    emptyText: 'Nessuna pagina informativa disponibile.',
  },
  focus: {
    title: 'Focus',
    highlight: 'tecnico',
    eyebrow: 'Tecnologia pellicole',
    description: 'Guide Solaris per tradurre prestazioni, norme e limiti delle pellicole in una scelta verificabile sul vetro reale.',
    path: '/focus-tecnico',
    types: ['technical-focus'],
    emptyText: 'Nessun focus tecnico disponibile.',
  },
  local: {
    title: 'Pagine',
    highlight: 'locali',
    eyebrow: 'Copertura territoriale',
    description: 'Pagine locali Solaris per partire dalla città e arrivare a una verifica tecnica su vetro, obiettivo e posa.',
    path: '/servizio-locale',
    types: ['local-service'],
    emptyText: 'Nessuna pagina locale disponibile.',
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

const titleCaseIfUpper = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed || trimmed !== trimmed.toUpperCase()) return trimmed;
  return trimmed
    .toLocaleLowerCase('it')
    .replace(/(^|\s|-)([a-z])/g, (match) => match.toLocaleUpperCase('it'));
};

const isGenericLiveTitle = (value = '') => (
  ['pellicole per vetri adesive', 'solaris films'].includes(cleanTitle(value).toLocaleLowerCase('it'))
);

export const getLiveTitle = (page = {}) => {
  const routeType = page.route?.type;
  const candidates = ['article', 'blog-category', 'film-type', 'author'].includes(routeType)
    ? [page.seo?.title, page.title, page.h1]
    : [page.h1, page.seo?.title, page.title];
  const title = candidates
    .map((candidate) => titleCaseIfUpper(cleanTitle(candidate || '')))
    .find((candidate) => candidate && !isGenericLiveTitle(candidate));
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

const EXCLUDED_SOLARIS_TERMS = [
  /fotocromatic/i,
  /\bcromia\b/i,
  /\bserie\s*nt\b/i,
  /\bnt\b/i,
  /\bnt[\s-]*20\b/i,
  /\bnt[\s-]*35\b/i,
  /tecnosolar/i,
  /tecnosolarnt20/i,
  /tecnosolarnt35/i,
];

export const hasExcludedSolarisReference = (value = '') => {
  const text = String(value || '');
  return EXCLUDED_SOLARIS_TERMS.some((pattern) => pattern.test(text));
};

export const isExcludedSolarisPage = (page = {}) => {
  const haystack = [
    page.url,
    page.path,
    page.route?.newPath,
    page.title,
    page.h1,
    page.description,
    page.seo?.title,
    page.seo?.description,
  ].join(' ');

  return hasExcludedSolarisReference(haystack);
};
