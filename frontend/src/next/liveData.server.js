import { isExcludedSolarisPage } from '@/utils/liveContent';

const normalizePath = (pathname = '/') => {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const PATH_ALIASES = {
  '/info/garanzie/': '/pagina-info/garanzie/',
  '/pagina-info/garanzie/': '/info/garanzie/',
};

const LEGACY_REDIRECTS = {
  '/pellicole-per-vetri/le-pellicole-antisolari/tecnosolarssn50tesr/': '/focus-tecnico/pellicole-spettro-selettive/',
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
    || pages.find((item) => normalizePath(item.route?.newPath) === normalizedTarget)
    || null;

  if (directMatch) return directMatch;

  const alias = PATH_ALIASES[normalizedTarget];
  if (!alias) return null;

  return pages.find((item) => normalizePath(item.path) === alias)
    || pages.find((item) => normalizePath(item.route?.newPath) === alias)
    || null;
};

export const readLivePageByFile = (fileName) => {
  const fs = require('fs');
  const { pagesDir } = getStoragePaths();
  if (!fileName) return null;
  const pagePath = require('path').join(pagesDir, fileName);
  if (!fs.existsSync(pagePath)) return null;
  return JSON.parse(fs.readFileSync(pagePath, 'utf8'));
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
  const legacyDestination = LEGACY_REDIRECTS[normalizedPathname];
  if (legacyDestination) {
    return {
      redirect: {
        destination: legacyDestination,
        permanent: true,
      },
    };
  }

  const entry = findPageEntryByPath(index, pathname);
  const page = readLivePageByFile(entry?.file);

  if (!entry || !page) {
    return { notFound: true };
  }

  const sourcePath = normalizePath(entry.path);
  const routedPath = normalizePath(entry.route?.newPath || entry.path);
  if (sourcePath === normalizedPathname && routedPath !== normalizedPathname) {
    return {
      redirect: {
        destination: routedPath,
        permanent: true,
      },
    };
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
    .map((item) => normalizePath(item.route?.newPath || item.path || '/'))
    .filter((pathname) => pathname.startsWith(prefix))
    .map((pathname) => pathname.replace(/\/$/, '').split('/').filter(Boolean).slice(1));

  return Array.from(new Set(paths.map((segments) => segments.join('/'))))
    .filter(Boolean)
    .map((joined) => ({ params: { slug: joined } }));
};

export const getAllMirrorPaths = () => {
  const index = readLiveIndex();
  const paths = (index.pages || [])
    .map((item) => normalizePath(item.route?.newPath || item.path || '/'))
    .filter((pathname) => pathname !== '/')
    .map((pathname) => pathname.replace(/\/$/, '').split('/').filter(Boolean));

  return Array.from(new Set(paths.map((segments) => segments.join('/'))))
    .filter(Boolean)
    .map((joined) => ({ params: { slug: joined.split('/') } }));
};

const EXCLUDED_CATCH_ALL_PREFIXES = [
  '/blog/',
  '/focus-tecnico/',
  '/info/',
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
    .map((item) => normalizePath(item.route?.newPath || item.path || '/'))
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
