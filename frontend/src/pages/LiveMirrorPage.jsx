import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from '@/next/router-shim';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { useHeadlessSEO, mergeHeadlessSEO } from '../hooks/useHeadlessSEO';
import { isExcludedSolarisPage } from '../utils/liveContent';
import {
  SERVICE_FAMILIES,
  getFocusForFamily,
  getPageTitle,
  getProductsForFamily,
  getServiceFamilyForFocusPage,
  getServiceFamilyForProductPage,
  getServiceFamilyForPage,
} from '../utils/serviceFamilies';
import { getLocalServiceLogo, getProductVisual } from '../utils/assetMaps';

const SITE_NAME = 'Solaris Films';
const BASE_URL = 'https://www.solarisfilms.it';
const LIVE_HOSTS = new Set(['solarisfilms.it', 'www.solarisfilms.it']);
const MAIN_PAGE_VISUALS = {
  info: '/assets/generated/main-pages/info-supporto-tecnico.webp',
  norms: '/assets/generated/main-pages/info-norme-verifica.webp',
  local: '/assets/generated/main-pages/servizio-locale-copertura.webp',
};

const normalizePath = (pathname) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const livePathAliases = {
  '/info/garanzie/': '/pagina-info/garanzie/',
  '/pagina-info/garanzie/': '/info/garanzie/',
};

const legacyFocusPathMap = new Map([
  ['/pellicole-antisolari/', '/focus-tecnico/pellicole-antisolari/'],
  ['/pellicole-di-sicurezza/', '/focus-tecnico/pellicole-di-sicurezza/'],
  ['/pellicole-antisolari-sputtered/', '/focus-tecnico/pellicole-antisolari-sputtered/'],
  ['/pellicole-antisolari-sunscape/', '/focus-tecnico/pellicole-antisolari-sunscape/'],
  ['/pellicole-oscuranti-per-vetri/', '/focus-tecnico/pellicole-oscuranti-per-vetri/'],
  ['/pellicole-riflettenti/', '/focus-tecnico/pellicole-riflettenti/'],
  ['/pellicole-spettro-selettive/', '/focus-tecnico/pellicole-spettro-selettive/'],
  ['/pellicole-di-sicurezza-neutre-la-serie-cl/', '/focus-tecnico/pellicole-di-sicurezza-neutre-la-serie-cl/'],
  ['/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/', '/focus-tecnico/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/'],
  ['/pellicole-antisolari-di-sicurezza-la-serie-rs/', '/focus-tecnico/pellicole-antisolari-di-sicurezza-la-serie-rs/'],
  ['/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/', '/focus-tecnico/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/'],
  ['/pellicole-decorative/', '/focus-tecnico/pellicole-decorative/'],
  ['/pellicole-antisolari-stampabili-e-vetrofanie/', '/focus-tecnico/pellicole-antisolari-stampabili-e-vetrofanie/'],
  ['/pellicole-decorative-privacy/', '/focus-tecnico/pellicole-decorative-privacy/'],
  ['/pellicole-termoisolanti/', '/focus-tecnico/pellicole-termoisolanti/'],
]);

const normalizeImportedHref = (href = '') => {
  const rawHref = String(href).trim();
  if (!rawHref) return rawHref;

  let localHref = rawHref;
  let isLiveAbsolute = false;
  if (/^https?:\/\//i.test(rawHref)) {
    try {
      const url = new URL(rawHref);
      if (!LIVE_HOSTS.has(url.hostname)) return rawHref;
      isLiveAbsolute = true;
      localHref = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return rawHref;
    }
  }

  if (!localHref.startsWith('/')) return rawHref;

  const [, pathOnly = localHref, suffix = ''] = localHref.match(/^([^?#]*)([?#].*)?$/) || [];
  const normalizedPath = normalizePath(pathOnly);
  if (isLiveAbsolute && normalizedPath.startsWith('/wp-content/')) return rawHref;

  const productMatch = normalizedPath.match(/^\/pellicole-per-vetri\/(?:le-pellicole-antisolari|pellicole-di-sicurezza|pellicole-decorative-per-vetri)\/([^/]+)\/$/i);
  if (productMatch) return `/prodotti/${productMatch[1]}/${suffix}`;

  if (normalizedPath === '/pellicole-per-vetri/' || normalizedPath === '/pellicole-per-vetri/pellicole-per-vetri/') {
    return `/servizi/${suffix}`;
  }
  if (normalizedPath === '/pellicole-per-vetri/le-pellicole-antisolari/') {
    return `/servizi#antisolari${suffix}`;
  }
  if (normalizedPath === '/pellicole-per-vetri/pellicole-di-sicurezza/') {
    return `/servizi#sicurezza${suffix}`;
  }
  if (normalizedPath === '/pellicole-per-vetri/pellicole-decorative-per-vetri/') {
    return `/servizi#decorative${suffix}`;
  }
  if (
    normalizedPath === '/contact/'
    || normalizedPath === '/contacts/'
    || normalizedPath === '/pellicole-per-vetri/contact/'
  ) {
    return `/contatti/${suffix}`;
  }

  const focusPath = legacyFocusPathMap.get(normalizedPath);
  if (focusPath) return `${focusPath}${suffix}`;

  const articleMatch = normalizedPath.match(/^\/approfondimenti\/([^/]+)\/$/i);
  if (articleMatch) return `/lo-sapevi-che/${articleMatch[1]}/${suffix}`;

  return localHref;
};

const titleCaseIfUpper = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed || trimmed !== trimmed.toUpperCase()) return trimmed;
  return trimmed
    .toLocaleLowerCase('it')
    .replace(/(^|\s|-)([a-z])/g, (match) => match.toLocaleUpperCase('it'));
};

const normalizeSolarisText = (value = '') => String(value)
  .replace(/\bpiu\b/gi, 'più')
  .replace(/\bEcosaving\b/g, 'EcoSaving')
  .replace(/\bsunscape\b/gi, 'Sunscape')
  .replace(/\bsputtered\b/gi, 'Sputtered')
  .replace(/\bTecnosolar\b/gi, 'Solaris Films')
  .replace(/\bserie\s*nt\b/gi, '')
  .replace(/\bnt[\s-]*20\b/gi, '')
  .replace(/\bnt[\s-]*35\b/gi, '')
  .replace(/\s{2,}/g, ' ')
  .trim();

const getLocalCityName = (page) => {
  const seoTitle = cleanTitle(page?.seo?.title || page?.title || '');
  const routeSlug = (page?.route?.newPath || page?.path || '')
    .split('/')
    .filter(Boolean)
    .pop();
  const fromTitle = seoTitle
    .replace(/^pellicole\s+per\s+vetri\s+/i, '')
    .trim();
  const raw = fromTitle && fromTitle.length <= 40 ? fromTitle : routeSlug || '';
  return titleCaseIfUpper(raw.replace(/-/g, ' '));
};

const supportExplicitTitle = (page = {}) => {
  const path = normalizePath(page.route?.newPath || page.path);

  if (path === '/profilo-solaris/') return 'Company Profile Solaris';
  if (path === '/faq/') return 'FAQ';
  if (path === '/guida-tecnica/') return 'Guida tecnica pellicole per vetri';
  if (path === '/privacy-policy/') return 'Privacy Policy';
  if (path === '/grazie/') return 'Grazie';

  return '';
};

const livePageTitle = (page, { includeSite = false } = {}) => {
  const routeType = page?.route?.type;
  const serviceFamily = getServiceFamilyForPage(page);
  const explicitSupportTitle = supportExplicitTitle(page);

  if (explicitSupportTitle) {
    return includeSite ? `${explicitSupportTitle} | ${SITE_NAME}` : explicitSupportTitle;
  }

  if (serviceFamily) {
    return includeSite ? `${serviceFamily.title} | ${SITE_NAME}` : serviceFamily.title;
  }

  if (routeType === 'local-service') {
    const city = getLocalCityName(page);
    const base = city ? `Pellicole per vetri ${city}` : 'Pellicole per vetri';
    return includeSite ? `${base} | ${SITE_NAME}` : base;
  }

  const rawTitle = titleCaseIfUpper(
    cleanTitle(page?.seo?.title || page?.title || page?.h1 || '')
  );
  const base = normalizeSolarisText(rawTitle || page?.route?.label || SITE_NAME);
  return includeSite && !base.includes(SITE_NAME) ? `${base} | ${SITE_NAME}` : base;
};

const liveDisplayTitle = (page) => {
  const routeType = page?.route?.type;
  const explicitSupportTitle = supportExplicitTitle(page);

  if (explicitSupportTitle) {
    return explicitSupportTitle;
  }

  if (routeType === 'local-service') {
    return normalizeSolarisText(livePageTitle(page));
  }

  if (['article', 'blog-category', 'film-type', 'author'].includes(routeType)) {
    return normalizeSolarisText(titleCaseIfUpper(cleanTitle(page?.seo?.title || page?.title || '')))
      || page?.h1
      || page?.route?.label
      || SITE_NAME;
  }

  return normalizeSolarisText(page?.h1 || cleanTitle(page?.seo?.title) || page?.route?.label || SITE_NAME);
};

const pageImage = (page) => (
  page?.primaryImage
  || page?.seo?.og?.['og:image']
  || page?.seo?.twitter?.['twitter:image']
  || ''
);

const decodeHtmlEntities = (value = '') => String(value)
  .replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
  .replace(/&#x([a-fA-F0-9]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&rsquo;/g, '’')
  .replace(/&lsquo;/g, '‘')
  .replace(/&ldquo;/g, '“')
  .replace(/&rdquo;/g, '”');

const cleanText = (value = '') => decodeHtmlEntities(value)
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const imageUrlFromBlock = (block = {}) => {
  if (!block || block.type !== 'image') return '';
  if (typeof block.src === 'string' && block.src.trim()) return block.src.trim();
  if (typeof block.url === 'string' && block.url.trim()) return block.url.trim();
  const html = String(block.html || '');
  const srcMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return srcMatch?.[1] || '';
};

const stripGenericLiveDescription = (value = '') => cleanText(value)
  .replace(/^DISTRIBUTORE DI PELLICOLE PER VETRI DAL 1983\s*/i, '')
  .replace(/^Solaris Films\s+-\s+Distributore esclusivo.*?1983\s*/i, '')
  .trim();

const trimMeta = (value = '', max = 155) => {
  const cleaned = cleanText(value);
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length).trim()}...`;
};

const livePageDescription = (page) => {
  const serviceFamily = getServiceFamilyForPage(page);
  if (serviceFamily) return normalizeSolarisText(trimMeta(serviceFamily.metaDescription || serviceFamily.description));

  const seoDescription = stripGenericLiveDescription(page?.seo?.description || page?.description || '');
  if (seoDescription) return normalizeSolarisText(trimMeta(seoDescription));

  if (page?.route?.type === 'local-service') {
    const city = getLocalCityName(page);
    return normalizeSolarisText(trimMeta(`Solaris Films installa pellicole per vetri MADICO a ${city || 'livello locale'}: controllo solare, sicurezza, privacy e sopralluogo tecnico.`));
  }

  return normalizeSolarisText(trimMeta(stripGenericLiveDescription(firstParagraph(page?.contentBlocks || [])) || 'Solaris Films installa pellicole per vetri MADICO per controllo solare, sicurezza, privacy e protezione professionale degli edifici.'));
};

const getServiceFamilyForArticlePage = (page = {}) => {
  const text = [
    liveDisplayTitle(page),
    livePageDescription(page),
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

const LivePageSEO = ({ page, currentPath }) => {
  const seo = page?.seo || {};
  if (!page) return null;
  const canonicalPath = currentPath || page.path || '/';
  const isLiveHost = typeof window === 'undefined' || LIVE_HOSTS.has(window.location.hostname);
  const canonical = typeof window !== 'undefined'
    ? new URL(canonicalPath, window.location.origin).toString()
    : seo.canonical;
  const title = livePageTitle(page, { includeSite: true });
  const description = livePageDescription(page);
  const robots = isLiveHost
    ? (seo.robots || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    : 'noindex, nofollow';
  const schemas = [
    ...(seo.schemas || []).map((schema) => schema.replaceAll(page.url, canonical)),
    ...buildLiveSchemas(page, canonicalPath),
  ];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}
      {Object.entries(seo.og || {}).map(([property, content]) => (
        <meta key={property} property={property} content={property === 'og:url' ? canonical : content} />
      ))}
      {Object.entries(seo.twitter || {}).map(([name, content]) => (
        <meta key={name} name={name} content={content} />
      ))}
      {Object.entries(seo.article || {}).map(([property, content]) => (
        <meta key={property} property={property} content={content} />
      ))}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">{schema}</script>
      ))}
    </Helmet>
  );
};

const routeSectionName = (page) => {
  const type = page?.route?.type;
  if (type === 'category' || type === 'service-index') return 'Servizi';
  if (type === 'article') return 'Lo sapevi che?';
  if (type === 'product') return 'Prodotti';
  if (type === 'local-service') return 'Servizio locale';
  if (type === 'info') return 'Info';
  if (type === 'technical-focus') return 'Focus tecnico';
  return page?.route?.label || 'Solaris Films';
};

const routeSectionPath = (page) => {
  const type = page?.route?.type;
  if (type === 'category' || type === 'service-index') return '/servizi/';
  if (type === 'article') return '/lo-sapevi-che/';
  if (type === 'product') return '/prodotti/';
  if (type === 'local-service') return '/servizio-locale/';
  if (type === 'info') return '/info/';
  if (type === 'technical-focus') return '/focus-tecnico/';
  return '/';
};

const buildLiveSchemas = (page, canonicalPath) => {
  const title = livePageTitle(page);
  const description = livePageDescription(page);
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;
  const sectionName = routeSectionName(page);
  const sectionPath = routeSectionPath(page);
  const type = page.route?.type;
  const contentType = ['article', 'blog-category', 'film-type', 'author'].includes(type)
    ? 'Article'
    : ['product'].includes(type)
      ? 'Product'
      : 'Service';
  const image = pageImage(page);

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: sectionName, item: `${BASE_URL}${sectionPath}` },
      { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
    ],
  };

  const content = {
    '@context': 'https://schema.org',
    '@type': contentType,
    name: title,
    headline: title,
    description,
    url: canonicalUrl,
    inLanguage: 'it-IT',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };

  if (contentType === 'Product') {
    content.brand = { '@type': 'Brand', name: 'MADICO' };
    content.category = 'Pellicole per vetri';
  }

  if (contentType === 'Article') {
    content.author = {
      '@type': 'Person',
      name: page.seo?.article?.['article:author'] || SITE_NAME,
    };
    content.publisher = {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    };
    if (page.seo?.article?.['article:published_time']) {
      content.datePublished = page.seo.article['article:published_time'];
    }
    if (page.seo?.article?.['article:modified_time']) {
      content.dateModified = page.seo.article['article:modified_time'];
    }
    if (image) content.image = image;
  }

  return [breadcrumb, content].map((schema) => JSON.stringify(schema));
};

const cleanTitle = (title = '') => title.replace(/\s+-\s+Solaris Films$/i, '').trim();

const firstParagraph = (blocks = []) => (
  blocks.find((block) => block.type === 'paragraph' && block.text)?.text || ''
);

const pdfHrefFromBlock = (block) => {
  if (block.href && /\.pdf($|\?)/i.test(block.href)) return block.href;
  const match = (block.html || '').match(/href=["']([^"']+\.pdf(?:\?[^"']*)?)["']/i);
  return match?.[1] || '';
};

const localizeCityText = (value = '', city = '') => {
  if (!value || !city || /^roma$/i.test(city)) return value;
  return String(value)
    .replace(/a Roma e provincia/gi, `a ${city} e provincia`)
    .replace(/a Roma/gi, `a ${city}`);
};

const localizeBlocksForCity = (blocks = [], city = '') => (
  blocks.map((block) => {
    if (!city) return block;
    const nextBlock = {
      ...block,
      text: localizeCityText(block.text, city),
      html: localizeCityText(block.html, city),
    };
    if (block.items) {
      nextBlock.items = block.items.map((item) => ({
        ...item,
        text: localizeCityText(item.text, city),
        html: localizeCityText(item.html, city),
      }));
    }
    return nextBlock;
  })
);

const SmartLink = ({ href = '/', className = '', children, ...props }) => {
  const normalizedHref = normalizeImportedHref(href);
  if (normalizedHref.startsWith('/')) {
    return <Link to={normalizedHref} className={className} {...props}>{children}</Link>;
  }

  return (
    <a href={normalizedHref} className={className} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

const stripHtmlTags = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const stripLegacyLocalLinks = (value = '') => value
  .replace(/<a\b[^>]*href=(["'])\/\1[^>]*>([\s\S]*?)<\/a>/gi, '$2')
  .replace(/<a\b[^>]*href=(["'])\/\1[^>]*>/gi, '')
  .replace(
    /<a\b[^>]*href=(["'])https?:\/\/(?:www\.)?solaris(?!films)[a-z-]*\.it\/?\1[^>]*>([\s\S]*?)<\/a>/gi,
    '$2'
  )
  .replace(
    /<a\b[^>]*href=(["'])https?:\/\/(?:www\.)?solaris(?!films)[a-z-]*\.it\/?\1[^>]*>/gi,
    ''
  );

const isLoudImportedText = (value = '') => {
  const text = stripHtmlTags(value);
  const letters = text.match(/[A-Za-zÀ-ÖØ-öø-ÿ]/g) || [];
  if (text.length < 32 || letters.length < 20) return false;

  const uppercaseLetters = letters.filter((letter) => letter === letter.toLocaleUpperCase('it')).length;
  return uppercaseLetters / letters.length > 0.78;
};

const properNameReplacements = [
  ['italia', 'Italia'],
  ['solaris films', 'Solaris Films'],
  ['madico', 'MADICO'],
  ['ancona', 'Ancona'],
  ['aosta', 'Aosta'],
  ['bari', 'Bari'],
  ['bologna', 'Bologna'],
  ['campobasso', 'Campobasso'],
  ['catanzaro', 'Catanzaro'],
  ['cosenza', 'Cosenza'],
  ['firenze', 'Firenze'],
  ['genova', 'Genova'],
  ['milano', 'Milano'],
  ['napoli', 'Napoli'],
  ['palermo', 'Palermo'],
  ['perugia', 'Perugia'],
  ['potenza', 'Potenza'],
  ['roma', 'Roma'],
  ['romagna', 'Romagna'],
  ['torino', 'Torino'],
  ['trento', 'Trento'],
  ['trieste', 'Trieste'],
  ['udine', 'Udine'],
  ['venezia', 'Venezia'],
];

const restoreProperNames = (value = '') => properNameReplacements.reduce(
  (current, [from, to]) => current.replace(new RegExp(`\\b${from}\\b`, 'gi'), to),
  value
).replace(/\bl[’']aquila\b/gi, "L'Aquila");

const sentenceCaseImportedHeading = (value = '') => {
  const lowered = stripHtmlTags(value).toLocaleLowerCase('it');
  const sentenceCased = lowered
    .replace(/(^|[.!?]\s+)([a-zà-öø-ÿ])/g, (_, prefix, letter) => `${prefix}${letter.toLocaleUpperCase('it')}`)
    .replace(/\bu\.s\.a\.\b/gi, 'U.S.A.')
    .replace(/\busa\b/gi, 'USA')
    .replace(/\buv\b/gi, 'UV');

  return restoreProperNames(sentenceCased);
};

const normalizeImportedHeadingHtml = (value = '') => {
  if (isLoudImportedText(value)) return sentenceCaseImportedHeading(value);

  return normalizeImportedHtml(value).replace(
    /^(\s*(?:<[^>]+>\s*)*)([a-zà-öø-ÿ])/,
    (_, prefix, letter) => `${prefix}${letter.toLocaleUpperCase('it')}`
  );
};

const shouldRenderImportedHeadingAsParagraph = (text = '', level = 2) => {
  if (level > 3) return false;
  const trimmed = text.trim();
  if (trimmed.length > 110 || (trimmed.length > 60 && /[.!?]$/.test(trimmed))) return true;
  const letters = trimmed.match(/[A-Za-zÀ-ÖØ-öø-ÿ]/g) || [];
  if (letters.length < 12) return false;
  const upper = letters.filter((letter) => letter === letter.toLocaleUpperCase('it')).length;
  return upper / letters.length > 0.82;
};

const normalizeImportedHtml = (value = '', { relaxHeavyStrong = false } = {}) => {
  if (!value) return value;

  const normalizedEntities = decodeHtmlEntities(decodeHtmlEntities(stripLegacyLocalLinks(value)
    .replace(/href=(["'])([^"']+)\1/gi, (_, quote, href) => `href=${quote}${normalizeImportedHref(href)}${quote}`)
  ));
  const withoutLegacyLinks = normalizedEntities
    .replace(/(^|[>\s])(?:É|&#0*201;|&#x0*c9;|&Eacute;)(?=\s)/gi, '$1È')
    .replace(/\btesta e certificata\b/gi, 'testata e certificata')
    .replace(/\bluoghi di lavori\b/gi, 'luoghi di lavoro')
    .replace(/\bnorma anti esplosione\b/gi, 'norma antiesplosione')
    .replace(/\bMT 200 VX\b/g, 'MT 200 XW')
    .replace(/\bEcosaving\b/g, 'EcoSaving')
    .replace(/\bpiu\b/gi, 'più')
    .replace(/\bsunscape\b/gi, 'Sunscape')
    .replace(/\bsputtered\b/gi, 'Sputtered')
    .replace(/\bInstallatore Certificato Tecnosolar\b/gi, 'Installatore certificato Solaris Films')
    .replace(/\bTecnosolar\b/gi, 'Solaris Films')
    .replace(/[^.!?<>]*(?:serie\s*nt|nt[\s-]*20|nt[\s-]*35)[^.!?<>]*[.!?]/gi, ' ')
    .replace(/\bUn eccellente riduzione\b/g, "Un'eccellente riduzione")
    .replace(/\bvetrate\s+\?/gi, 'vetrate?')
    .replace(/\s{2,}/g, ' ');
  if (!relaxHeavyStrong) return withoutLegacyLinks;

  const strongTags = withoutLegacyLinks.match(/<strong\b/gi) || [];
  const closingStrongTags = withoutLegacyLinks.match(/<\/strong>/gi) || [];
  const plainText = stripHtmlTags(withoutLegacyLinks);

  const strongTextLength = [...withoutLegacyLinks.matchAll(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi)]
    .reduce((total, match) => total + stripHtmlTags(match[1]).length, 0);
  const strongRatio = plainText.length ? strongTextLength / plainText.length : 0;

  if (
    strongTags.length >= 4
    || (strongTags.length >= 2 && closingStrongTags.length < strongTags.length)
    || (strongTags.length >= 1 && closingStrongTags.length === 0 && plainText.length > 110)
    || strongRatio > 0.62
    || (strongTags.length >= 1 && /^<strong\b/i.test(withoutLegacyLinks.trim()) && plainText.length > 160)
  ) {
    return withoutLegacyLinks.replace(/<\/?strong\b[^>]*>/gi, '');
  }

  if (plainText.length < 160) return withoutLegacyLinks;

  return withoutLegacyLinks;
};

const ContentBlocks = ({ blocks, title, skipFirstHeading = false }) => {
  const renderedBlocks = [];
  const titleText = title.toLowerCase();
  let firstHeadingSkipped = false;

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === 'heading' && block.level === 1) {
      const shouldSkip = block.text.toLowerCase() === titleText || (skipFirstHeading && !firstHeadingSkipped);
      firstHeadingSkipped = true;
      if (shouldSkip) continue;
    }

    if (block.type === 'image') {
      continue;
    }

    if (block.type === 'metric') {
      const metrics = [];
      let metricIndex = index;
      while (blocks[metricIndex]?.type === 'metric') {
        metrics.push(blocks[metricIndex]);
        metricIndex += 1;
      }
      index = metricIndex - 1;

      renderedBlocks.push(
        <div className="live-metrics-grid" key={`metrics-${index}`}>
          {metrics.map((metric, metricItemIndex) => (
            <div className="live-metric" key={`${metric.label}-${metricItemIndex}`}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>
      );
      continue;
    }

    if (block.type === 'heading') {
      const extractedSpecs = extractSpecsFromHeadings(blocks, index);
      if (extractedSpecs) {
        renderedBlocks.push(
          <section className="focus-specs-panel" key={`focus-specs-headings-${index}`} aria-label="Dati prestazionali principali">
            <header>
              <span>Dati principali</span>
              <h3>Valori utili per un confronto rapido</h3>
            </header>
            <div className="focus-specs-grid">
              {extractedSpecs.specs.map((item) => (
                <article key={`${item.label}-${item.value}`} className="focus-spec-card">
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </article>
              ))}
            </div>
          </section>
        );
        index = extractedSpecs.nextIndex - 1;
        continue;
      }

      const rawHeadingText = stripHtmlTags(block.text || block.html || '');
      if (shouldRenderImportedHeadingAsParagraph(rawHeadingText, block.level)) {
        renderedBlocks.push(
          <p
            key={`${block.type}-${index}`}
            dangerouslySetInnerHTML={{
              __html: normalizeImportedHtml(block.html || block.text, { relaxHeavyStrong: true }),
            }}
          />
        );
        continue;
      }
      const Heading = `h${Math.min(Math.max(block.level, 2), 4)}`;
      const headingHtml = normalizeImportedHeadingHtml(block.html || block.text);
      renderedBlocks.push(
        <Heading
          className={`live-prose-heading live-prose-heading-${Math.min(block.level, 4)}`}
          key={`${block.type}-${index}`}
          dangerouslySetInnerHTML={{ __html: headingHtml }}
        />
      );
      continue;
    }

    if (block.type === 'paragraph') {
      const extractedSpecs = extractSpecsFromParagraphs(blocks, index);
      if (extractedSpecs) {
        renderedBlocks.push(
          <section className="focus-specs-panel" key={`focus-specs-inline-${index}`} aria-label="Dati prestazionali principali">
            <header>
              <span>Dati principali</span>
              <h3>Valori utili per un confronto rapido</h3>
            </header>
            <div className="focus-specs-grid">
              {extractedSpecs.specs.map((item) => (
                <article key={`${item.label}-${item.value}`} className="focus-spec-card">
                  <strong>{item.label}</strong>
                  <p>{item.value}</p>
                </article>
              ))}
            </div>
          </section>
        );
        index = extractedSpecs.nextIndex - 1;
        continue;
      }

      renderedBlocks.push(
        <p
          className="live-prose-paragraph"
          key={`${block.type}-${index}`}
          dangerouslySetInnerHTML={{
            __html: normalizeImportedHtml(block.html || block.text, { relaxHeavyStrong: true }),
          }}
        />
      );
      continue;
    }

    if (block.type === 'list') {
      const ListTag = block.ordered ? 'ol' : 'ul';
      renderedBlocks.push(
        <ListTag className="live-prose-list" key={`${block.type}-${index}`}>
          {(block.items || []).map((item, itemIndex) => (
            <li
              key={`${item.text}-${itemIndex}`}
              dangerouslySetInnerHTML={{
                __html: normalizeImportedHtml(item.html || item.text, { relaxHeavyStrong: true }),
              }}
            />
          ))}
        </ListTag>
      );
      continue;
    }

    if (block.type === 'note') {
      renderedBlocks.push(
        <div
          className="live-prose-note"
          key={`${block.type}-${index}`}
          dangerouslySetInnerHTML={{
            __html: normalizeImportedHtml(block.html || block.text, { relaxHeavyStrong: true }),
          }}
        />
      );
      continue;
    }

    if (block.type === 'cta' && block.href) {
      const normalizedHref = normalizeImportedHref(block.href);
      renderedBlocks.push(
        <SmartLink href={normalizedHref} className="live-inline-cta" key={`${block.type}-${index}`}>
          <span>{block.text}</span>
          {normalizedHref.startsWith('/') ? <ArrowRight size={18} /> : <ExternalLink size={18} />}
        </SmartLink>
      );
      continue;
    }

    if (block.type === 'image') continue;
  }

  return renderedBlocks;
};

const formatArticleDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const infoThemes = [
  {
    key: 'normative',
    title: 'Norme e sicurezza',
    eyebrow: 'Norme applicate',
    route: '/info/norme/',
    description: 'Riferimenti normativi e sicurezza sul lavoro letti in funzione del vetro, del rischio e della posa.',
    match: /(norm|sicurezza|testo unico|dpr|brc)/i,
  },
  {
    key: 'certificazioni',
    title: 'Garanzie e certificazioni',
    eyebrow: 'Affidabilità',
    route: '/info/garanzie-clienti/',
    description: 'Garanzie, certificazioni e punti di forza da leggere insieme a prodotto, applicazione e metodo Solaris.',
    match: /(garanz|certific|nfrc|punti di forza)/i,
  },
  {
    key: 'supporto',
    title: 'Uso, manutenzione e glossario',
    eyebrow: 'Supporto operativo',
    route: '/info/#supporto',
    description: 'Istruzioni, manutenzione e termini tecnici per fare domande più precise prima della verifica.',
    match: /(istruz|manutenz|glossario|termini)/i,
  },
];

const infoThemeForPage = (page = {}) => {
  const text = `${liveDisplayTitle(page)} ${livePageDescription(page)} ${page.path || ''}`.toLocaleLowerCase('it');
  return infoThemes.find((theme) => theme.match.test(text)) || infoThemes[2];
};

const infoTagsForPage = (page = {}, theme) => {
  const text = `${liveDisplayTitle(page)} ${livePageDescription(page)} ${page.path || ''}`.toLocaleLowerCase('it');
  const tags = [theme?.eyebrow || 'Info Solaris'];

  if (/norm|dpr|testo unico|brc/i.test(text)) tags.push('Norme');
  if (/sicurezza/i.test(text)) tags.push('Sicurezza');
  if (/garanz/i.test(text)) tags.push('Garanzia');
  if (/certific|nfrc/i.test(text)) tags.push('Certificazioni');
  if (/glossario|termini/i.test(text)) tags.push('Glossario');
  if (/manutenz|istruz/i.test(text)) tags.push('Manutenzione');

  return [...new Set(tags)].slice(0, 3);
};

const focusTagsForPage = (page = {}, family) => {
  const text = `${liveDisplayTitle(page)} ${livePageDescription(page)} ${page.path || ''}`.toLocaleLowerCase('it');
  const tags = [family?.eyebrow || 'Focus tecnico'];

  if (/serie|cl|rs|safetyshield|graffiti free/i.test(text)) tags.push('Serie');
  if (/norm|uni|sicurezza|antiesplos|antisfond/i.test(text)) tags.push('Sicurezza');
  if (/sputtered|sunscape|spettro|riflett|oscur|termoisol|solar/i.test(text)) tags.push('Prestazioni');
  if (/privacy|decorativ|vetrofanie|stampabil/i.test(text)) tags.push('Design');

  return [...new Set(tags)].slice(0, 3);
};

const focusQuickGuide = (family) => {
  if (family?.key === 'antisolari') {
    return [
      'Definisci la priorita: ridurre calore, limitare abbagliamento o mantenere piu luce naturale.',
      'Verifica esposizione, tipo di vetro e vincoli estetici prima di scegliere la serie.',
      'Confronta i prodotti collegati sul caso reale con verifica tecnica Solaris.',
    ];
  }

  if (family?.key === 'sicurezza') {
    return [
      'Individua il rischio principale: urto, antisfondamento o scenario ad alta criticita.',
      'Controlla classe richiesta, spessore e compatibilita vetro-telaio.',
      'Valida posa e ancoraggi prima della scelta definitiva.',
    ];
  }

  return [
    'Chiarisci il risultato atteso: privacy, design, branding o combinazione dei tre.',
    'Valuta luce, visibilita e finitura piu coerente con lo spazio.',
    'Conferma la scelta con verifica tecnica su superfici e posa.',
  ];
};

const focusDecisionPanel = (family) => {
  if (family?.key === 'antisolari') {
    return {
      objective: 'Ridurre calore e abbagliamento senza perdere controllo su luce e resa estetica.',
      checks: [
        'Esposizione e orientamento delle superfici vetrate.',
        'Tipo di vetro e limiti di applicazione interna/esterna.',
        'Target reale: comfort, consumo energetico, protezione UV.',
      ],
      action: 'Richiedi verifica quando vuoi una scelta misurata tra serie riflettenti, selettive o neutre.',
    };
  }

  if (family?.key === 'sicurezza') {
    return {
      objective: 'Aumentare la sicurezza del vetro con un livello coerente al rischio reale.',
      checks: [
        'Scenario di rischio: urto, antisfondamento, frammentazione, antiesplosione.',
        'Classe richiesta e compatibilita con vetro, telaio e contesto normativo.',
        'Strategia di posa e, se richiesto, sistemi di ancoraggio.',
      ],
      action: 'Richiedi verifica quando devi decidere classe, spessore e soluzione applicabile senza sostituire il vetro.',
    };
  }

  return {
    objective: 'Gestire privacy e design mantenendo una lettura pulita dello spazio.',
    checks: [
      'Privacy richiesta in orario diurno e serale.',
      'Quantita di luce da preservare negli ambienti.',
      'Finitura e grafica coerenti con uso e brand.',
    ],
    action: 'Richiedi verifica quando devi bilanciare estetica, funzionalita e posa su vetro esistente.',
  };
};

const isLegacySafetyShieldFocusPage = (page = {}) => {
  const path = normalizePath(page?.route?.newPath || page?.path || '');
  return path === '/focus-tecnico/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/';
};

const normalizeSpecLabel = (value = '') => (
  String(value)
    .replace(/\.$/, '')
    .replace(/\s+/g, ' ')
    .trim()
);

const parseFocusSpecItem = (text = '') => {
  const normalized = normalizeSpecLabel(text);
  const lower = normalized.toLocaleLowerCase('it');

  const map = [
    { key: 'Riflessione solare', test: /riflessione solare/ },
    { key: 'Spessore medio', test: /spessore/ },
    { key: 'Protezione antigraffio', test: /antigraffio|strati/ },
    { key: 'Qualita installazione', test: /installazione|posa/ },
    { key: 'Resistenza abrasione', test: /abrasion|resistenza/ },
    { key: 'Norma sicurezza', test: /en 12600|norma/ },
    { key: 'Garanzia', test: /garanzia/ },
  ];

  const matched = map.find((entry) => entry.test.test(lower));
  if (!matched) return null;

  const valueMatch = normalized.match(/(?:fino al|fino a|di|da)\s+(.+)$/i);
  const value = valueMatch ? valueMatch[1].trim() : normalized;
  return { label: matched.key, value };
};

const extractFocusSpecs = (blocks = []) => {
  const extracted = [];
  const cleanedBlocks = [];

  for (const block of blocks) {
    if (block.type !== 'list' || !Array.isArray(block.items) || block.items.length < 4) {
      cleanedBlocks.push(block);
      continue;
    }

    const parsed = block.items
      .map((item) => parseFocusSpecItem(item.text || item.html || ''))
      .filter(Boolean);

    if (parsed.length < 4) {
      cleanedBlocks.push(block);
      continue;
    }

    const uniqueByLabel = [];
    const seen = new Set();
    parsed.forEach((entry) => {
      if (seen.has(entry.label)) return;
      seen.add(entry.label);
      uniqueByLabel.push(entry);
    });

    extracted.push(...uniqueByLabel);
  }

  return { cleanedBlocks, specs: extracted };
};

const extractSpecsFromParagraphs = (blocks = [], startIndex = 0) => {
  const specs = [];
  let cursor = startIndex;

  while (cursor < blocks.length) {
    const block = blocks[cursor];
    if (block?.type !== 'paragraph') break;
    const parsed = parseFocusSpecItem(block.text || block.html || '');
    if (!parsed) break;
    specs.push(parsed);
    cursor += 1;
  }

  if (specs.length < 4) return null;

  const uniqueByLabel = [];
  const seen = new Set();
  specs.forEach((entry) => {
    if (seen.has(entry.label)) return;
    seen.add(entry.label);
    uniqueByLabel.push(entry);
  });

  return {
    specs: uniqueByLabel,
    nextIndex: cursor,
  };
};

const extractSpecsFromHeadings = (blocks = [], startIndex = 0) => {
  const specs = [];
  let cursor = startIndex;

  while (cursor < blocks.length) {
    const block = blocks[cursor];
    if (block?.type !== 'heading' || Number(block.level) !== 2) break;
    const parsed = parseFocusSpecItem(block.text || block.html || '');
    if (!parsed) break;
    specs.push(parsed);
    cursor += 1;
  }

  if (specs.length < 4) return null;

  const uniqueByLabel = [];
  const seen = new Set();
  specs.forEach((entry) => {
    if (seen.has(entry.label)) return;
    seen.add(entry.label);
    uniqueByLabel.push(entry);
  });

  return {
    specs: uniqueByLabel,
    nextIndex: cursor,
  };
};

const isProductLikeFocusText = (value = '') => {
  const text = cleanText(value).toLocaleLowerCase('it');
  if (!text) return false;

  return (
    /\b(?:madico\s+)?(?:sb|sg|sl|rs|cl)\s*\d{1,3}\s*(?:e\s*)?ps\s*sr\b/i.test(text)
    || /\bsafetyshield\s*\d+\b/i.test(text)
    || /\b(?:scheda tecnica disponibile|vai al focus tecnico|prodotto:)\b/i.test(text)
    || /\bpellicola\s+antisolare\s+riflettente\b/i.test(text)
  );
};

const sanitizeFocusBlocks = (blocks = []) => blocks
  .map((block) => {
    if (!block) return block;

    if (block.type === 'paragraph' || block.type === 'heading') {
      const value = block.text || block.html || '';
      if (isProductLikeFocusText(value)) return null;
      return block;
    }

    if (block.type === 'list' && Array.isArray(block.items)) {
      const items = block.items.filter((item) => !isProductLikeFocusText(item?.text || item?.html || ''));
      if (!items.length) return null;
      return { ...block, items };
    }

    if (block.type === 'cta') {
      const value = block.text || block.html || '';
      if (isProductLikeFocusText(value)) return null;
      if (/focus-tecnico/i.test(value)) return null;
      return block;
    }

    return block;
  })
  .filter(Boolean);

const samePath = (a = '', b = '') => normalizePath(a) === normalizePath(b);

const ArticleTemplate = ({ page }) => {
  const blocks = page.contentBlocks || [];
  const title = liveDisplayTitle(page);
  const description = livePageDescription(page) || firstParagraph(blocks);
  const family = getServiceFamilyForArticlePage(page);
  const image = family?.image || '/assets/services/pellicole-antisolari.jpg';
  const inlineImage = blocks.map(imageUrlFromBlock).find(Boolean) || '';
  const published = formatArticleDate(page.seo?.article?.['article:published_time']);
  const modified = formatArticleDate(page.seo?.article?.['article:modified_time']);

  return (
    <main className="live-modern-shell live-article-shell">
      <section className="live-article-hero">
        <div className="live-article-hero-copy">
          <div className="live-modern-kicker">
            <BookOpen size={16} />
            <span>Approfondimento Solaris</span>
          </div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <div className="live-article-meta" aria-label="Dettagli articolo">
            {(published || modified) && (
              <span>
                <CalendarDays size={16} />
                {published || modified}
              </span>
            )}
            <span>
              <ShieldCheck size={16} />
              Consulenza tecnica
            </span>
            <span>
              <CheckCircle2 size={16} />
              Pellicole MADICO
            </span>
          </div>
        </div>
        {image && (
          <figure className="live-article-hero-media">
            <img src={image} alt={title} loading="eager" />
          </figure>
        )}
      </section>

      <section className="live-article-body">
        <article className="live-prose live-article-prose">
          {inlineImage ? (
            <figure className="live-article-inline-media">
              <img src={inlineImage} alt={title} loading="lazy" />
            </figure>
          ) : null}
          <ContentBlocks blocks={blocks} title={title} skipFirstHeading />
          <div className="live-article-cta-band">
            <h2>Porta questo approfondimento sul tuo progetto</h2>
            <p>Solaris Films verifica vetro, esposizione e obiettivo tecnico, poi seleziona la pellicola corretta con posa professionale e assistenza dedicata.</p>
            <Link to="/preventivo" className="btn-yellow">
              Richiedi preventivo
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>

        <aside className="live-side-panel live-article-panel" aria-label="Approccio Solaris Films">
          <div className="live-side-block">
            <span className="live-side-eyebrow">Perché Solaris</span>
            <h2>Dal contenuto alla soluzione corretta</h2>
            <p>La base contenuti Solaris valorizza competenza, posa e prodotti originali: ogni articolo deve portare alla scelta tecnica più adatta.</p>
          </div>
          <ul className="live-article-checklist">
            <li><CheckCircle2 size={17} /> Analisi di vetri ed esposizione</li>
            <li><CheckCircle2 size={17} /> Pellicole MADICO originali</li>
            <li><CheckCircle2 size={17} /> Posa e assistenza Solaris</li>
          </ul>
          <div className="live-side-actions">
            <a href="tel:+390559107621" className="live-side-link">
              <Phone size={18} />
              <span>055 9107621</span>
            </a>
            <a href="mailto:info@solarisfilms.it" className="live-side-link">
              <Mail size={18} />
              <span>info@solarisfilms.it</span>
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
};

const ServiceFamilyTemplate = ({ page, allPages = [] }) => {
  const family = getServiceFamilyForPage(page);
  const blocks = page.contentBlocks || [];
  const products = getProductsForFamily(allPages, family);
  const focusPages = getFocusForFamily(allPages, family);

  if (!family) return null;

  return (
    <main className="live-modern-shell service-family-shell">
      <section className="service-family-hero">
        <div className="service-family-hero-copy">
          <div className="live-modern-kicker">
            <ShieldCheck size={16} />
            <span>{family.eyebrow}</span>
          </div>
          <h1>{family.title}</h1>
          <p>{family.headline}</p>
          <p className="service-family-hero-description">{family.description}</p>
          <div className="live-hero-actions">
            <Link to="/preventivo" className="btn-yellow">
              Richiedi preventivo
              <ArrowRight size={18} />
            </Link>
            <Link to="/servizi" className="live-ghost-button">
              Tutti i servizi
            </Link>
          </div>
        </div>

        <div className="service-family-hero-card">
          {family.image && (
            <figure className={`service-family-image service-family-image-hero service-family-image-${family.key}`}>
              <img src={family.image} alt={family.title} loading="eager" />
              <figcaption className="service-family-image-caption">
                <span>Ruolo nel menu</span>
                <p>{family.menuRole}</p>
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="service-family-overview">
        <div className="service-family-stat-grid">
          {family.stats.map((stat) => (
            <div className="service-family-stat" key={`${stat.value}-${stat.label}`}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="service-family-body">
        <div className="service-family-main">
          <section className="service-family-section">
            <div className="service-family-section-heading">
              <span>Funzione</span>
              <h2>Quando usare questa famiglia</h2>
            </div>
            <div className="service-family-benefits">
              {family.benefits.map((benefit) => (
                <div className="service-family-benefit" key={benefit}>
                  <CheckCircle2 size={18} />
                  <p>{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="service-family-section">
            <div className="service-family-section-heading">
              <span>Catalogo</span>
              <h2>Prodotti collegati</h2>
              <p>{products.length} schede prodotto collegate alla nuova struttura Solaris.</p>
            </div>
            <div className="service-family-card-grid">
              {products.map((product) => (
                <Link
                  to={product.route?.newPath || product.path}
                  className="service-family-link-card"
                  key={product.path}
                >
                  <span>{product.route?.label || 'Prodotto'}</span>
                  <h3>{getPageTitle(product)}</h3>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </section>

          {focusPages.length > 0 && (
            <section className="service-family-section">
              <div className="service-family-section-heading">
                <span>Supporto tecnico</span>
                <h2>Focus collegati</h2>
                <p>Questi contenuti restano separati dalla pagina servizio e aiutano chi vuole valutare tecnologia, serie e applicazioni.</p>
              </div>
              <div className="service-family-focus-list">
                {focusPages.map((focus) => (
                  <Link to={focus.route?.newPath || focus.path} key={focus.path}>
                    <span>{getPageTitle(focus)}</span>
                    <ArrowRight size={15} />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="service-family-section service-family-live-source">
            <div className="service-family-section-heading">
              <span>Approfondimento Solaris</span>
              <h2>Contenuto tecnico riorganizzato</h2>
              <p>La pagina raccoglie le informazioni utili e le presenta in una struttura piu chiara per menu, SEO e conversione.</p>
            </div>
            <article className="live-prose">
              <ContentBlocks blocks={blocks} title={family.title} skipFirstHeading />
            </article>
          </section>
        </div>

        <aside className="live-side-panel service-family-side" aria-label="Metodo Solaris Films">
          <div className="live-side-block">
            <span className="live-side-eyebrow">Metodo Solaris</span>
            <h2>Prima si valuta il vetro, poi si sceglie la pellicola</h2>
            <p>La pagina padre orienta la scelta, ma il prodotto corretto dipende da vetro, esposizione, obiettivo tecnico e condizioni di posa.</p>
          </div>
          <ul className="live-article-checklist">
            {family.decisionPoints.map((point) => (
              <li key={point}><CheckCircle2 size={17} /> {point}</li>
            ))}
          </ul>
          <div className="live-side-actions">
            <Link to="/preventivo" className="live-side-link">
              <ArrowRight size={18} />
              <span>Richiedi analisi</span>
            </Link>
            <a href="tel:+390559107621" className="live-side-link">
              <Phone size={18} />
              <span>055 9107621</span>
            </a>
            <a href="mailto:info@solarisfilms.it" className="live-side-link">
              <Mail size={18} />
              <span>info@solarisfilms.it</span>
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
};

const ProductTemplate = ({ page, allPages = [] }) => {
  const blocks = page.contentBlocks || [];
  const title = liveDisplayTitle(page);
  const family = getServiceFamilyForProductPage(page);
  const description = livePageDescription(page) || firstParagraph(blocks);
  const productVisual = getProductVisual(page);
  const image = productVisual?.src || pageImage(page) || family?.image;
  const pdfHref = blocks.map(pdfHrefFromBlock).find(Boolean);
  const internalClMatch = (page.route?.newPath || page.path || '').match(/madico-cl-(400|700)-ps-sr/i);
  const normalizeProductBlock = (block) => {
    if (!internalClMatch) return block;
    const model = internalClMatch[1];
    const fixInternalClCopy = (value = '') => String(value)
      .replace(new RegExp(`\\bMadico CL ${model} E PS SR di Tecnosolar\\b`, 'g'), `Madico CL ${model} PS SR di Solaris Films`)
      .replace(/\bTecnosolar\b/gi, 'Solaris Films')
      .replace(/\bversione da interno\b/g, 'versione da esterno')
      .replace(new RegExp(`madico-cl-${model}-ps-sr/`, 'gi'), `madico-cl-${model}-e-ps-sr/`)
      .replace(new RegExp(`(madico-cl-${model}-e-ps-sr/[^>]*>)CL ${model} PS SR`, 'gi'), `$1CL ${model} E PS SR`)
      .replace(new RegExp(`\\bversione da esterno CL ${model} PS SR\\b`, 'g'), `versione da esterno CL ${model} E PS SR`);
    return {
      ...block,
      html: block.html ? fixInternalClCopy(block.html) : block.html,
      text: block.text ? fixInternalClCopy(block.text) : block.text,
      items: block.items?.map((item) => ({
        ...item,
        html: item.html ? fixInternalClCopy(item.html) : item.html,
        text: item.text ? fixInternalClCopy(item.text) : item.text,
      })),
    };
  };
  const productBlocks = blocks.map(normalizeProductBlock).filter((block) => {
    const text = stripHtmlTags(block.text || block.html || '').replace(/\s+/g, ' ').trim();
    if (/^consulta la scheda tecnica$/i.test(text)) return false;
    if (pdfHrefFromBlock(block) && /scheda tecnica/i.test(text)) return false;
    if (/^hai bisogno di una pellicola antisolare\?/i.test(text)) return false;
    if (/^volete scoprire tutte le possibilit/i.test(text)) return false;
    if (/^scopri insieme a noi il mondo delle pellicole per vetri!?$/i.test(text)) return false;
    if (/^(10|anni di garanzia)$/i.test(text)) return false;
    return true;
  });
  const relatedProducts = family
    ? getProductsForFamily(allPages, family)
      .filter((product) => normalizePath(product.route?.newPath || product.path) !== normalizePath(page.route?.newPath || page.path))
      .slice(0, 4)
    : [];
  const focusPages = family ? getFocusForFamily(allPages, family).slice(0, 3) : [];
  const visualIsFamilyFallback = image && image === family?.image;

  return (
    <main className="live-modern-shell product-detail-shell">
      <section className="product-detail-hero">
        <div className="product-detail-hero-copy">
          <div className="live-modern-kicker">
            <ShieldCheck size={16} />
            <span>{family?.menuLabel || 'Prodotto Solaris'}</span>
          </div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <div className="product-detail-tags" aria-label="Dettagli prodotto">
            <span>Prodotto MADICO</span>
            {family && <span>{family.title}</span>}
            {pdfHref && <span>Scheda tecnica disponibile</span>}
          </div>
          <div className="live-hero-actions">
            <Link to="/preventivo" className="btn-yellow">
              Richiedi verifica tecnica
              <ArrowRight size={18} />
            </Link>
            {family && (
              <Link to={family.route} className="live-ghost-button">
                Torna alla famiglia
              </Link>
            )}
          </div>
        </div>

        {image && (
          <figure className={`product-detail-visual ${family ? `service-family-image-${family.key}` : ''} ${productVisual ? 'product-detail-visual-product' : ''} ${visualIsFamilyFallback ? 'product-detail-visual-cover' : ''}`}>
            <img src={image} alt={productVisual?.alt || title} loading="eager" />
          </figure>
        )}
      </section>

      <section className="product-detail-body">
        <article className="live-prose product-detail-prose">
          <ContentBlocks blocks={productBlocks} title={title} skipFirstHeading />
          <div className="live-article-cta-band">
            <h2>Serve confermare il prodotto sul tuo vetro?</h2>
            <p>Solaris verifica composizione del vetro, posa possibile, obiettivo tecnico e contesto normativo prima di confermare la pellicola corretta.</p>
            <Link to="/preventivo" className="btn-yellow">
              Richiedi preventivo
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>

        <aside className="live-side-panel product-detail-side" aria-label="Consulenza prodotto Solaris Films">
          <div className="live-side-block">
            <span className="live-side-eyebrow">Metodo Solaris</span>
            <h2>La scheda non basta: va verificato il vetro</h2>
            <p>Il dato tecnico orienta la scelta, ma esposizione, dimensione, telaio e condizioni di posa decidono quale soluzione installare.</p>
          </div>
          <ul className="live-article-checklist">
            <li><CheckCircle2 size={17} /> Analisi del vetro esistente</li>
            <li><CheckCircle2 size={17} /> Compatibilità con famiglia prodotto</li>
            <li><CheckCircle2 size={17} /> Posa professionale Solaris</li>
          </ul>
          <div className="live-side-actions">
            {pdfHref && (
              <SmartLink href={pdfHref} className="live-side-link">
                <FileText size={18} />
                <span>Scheda tecnica</span>
              </SmartLink>
            )}
            <Link to="/preventivo" className="live-side-link">
              <ArrowRight size={18} />
              <span>Richiedi analisi</span>
            </Link>
            <a href="tel:+390559107621" className="live-side-link">
              <Phone size={18} />
              <span>055 9107621</span>
            </a>
          </div>

          {relatedProducts.length > 0 && (
            <div className="product-related-block">
              <span className="live-side-eyebrow">Stessa famiglia</span>
              <div className="product-related-list">
                {relatedProducts.map((product) => (
                  <Link to={product.route?.newPath || product.path} key={product.path}>
                    <span>{getPageTitle(product)}</span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {focusPages.length > 0 && (
            <div className="product-related-block">
              <span className="live-side-eyebrow">Focus tecnici</span>
              <div className="product-related-list">
                {focusPages.map((focus) => (
                  <Link to={focus.route?.newPath || focus.path} key={focus.path}>
                    <span>{getPageTitle(focus)}</span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

const FocusTemplate = ({ page, allPages = [] }) => {
  const rawBlocks = page.contentBlocks || [];
  const { cleanedBlocks, specs } = extractFocusSpecs(rawBlocks);
  const blocks = sanitizeFocusBlocks(cleanedBlocks);
  const title = liveDisplayTitle(page);
  const family = getServiceFamilyForFocusPage(page);
  const focusSubject = title || family?.title || 'Tecnologia Solaris';
  const description = livePageDescription(page) || (family
    ? `Focus tecnico Solaris su ${family.title.toLocaleLowerCase('it')}, prestazioni e criteri di scelta.`
    : 'Focus tecnico Solaris su pellicole per vetri, prestazioni e condizioni di posa.');
  const image = family?.image || pageImage(page) || '/assets/services/pellicole-antisolari.jpg';
  const relatedFocus = family
    ? getFocusForFamily(allPages, family)
      .filter((focus) => !samePath(focus.route?.newPath || focus.path, page.route?.newPath || page.path))
      .slice(0, 4)
    : [];
  const relatedProducts = family ? getProductsForFamily(allPages, family).slice(0, 4) : [];
  const quickGuide = focusQuickGuide(family);
  const decisionPanel = focusDecisionPanel(family);
  const isLegacySafetyShield = isLegacySafetyShieldFocusPage(page);

  return (
    <main className="live-modern-shell product-detail-shell focus-detail-shell">
      <section className="product-detail-hero focus-detail-hero">
        <div className="product-detail-hero-copy">
          <div className="live-modern-kicker">
            <BookOpen size={16} />
            <span>{family?.eyebrow || 'Focus tecnico Solaris'}</span>
          </div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <div className="product-detail-tags" aria-label="Dettagli focus tecnico">
            {focusTagsForPage(page, family).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="live-hero-actions">
            <Link to="/preventivo" className="btn-yellow">
              Richiedi verifica tecnica
              <ArrowRight size={18} />
            </Link>
            <Link to="/focus-tecnico" className="live-ghost-button">
              Tutti i focus
            </Link>
          </div>
        </div>

        <figure className={`product-detail-visual product-detail-visual-cover ${family ? `service-family-image-${family.key}` : ''}`}>
          <img src={image} alt={focusSubject} loading="eager" />
          <figcaption>
            <span>Approfondimento tecnico</span>
            <p>{`${focusSubject}: tecnologia e applicazioni da confermare sul vetro reale.`}</p>
          </figcaption>
        </figure>
      </section>

      <section className="product-detail-body focus-detail-body">
        <article className="live-prose product-detail-prose">
          <div className="local-service-intro">
            <span>Percorso di scelta</span>
            <h2>Capire se questa soluzione è giusta per il tuo vetro</h2>
            <p>
              Qui trovi un quadro semplice: cosa ottieni, cosa verificare e quando passare a una valutazione tecnica sul caso reale.
            </p>
          </div>
          <div className="focus-quick-guide" aria-label="Percorso rapido di lettura">
            {quickGuide.map((step, index) => (
              <article key={step} className="focus-quick-card">
                <span>{`Step ${index + 1}`}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
          <div className="focus-decision-panel" aria-label="Quadro decisionale focus">
            <article className="focus-decision-card">
              <span>Obiettivo</span>
              <p>{decisionPanel.objective}</p>
            </article>
            <article className="focus-decision-card">
              <span>Verifiche chiave</span>
              <ul>
                {decisionPanel.checks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="focus-decision-card">
              <span>Quando passare al preventivo</span>
              <p>{decisionPanel.action}</p>
            </article>
          </div>
          {isLegacySafetyShield && (
            <section className="focus-specs-panel" aria-label="Sezione dedicata SafetyShield">
              <header>
                <span>Approfondimento completo</span>
                <h3>Per SafetyShield 800/1500 e ancoraggi, apri la sezione dedicata</h3>
              </header>
              <div className="focus-specs-grid">
                <article className="focus-spec-card">
                  <strong>Pagina dedicata</strong>
                  <p>Confronto SafetyShield 800 vs 1500, FrameGard, GullWing e supporti tecnici ufficiali.</p>
                  <Link to="/focus-tecnico/safetyshield/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] mt-3">
                    Apri sezione SafetyShield
                    <ArrowRight size={14} />
                  </Link>
                </article>
              </div>
            </section>
          )}
          {specs.length > 0 && (
            <section className="focus-specs-panel" aria-label="Dati prestazionali principali">
              <header>
                <span>Dati principali</span>
                <h3>Valori utili per un confronto rapido</h3>
              </header>
              <div className="focus-specs-grid">
                {specs.map((item) => (
                  <article key={`${item.label}-${item.value}`} className="focus-spec-card">
                    <strong>{item.label}</strong>
                    <p>{item.value}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
          <ContentBlocks blocks={blocks} title={title} skipFirstHeading />
          <div className="live-article-cta-band">
            <h2>Vuoi applicare questo focus al tuo progetto?</h2>
            <p>Solaris verifica vetro, esposizione, obiettivo tecnico e condizioni di posa prima di indicare la pellicola corretta.</p>
            <Link to="/preventivo" className="btn-yellow">
              Richiedi analisi
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>

        <aside className="live-side-panel product-detail-side" aria-label="Metodo focus tecnico Solaris Films">
          <div className="live-side-block">
            <span className="live-side-eyebrow">Metodo Solaris</span>
            <h2>Il dato tecnico va portato sul caso reale</h2>
            <p>La scheda spiega la tecnologia; Solaris valuta vetro, dimensioni, esposizione e rischio prima della scelta finale.</p>
          </div>
          <ul className="live-article-checklist">
            {(family?.decisionPoints || [
              'Obiettivo tecnico del cliente.',
              'Compatibilità con vetro e serramento.',
              'Condizioni di posa e manutenzione.',
            ]).map((point) => (
              <li key={point}><CheckCircle2 size={17} /> {point}</li>
            ))}
          </ul>
          <div className="live-side-actions">
            {family && (
              <Link to={family.route} className="live-side-link">
                <ShieldCheck size={18} />
                <span>Pagina servizio</span>
              </Link>
            )}
            <Link to="/preventivo" className="live-side-link">
              <ArrowRight size={18} />
              <span>Richiedi analisi</span>
            </Link>
            <a href="tel:+390559107621" className="live-side-link">
              <Phone size={18} />
              <span>055 9107621</span>
            </a>
          </div>

          {relatedProducts.length > 0 && (
            <div className="product-related-block">
              <span className="live-side-eyebrow">Prodotti collegati</span>
              <div className="product-related-list">
                {relatedProducts.map((product) => (
                  <Link to={product.route?.newPath || product.path} key={product.path}>
                    <span>{getPageTitle(product)}</span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedFocus.length > 0 && (
            <div className="product-related-block">
              <span className="live-side-eyebrow">Altri focus</span>
              <div className="product-related-list">
                {relatedFocus.map((focus) => (
                  <Link to={focus.route?.newPath || focus.path} key={focus.path}>
                    <span>{getPageTitle(focus)}</span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

const InfoTemplate = ({ page, allPages = [] }) => {
  const blocks = page.contentBlocks || [];
  const title = liveDisplayTitle(page);
  const theme = infoThemeForPage(page);
  const description = livePageDescription(page) || theme.description;
  const relatedInfo = allPages
    .filter((item) => item.route?.type === 'info')
    .filter((item) => !samePath(item.route?.newPath || item.path, page.route?.newPath || page.path))
    .filter((item) => infoThemeForPage(item).key === theme.key)
    .slice(0, 4);
  const pdfHref = blocks.map(pdfHrefFromBlock).find(Boolean);
  const infoVisual = theme.key === 'normative'
    ? {
      src: MAIN_PAGE_VISUALS.norms,
      label: 'Norme applicate',
      caption: 'Riferimenti, rischio e posa vanno letti sul vetro reale.',
    }
    : {
      src: MAIN_PAGE_VISUALS.info,
      label: 'Supporto Solaris',
      caption: 'Documenti, garanzie e manutenzione diventano utili quando guidano una scelta concreta.',
    };

  return (
    <main className="live-modern-shell product-detail-shell info-detail-shell">
      <section className="product-detail-hero info-detail-hero">
        <div className="product-detail-hero-copy">
          <div className="live-modern-kicker">
            <FileText size={16} />
            <span>{theme.eyebrow}</span>
          </div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <div className="product-detail-tags" aria-label="Dettagli pagina info">
            {infoTagsForPage(page, theme).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="live-hero-actions">
            <Link to="/preventivo" className="btn-yellow">
              Verifica il caso
              <ArrowRight size={18} />
            </Link>
            <Link to="/info" className="live-ghost-button">
              Torna alle info
            </Link>
          </div>
        </div>

        <aside className="support-detail-aside info-detail-visual-side" aria-label="Riepilogo pagina informativa Solaris">
          <figure className="support-detail-visual">
            <img src={infoVisual.src} alt={`${title} Solaris`} loading="eager" />
            <figcaption>
              <span>{infoVisual.label}</span>
              <p>{infoVisual.caption}</p>
            </figcaption>
          </figure>

          <div className="knowledge-directory-hero-panel info-detail-panel">
            <div className="knowledge-directory-panel-top">
              <FileText size={24} />
              <span>Info Solaris</span>
            </div>
            <h2>{theme.title}</h2>
            <p>{theme.description}</p>
            <div className="knowledge-directory-mini-list">
              <Link to={theme.route}>
                <span>{theme.key === 'normative' ? 'Norme e sicurezza vetri' : theme.key === 'certificazioni' ? 'Garanzie e certificazioni' : 'Uso e supporto operativo'}</span>
                <strong>Apri percorso</strong>
              </Link>
              <Link to="/preventivo">
                <span>Verifica sul caso reale</span>
                <strong>Ora</strong>
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="product-detail-body info-detail-body">
        <article className="live-prose product-detail-prose">
          <div className="local-service-intro">
            <span>{theme.eyebrow}</span>
            <h2>Dal riferimento tecnico alla verifica sul vetro</h2>
            <p>
              Questa pagina aiuta a leggere il contesto, ma la scelta corretta dipende da vetro, rischio,
              destinazione d'uso e posa.
            </p>
          </div>
          <ContentBlocks blocks={blocks} title={title} skipFirstHeading />
          <div className="live-article-cta-band">
            <h2>Vuoi applicare questa informazione al tuo caso?</h2>
            <p>Solaris traduce norme, garanzie e indicazioni tecniche in una verifica concreta sul vetro da trattare.</p>
            <Link to="/preventivo" className="btn-yellow">
              Richiedi consulenza
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>

        <aside className="live-side-panel product-detail-side" aria-label="Supporto informativo Solaris Films">
          <div className="live-side-block">
            <span className="live-side-eyebrow">Metodo Solaris</span>
            <h2>Ogni riferimento va letto nel contesto giusto</h2>
            <p>Solaris collega il contenuto informativo a prodotto, posa, rischio e obiettivo reale del cliente.</p>
          </div>
          <ul className="live-article-checklist">
            <li><CheckCircle2 size={17} /> Verifica tecnica del vetro e del contesto</li>
            <li><CheckCircle2 size={17} /> Pellicole MADICO originali</li>
            <li><CheckCircle2 size={17} /> Posa e assistenza Solaris</li>
          </ul>
          <div className="live-side-actions">
            <Link to="/preventivo" className="live-side-link">
              <ArrowRight size={18} />
              <span>Richiedi consulenza</span>
            </Link>
            <a href="tel:+390559107621" className="live-side-link">
              <Phone size={18} />
              <span>055 9107621</span>
            </a>
            {pdfHref && (
              <SmartLink href={pdfHref} className="live-side-link">
                <FileText size={18} />
                <span>Documento</span>
              </SmartLink>
            )}
          </div>

          {relatedInfo.length > 0 && (
            <div className="product-related-block">
              <span className="live-side-eyebrow">Info correlate</span>
              <div className="product-related-list">
                {relatedInfo.map((item) => (
                  <Link to={item.route?.newPath || item.path} key={item.path}>
                    <span>{getPageTitle(item)}</span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

const supportProfiles = {
  company: {
    eyebrow: 'Company Profile',
    panelTitle: 'Azienda e metodo',
    panelDescription: 'Solaris Films valorizza esperienza, distribuzione MADICO, assistenza tecnica e posa professionale su tutto il territorio.',
    cta: 'Parla con Solaris',
    route: '/company-profile/',
    routeLabel: 'Company Profile',
    tags: ['Solaris Films', 'MADICO', 'Esperienza'],
    visual: {
      src: '/wp-data/images/hero.jpg',
      caption: 'Esperienza Solaris su edifici, vetrate e progetti reali.',
    },
  },
  faq: {
    eyebrow: 'Supporto clienti',
    panelTitle: 'Risposte operative',
    panelDescription: 'Le domande frequenti orientano la scelta, ma il caso reale va sempre verificato su vetro, esposizione e obiettivo tecnico.',
    cta: 'Chiedi conferma',
    route: '/info/',
    routeLabel: 'Tutte le info',
    tags: ['FAQ', 'Supporto', 'Verifica tecnica'],
    visual: {
      src: '/assets/services/pellicole-di-sicurezza.jpg',
      caption: 'Risposte tecniche collegate alla verifica del vetro.',
    },
  },
  guide: {
    eyebrow: 'Guida tecnica',
    panelTitle: 'Scelta consapevole',
    panelDescription: 'La guida collega famiglie di pellicole, prestazioni e criteri di applicazione con il metodo Solaris.',
    cta: 'Richiedi analisi',
    route: '/servizi/',
    routeLabel: 'Servizi',
    tags: ['Guida', 'Tecnica', 'Pellicole per vetri'],
    visual: {
      src: '/assets/services/pellicole-antisolari.jpg',
      caption: 'Guida alle prestazioni delle pellicole per vetri.',
    },
  },
  legal: {
    eyebrow: 'Informazioni legali',
    panelTitle: 'Trasparenza Solaris',
    panelDescription: 'Le informazioni legali restano accessibili e leggibili senza togliere centralita alla richiesta di supporto.',
    cta: 'Contatta Solaris',
    route: '/contatti/',
    routeLabel: 'Contatti',
    tags: ['Privacy', 'Trasparenza', 'Supporto'],
    visual: {
      src: '/assets/services/pellicole-privacy-design.jpg',
      caption: 'Informazioni e supporto nel perimetro Solaris.',
    },
  },
  page: {
    eyebrow: 'Pagina Solaris',
    panelTitle: 'Contatto e conversione',
    panelDescription: 'Le pagine operative devono portare rapidamente a una richiesta chiara e gestibile dal team Solaris.',
    cta: 'Richiedi preventivo',
    route: '/preventivo/',
    routeLabel: 'Preventivo',
    tags: ['Solaris', 'Contatto', 'Preventivo'],
    visual: {
      src: '/wp-data/images/hero.jpg',
      caption: 'Dal contatto alla soluzione tecnica corretta.',
    },
  },
  utility: {
    eyebrow: 'Pagina tecnica',
    panelTitle: 'Supporto operativo',
    panelDescription: 'Pagina di supporto mantenuta per continuita tecnica e orientamento verso i percorsi principali Solaris.',
    cta: 'Torna ai servizi',
    route: '/servizi/',
    routeLabel: 'Servizi',
    tags: ['Solaris', 'Supporto', 'Servizi'],
    visual: {
      src: '/assets/services/pellicole-antisolari.jpg',
      caption: 'Pagina tecnica mantenuta per continuita del progetto.',
    },
  },
};

const supportProfileForPage = (page = {}) => {
  const routeType = page.route?.type || 'page';
  const profile = supportProfiles[routeType] || supportProfiles.page;
  const normalizedPath = normalizePath(page.route?.newPath || page.path);

  if (normalizedPath === '/profilo-solaris/') {
    return {
      ...profile,
      panelTitle: 'Company Profile Solaris',
      panelDescription: 'Company profile, distribuzione MADICO, esperienza e metodo Solaris letti come un unico percorso di fiducia tecnica.',
      route: '/company-profile/',
      routeLabel: 'Vai al Company Profile',
      tags: ['Company Profile', 'MADICO', 'Metodo Solaris'],
      visual: {
        src: '/wp-data/images/hero.jpg',
        caption: 'Esperienza Solaris su edifici, vetrate e progetti reali.',
      },
    };
  }

  if (normalizedPath === '/faq/') {
    return supportProfiles.faq;
  }

  if (normalizedPath === '/grazie/') {
    return {
      ...supportProfiles.page,
      eyebrow: 'Richiesta ricevuta',
      panelTitle: 'Grazie da Solaris',
      panelDescription: 'La richiesta e arrivata al team Solaris: il passaggio successivo e la verifica tecnica del caso reale.',
      cta: 'Vai ai servizi',
      primaryRoute: '/servizi/',
      route: '/',
      routeLabel: 'Torna alla home',
      tags: ['Conferma', 'Solaris Films', 'Contatto'],
      visual: {
        src: '/wp-data/images/hero.jpg',
        caption: 'Il team Solaris prende in carico richieste e verifiche tecniche.',
      },
    };
  }

  return profile;
};

const SupportTemplate = ({ page }) => {
  const blocks = page.contentBlocks || [];
  const title = liveDisplayTitle(page);
  const description = livePageDescription(page) || firstParagraph(blocks);
  const profile = supportProfileForPage(page);
  const visual = profile.visual;
  const normalizedPath = normalizePath(page.route?.newPath || page.path);

  if (normalizedPath === '/grazie/') {
    return (
      <main className="live-modern-shell product-detail-shell support-detail-shell">
        <section className="product-detail-hero info-detail-hero">
          <div className="product-detail-hero-copy">
            <div className="live-modern-kicker">
              <FileText size={16} />
              <span>Richiesta ricevuta</span>
            </div>
            <h1>Grazie da Solaris</h1>
            <p>
              Abbiamo ricevuto la tua richiesta. Il team Solaris verifica i dati inviati
              e ti ricontatta per inquadrare esigenza, vetro e soluzione corretta.
            </p>
            <div className="product-detail-tags" aria-label="Dettagli richiesta">
              <span>Conferma</span>
              <span>Verifica tecnica</span>
              <span>Solaris Films</span>
            </div>
            <div className="live-hero-actions">
              <Link to="/servizi/" className="btn-yellow">
                Vai ai servizi
                <ArrowRight size={18} />
              </Link>
              <Link to="/" className="live-ghost-button">
                Torna alla home
              </Link>
            </div>
          </div>

          <aside className="support-detail-aside" aria-label="Riepilogo richiesta Solaris">
            {visual && (
              <figure className="support-detail-visual">
                <img src={visual.src} alt="Solaris Films" loading="eager" />
                <figcaption>
                  <span>Solaris Films</span>
                  <p>{visual.caption}</p>
                </figcaption>
              </figure>
            )}

            <div className="knowledge-directory-hero-panel info-detail-panel">
              <div className="knowledge-directory-panel-top">
                <ShieldCheck size={24} />
                <span>Prossimo passaggio</span>
              </div>
              <h2>Verifica del caso reale</h2>
              <p>
                La richiesta viene letta dal team Solaris e trasformata in un confronto
                tecnico su obiettivo, superfici, contesto di posa e prodotto piu adatto.
              </p>
              <div className="knowledge-directory-mini-list">
                <Link to="/preventivo/">
                  <span>Nuova richiesta</span>
                  <strong>Apri</strong>
                </Link>
                <Link to="/contatti/">
                  <span>Contatti diretti</span>
                  <strong>Vai</strong>
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="product-detail-body info-detail-body">
          <article className="live-prose product-detail-prose">
            <div className="local-service-intro">
              <span>Richiesta ricevuta</span>
              <h2>Cosa succede adesso</h2>
              <p>
                Solaris prende in carico la richiesta e verifica se servono foto,
                misure o dettagli aggiuntivi prima di proporre la soluzione.
              </p>
            </div>

            <ul className="live-article-checklist thank-you-checklist">
              <li><CheckCircle2 size={17} /> Lettura della richiesta da parte del team Solaris</li>
              <li><CheckCircle2 size={17} /> Verifica di esigenza, vetro, esposizione e contesto</li>
              <li><CheckCircle2 size={17} /> Ricontatto per chiarire dati tecnici o fissare il passo successivo</li>
            </ul>

            <div className="live-article-cta-band">
              <h2>Vuoi aggiungere informazioni?</h2>
              <p>
                Puoi inviare foto, misure o dettagli sulla vetrata dalla pagina contatti
                o aprire una nuova richiesta di preventivo.
              </p>
              <Link to="/contatti/" className="btn-yellow">
                Vai ai contatti
                <ArrowRight size={18} />
              </Link>
            </div>
          </article>

          <aside className="live-side-panel product-detail-side" aria-label="Contatti Solaris Films">
            <div className="live-side-block">
              <span className="live-side-eyebrow">Solaris Films</span>
              <h2>Canali diretti</h2>
              <p>
                Per urgenze o integrazioni puoi contattare Solaris direttamente
                via telefono o email.
              </p>
            </div>
            <div className="live-side-actions">
              <a href="tel:+390559107621" className="live-side-link">
                <Phone size={18} />
                <span>055 9107621</span>
              </a>
              <a href="mailto:info@solarisfilms.it" className="live-side-link">
                <Mail size={18} />
                <span>info@solarisfilms.it</span>
              </a>
              <Link to="/servizi/" className="live-side-link">
                <ArrowRight size={18} />
                <span>Rivedi i servizi</span>
              </Link>
            </div>
          </aside>
        </section>
      </main>
    );
  }

  return (
    <main className="live-modern-shell product-detail-shell support-detail-shell">
      <section className="product-detail-hero info-detail-hero">
        <div className="product-detail-hero-copy">
          <div className="live-modern-kicker">
            <FileText size={16} />
            <span>{profile.eyebrow}</span>
          </div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <div className="product-detail-tags" aria-label="Dettagli pagina Solaris">
            {profile.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="live-hero-actions">
            <Link to={profile.primaryRoute || '/preventivo'} className="btn-yellow">
              {profile.cta}
              <ArrowRight size={18} />
            </Link>
            <Link to={profile.route} className="live-ghost-button">
              {profile.routeLabel}
            </Link>
          </div>
        </div>

        <aside className="support-detail-aside" aria-label="Riepilogo pagina Solaris">
          {visual && (
            <figure className="support-detail-visual">
              <img src={visual.src} alt={title} loading="eager" />
              <figcaption>
                <span>Solaris Films</span>
                <p>{visual.caption}</p>
              </figcaption>
            </figure>
          )}

          <div className="knowledge-directory-hero-panel info-detail-panel">
            <div className="knowledge-directory-panel-top">
              <ShieldCheck size={24} />
              <span>Solaris Films</span>
            </div>
            <h2>{profile.panelTitle}</h2>
            <p>{profile.panelDescription}</p>
            <div className="knowledge-directory-mini-list">
              <Link to="/servizi/">
                <span>Famiglie servizio</span>
                <strong>Apri</strong>
              </Link>
              <Link to="/preventivo/">
                <span>Verifica sul caso reale</span>
                <strong>Ora</strong>
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="product-detail-body info-detail-body">
        <article className="live-prose product-detail-prose">
          <div className="local-service-intro">
            <span>{profile.eyebrow}</span>
            <h2>Approfondimento Solaris</h2>
            <p>
              Una sintesi pensata per orientare la scelta tecnica e rendere piu semplice
              il passaggio verso una verifica Solaris sul caso reale.
            </p>
          </div>
          <ContentBlocks blocks={blocks} title={title} skipFirstHeading />
          <div className="live-article-cta-band">
            <h2>Serve una risposta applicata al tuo caso?</h2>
            <p>Solaris traduce le informazioni della pagina in una scelta concreta su pellicola, posa e responsabilita tecnica.</p>
            <Link to="/preventivo" className="btn-yellow">
              Richiedi consulenza
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>

        <aside className="live-side-panel product-detail-side" aria-label="Supporto Solaris Films">
          <div className="live-side-block">
            <span className="live-side-eyebrow">Metodo Solaris</span>
            <h2>Dal contenuto alla soluzione corretta</h2>
            <p>Ogni pagina deve portare a un passaggio operativo: capire il problema, verificare il vetro e scegliere la pellicola MADICO corretta.</p>
          </div>
          <ul className="live-article-checklist">
            <li><CheckCircle2 size={17} /> Informazioni essenziali in evidenza</li>
            <li><CheckCircle2 size={17} /> Collegamento ai servizi Solaris</li>
            <li><CheckCircle2 size={17} /> Contatto diretto per la verifica tecnica</li>
          </ul>
          <div className="live-side-actions">
            <Link to="/preventivo" className="live-side-link">
              <ArrowRight size={18} />
              <span>Richiedi consulenza</span>
            </Link>
            <a href="tel:+390559107621" className="live-side-link">
              <Phone size={18} />
              <span>055 9107621</span>
            </a>
            <a href="mailto:info@solarisfilms.it" className="live-side-link">
              <Mail size={18} />
              <span>info@solarisfilms.it</span>
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
};

const LocalServiceTemplate = ({ page }) => {
  const city = getLocalCityName(page);
  const title = city ? `Pellicole per vetri ${city}` : liveDisplayTitle(page);
  const blocks = localizeBlocksForCity(page.contentBlocks || [], city);
  const description = livePageDescription(page);
  const image = pageImage(page) || MAIN_PAGE_VISUALS.local;
  const cityLabel = city || 'la tua zona';
  const localLogo = getLocalServiceLogo(page);

  return (
    <main className="live-modern-shell local-service-shell">
      <section className="local-service-hero">
        <div className="local-service-copy">
          <div className="live-modern-kicker">
            <ShieldCheck size={16} />
            <span>Servizio locale Solaris</span>
          </div>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="local-service-tags" aria-label="Servizi disponibili">
            <span>Controllo solare</span>
            <span>Sicurezza vetri</span>
            <span>Privacy e design</span>
          </div>
          <div className="live-hero-actions">
            <Link to="/preventivo" className="btn-yellow">
              Richiedi sopralluogo
              <ArrowRight size={18} />
            </Link>
            <a href="tel:+390559107621" className="live-ghost-button">
              Chiama Solaris
            </a>
          </div>
        </div>

        <figure className={`local-service-visual ${localLogo ? 'local-service-visual-logo' : ''}`}>
          <img src={localLogo ? localLogo.src : image} alt={localLogo ? localLogo.alt : title} loading="eager" />
        </figure>
      </section>

      <section className="local-service-strip" aria-label="Metodo locale Solaris">
        <div>
          <strong>1</strong>
          <span>analisi di esposizione, vetri e obiettivo tecnico</span>
        </div>
        <div>
          <strong>3</strong>
          <span>famiglie prodotto: solare, sicurezza, privacy/design</span>
        </div>
        <div>
          <strong>30+</strong>
          <span>anni di esperienza Solaris su installazioni professionali</span>
        </div>
      </section>

      <section className="local-service-body">
        <article className="live-prose local-service-prose">
          <div className="local-service-intro">
            <span>Pagina locale</span>
            <h2>Soluzioni Solaris per vetri a {cityLabel}</h2>
            <p>La pagina locale porta l'utente verso una richiesta concreta: verifica tecnica, scelta della pellicola MADICO e posa professionale.</p>
          </div>
          <ContentBlocks blocks={blocks} title={page.h1 || title} skipFirstHeading />
          <div className="live-article-cta-band">
            <h2>Hai vetri da migliorare a {cityLabel}?</h2>
            <p>Solaris valuta calore, sicurezza, privacy e condizioni di posa prima di proporre la pellicola corretta.</p>
            <Link to="/preventivo" className="btn-yellow">
              Richiedi preventivo
              <ArrowRight size={18} />
            </Link>
          </div>
        </article>

        <aside className="live-side-panel local-service-side" aria-label="Contatti servizio locale Solaris Films">
          <div className="live-side-block">
            <span className="live-side-eyebrow">Consulenza locale</span>
            <h2>Da {cityLabel} alla soluzione corretta</h2>
            <p>Partiamo dal problema sul vetro: calore, abbagliamento, sicurezza, privacy o immagine coordinata.</p>
          </div>
          <ul className="live-article-checklist">
            <li><CheckCircle2 size={17} /> Sopralluogo o verifica fotografica</li>
            <li><CheckCircle2 size={17} /> Pellicole MADICO originali</li>
            <li><CheckCircle2 size={17} /> Posa tecnica e assistenza Solaris</li>
          </ul>
          <div className="live-side-actions">
            <Link to="/preventivo" className="live-side-link">
              <ArrowRight size={18} />
              <span>Richiedi analisi</span>
            </Link>
            <a href="tel:+390559107621" className="live-side-link">
              <Phone size={18} />
              <span>055 9107621</span>
            </a>
            <a href="mailto:info@solarisfilms.it" className="live-side-link">
              <Mail size={18} />
              <span>info@solarisfilms.it</span>
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
};

const LiveContent = ({ page, allPages = [] }) => {
  const blocks = page.contentBlocks || [];
  const title = liveDisplayTitle(page);
  const description = livePageDescription(page) || firstParagraph(blocks);
  const route = page.route || {};
  const label = route.label || 'Solaris Films';
  const pdfHref = blocks.map(pdfHrefFromBlock).find(Boolean);

  if (route.type === 'article') {
    return <ArticleTemplate page={page} />;
  }

  if (route.type === 'category' && getServiceFamilyForPage(page)) {
    return <ServiceFamilyTemplate page={page} allPages={allPages} />;
  }

  if (route.type === 'product') {
    return <ProductTemplate page={page} allPages={allPages} />;
  }

  if (route.type === 'local-service') {
    return <LocalServiceTemplate page={page} />;
  }

  if (route.type === 'technical-focus') {
    return <FocusTemplate page={page} allPages={allPages} />;
  }

  if (route.type === 'info') {
    return <InfoTemplate page={page} allPages={allPages} />;
  }

  if (['company', 'faq', 'guide', 'legal', 'page', 'utility'].includes(route.type)) {
    return <SupportTemplate page={page} />;
  }

  return (
    <main className="live-modern-shell">
      <section className="live-modern-hero">
        <div className="live-modern-hero-copy">
          <div className="live-modern-kicker">
            <ShieldCheck size={16} />
            <span>{label}</span>
          </div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          <div className="live-hero-actions">
            <Link to="/preventivo" className="btn-yellow">
              Richiedi preventivo
              <ArrowRight size={18} />
            </Link>
            <Link to="/contatti" className="live-ghost-button">
              Contatti
            </Link>
          </div>
        </div>
      </section>

      <section className="live-modern-body">
        <article className="live-prose">
          <ContentBlocks blocks={blocks} title={title} />
        </article>

        <aside className="live-side-panel" aria-label="Contatti Solaris Films">
          <div className="live-side-block">
            <span className="live-side-eyebrow">Assistenza tecnica</span>
            <h2>Serve una verifica sui vetri?</h2>
            <p>Solaris Films valuta esposizione, tipologia del vetro e obiettivo tecnico prima di proporre la pellicola.</p>
          </div>
          <div className="live-side-actions">
            <a href="tel:+390559107621" className="live-side-link">
              <Phone size={18} />
              <span>055 9107621</span>
            </a>
            <a href="mailto:info@solarisfilms.it" className="live-side-link">
              <Mail size={18} />
              <span>info@solarisfilms.it</span>
            </a>
            {pdfHref && (
              <SmartLink href={pdfHref} className="live-side-link">
                <FileText size={18} />
                <span>Scheda tecnica</span>
              </SmartLink>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
};

const LiveMirrorPage = ({ initialIndex = null, initialPage = null, initialPath = '' }) => {
  const location = useLocation();
  const [index, setIndex] = useState(initialIndex);
  const [page, setPage] = useState(initialPage);
  const [error, setError] = useState(null);
  const hasInitialData = Boolean(initialIndex && initialPage);

  useEffect(() => {
    if (hasInitialData) return undefined;

    let mounted = true;

    fetch('/wp-data/live-pages-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (!mounted) return;
        const pages = (data?.pages || []).filter((item) => !isExcludedSolarisPage(item));
        setIndex({ ...data, pages });
      })
      .catch((err) => {
        if (mounted) setError(err);
      });

    return () => {
      mounted = false;
    };
  }, [hasInitialData]);

  const currentPath = normalizePath(initialPath || location.pathname);
  const headlessSEO = useHeadlessSEO(currentPath, page);
  const resolvedPage = useMemo(() => mergeHeadlessSEO(page, headlessSEO), [page, headlessSEO]);
  const pageIndexEntry = useMemo(() => {
    const pages = index?.pages || [];
    const directEntry = pages.find((item) => normalizePath(item.path) === currentPath)
      || pages.find((item) => normalizePath(item.route?.newPath) === currentPath);
    if (directEntry) return directEntry;

    const aliasPath = livePathAliases[currentPath];
    if (!aliasPath) return null;

    return pages.find((item) => normalizePath(item.path) === aliasPath)
      || pages.find((item) => normalizePath(item.route?.newPath) === aliasPath)
      || null;
  }, [index, currentPath]);

  useEffect(() => {
    if (hasInitialData) return undefined;

    if (!pageIndexEntry?.file) {
      setPage(null);
      return;
    }

    let mounted = true;
    setPage(null);

    fetch(`/wp-data/live-pages/${pageIndexEntry.file}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (mounted) setPage(data);
      })
      .catch((err) => {
        if (mounted) setError(err);
      });

    return () => {
      mounted = false;
    };
  }, [hasInitialData, pageIndexEntry]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-32 max-w-4xl mx-auto px-6 text-white">
          <h1 className="text-4xl font-medium mb-4">Contenuti non disponibili</h1>
          <p className="text-[#94A3B8]">I contenuti non sono disponibili in questo momento. Riprova tra poco o torna alla home.</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!index) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-32 max-w-4xl mx-auto px-6 text-white">
          <p className="text-[#94A3B8]">Caricamento contenuti...</p>
        </main>
      </div>
    );
  }

  if (!pageIndexEntry) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-32 max-w-4xl mx-auto px-6 text-white">
          <h1 className="text-4xl font-medium mb-4">Pagina non trovata</h1>
          <p className="text-[#94A3B8] mb-8">Questo URL non e presente nella mappa del sito Solaris.</p>
          <Link to="/" className="btn-yellow">Torna alla home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-32 max-w-4xl mx-auto px-6 text-white">
          <p className="text-[#94A3B8]">Caricamento pagina...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] live-mirror-page" data-testid="live-mirror-page">
      <LivePageSEO page={resolvedPage} currentPath={currentPath} />
      <Header />
      <LiveContent page={resolvedPage} allPages={index?.pages || []} />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default LiveMirrorPage;
