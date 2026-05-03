import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ExternalLink, FileText, Mail, Phone, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { useHeadlessSEO, mergeHeadlessSEO } from '../hooks/useHeadlessSEO';

const SITE_NAME = 'Solaris Films';
const BASE_URL = 'https://www.solarisfilms.it';
const LIVE_HOSTS = new Set(['solarisfilms.it', 'www.solarisfilms.it']);

const normalizePath = (pathname) => {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
};

const titleCaseIfUpper = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed || trimmed !== trimmed.toUpperCase()) return trimmed;
  return trimmed
    .toLocaleLowerCase('it')
    .replace(/(^|\s|-)([a-z])/g, (match) => match.toLocaleUpperCase('it'));
};

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

const livePageTitle = (page, { includeSite = false } = {}) => {
  const routeType = page?.route?.type;

  if (routeType === 'local-service') {
    const city = getLocalCityName(page);
    const base = city ? `Pellicole per vetri ${city}` : 'Pellicole per vetri';
    return includeSite ? `${base} | ${SITE_NAME}` : base;
  }

  const rawTitle = titleCaseIfUpper(
    cleanTitle(page?.seo?.title || page?.title || page?.h1 || '')
  );
  const base = rawTitle || page?.route?.label || SITE_NAME;
  return includeSite && !base.includes(SITE_NAME) ? `${base} | ${SITE_NAME}` : base;
};

const cleanText = (value = '') => String(value)
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const trimMeta = (value = '', max = 155) => {
  const cleaned = cleanText(value);
  if (cleaned.length <= max) return cleaned;
  const cut = cleaned.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length).trim()}...`;
};

const livePageDescription = (page) => {
  const seoDescription = cleanText(page?.seo?.description || '');
  const genericDescription = /^Solaris Films\s+-\s+Distributore esclusivo/i.test(seoDescription);
  if (seoDescription && !genericDescription) return trimMeta(seoDescription);

  if (page?.route?.type === 'local-service') {
    const city = getLocalCityName(page);
    return trimMeta(`Solaris Films installa pellicole per vetri MADICO a ${city || 'livello locale'}: controllo solare, sicurezza, privacy e sopralluogo tecnico.`);
  }

  return trimMeta(firstParagraph(page?.contentBlocks || []) || seoDescription || 'Solaris Films installa pellicole per vetri MADICO per controllo solare, sicurezza, privacy e protezione professionale degli edifici.');
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
  if (type === 'article') return 'Blog';
  if (type === 'product') return 'Prodotti';
  if (type === 'local-service') return 'Servizio locale';
  if (type === 'info') return 'Info';
  if (type === 'technical-focus') return 'Focus tecnico';
  return page?.route?.label || 'Solaris Films';
};

const routeSectionPath = (page) => {
  const type = page?.route?.type;
  if (type === 'article') return '/blog/';
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

const SmartLink = ({ href = '/', className = '', children, ...props }) => {
  if (href.startsWith('/')) {
    return <Link to={href} className={className} {...props}>{children}</Link>;
  }

  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

const ContentBlocks = ({ blocks, title }) => {
  const renderedBlocks = [];
  const titleText = title.toLowerCase();

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (block.type === 'heading' && block.level === 1 && block.text.toLowerCase() === titleText) {
      continue;
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
      const Heading = `h${Math.min(Math.max(block.level, 2), 4)}`;
      renderedBlocks.push(
        <Heading
          className={`live-prose-heading live-prose-heading-${Math.min(block.level, 4)}`}
          key={`${block.type}-${index}`}
          dangerouslySetInnerHTML={{ __html: block.html || block.text }}
        />
      );
      continue;
    }

    if (block.type === 'paragraph') {
      renderedBlocks.push(
        <p
          className="live-prose-paragraph"
          key={`${block.type}-${index}`}
          dangerouslySetInnerHTML={{ __html: block.html || block.text }}
        />
      );
      continue;
    }

    if (block.type === 'list') {
      const ListTag = block.ordered ? 'ol' : 'ul';
      renderedBlocks.push(
        <ListTag className="live-prose-list" key={`${block.type}-${index}`}>
          {(block.items || []).map((item, itemIndex) => (
            <li key={`${item.text}-${itemIndex}`} dangerouslySetInnerHTML={{ __html: item.html || item.text }} />
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
          dangerouslySetInnerHTML={{ __html: block.html || block.text }}
        />
      );
      continue;
    }

    if (block.type === 'cta' && block.href) {
      renderedBlocks.push(
        <SmartLink href={block.href} className="live-inline-cta" key={`${block.type}-${index}`}>
          <span>{block.text}</span>
          {block.href.startsWith('/') ? <ArrowRight size={18} /> : <ExternalLink size={18} />}
        </SmartLink>
      );
      continue;
    }

    if (block.type === 'image') continue;
  }

  return renderedBlocks;
};

const LiveContent = ({ page }) => {
  const blocks = page.contentBlocks || [];
  const title = page.route?.type === 'local-service'
    ? livePageTitle(page)
    : page.h1 || cleanTitle(page.seo?.title) || 'Solaris Films';
  const description = livePageDescription(page) || firstParagraph(blocks);
  const route = page.route || {};
  const label = route.label || 'Solaris Films';
  const pdfHref = blocks.map(pdfHrefFromBlock).find(Boolean);

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

const LiveMirrorPage = () => {
  const location = useLocation();
  const [index, setIndex] = useState(null);
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch('/wp-data/live-pages-index.json')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        if (mounted) setIndex(data);
      })
      .catch((err) => {
        if (mounted) setError(err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const currentPath = normalizePath(location.pathname);
  const headlessSEO = useHeadlessSEO(currentPath, page);
  const resolvedPage = useMemo(() => mergeHeadlessSEO(page, headlessSEO), [page, headlessSEO]);
  const pageIndexEntry = useMemo(() => {
    const pages = index?.pages || [];
    return pages.find((item) => normalizePath(item.path) === currentPath)
      || pages.find((item) => normalizePath(item.route?.newPath) === currentPath);
  }, [index, currentPath]);

  useEffect(() => {
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
  }, [pageIndexEntry]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-32 max-w-4xl mx-auto px-6 text-white">
          <h1 className="text-4xl font-medium mb-4">Contenuti non disponibili</h1>
          <p className="text-[#94A3B8]">Il mirror del sito live non e stato generato. Esegui il build con lo script di fetch attivo.</p>
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
          <p className="text-[#94A3B8] mb-8">Questo URL non e presente nella sitemap live importata.</p>
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
      <LiveContent page={resolvedPage} />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default LiveMirrorPage;
