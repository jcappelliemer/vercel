import { Link } from '@/next/router-shim';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Buildings, Certificate, FolderOpen, Lightbulb, LinkSimple, MapPin, MagnifyingGlass, Phone, ShieldCheck, Tag } from '@phosphor-icons/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { useLivePages } from '../hooks/useLivePages';
import {
  DIRECTORY_CONFIG,
  byTitle,
  filterByTypes,
  getLiveDescription,
  getLivePath,
  getLiveTitle,
  groupPages,
} from '../utils/liveContent';
import { SERVICE_FAMILIES, getFocusForFamily, getProductsForFamily } from '../utils/serviceFamilies';
import { getLocalServiceLogo, getProductVisual } from '../utils/assetMaps';

const CITY_NAME_OVERRIDES = {
  laquila: "L'Aquila",
};

const cityNameFromPage = (page = {}) => {
  const slug = (getLivePath(page) || '')
    .split('/')
    .filter(Boolean)
    .pop() || '';

  if (!slug) return getLiveTitle(page);
  if (CITY_NAME_OVERRIDES[slug]) return CITY_NAME_OVERRIDES[slug];

  return slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const byCityName = (a, b) => cityNameFromPage(a).localeCompare(cityNameFromPage(b), 'it');

const productFallbackByFamily = {
  antisolari: 'Scheda prodotto per controllo solare, riduzione del calore, protezione UV e comfort degli edifici vetrati.',
  sicurezza: 'Scheda prodotto per aumentare sicurezza del vetro, contenimento frammenti, antisfondamento o scenari ad alto rischio.',
  decorative: 'Scheda prodotto per privacy, vetrofanie, finiture decorative e superfici vetrate coordinate al progetto.',
};

const productTags = (page = {}, family) => {
  const title = getLiveTitle(page);
  const tags = [family?.eyebrow || 'Prodotto'];

  if (/madico/i.test(title)) tags.push('MADICO');
  if (/safetyshield/i.test(title)) tags.push('SafetyShield');
  if (/gullwing/i.test(title)) tags.push('Ancoraggio');
  if (/\bCL\b/i.test(title)) tags.push('Serie CL');
  if (/\bRS\b/i.test(title)) tags.push('Serie RS');
  if (/vetrofanie/i.test(title)) tags.push('Vetrofanie');

  return [...new Set(tags)].slice(0, 3);
};

const DIRECTORY_VISUALS = {
  productsHero: '/assets/generated/home/decision-assessment.webp',
  productsCta: '/assets/generated/home/cta-consultation.webp',
  focusHero: '/assets/generated/home/focus-performance.webp',
  focusCta: '/assets/generated/home/need-consulenza-tecnica.webp',
  infoHero: '/assets/generated/main-pages/info-supporto-tecnico.webp',
  localHero: '/assets/generated/main-pages/servizio-locale-copertura.webp',
};

const ProductCard = ({ page, family, index }) => {
  const title = getLiveTitle(page);
  const description = getLiveDescription(page) || productFallbackByFamily[family?.key] || 'Scheda prodotto Solaris Films per pellicole professionali.';
  const path = getLivePath(page);
  const familyKey = family?.key || 'default';
  const visual = getProductVisual(page);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.025, 0.24) }}
    >
      <Link
        to={path}
        className={`product-directory-product-card product-directory-product-card-${familyKey}`}
        data-testid={`product-directory-card-${index}`}
      >
        {visual && (
          <figure className={`product-directory-product-image product-directory-product-image-${familyKey}`}>
            <img src={visual.src} alt={visual.alt || title} loading="lazy" />
          </figure>
        )}
        <div className="product-directory-product-head">
          <span>{family?.menuLabel || 'Prodotto Solaris'}</span>
          <ArrowRight size={18} weight="bold" />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="product-directory-tags" aria-label="Caratteristiche prodotto">
          {productTags(page, family).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
};

const articleFamilyForPage = (page = {}) => {
  const text = [
    getLiveTitle(page),
    getLiveDescription(page),
    page.path,
    page.route?.newPath,
  ].join(' ').toLocaleLowerCase('it');

  if (/(sicurezza|antisfond|antiesplos|antischegg|safety|rottura|framment|uni en|norma|scuol|graffiti|vandal)/i.test(text)) {
    return SERVICE_FAMILIES.find((family) => family.key === 'sicurezza');
  }

  if (/(privacy|design|decorativ|satinat|vetrofanie|anti sguardo|uffici|bagno|porte in vetro|brand|vetrine)/i.test(text)) {
    return SERVICE_FAMILIES.find((family) => family.key === 'decorative');
  }

  if (/(solar|calore|termic|oscurant|riflett|specchio|uv|infraross|energia|vlt|termoisol|spettro|facciate|abbagliamento|consumi|risparmio|tende)/i.test(text)) {
    return SERVICE_FAMILIES.find((family) => family.key === 'antisolari');
  }

  return null;
};

const articleTags = (page = {}, family) => {
  const text = `${getLiveTitle(page)} ${getLiveDescription(page)} ${page.path}`.toLocaleLowerCase('it');
  const tags = [family?.eyebrow || 'Guida Solaris'];

  if (/guida|come|sceglier/i.test(text)) tags.push('Guida');
  if (/norma|uni en|certificat/i.test(text)) tags.push('Norme');
  if (/costo|preventivo|prezzo/i.test(text)) tags.push('Preventivo');
  if (/garanzia|durata/i.test(text)) tags.push('Garanzia');
  if (/scuol/i.test(text)) tags.push('Scuole');
  if (/fake news|fals/i.test(text)) tags.push('Chiarezza');

  return [...new Set(tags)].slice(0, 3);
};

const articleFamilyPathCopy = {
  antisolari: 'Guide su calore, abbagliamento, raggi UV e comfort per capire quando serve una pellicola di controllo solare.',
  sicurezza: 'Approfondimenti su rischio vetro, frammenti, norme e protezione per scegliere una soluzione di sicurezza coerente.',
  decorative: 'Risposte su privacy, luce, vetrofanie e immagine degli ambienti per usare il vetro in modo più funzionale.',
};

const articleDirectoryCopy = {
  blog: {
    seoTitle: 'Blog Solaris | Guide tecniche pellicole per vetri',
    kicker: 'Blog Solaris',
    title: 'Guide tecniche e casi pratici sulle pellicole per vetri',
    intro:
      'Approfondimenti per orientarsi tra controllo solare, sicurezza e privacy: spiegano il problema, chiariscono cosa verificare e collegano la lettura alla consulenza Solaris.',
    panelLabel: 'guide selezionate',
    panelTitle: 'Un punto di partenza per scegliere con più criterio',
    panelText:
      'Ogni articolo aiuta a riconoscere il bisogno, evitare scelte generiche e capire quando conviene passare alla verifica tecnica sul vetro.',
    statArticles: 'guide e approfondimenti Solaris',
    statFamilies: 'aree di intervento collegate ai servizi',
    statSecondary: 'temi tecnici collegati',
    featuredKicker: 'Da leggere prima',
    featuredTitle: 'Guide utili per arrivare a una scelta più chiara',
    featuredText:
      'Gli articoli in evidenza aiutano a inquadrare casi frequenti: calore, sicurezza, privacy, costi, durata e limiti reali delle pellicole.',
    pathsKicker: "Scegli l'area",
    pathsTitle: "Trova l'approfondimento partendo dal bisogno",
    pathsText:
      'Se il problema è calore, rischio vetro o privacy, entra dalla famiglia corretta e confronta le guide prima di richiedere una verifica.',
    bodyKicker: 'Approfondimenti per area',
    bodyTitle: 'Tutte le guide Solaris',
    bodyText:
      'Ogni raccolta mantiene un taglio pratico: capire il problema, individuare il criterio tecnico e arrivare a una richiesta più precisa.',
    generalKicker: 'Guide trasversali',
    generalTitle: 'Scelta, confronto e domande frequenti',
    relatedKicker: 'Percorsi collegati',
    relatedTitle: 'Temi tecnici da tenere a portata di mano',
    relatedText:
      'Alcuni contenuti funzionano come ponte tra articoli, focus e prodotti: aiutano a leggere meglio le soluzioni disponibili.',
    ctaKicker: 'Dopo la lettura',
    ctaTitle: 'Porta il dubbio sul tuo vetro reale',
    ctaText:
      'Se una guida descrive il tuo caso, Solaris può verificare vetro, esposizione, obiettivo e posa per indicare una soluzione concreta.',
    inventory:
      'Guide Solaris organizzate per passare da un dubbio iniziale a una scelta più consapevole su prodotto e posa.',
  },
  knowledge: {
    seoTitle: 'Lo sapevi che?',
    kicker: 'Lo sapevi che?',
    title: 'Domande pratiche sulle pellicole per vetri',
    intro:
      'Risposte brevi e orientate alla scelta: chiariscono dubbi ricorrenti, spiegano pro e contro e indicano quando serve una verifica Solaris.',
    panelLabel: 'risposte utili',
    panelTitle: 'Dubbi frequenti, risposte utili e prossimo passo chiaro',
    panelText:
      'La raccolta aiuta a capire cosa può fare una pellicola, cosa va verificato sul vetro e quando conviene chiedere una consulenza.',
    statArticles: 'risposte e guide pratiche',
    statFamilies: 'aree Solaris collegate',
    statSecondary: 'temi tecnici di supporto',
    featuredKicker: 'Dubbi ricorrenti',
    featuredTitle: 'Le risposte più utili prima di decidere',
    featuredText:
      'Parti da qui per distinguere promesse generiche, limiti reali e verifiche necessarie su controllo solare, sicurezza e privacy.',
    pathsKicker: 'Da quale dubbio parti?',
    pathsTitle: 'Calore, sicurezza o privacy: filtra le risposte',
    pathsText:
      'Le domande sono ordinate per bisogno, così puoi passare dal dubbio iniziale alla soluzione Solaris più vicina al tuo caso.',
    bodyKicker: 'Risposte per area',
    bodyTitle: 'Tutti i contenuti Lo sapevi che?',
    bodyText:
      'Una raccolta pensata per chiarire il linguaggio tecnico e aiutare il cliente a fare domande migliori prima della posa.',
    generalKicker: 'Domande trasversali',
    generalTitle: 'Scelta, confronto e falsi miti',
    relatedKicker: 'Temi collegati',
    relatedTitle: 'Percorsi utili per approfondire',
    relatedText:
      'Quando una risposta apre un tema più tecnico, questi percorsi aiutano a continuare la lettura senza perdere orientamento.',
    ctaKicker: 'Dal dubbio alla verifica',
    ctaTitle: 'Una risposta utile va confermata sul vetro',
    ctaText:
      'Solaris traduce il dubbio in una verifica concreta su vetro, esposizione, obiettivo e prodotto applicabile.',
    inventory: '',
  },
};

const articleFallbackDescription = (family) => (
  family
    ? `Approfondimento Solaris su ${family.title.toLocaleLowerCase('it')}, scelta della pellicola corretta e posa professionale.`
    : 'Approfondimento Solaris per scegliere pellicole per vetri con criteri tecnici, commerciali e applicativi chiari.'
);

const normalizeDirectoryPath = (pathname = '') => {
  if (!pathname) return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const normalizeKnowledgePath = (pathname = '') => {
  const normalized = normalizeDirectoryPath(pathname);
  if (normalized.startsWith('/blog/')) {
    return normalized.replace(/^\/blog\//, '/lo-sapevi-che/');
  }
  return normalized;
};

const filterPagesForKind = (pages = [], kind = '', types = []) => {
  const typed = filterByTypes(pages, types);
  const blockedFocusPaths = new Set(['/pellicole-termoisolanti/']);

  if (kind === 'knowledge') {
    return typed;
  }

  if (kind === 'focus') {
    return typed.filter((page) => !blockedFocusPaths.has(normalizeDirectoryPath(getLivePath(page))));
  }

  return typed;
};

const serviceFamilyRoute = (family = {}) => {
  if (family.key === 'antisolari') return '/servizi#antisolari';
  if (family.key === 'sicurezza') return '/servizi#sicurezza';
  if (family.key === 'decorative') return '/servizi#decorative';
  return family.route || '/servizi';
};

const stripGenericLiveDescription = (value = '') => String(value)
  .replace(/^DISTRIBUTORE DI PELLICOLE PER VETRI DAL 1983\s*/i, '')
  .replace(/^Solaris Films\s+-\s+Distributore esclusivo.*?1983\s*/i, '')
  .trim();

const resourceDescription = (page = {}, fallback = '') => {
  const cleaned = stripGenericLiveDescription(getLiveDescription(page));
  if (!cleaned || cleaned.length < 24) return fallback;
  return cleaned;
};

const focusFamilyForPage = (page = {}) => {
  const path = normalizeDirectoryPath(getLivePath(page));
  return SERVICE_FAMILIES.find((family) => (
    family.focusPaths.map(normalizeDirectoryPath).includes(path)
  )) || articleFamilyForPage(page);
};

const focusFallbackDescription = (family) => (
  family
    ? `Guida Solaris per capire quando scegliere ${family.title.toLocaleLowerCase('it')}, cosa verificare sul vetro e quali prodotti confrontare.`
    : 'Guida Solaris per trasformare un dubbio tecnico su prestazioni, norme o posa in una scelta verificabile.'
);

const focusUxDescriptions = {
  '/pellicole-antisolari/':
    'Quando il problema è calore, abbagliamento o raggi UV: guida per capire cosa misurare e quale livello di schermatura valutare.',
  '/pellicole-di-sicurezza/':
    'Guida per capire quando il vetro va messo in sicurezza, quali rischi ridurre e quali verifiche servono prima della posa.',
  '/pellicole-antisolari-sputtered/':
    'Spiega quando scegliere una pellicola sputtered: controllo solare più selettivo, resa estetica e compatibilità con il vetro.',
  '/pellicole-antisolari-sunscape/':
    'Percorso per valutare Sunscape quando serve comfort solare con una finitura esterna più discreta e controllata.',
  '/pellicole-oscuranti-per-vetri/':
    'Aiuta a distinguere privacy, oscuramento e controllo della luce, evitando scelte troppo scure o poco funzionali.',
  '/pellicole-riflettenti/':
    "Guida ai vantaggi e ai limiti dell'effetto riflettente su facciate, uffici e superfici esposte.",
  '/pellicole-spettro-selettive/':
    'Per capire quando una pellicola selettiva riduce calore mantenendo più luce naturale negli ambienti.',
  '/pellicole-di-sicurezza-neutre-la-serie-cl/':
    'Spiega quando usare una sicurezza neutra, quali spessori valutare e che ruolo ha la norma UNI EN 12600.',
  '/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/':
    'Percorso per scenari ad alto rischio: frammenti, pressione, ancoraggi e verifica tecnica prima della scelta.',
  '/pellicole-antisolari-di-sicurezza-la-serie-rs/':
    'Quando servono insieme controllo solare e sicurezza: guida per confrontare beneficio termico e protezione del vetro.',
  '/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/':
    'Per vetrine e superfici esposte: capire quando una protezione sacrificabile riduce costi e tempi di ripristino.',
  '/pellicole-decorative/':
    'Aiuta a scegliere finiture decorative, satinate o stampabili in base a privacy, luce e immagine dello spazio.',
  '/pellicole-antisolari-stampabili-e-vetrofanie/':
    'Guida per usare vetrofanie e grafiche senza perdere coerenza tra visibilità, brand e funzione del vetro.',
  '/pellicole-decorative-privacy/':
    'Per capire quanta privacy serve davvero, cosa cambia tra giorno e sera e quale finitura valutare.',
  '/pellicole-termoisolanti/':
    'Percorso per valutare isolamento e comfort su vetri esistenti, distinguendo beneficio reale, limiti e posa.',
};

const focusFamilyPathCopy = {
  antisolari: 'Riduci calore, abbagliamento e raggi UV partendo da esposizione, luce e tipo di vetro.',
  sicurezza: 'Capisci rischio, spessore e norma prima di scegliere una pellicola antischeggia o rinforzata.',
  decorative: 'Valuta privacy, luce e immagine coordinata prima di scegliere finitura, grafica o vetrofania.',
};

const focusResourceDescription = (page = {}, family) => (
  focusUxDescriptions[normalizeDirectoryPath(getLivePath(page))]
  || resourceDescription(page, focusFallbackDescription(family))
);

const focusTags = (page = {}, family) => {
  const text = `${getLiveTitle(page)} ${getLiveDescription(page)} ${page.path}`.toLocaleLowerCase('it');
  const tags = [family?.eyebrow || 'Focus tecnico'];

  if (/serie|cl|rs|safetyshield|graffiti free/i.test(text)) tags.push('Serie');
  if (/norm|uni|sicurezza|antiesplos|antisfond/i.test(text)) tags.push('Sicurezza');
  if (/sputtered|sunscape|spettro|riflett|oscur|termoisol|solar/i.test(text)) tags.push('Prestazioni');
  if (/privacy|decorativ|vetrofanie|stampabil/i.test(text)) tags.push('Design');

  return [...new Set(tags)].slice(0, 3);
};

const INFO_THEMES = [
  {
    key: 'normative',
    title: 'Norme e sicurezza',
    eyebrow: 'Norme applicate',
    route: '/pagina-info/norme/',
    description: 'Riferimenti normativi e sicurezza sul lavoro letti in funzione del vetro, del rischio e della posa.',
    match: /(norm|sicurezza|testo unico|dpr|brc)/i,
  },
  {
    key: 'certificazioni',
    title: 'Garanzie e certificazioni',
    eyebrow: 'Affidabilità',
    route: '/pagina-info/garanzie/',
    description: 'Garanzie, certificazioni e punti di forza da leggere insieme a prodotto, applicazione e metodo Solaris.',
    match: /(garanz|certific|nfrc|punti di forza)/i,
  },
  {
    key: 'supporto',
    title: 'Uso, manutenzione e glossario',
    eyebrow: 'Supporto operativo',
    route: '/pagina-info/istruzioni-e-manutenzione/',
    description: 'Istruzioni, manutenzione e termini tecnici per fare domande più precise prima della verifica.',
    match: /(istruz|manutenz|glossario|termini)/i,
  },
];

const infoThemeForPage = (page = {}) => {
  const text = `${getLiveTitle(page)} ${getLiveDescription(page)} ${page.path}`.toLocaleLowerCase('it');
  return INFO_THEMES.find((theme) => theme.match.test(text)) || INFO_THEMES[2];
};

const infoTags = (page = {}, theme) => {
  const text = `${getLiveTitle(page)} ${getLiveDescription(page)} ${page.path}`.toLocaleLowerCase('it');
  const tags = [theme?.eyebrow || 'Info Solaris'];

  if (/norm|dpr|testo unico|brc/i.test(text)) tags.push('Norme');
  if (/sicurezza/i.test(text)) tags.push('Sicurezza');
  if (/garanz/i.test(text)) tags.push('Garanzia');
  if (/certific|nfrc/i.test(text)) tags.push('Certificazioni');
  if (/glossario|termini/i.test(text)) tags.push('Glossario');
  if (/manutenz|istruz/i.test(text)) tags.push('Manutenzione');

  return [...new Set(tags)].slice(0, 3);
};

const ResourceCard = ({ page, eyebrow, description, tags = [], index, section = 'main', featured = false, image, imageKey, toneKey }) => {
  const title = getLiveTitle(page);
  const path = getLivePath(page);
  const resourceId = path.split('/').filter(Boolean).pop() || `resource-${index}`;
  const resourceTone = toneKey || imageKey || 'default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.025, 0.24) }}
    >
      <Link
        to={path}
        className={`knowledge-directory-article-card knowledge-directory-article-card-${resourceTone}${featured ? ' knowledge-directory-article-featured' : ''}`}
        data-testid={`resource-directory-${section}-${resourceId}`}
      >
        {image && (
          <figure className={`knowledge-directory-article-image service-family-image service-family-image-${imageKey || 'default'}`}>
            <img src={image} alt={`${title} Solaris`} loading="lazy" />
          </figure>
        )}
        <div className="knowledge-directory-article-head">
          <span>{eyebrow}</span>
          <ArrowRight size={18} weight="bold" />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="knowledge-directory-tags" aria-label="Tag risorsa">
          {tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
};

const ArticleCard = ({ page, family, index, featured = false }) => {
  const title = getLiveTitle(page);
  const description = resourceDescription(page, articleFallbackDescription(family));
  const path = normalizeKnowledgePath(getLivePath(page));
  const articleId = path.split('/').filter(Boolean).pop() || `article-${index}`;
  const familyKey = family?.key || 'default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.025, 0.24) }}
    >
      <Link to={path} className={`knowledge-directory-article-card knowledge-directory-article-card-${familyKey}${featured ? ' knowledge-directory-article-featured' : ''}`} data-testid={`knowledge-directory-article-${articleId}`}>
        <div className="knowledge-directory-article-head">
          <span>{family?.eyebrow || 'Knowledge Solaris'}</span>
          <ArrowRight size={18} weight="bold" />
        </div>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="knowledge-directory-tags" aria-label="Tag articolo">
          {articleTags(page, family).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
};

const DirectoryCard = ({ page, index, light = true }) => {
  const title = getLiveTitle(page);
  const description = getLiveDescription(page);
  const path = getLivePath(page);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.035, 0.3) }}
    >
      <Link
        to={path}
        className={`block h-full rounded-xl p-6 group transition-all ${light ? 'card-light' : 'card-glass'}`}
        data-testid={`live-directory-link-${page.route?.type || 'page'}-${index}`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-11 h-11 rounded-xl bg-[#EAB308]/12 border border-[#EAB308]/25 flex items-center justify-center">
            <LinkSimple size={20} weight="bold" className="text-[#EAB308]" />
          </div>
          <span className={`text-xs font-medium uppercase ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
            {page.route?.label || 'Pagina'}
          </span>
        </div>
        <h3 className={`font-medium mb-3 transition-colors ${light ? 'text-[#0A0F1C] group-hover:text-[#2563EB]' : 'text-white group-hover:text-[#EAB308]'}`}>
          {title}
        </h3>
        {description ? (
          <p className={`text-sm line-clamp-3 ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
            {description}
          </p>
        ) : (
          <p className={`text-sm ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
            Contenuto tecnico Solaris.
          </p>
        )}
        <span className="inline-flex items-center gap-2 mt-5 text-[#EAB308] text-sm font-medium">
          Apri pagina
          <ArrowRight size={15} weight="bold" className="group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </motion.div>
  );
};

const localStatCards = [
  { value: '22', label: 'aree servite con metodo Solaris' },
  { value: '3', label: 'famiglie di intervento collegabili' },
  { value: '30+', label: 'anni di esperienza sulle superfici vetrate' },
];

const LocalCityCard = ({ page, index }) => {
  const city = cityNameFromPage(page);
  const path = getLivePath(page);
  const logo = getLocalServiceLogo(page);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.025, 0.25) }}
    >
      <Link to={path} className={`local-directory-city-card ${logo ? 'local-directory-city-card-with-logo' : ''}`} data-testid={`local-directory-city-${city.toLowerCase().replace(/\s+/g, '-')}`}>
        {logo ? (
          <figure className="local-directory-city-logo-panel">
            <img src={logo.src} alt={logo.alt} loading="lazy" />
          </figure>
        ) : (
          <span className="local-directory-city-icon">
            <MapPin size={20} weight="fill" />
          </span>
        )}
        <div>
          <h3>{city}</h3>
          <p>Pellicole antisolari, sicurezza vetri, privacy e design per edifici a {city} e provincia.</p>
        </div>
        <ArrowRight size={18} weight="bold" />
      </Link>
    </motion.div>
  );
};

const LocalDirectoryPage = ({ config, primaryPages, loading, error, stats }) => {
  const sortedCities = [...primaryPages].sort(byCityName);
  const highlightedCities = sortedCities.filter((page) => (
    ['milano', 'roma', 'torino', 'bologna', 'firenze', 'napoli'].includes((getLivePath(page) || '').split('/').filter(Boolean).pop())
  ));

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="live-directory-local">
      <SEO title="Pellicole per vetri in tutta Italia" description={config.description} path={config.path} />
      <Header />
      <main className="directory-page-shell local-directory-page">
        <section className="local-directory-hero">
          <div className="local-directory-hero-copy">
            <div className="live-modern-kicker">
              <MapPin size={16} weight="fill" />
              <span>Copertura territoriale Solaris</span>
            </div>
            <h1>Pellicole per vetri in tutta Italia</h1>
            <p>
              Trova il percorso Solaris più vicino alla tua esigenza: controllo solare, sicurezza vetri,
              privacy e posa professionale su edifici esistenti.
            </p>
            <div className="local-directory-actions">
              <Link to="/preventivo" className="btn-yellow group">
                Richiedi sopralluogo
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="tel:800625052" className="btn-secondary local-phone-link">
                <Phone size={18} weight="fill" />
                800625052
              </a>
            </div>
          </div>

          <div className="directory-hero-side">
            <figure className="directory-hero-visual">
              <img src={DIRECTORY_VISUALS.localHero} alt="Copertura locale Solaris con strumenti per verifica vetri" loading="eager" />
              <figcaption>
                <span>Copertura locale</span>
                <p>Dal contesto territoriale alla verifica tecnica su vetro, posa e obiettivo.</p>
              </figcaption>
            </figure>

            <aside className="local-directory-coverage" aria-label="Copertura Solaris Films">
              <div className="local-directory-coverage-top">
                <Buildings size={24} weight="fill" />
                <span>{loading ? 'Caricamento...' : `${sortedCities.length} aree locali`}</span>
              </div>
              <h2>Un unico metodo Solaris, adattato al contesto locale</h2>
              <p>
                Il punto di partenza cambia da città a città, ma il metodo resta lo stesso:
                capire il problema, verificare il vetro e scegliere la pellicola corretta.
              </p>
              {highlightedCities.length > 0 && (
                <div className="local-directory-chip-grid" aria-label="Città principali">
                  {highlightedCities.map((page) => (
                    <Link key={getLivePath(page)} to={getLivePath(page)}>{cityNameFromPage(page)}</Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="local-directory-stats" aria-label="Dati copertura locale">
          {localStatCards.map((item) => (
            <div key={item.value}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="local-directory-services" aria-label="Servizi locali Solaris">
          <div className="local-directory-section-heading">
            <span>Servizi disponibili sul territorio</span>
            <h2>Parti dalla città, poi scegli il risultato da ottenere sul vetro</h2>
            <p>
              Le pagine locali aiutano a collegare il contesto dell'edificio alla famiglia di intervento più adatta.
            </p>
          </div>
          <div className="local-directory-service-grid">
            {SERVICE_FAMILIES.map((family) => (
              <Link key={family.key} to={serviceFamilyRoute(family)} className="local-directory-service-card">
                <figure className={`service-family-image service-family-image-card service-family-image-${family.key}`}>
                  <img src={family.image} alt={family.title} loading="lazy" />
                </figure>
                <div>
                  <span>{family.eyebrow}</span>
                  <h3>{family.title}</h3>
                  <p>{family.description}</p>
                </div>
                <ArrowRight size={18} weight="bold" />
              </Link>
            ))}
          </div>
        </section>

        <section className="local-directory-body">
          <div className="local-directory-section-heading">
            <span>Aree servite</span>
            <h2>Scegli la città e passa alla verifica del caso reale</h2>
            <p>
              Ogni pagina locale mantiene il contatto con il territorio, ma porta sempre verso una richiesta utile:
              foto, misure, obiettivo e tipo di vetro da valutare.
            </p>
          </div>

          {error && (
            <div className="local-directory-empty">Non riesco a caricare la mappa contenuti in questo momento.</div>
          )}

          {!error && !loading && sortedCities.length === 0 && (
            <div className="local-directory-empty">{config.emptyText}</div>
          )}

          <div className="local-directory-city-grid">
            {sortedCities.map((page, index) => (
              <LocalCityCard key={`${page.path}-${page.route?.newPath}`} page={page} index={index} />
            ))}
          </div>
        </section>

        <section className="local-directory-cta">
          <div>
            <span>Prossimo passo</span>
            <h2>Racconta il problema, Solaris verifica la soluzione</h2>
            <p>
              Indica città, foto della vetrata e obiettivo: meno calore, più sicurezza, privacy o una combinazione
              di prestazioni.
            </p>
          </div>
          <Link to="/preventivo" className="btn-yellow group">
            Avvia richiesta
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

const ProductFamilyCard = ({ family, products, focus }) => (
  <Link to={serviceFamilyRoute(family)} className={`product-directory-family-card product-directory-family-card-${family.key}`}>
    <figure className={`service-family-image service-family-image-card service-family-image-${family.key}`}>
      <img src={family.image} alt={family.title} loading="lazy" />
    </figure>
    <div className="product-directory-family-copy">
      <span>{family.eyebrow}</span>
      <h3>{family.title}</h3>
      <p>{family.description}</p>
      <div className="product-directory-family-meta">
        <span>{products.length} schede prodotto</span>
        <span>{focus.length} focus tecnici</span>
      </div>
    </div>
    <ArrowRight size={18} weight="bold" />
  </Link>
);

const ProductDirectoryPage = ({ config, primaryPages, allPages, loading, error, stats }) => {
  const familyBlocks = SERVICE_FAMILIES.map((family) => ({
    ...family,
    products: getProductsForFamily(allPages, family),
    focus: getFocusForFamily(allPages, family),
  }));
  const linkedProductPaths = new Set(familyBlocks.flatMap((family) => family.products.map((page) => getLivePath(page))));
  const otherProducts = primaryPages.filter((page) => !linkedProductPaths.has(getLivePath(page)));
  const focusTotal = familyBlocks.reduce((sum, family) => sum + family.focus.length, 0);
  const heroFamilies = familyBlocks.filter((family) => family.products.length > 0);

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="live-directory-products">
      <SEO title="Catalogo pellicole MADICO Solaris" description={config.description} path={config.path} />
      <Header />
      <main className="directory-page-shell product-directory-page">
        <section className="product-directory-hero">
          <div className="product-directory-hero-bg" aria-hidden="true">
            <img src={DIRECTORY_VISUALS.productsHero} alt="" fetchPriority="high" />
          </div>
          <div className="product-directory-hero-copy">
            <div className="live-modern-kicker">
              <ShieldCheck size={16} weight="fill" />
              <span>Pellicole e schede tecniche</span>
            </div>
            <h1>Catalogo pellicole per vetri MADICO</h1>
            <p>
              Scegli prima l'obiettivo: ridurre calore e abbagliamento, mettere in sicurezza il vetro
              o gestire privacy e design. Le schede aiutano a confrontare le soluzioni senza partire dal codice prodotto.
            </p>
            <div className="product-directory-actions">
              <Link to="/preventivo" className="btn-yellow group">
                Richiedi consulenza prodotto
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/servizi" className="btn-secondary">
                <Tag size={18} weight="fill" />
                Vedi servizi
              </Link>
            </div>
          </div>

          <aside className="product-directory-hero-panel" aria-label="Riepilogo catalogo Solaris Films">
            <div className="product-directory-panel-top">
              <Certificate size={24} weight="fill" />
              <span>{loading ? 'Caricamento...' : `${primaryPages.length} schede prodotto`}</span>
            </div>
            <h2>Confronta la famiglia giusta prima della scheda</h2>
            <p>
              Se il problema è già chiaro, entra nella famiglia corretta. Se non lo è, parti da una verifica Solaris:
              vetro, esposizione e obiettivo cambiano la scelta finale.
            </p>
            <div className="product-directory-mini-list">
              {heroFamilies.map((family) => (
                <Link key={family.key} to={serviceFamilyRoute(family)}>
                  <span>{family.title}</span>
                  <strong>{family.products.length}</strong>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="product-directory-stats" aria-label="Dati catalogo prodotto">
          <div>
            <strong>{primaryPages.length}</strong>
            <span>schede disponibili per confrontare prestazioni e applicazioni</span>
          </div>
          <div>
            <strong>{familyBlocks.length}</strong>
            <span>percorsi di scelta: controllo solare, sicurezza, privacy e design</span>
          </div>
          <div>
            <strong>{focusTotal}</strong>
            <span>focus tecnici collegati per capire limiti, vantaggi e posa</span>
          </div>
        </section>

        <section className="product-directory-families" aria-label="Famiglie prodotto Solaris">
          <div className="product-directory-section-heading">
            <span>Scegli prima l'obiettivo</span>
            <h2>La famiglia corretta restringe subito il campo</h2>
            <p>
              Antisolari, sicurezza e privacy/design rispondono a bisogni diversi. La scheda prodotto arriva dopo,
              quando è chiaro cosa deve fare il vetro.
            </p>
          </div>
          <div className="product-directory-family-grid">
            {familyBlocks.map((family) => (
              <ProductFamilyCard key={family.key} family={family} products={family.products} focus={family.focus} />
            ))}
          </div>
        </section>

        <section className="product-directory-body">
          <div className="product-directory-section-heading">
            <span>Confronto prodotti</span>
            <h2>Schede tecniche per area di intervento</h2>
            <p>
              Ogni scheda conserva i dati tecnici essenziali e ti guida al passaggio successivo senza perdere il contesto della tua esigenza.
            </p>
          </div>

          {error && (
            <div className="product-directory-empty">Non riesco a caricare la mappa contenuti in questo momento.</div>
          )}

          {!error && !loading && primaryPages.length === 0 && (
            <div className="product-directory-empty">{config.emptyText}</div>
          )}

          <div className="product-directory-product-sections">
            {familyBlocks.map((family) => (
              <section key={family.key} className={`product-directory-product-section product-directory-product-section-${family.key}`}>
                <div className="product-directory-product-section-head">
                  <div>
                    <span>{family.eyebrow}</span>
                    <h2>{family.title}</h2>
                  </div>
                  <Link to={serviceFamilyRoute(family)}>
                    Vedi soluzione
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
                <div className="product-directory-product-grid">
                  {family.products.map((page, index) => (
                    <ProductCard key={`${page.path}-${page.route?.newPath}`} page={page} family={family} index={index} />
                  ))}
                </div>
              </section>
            ))}

            {otherProducts.length > 0 && (
              <section className="product-directory-product-section product-directory-product-section-default">
                <div className="product-directory-product-section-head">
                  <div>
                    <span>Soluzioni complementari</span>
                    <h2>Altre schede disponibili</h2>
                  </div>
                </div>
                <div className="product-directory-product-grid">
                  {otherProducts.map((page, index) => (
                    <ProductCard key={`${page.path}-${page.route?.newPath}`} page={page} index={index} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>

        <section className="product-directory-cta">
          <div className="product-directory-cta-bg" aria-hidden="true">
            <img src={DIRECTORY_VISUALS.productsCta} alt="" loading="lazy" />
          </div>
          <div>
            <span>Scelta guidata</span>
            <h2>Il prodotto va confermato sul vetro reale</h2>
            <p>
              Solaris verifica esposizione, stratigrafia, dimensione, obiettivo tecnico e condizioni di posa prima
              di indicare la pellicola definitiva.
            </p>
          </div>
          <Link to="/preventivo" className="btn-yellow group">
            Richiedi verifica
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

const ArticleDirectoryPage = ({ kind, config, primaryPages, secondaryPages, loading, error, stats }) => {
  const articles = [...primaryPages].sort((a, b) => (b.textLength || 0) - (a.textLength || 0));
  const featuredArticles = articles.slice(0, 3);
  const familyBlocks = SERVICE_FAMILIES.map((family) => ({
    ...family,
    articles: articles.filter((page) => articleFamilyForPage(page)?.key === family.key),
  }));
  const assignedPaths = new Set(familyBlocks.flatMap((family) => family.articles.map((page) => getLivePath(page))));
  const generalArticles = articles.filter((page) => !assignedPaths.has(getLivePath(page)));
  const isKnowledge = kind === 'knowledge';
  const copy = isKnowledge ? articleDirectoryCopy.knowledge : articleDirectoryCopy.blog;
  const familySectionHref = (familyKey) => `#knowledge-${familyKey}`;
  const familyLinkTarget = (family) => (isKnowledge ? familySectionHref(family.key) : serviceFamilyRoute(family));

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`live-directory-${kind}`}>
      <SEO
        title={copy.seoTitle}
        description={config.description}
        path={config.path}
      />
      <Header />
      <main className="directory-page-shell knowledge-directory-page">
        <section className="knowledge-directory-hero">
          <div className="knowledge-directory-hero-copy">
            <div className="live-modern-kicker">
              {isKnowledge ? <Lightbulb size={16} weight="fill" /> : <BookOpen size={16} weight="fill" />}
              <span>{copy.kicker}</span>
            </div>
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
            <div className="knowledge-directory-actions">
              <Link to="/preventivo" className="btn-yellow group">
                Richiedi consulenza
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/servizi" className="btn-secondary">
                <MagnifyingGlass size={18} weight="bold" />
                Esplora servizi
              </Link>
            </div>
          </div>

          <aside className="knowledge-directory-hero-panel" aria-label="Riepilogo knowledge Solaris Films">
            <div className="knowledge-directory-panel-top">
              <BookOpen size={24} weight="fill" />
              <span>{loading ? 'Caricamento...' : `${articles.length} ${copy.panelLabel}`}</span>
            </div>
            <h2>{copy.panelTitle}</h2>
            <p>{copy.panelText}</p>
            <div className="knowledge-directory-mini-list">
              {familyBlocks.map((family) => (
                <Link key={family.key} to={familyLinkTarget(family)}>
                  <span>{family.title}</span>
                  <strong>{family.articles.length}</strong>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="knowledge-directory-stats" aria-label="Dati archivio knowledge">
          <div>
            <strong>{articles.length}</strong>
            <span>{copy.statArticles}</span>
          </div>
          <div>
            <strong>{familyBlocks.length}</strong>
            <span>{copy.statFamilies}</span>
          </div>
          <div>
            <strong>{secondaryPages.length}</strong>
            <span>{copy.statSecondary}</span>
          </div>
        </section>

        <section className="knowledge-directory-featured">
          <div className="knowledge-directory-section-heading">
            <span>{copy.featuredKicker}</span>
            <h2>{copy.featuredTitle}</h2>
            <p>{copy.featuredText}</p>
          </div>
          <div className="knowledge-directory-featured-grid">
            {featuredArticles.map((page, index) => (
              <ArticleCard
                key={`${page.path}-${page.route?.newPath}`}
                page={page}
                family={articleFamilyForPage(page)}
                index={index}
                featured
              />
            ))}
          </div>
        </section>

        <section className="knowledge-directory-paths" aria-label="Percorsi di lettura Solaris">
          <div className="knowledge-directory-section-heading">
            <span>{copy.pathsKicker}</span>
            <h2>{copy.pathsTitle}</h2>
            <p>{copy.pathsText}</p>
          </div>
          <div className="knowledge-directory-path-grid">
            {familyBlocks.map((family) => (
              <Link key={family.key} to={familyLinkTarget(family)} className={`knowledge-directory-path-card knowledge-directory-path-card-${family.key}`}>
                <figure className={`service-family-image service-family-image-card service-family-image-${family.key}`}>
                  <img src={family.image} alt={family.title} loading="lazy" />
                </figure>
                <div>
                  <span>{family.eyebrow}</span>
                  <h3>{family.title}</h3>
                  <p>
                    {articleFamilyPathCopy[family.key]} {family.articles.length} contenuti collegati.
                  </p>
                </div>
                <ArrowRight size={18} weight="bold" />
              </Link>
            ))}
          </div>
        </section>

        <section className="knowledge-directory-body">
          <div className="knowledge-directory-section-heading">
            <span>{copy.bodyKicker}</span>
            <h2>{copy.bodyTitle}</h2>
            <p>{copy.bodyText}</p>
          </div>

          {error && (
            <div className="knowledge-directory-empty">Non riesco a caricare la mappa contenuti in questo momento.</div>
          )}

          {!error && !loading && articles.length === 0 && (
            <div className="knowledge-directory-empty">{config.emptyText}</div>
          )}

          <div className="knowledge-directory-article-sections">
            {familyBlocks.map((family) => (
              <section id={`knowledge-${family.key}`} key={family.key} className={`knowledge-directory-article-section knowledge-directory-article-section-${family.key}`}>
                <div className="knowledge-directory-article-section-head">
                  <div>
                    <span>{family.eyebrow}</span>
                    <h2>{family.title}</h2>
                  </div>
                  <Link to={familyLinkTarget(family)}>
                    Servizio collegato
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
                <div className="knowledge-directory-article-grid">
                  {family.articles.map((page, index) => (
                    <ArticleCard key={`${page.path}-${page.route?.newPath}`} page={page} family={family} index={index} />
                  ))}
                </div>
              </section>
            ))}

            {generalArticles.length > 0 && (
              <section className="knowledge-directory-article-section knowledge-directory-article-section-default">
                <div className="knowledge-directory-article-section-head">
                  <div>
                    <span>{copy.generalKicker}</span>
                    <h2>{copy.generalTitle}</h2>
                  </div>
                </div>
                <div className="knowledge-directory-article-grid">
                  {generalArticles.map((page, index) => (
                    <ArticleCard key={`${page.path}-${page.route?.newPath}`} page={page} index={index} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>

        {secondaryPages.length > 0 && (
          <section className="knowledge-directory-taxonomies">
            <div className="knowledge-directory-section-heading">
              <span>{copy.relatedKicker}</span>
              <h2>{copy.relatedTitle}</h2>
              <p>{copy.relatedText}</p>
            </div>
            <div className="knowledge-directory-taxonomy-grid">
              {secondaryPages.map((page, index) => (
                <DirectoryCard key={`${page.path}-${page.route?.newPath}`} page={page} index={index} />
              ))}
            </div>
          </section>
        )}

        <section className="knowledge-directory-cta">
          <div>
            <span>{copy.ctaKicker}</span>
            <h2>{copy.ctaTitle}</h2>
            <p>{copy.ctaText}</p>
          </div>
          <Link to="/preventivo" className="btn-yellow group">
            Richiedi verifica
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        {copy.inventory ? (
          <p className="knowledge-directory-inventory">
            {copy.inventory}
          </p>
        ) : null}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

const FocusDirectoryPage = ({ config, primaryPages, allPages, loading, error, stats }) => {
  const familyBlocks = SERVICE_FAMILIES.map((family) => ({
    ...family,
    pages: getFocusForFamily(allPages, family),
    products: getProductsForFamily(allPages, family),
  }));
  const assignedPaths = new Set(familyBlocks.flatMap((family) => family.pages.map((page) => getLivePath(page))));
  const generalFocus = primaryPages.filter((page) => !assignedPaths.has(getLivePath(page)));
  const featuredFocus = [...primaryPages].sort((a, b) => (b.textLength || 0) - (a.textLength || 0)).slice(0, 3);
  const productTotal = familyBlocks.reduce((sum, family) => sum + family.products.length, 0);
  const focusSectionHref = (familyKey) => `#focus-${familyKey}`;

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="live-directory-focus">
      <SEO title="Focus tecnico Solaris" description={config.description} path={config.path} />
      <Header />
      <main className="directory-page-shell knowledge-directory-page focus-directory-page">
        <section className="knowledge-directory-hero">
          <div className="knowledge-directory-hero-bg" aria-hidden="true">
            <img src={DIRECTORY_VISUALS.focusHero} alt="" fetchPriority="high" />
          </div>
          <div className="knowledge-directory-hero-copy">
            <div className="live-modern-kicker">
              <BookOpen size={16} weight="fill" />
              <span>Guide alla scelta Solaris</span>
            </div>
            <h1>Capire la tecnologia, scegliere meglio la pellicola</h1>
            <p>
              I focus tecnici traducono norme, prestazioni e limiti in decisioni pratiche: quando serve ridurre
              calore, rendere un vetro più sicuro o gestire privacy e design.
            </p>
            <div className="knowledge-directory-actions">
              <Link to="/preventivo" className="btn-yellow group">
                Avvia verifica sul vetro
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/prodotti" className="btn-secondary">
                <Certificate size={18} weight="fill" />
                Confronta prodotti
              </Link>
            </div>
          </div>

          <aside className="knowledge-directory-hero-panel" aria-label="Riepilogo focus tecnico Solaris Films">
            <div className="knowledge-directory-panel-top">
              <FolderOpen size={24} weight="fill" />
              <span>{loading ? 'Caricamento...' : `${primaryPages.length} focus tecnici`}</span>
            </div>
            <h2>Parti dal problema, arriva alla soluzione verificabile</h2>
            <p>
              Ogni guida chiarisce cosa guardare prima del preventivo: tipo di vetro, esposizione, obiettivo,
              vincoli e prodotto compatibile.
            </p>
            <div className="knowledge-directory-mini-list">
              {familyBlocks.map((family) => (
                <Link key={family.key} to={focusSectionHref(family.key)}>
                  <span>{family.title}</span>
                  <strong>{family.pages.length}</strong>
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="knowledge-directory-stats" aria-label="Dati focus tecnico">
          <div>
            <strong>{primaryPages.length}</strong>
            <span>guide tecniche trasformate in criteri di scelta</span>
          </div>
          <div>
            <strong>{familyBlocks.length}</strong>
            <span>aree di bisogno: controllo solare, sicurezza, privacy e design</span>
          </div>
          <div>
            <strong>{productTotal}</strong>
            <span>schede prodotto collegate quando serve confrontare serie e prestazioni</span>
          </div>
        </section>

        <section className="knowledge-directory-featured">
          <div className="knowledge-directory-section-heading">
            <span>Scelte frequenti</span>
            <h2>I dubbi tecnici che bloccano più spesso la decisione</h2>
            <p>
              Abbiamo messo in evidenza i temi che aiutano a capire cosa chiedere, cosa misurare e quando passare
              alla verifica Solaris.
            </p>
          </div>
          <div className="knowledge-directory-featured-grid">
            {featuredFocus.map((page, index) => {
              const family = focusFamilyForPage(page);
              return (
                <ResourceCard
                  key={`${page.path}-${page.route?.newPath}`}
                  page={page}
                  eyebrow={family?.eyebrow || 'Focus tecnico'}
                  description={focusResourceDescription(page, family)}
                  tags={focusTags(page, family)}
                  index={index}
                  section="focus-featured"
                  featured
                  image={family?.image}
                  imageKey={family?.key}
                  toneKey={family?.key}
                />
              );
            })}
          </div>
        </section>

        <section className="knowledge-directory-paths" aria-label="Percorsi tecnici Solaris">
          <div className="knowledge-directory-section-heading">
            <span>Scegli dal risultato atteso</span>
            <h2>Calore, sicurezza o privacy: entra dal problema reale</h2>
            <p>
              Non serve conoscere subito sigle o serie. Seleziona l'effetto da ottenere sul vetro e usa il focus
              per arrivare ai prodotti coerenti.
            </p>
          </div>
          <div className="knowledge-directory-path-grid">
            {familyBlocks.map((family) => (
              <Link key={family.key} to={focusSectionHref(family.key)} className={`knowledge-directory-path-card knowledge-directory-path-card-${family.key}`}>
                <figure className={`service-family-image service-family-image-card service-family-image-${family.key}`}>
                  <img src={family.image} alt={family.title} loading="lazy" />
                </figure>
                <div>
                  <span>{family.eyebrow}</span>
                  <h3>{family.title}</h3>
                  <p>
                    {focusFamilyPathCopy[family.key]} {family.pages.length} guide, {family.products.length} schede collegate.
                  </p>
                </div>
                <ArrowRight size={18} weight="bold" />
              </Link>
            ))}
          </div>
        </section>

        <section className="knowledge-directory-paths" aria-label="Percorso speciale SafetyShield">
          <div className="knowledge-directory-section-heading">
            <span>Percorso speciale</span>
            <h2>SafetyShield: protezione speciale per scenari estremi</h2>
            <p>
              Se il tema è mitigazione esplosione, protezione persone o tenuta del sistema vetro in eventi critici,
              usa la sezione dedicata SafetyShield.
            </p>
          </div>
          <div className="knowledge-directory-path-grid">
            <Link to="/focus-tecnico/safetyshield/" className="knowledge-directory-path-card knowledge-directory-path-card-sicurezza">
              <figure className="service-family-image service-family-image-card service-family-image-sicurezza">
                <img src="/assets/safetyshield/madico-safetyshield-hero.jpg" alt="SafetyShield Special Security System" loading="lazy" />
              </figure>
              <div>
                <span>Special Security System</span>
                <h3>SafetyShield 800/1500 con FrameGard e GullWing</h3>
                <p>
                  Approfondimento dedicato con scenari, confronto serie, ancoraggi e documenti ufficiali.
                </p>
              </div>
              <ArrowRight size={18} weight="bold" />
            </Link>
          </div>
        </section>

        <section className="knowledge-directory-body">
          <div className="knowledge-directory-section-heading">
            <span>Guide ordinate per decisione</span>
            <h2>Approfondimenti tecnici che portano a una scelta pratica</h2>
            <p>
              Ogni focus mantiene il rigore tecnico, ma indica anche cosa verificare, quali errori evitare e quali
              prodotti confrontare.
            </p>
          </div>

          {error && (
            <div className="knowledge-directory-empty">Non riesco a caricare la mappa contenuti in questo momento.</div>
          )}

          {!error && !loading && primaryPages.length === 0 && (
            <div className="knowledge-directory-empty">{config.emptyText}</div>
          )}

          <div className="knowledge-directory-article-sections">
            {familyBlocks.map((family) => (
              <section id={`focus-${family.key}`} key={family.key} className={`knowledge-directory-article-section knowledge-directory-article-section-${family.key}`}>
                <div className="knowledge-directory-article-section-head">
                  <div>
                    <span>{family.eyebrow}</span>
                    <h2>{family.title}</h2>
                  </div>
                  <Link to={serviceFamilyRoute(family)}>
                    Vai alla soluzione
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
                <div className="knowledge-directory-article-grid">
                  {family.pages.map((page, index) => (
                    <ResourceCard
                      key={`${page.path}-${page.route?.newPath}`}
                      page={page}
                      eyebrow={family.eyebrow}
                      description={focusResourceDescription(page, family)}
                      tags={focusTags(page, family)}
                      index={index}
                      section={`focus-${family.key}`}
                      toneKey={family.key}
                    />
                  ))}
                </div>
              </section>
            ))}

            {generalFocus.length > 0 && (
              <section className="knowledge-directory-article-section knowledge-directory-article-section-default">
                <div className="knowledge-directory-article-section-head">
                  <div>
                    <span>Temi trasversali</span>
                    <h2>Guide utili prima della verifica</h2>
                  </div>
                </div>
                <div className="knowledge-directory-article-grid">
                  {generalFocus.map((page, index) => {
                    const family = focusFamilyForPage(page);
                    return (
                      <ResourceCard
                        key={`${page.path}-${page.route?.newPath}`}
                        page={page}
                        eyebrow={family?.eyebrow || 'Focus tecnico'}
                        description={focusResourceDescription(page, family)}
                        tags={focusTags(page, family)}
                        index={index}
                        section="focus-general"
                        toneKey={family?.key || 'default'}
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </section>

        <section className="knowledge-directory-cta">
          <div className="knowledge-directory-cta-bg" aria-hidden="true">
            <img src={DIRECTORY_VISUALS.focusCta} alt="" loading="lazy" />
          </div>
          <div>
            <span>Passaggio successivo</span>
            <h2>Trasforma il focus in una verifica sul vetro</h2>
            <p>
              Solaris usa la guida come punto di partenza: poi controlla vetro, esposizione, dimensioni e obiettivo
              per indicare una soluzione realistica, non solo teorica.
            </p>
          </div>
          <Link to="/preventivo" className="btn-yellow group">
            Richiedi verifica
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

const InfoDirectoryPage = ({ config, primaryPages, loading, error, stats }) => {
  const themeBlocks = INFO_THEMES.map((theme) => ({
    ...theme,
    pages: primaryPages.filter((page) => infoThemeForPage(page).key === theme.key),
  }));
  const featuredInfoPaths = ['/pagina-info/norme/', '/pagina-info/garanzie/', '/pagina-info/istruzioni-e-manutenzione/'];
  const featuredInfo = featuredInfoPaths
    .map((path) => primaryPages.find((page) => normalizeDirectoryPath(getLivePath(page)) === normalizeDirectoryPath(path)))
    .filter(Boolean);
  const fallbackFeatured = primaryPages.filter((page) => !featuredInfo.includes(page)).slice(0, Math.max(0, 3 - featuredInfo.length));
  const highlightedInfo = [...featuredInfo, ...fallbackFeatured].slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="live-directory-info">
      <SEO title="Info utili Solaris" description={config.description} path={config.path} />
      <Header />
      <main className="directory-page-shell knowledge-directory-page">
        <section className="knowledge-directory-hero">
          <div className="knowledge-directory-hero-copy">
            <div className="live-modern-kicker">
              <Lightbulb size={16} weight="fill" />
              <span>Info Solaris</span>
            </div>
            <h1>Norme, garanzie e supporto Solaris</h1>
            <p>
              Qui trovi le informazioni che aiutano a decidere meglio: obblighi, garanzie e gestione post-posa,
              tradotti in passaggi pratici per il tuo caso.
            </p>
            <div className="knowledge-directory-actions">
              <Link to="/preventivo" className="btn-yellow group">
                Richiedi consulenza
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/servizi" className="btn-secondary">
                <ShieldCheck size={18} weight="fill" />
                Vedi servizi
              </Link>
            </div>
          </div>

          <div className="directory-hero-side">
            <figure className="directory-hero-visual">
              <img src={DIRECTORY_VISUALS.infoHero} alt="Documenti, campioni vetro e supporto tecnico Solaris" loading="eager" />
              <figcaption>
                <span>Supporto Solaris</span>
                <p>Norme, garanzie e manutenzione diventano utili quando aiutano a scegliere meglio.</p>
              </figcaption>
            </figure>

            <aside className="knowledge-directory-hero-panel" aria-label="Riepilogo informazioni Solaris Films">
              <div className="knowledge-directory-panel-top">
                <Certificate size={24} weight="fill" />
                <span>{loading ? 'Caricamento...' : `${primaryPages.length} pagine info`}</span>
              </div>
              <h2>Informazioni utili solo quando aiutano a decidere meglio</h2>
              <p>
                Questa sezione chiarisce cosa è obbligatorio, cosa è raccomandato e cosa va verificato sul vetro
                prima di scegliere la soluzione.
              </p>
              <div className="knowledge-directory-mini-list">
                {themeBlocks.map((theme) => (
                  <Link key={theme.key} to={theme.route}>
                    <span>{theme.title}</span>
                    <strong>{theme.pages.length}</strong>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="knowledge-directory-stats" aria-label="Dati pagine informative">
          <div>
            <strong>{primaryPages.length}</strong>
            <span>pagine per orientare la scelta</span>
          </div>
          <div>
            <strong>{themeBlocks[0]?.pages.length || 0}</strong>
            <span>pagine dedicate a norme e sicurezza vetri</span>
          </div>
          <div>
            <strong>{INFO_THEMES.length}</strong>
            <span>percorsi per leggere meglio il caso reale</span>
          </div>
        </section>

        <section className="knowledge-directory-featured">
          <div className="knowledge-directory-section-heading">
            <span>Da leggere prima</span>
            <h2>Le informazioni che rendono più chiara la richiesta</h2>
            <p>
              Le pagine in evidenza aiutano a impostare una richiesta più precisa e a ridurre errori di valutazione.
            </p>
          </div>
          <div className="knowledge-directory-featured-grid">
            {highlightedInfo.map((page, index) => {
              const theme = infoThemeForPage(page);
              return (
                <ResourceCard
                  key={`${page.path}-${page.route?.newPath}`}
                  page={page}
                  eyebrow={theme.eyebrow}
                  description={resourceDescription(page, theme.description)}
                  tags={infoTags(page, theme)}
                  index={index}
                  section="info-featured"
                  featured
                />
              );
            })}
          </div>
        </section>

        <section className="knowledge-directory-paths" aria-label="Percorsi informativi Solaris">
          <div className="knowledge-directory-section-heading">
            <span>Percorsi di lettura</span>
            <h2>Norme, garanzie e manutenzione: scegli il percorso giusto</h2>
            <p>
              Se il tema è sicurezza, affidabilità o gestione dopo la posa, parti dal blocco corretto e arriva
              rapidamente alla pagina utile.
            </p>
          </div>
          <div className="knowledge-directory-path-grid">
            {themeBlocks.map((theme) => (
              <Link key={theme.key} to={theme.route} className="knowledge-directory-path-card">
                <div>
                  <span>{theme.eyebrow}</span>
                  <h3>{theme.title}</h3>
                  <p>{theme.description}</p>
                  <div className="product-directory-family-meta">
                    <span>{theme.pages.length} pagine</span>
                    <span>percorso tematico</span>
                  </div>
                </div>
                <ArrowRight size={18} weight="bold" />
              </Link>
            ))}
          </div>
        </section>

        <section className="knowledge-directory-body">
          <div className="knowledge-directory-section-heading">
            <span>Tutte le info</span>
            <h2>Riferimenti utili per clienti, progettisti e responsabili sicurezza</h2>
            <p>
              Le pagine sono ordinate per funzione: chiarire il contesto, preparare la richiesta e scegliere con più sicurezza.
            </p>
          </div>

          {error && (
            <div className="knowledge-directory-empty">Non riesco a caricare la mappa contenuti in questo momento.</div>
          )}

          {!error && !loading && primaryPages.length === 0 && (
            <div className="knowledge-directory-empty">{config.emptyText}</div>
          )}

          <div className="knowledge-directory-article-sections">
            {themeBlocks.map((theme) => (
              <section key={theme.key} id={theme.key} className="knowledge-directory-article-section">
                <div className="knowledge-directory-article-section-head">
                  <div>
                    <span>{theme.eyebrow}</span>
                    <h2>{theme.title}</h2>
                  </div>
                  <Link to={theme.route}>
                    {theme.key === 'normative' ? 'Apri percorso norme' : theme.key === 'certificazioni' ? 'Apri percorso garanzie' : 'Apri percorso supporto'}
                    <ArrowRight size={16} weight="bold" />
                  </Link>
                </div>
                <div className="knowledge-directory-article-grid">
                  {theme.pages.map((page, index) => (
                    <ResourceCard
                      key={`${page.path}-${page.route?.newPath}`}
                      page={page}
                      eyebrow={theme.eyebrow}
                      description={resourceDescription(page, theme.description)}
                      tags={infoTags(page, theme)}
                      index={index}
                      section={`info-${theme.key}`}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="knowledge-directory-cta">
          <div>
            <span>Dal dubbio alla verifica</span>
            <h2>Le informazioni vanno applicate al caso reale</h2>
            <p>
              Se hai già un caso concreto, Solaris può trasformare queste informazioni in una proposta operativa
              su vetro, contesto e posa.
            </p>
          </div>
          <Link to="/preventivo" className="btn-yellow group">
            Richiedi consulenza
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>

        <div className="knowledge-directory-inventory" aria-hidden="true">&nbsp;</div>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

const LiveDirectoryPage = ({ kind, initialPages = [] }) => {
  const config = DIRECTORY_CONFIG[kind] || DIRECTORY_CONFIG.blog;
  const { pages, loading, error, stats } = useLivePages(initialPages);
  const primaryPages = filterPagesForKind(pages, kind, config.types).sort(byTitle);
  const secondaryPages = filterPagesForKind(pages, kind, config.secondaryTypes || []).sort(byTitle);
  const grouped = groupPages(primaryPages, kind);

  if (kind === 'local') {
    return (
      <LocalDirectoryPage
        config={config}
        primaryPages={primaryPages}
        loading={loading}
        error={error}
        stats={stats}
      />
    );
  }

  if (kind === 'products') {
    return (
      <ProductDirectoryPage
        config={config}
        primaryPages={primaryPages}
        allPages={pages}
        loading={loading}
        error={error}
        stats={stats}
      />
    );
  }

  if (kind === 'blog' || kind === 'knowledge') {
    return (
      <ArticleDirectoryPage
        kind={kind}
        config={config}
        primaryPages={primaryPages}
        secondaryPages={secondaryPages}
        loading={loading}
        error={error}
        stats={stats}
      />
    );
  }

  if (kind === 'focus') {
    return (
      <FocusDirectoryPage
        config={config}
        primaryPages={primaryPages}
        allPages={pages}
        loading={loading}
        error={error}
        stats={stats}
      />
    );
  }

  if (kind === 'info') {
    return (
      <InfoDirectoryPage
        config={config}
        primaryPages={primaryPages}
        loading={loading}
        error={error}
        stats={stats}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`live-directory-${kind}`}>
      <SEO title={config.title} description={config.description} path={config.path} />
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <div className="accent-bar w-16 mb-6" />
              <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">{config.eyebrow}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                {config.title}
                <span className="text-gradient"> {config.highlight}</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed">{config.description}</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm">
                  <FolderOpen size={16} />
                  {loading ? 'Caricamento...' : `${primaryPages.length} pagine`}
                </span>
                <Link to="/mappa-sito" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/25 text-[#EAB308] text-sm hover:bg-[#EAB308]/15 transition-colors">
                  Mappa sito
                  <ArrowRight size={15} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            {error && (
              <div className="card-light rounded-xl p-6 text-[#0A0F1C]">
                Non riesco a caricare la mappa contenuti in questo momento.
              </div>
            )}

            {!error && !loading && primaryPages.length === 0 && (
              <div className="card-light rounded-xl p-6 text-[#0A0F1C]">{config.emptyText}</div>
            )}

            <div className="space-y-14">
              {Object.entries(grouped).map(([group, groupPagesList]) => (
                <div key={group}>
                  <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-medium text-[#0A0F1C]">{group}</h2>
                      <p className="text-sm text-[#64748B] mt-1">{groupPagesList.length} pagine</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupPagesList.map((page, index) => (
                      <DirectoryCard key={`${page.path}-${page.route?.newPath}`} page={page} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {secondaryPages.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-medium text-[#0A0F1C] mb-6">Archivi e tassonomie</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {secondaryPages.map((page, index) => (
                    <DirectoryCard key={`${page.path}-${page.route?.newPath}`} page={page} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <p className="text-[#94A3B8] mb-6">
              Mappa contenuti: {Object.values(stats).reduce((sum, value) => sum + value, 0)} pagine organizzate nel sito Solaris.
            </p>
            <Link to="/preventivo" className="btn-yellow group">
              Richiedi consulenza
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default LiveDirectoryPage;
