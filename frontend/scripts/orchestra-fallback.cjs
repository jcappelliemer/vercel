const crypto = require('crypto');
const { parseDocument, DomUtils } = require('htmlparser2');

const FALLBACK_SOURCE = 'orchestra-headless-fixes';

function normalizeMirrorPath(value = '/') {
  let pathname = String(value || '/');
  try {
    if (/^https?:\/\//i.test(pathname)) pathname = new URL(pathname).pathname;
  } catch {
    pathname = '/';
  }
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  pathname = pathname.replace(/\/{2,}/g, '/');
  return pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
}

function stripOrchestraManagedBlocks(html = '') {
  return String(html || '').replace(
    /<!--\s*aeo-orchestra:[a-z0-9_-]+\s*-->[\s\S]*?<!--\s*\/aeo-orchestra:[a-z0-9_-]+\s*-->/gi,
    ''
  );
}

function cleanText(value = '') {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function nodeText(node) {
  return cleanText(DomUtils.textContent(node));
}

function nodeHtml(node) {
  return String(DomUtils.getInnerHTML(node) || '').trim();
}

function appendNodes(nodes, blocks) {
  for (const node of nodes || []) {
    if (!node) continue;
    if (node.type === 'text') {
      const text = cleanText(node.data);
      if (text) blocks.push({ type: 'paragraph', html: text, text });
      continue;
    }
    if (node.type !== 'tag') continue;

    const tag = String(node.name || '').toLowerCase();
    if (['script', 'style', 'noscript', 'iframe', 'form'].includes(tag)) continue;

    if (/^h[1-4]$/.test(tag)) {
      const text = nodeText(node);
      if (text) blocks.push({ type: 'heading', level: Number(tag.slice(1)), html: nodeHtml(node), text });
      continue;
    }

    if (tag === 'p') {
      const text = nodeText(node);
      if (text) blocks.push({ type: 'paragraph', html: nodeHtml(node), text });
      continue;
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = (node.children || [])
        .filter((child) => child?.type === 'tag' && String(child.name).toLowerCase() === 'li')
        .map((child) => ({ html: nodeHtml(child), text: nodeText(child) }))
        .filter((item) => item.text);
      if (items.length) blocks.push({ type: 'list', ordered: tag === 'ol', items, text: items.map((item) => item.text).join(' ') });
      continue;
    }

    if (tag === 'blockquote' || tag === 'details') {
      const text = nodeText(node);
      if (text) blocks.push({ type: 'note', html: nodeHtml(node), text });
      continue;
    }

    if (tag === 'a' && node.attribs?.href) {
      const text = nodeText(node);
      if (text) blocks.push({ type: 'cta', href: String(node.attribs.href), text });
      continue;
    }

    appendNodes(node.children, blocks);
  }
}

function contentToBlocks(html = '') {
  const cleanHtml = stripOrchestraManagedBlocks(html);
  const document = parseDocument(cleanHtml);
  const blocks = [];
  appendNodes(document.children, blocks);
  return { cleanHtml, blocks };
}

function titleFromPath(pathname = '/') {
  const segment = normalizeMirrorPath(pathname).split('/').filter(Boolean).pop() || 'Solaris Films';
  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function withoutBrandSuffix(value = '') {
  return String(value || '').replace(/\s+[—–-]\s+Solaris Films.*$/i, '').trim();
}

function buildOrchestraFallbackPage(detail = {}, pathname = '/', publicOrigin = '', options = {}) {
  const path = normalizeMirrorPath(pathname);
  const origin = String(publicOrigin || '').replace(/\/+$/, '');
  const canonical = `${origin}${path}`;
  const meta = detail.meta && typeof detail.meta === 'object' ? detail.meta : {};
  const aeo = detail.aeo && typeof detail.aeo === 'object' ? detail.aeo : {};
  const parsed = contentToBlocks(detail.content || '');
  const firstHeading = parsed.blocks.find((block) => block.type === 'heading' && block.level === 1)?.text || '';
  const firstParagraph = parsed.blocks.find((block) => block.type === 'paragraph')?.text || '';
  const title = String(meta.title || '').trim() || titleFromPath(path);
  const h1 = firstHeading || withoutBrandSuffix(title) || titleFromPath(path);
  const description = String(meta.description || '').trim() || firstParagraph.slice(0, 180);
  const text = parsed.blocks.map((block) => block.text || '').filter(Boolean).join(' ');
  const schemas = aeo.schema_jsonld ? [JSON.stringify(aeo.schema_jsonld)] : [];
  const robots = options.indexable === false
    ? 'noindex, nofollow, max-image-preview:large'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return {
    url: canonical,
    path,
    route: {
      type: 'page',
      label: 'Pagina',
      newPath: path,
      confidence: 'high',
      needsReview: false,
    },
    h1,
    text,
    textLength: text.length,
    contentHtml: parsed.cleanHtml,
    contentBlocks: parsed.blocks,
    headings: parsed.blocks
      .filter((block) => block.type === 'heading')
      .map((block) => ({ level: block.level, text: block.text })),
    primaryImage: null,
    seo: {
      title,
      description,
      robots,
      canonical,
      og: {
        'og:title': title,
        'og:description': description,
        'og:url': canonical,
        'og:type': 'website',
        'og:site_name': 'Solaris Films',
        'og:locale': 'it_IT',
      },
      twitter: {
        'twitter:card': 'summary',
        'twitter:title': title,
        'twitter:description': description,
      },
      schemas,
    },
    sourceSitemap: FALLBACK_SOURCE,
    fetchedAt: new Date().toISOString(),
  };
}

function fallbackFileName(postId, pathname) {
  const digest = crypto.createHash('sha1').update(normalizeMirrorPath(pathname)).digest('hex').slice(0, 10);
  return `orchestra-${Number(postId) || 0}-${digest}.json`;
}

module.exports = {
  FALLBACK_SOURCE,
  buildOrchestraFallbackPage,
  contentToBlocks,
  fallbackFileName,
  normalizeMirrorPath,
  stripOrchestraManagedBlocks,
};
