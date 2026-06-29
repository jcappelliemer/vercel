import { isExcludedSolarisPage } from '@/utils/liveContent';

const normalizePath = (pathname = '/') => {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const PATH_ALIASES = {
  // Keep legacy aliases only as read fallbacks. Final cutover paths remain the
  // historical solarisfilms.it paths, e.g. /pagina-info/{slug}/.
  '/info/garanzie/': '/pagina-info/garanzie/',
};

const LEGACY_INTERNAL_HREF_MAP = {
  '/pagina-info/': '/pellicole-per-vetri/pellicole-per-vetri/faq/',
  '/pagina-info/garanzie-clienti/': '/pagina-info/garanzie/',
  '/info/norme/': '/pagina-info/norme/',
  '/info/norma-brc/': '/pagina-info/norma-brc/',
  '/info/sicurezza-a-norma-di-legge/': '/pagina-info/sicurezza-a-norma-di-legge/',
  '/info/testo-unico-sulla-salute-e-sicurezza-sul-lavoro/': '/pagina-info/testo-unico-sulla-salute-e-sicurezza-sul-lavoro/',
  '/info/sistemi-filtranti-dpr-59-09/': '/pagina-info/sistemi-filtranti-dpr-59-09/',
  '/info/certificazione-nfrc/': '/pagina-info/certificazione-nfrc/',
  '/info/garanzie-clienti/': '/pagina-info/garanzie/',
  '/info/garanzie/': '/pagina-info/garanzie/',
  '/info/i-punti-di-forza/': '/pagina-info/i-punti-di-forza/',
  '/info/istruzioni-e-manutenzione/': '/pagina-info/istruzioni-e-manutenzione/',
  '/info/glossario-termini/': '/pagina-info/glossario-termini/',
  '/focus-tecnico/pellicole-antisolari/': '/pellicole-antisolari/',
  '/focus-tecnico/pellicole-di-sicurezza/': '/pellicole-di-sicurezza/',
  '/focus-tecnico/pellicole-antisolari-sputtered/': '/pellicole-antisolari-sputtered/',
  '/focus-tecnico/pellicole-antisolari-sunscape/': '/pellicole-antisolari-sunscape/',
  '/focus-tecnico/pellicole-oscuranti-per-vetri/': '/pellicole-oscuranti-per-vetri/',
  '/focus-tecnico/pellicole-riflettenti/': '/pellicole-riflettenti/',
  '/focus-tecnico/pellicole-spettro-selettive/': '/pellicole-spettro-selettive/',
  '/focus-tecnico/pellicole-di-sicurezza-neutre-la-serie-cl/': '/pellicole-di-sicurezza-neutre-la-serie-cl/',
  '/focus-tecnico/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/': '/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/',
  '/focus-tecnico/pellicole-antisolari-di-sicurezza-la-serie-rs/': '/pellicole-antisolari-di-sicurezza-la-serie-rs/',
  '/focus-tecnico/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/': '/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/',
  '/focus-tecnico/pellicole-decorative/': '/pellicole-decorative/',
  '/focus-tecnico/pellicole-antisolari-stampabili-e-vetrofanie/': '/pellicole-antisolari-stampabili-e-vetrofanie/',
  '/focus-tecnico/pellicole-decorative-privacy/': '/pellicole-decorative-privacy/',
  '/focus-tecnico/pellicole-termoisolanti/': '/pellicole-termoisolanti/',
  '/pellicole-per-vetri/le-pellicole-antisolari/madicosb20epssr/': '/prodotti/madico-sb-20-e-ps-sr/',
  '/pellicole-per-vetri/le-pellicole-antisolari/madicosb35epssr/': '/prodotti/madico-sb-35-e-ps-sr/',
  '/pellicole-per-vetri/le-pellicole-antisolari/madicosg20epssr/': '/prodotti/madico-sg-20-e-ps-sr/',
  '/pellicole-per-vetri/le-pellicole-antisolari/madicosl8epssr/': '/prodotti/madico-sl-8-e-ps-sr/',
  '/prodotti/madicosb20epssr/': '/prodotti/madico-sb-20-e-ps-sr/',
  '/prodotti/madicosb35epssr/': '/prodotti/madico-sb-35-e-ps-sr/',
  '/prodotti/madicosg20epssr/': '/prodotti/madico-sg-20-e-ps-sr/',
  '/prodotti/madicosl8epssr/': '/prodotti/madico-sl-8-e-ps-sr/',
  '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-20-e-ps-sr/': '/prodotti/madico-rs-20-e-ps-sr/',
  '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-30-e-ps-sr/': '/prodotti/madico-rs-30-e-ps-sr/',
  '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-40-e-ps-sr/': '/prodotti/madico-rs-40-e-ps-sr/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-20-ps-sr-4mil/': '/prodotti/madico-rs-20-ps-sr-4mil/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-20-ps-sr-8-mil/': '/prodotti/madico-rs-20-ps-sr-8mil/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-40-ps-sr-4-mil/': '/prodotti/madico-rs-40-ps-sr-4mil/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-40-ps-sr-8-mil/': '/prodotti/madico-rs-40-ps-sr-8mil/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-400-ps-sr/': '/prodotti/madico-cl-400-ps-sr/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-400-e-ps-sr/': '/prodotti/madico-cl-400-e-ps-sr/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-700-ps-sr/': '/prodotti/madico-cl-700-ps-sr/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-700-e-ps-sr/': '/prodotti/madico-cl-700-e-ps-sr/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-800/': '/prodotti/madico-safetyshield-800/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-1500/': '/prodotti/madico-safetyshield-1500/',
  '/pellicole-per-vetri/pellicole-di-sicurezza/madico-gullwing/': '/prodotti/madico-gullwing/',
  '/pellicole-per-vetri/pellicole-decorative-per-vetri/vetrofanie/': '/prodotti/vetrofanie/',
  '/pellicole-per-vetri/pellicole-decorative-per-vetri/madico-mt-200-xw/': '/prodotti/madico-mt-200-xw/',
};

const normalizeLegacyInternalHref = (href = '') => {
  const rawHref = String(href).trim();
  if (!rawHref) return rawHref;

  let localHref = rawHref;
  if (/^https?:\/\//i.test(rawHref)) {
    try {
      const url = new URL(rawHref);
      if (!['solarisfilms.it', 'www.solarisfilms.it'].includes(url.hostname)) return rawHref;
      localHref = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return rawHref;
    }
  }

  if (!localHref.startsWith('/')) return rawHref;
  const [, pathOnly = localHref, suffix = ''] = localHref.match(/^([^?#]*)([?#].*)?$/) || [];
  const normalizedPath = normalizePath(pathOnly);
  const mappedPath = LEGACY_INTERNAL_HREF_MAP[normalizedPath] || normalizedPath;
  return `${mappedPath === '/' ? '/' : mappedPath}${suffix}`;
};

const sanitizeLiveString = (value = '') => String(value)
  .replace(/href=(["'])([^"']+)\1/gi, (_, quote, href) => `href=${quote}${normalizeLegacyInternalHref(href)}${quote}`)
  .replace(/\bLa pellicola oscurante NT\b/gi, 'Pellicole oscuranti ad alta riduzione luminosa')
  .replace(/\bpellicola oscurante NT\b/gi, 'pellicola oscurante ad alta riduzione luminosa')
  .replace(/\bCome la NT\b/gi, 'Questa soluzione')
  .replace(/[^.!?<>]*(?:serie\s*nt|\bnt\b|nt[\s-]*20|nt[\s-]*35)[^.!?<>]*[.!?]/gi, ' ')
  .replace(/\bserie\s*nt\b/gi, '')
  .replace(/\bnt[\s-]*20\b/gi, '')
  .replace(/\bnt[\s-]*35\b/gi, '')
  .replace(/\bnt\b/gi, '')
  .replace(/\s{2,}/g, ' ')
  .trim();

const sanitizeLivePayload = (value) => {
  if (typeof value === 'string') return sanitizeLiveString(value);
  if (Array.isArray(value)) return value.map(sanitizeLivePayload);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeLivePayload(item)])
    );
  }
  return value;
};

const getStoragePaths = () => {
  const path = require('path');
  const publicDir = path.join(process.cwd(), 'public', 'wp-data');
  return {
    indexPath: path.join(publicDir, 'live-pages-index.json'),
    pagesDir: path.join(publicDir, 'live-pages'),
  };
};

export const readLiveIndex = () => {
  const fs = require('fs');
  const { indexPath } = getStoragePaths();
  const raw = fs.readFileSync(indexPath, 'utf8');
  const data = JSON.parse(raw);
  const pages = (data?.pages || []).filter((item) => !isExcludedSolarisPage(item));
  return { ...data, pages };
};

export const findPageEntryByPath = (index, pathname) => {
  const normalizedTarget = normalizePath(pathname);
  const pages = index?.pages || [];
  const directMatch = pages.find((item) => normalizePath(item.path) === normalizedTarget)
    || null;

  if (directMatch) return directMatch;

  const alias = PATH_ALIASES[normalizedTarget];
  if (!alias) return null;

  return pages.find((item) => normalizePath(item.path) === alias)
    || null;
};

export const readLivePageByFile = (fileName) => {
  const fs = require('fs');
  const { pagesDir } = getStoragePaths();
  if (!fileName) return null;
  const pagePath = require('path').join(pagesDir, fileName);
  if (!fs.existsSync(pagePath)) return null;
  return sanitizeLivePayload(JSON.parse(fs.readFileSync(pagePath, 'utf8')));
};

export const getMirrorStaticProps = (pathname) => {
  const index = readLiveIndex();
  const entry = findPageEntryByPath(index, pathname);
  const page = readLivePageByFile(entry?.file);

  if (!entry || !page) {
    return { notFound: true };
  }

  return {
    props: {
      initialIndex: index,
      initialPage: page,
      initialPath: normalizePath(pathname),
    },
    revalidate: 300,
  };
};

export const getMirrorServerProps = (pathname) => {
  const index = readLiveIndex();
  const normalizedPathname = normalizePath(pathname);

  const entry = findPageEntryByPath(index, pathname);
  const page = readLivePageByFile(entry?.file);

  if (!entry || !page) {
    return { notFound: true };
  }

  return {
    props: {
      initialIndex: index,
      initialPage: page,
      initialPath: normalizedPathname,
    },
  };
};

export const getPathsByRoutePrefix = (prefixPath) => {
  const index = readLiveIndex();
  const prefix = normalizePath(prefixPath);
  const paths = (index.pages || [])
    .map((item) => normalizePath(item.path || '/'))
    .filter((pathname) => pathname.startsWith(prefix))
    .map((pathname) => pathname.replace(/\/$/, '').split('/').filter(Boolean).slice(1));

  return Array.from(new Set(paths.map((segments) => segments.join('/'))))
    .filter(Boolean)
    .map((joined) => ({ params: { slug: joined } }));
};

export const getAllMirrorPaths = () => {
  const index = readLiveIndex();
  const paths = (index.pages || [])
    .map((item) => normalizePath(item.path || '/'))
    .filter((pathname) => pathname !== '/')
    .map((pathname) => pathname.replace(/\/$/, '').split('/').filter(Boolean));

  return Array.from(new Set(paths.map((segments) => segments.join('/'))))
    .filter(Boolean)
    .map((joined) => ({ params: { slug: joined.split('/') } }));
};

const EXCLUDED_CATCH_ALL_PREFIXES = [
  '/prodotti/',
  '/servizio-locale/',
];

const EXCLUDED_CATCH_ALL_EXACT = new Set([
  '/servizi/',
  '/company-profile/',
  '/contatti/',
  '/guida-tecnica/',
  '/mappa-sito/',
  '/preventivo/',
  '/privacy-policy/',
  '/lo-sapevi-che/',
]);

export const getCatchAllPaths = () => {
  const index = readLiveIndex();
  const paths = (index.pages || [])
    .map((item) => normalizePath(item.path || '/'))
    .filter((pathname) => pathname !== '/')
    .filter((pathname) => !EXCLUDED_CATCH_ALL_EXACT.has(pathname))
    .filter((pathname) => !EXCLUDED_CATCH_ALL_PREFIXES.some((prefix) => pathname.startsWith(prefix)))
    .map((pathname) => pathname.replace(/\/$/, '').split('/').filter(Boolean));

  return Array.from(new Set(paths.map((segments) => segments.join('/'))))
    .filter(Boolean)
    .map((joined) => ({ params: { slug: joined.split('/') } }));
};

export const getDirectoryStaticProps = () => {
  const index = readLiveIndex();
  return {
    props: {
      initialPages: index.pages || [],
    },
    revalidate: 300,
  };
};
