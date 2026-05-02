/**
 * Build-time SEO mirror for the current Solaris Films live site.
 *
 * The React app can improve the visual layer, but for a safe migration we need
 * a source-of-truth snapshot of the live URLs, metadata, and page copy.
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const crypto = require('crypto');
const { parseDocument, DomUtils } = require('htmlparser2');

const LIVE_ORIGIN = process.env.REACT_APP_LIVE_ORIGIN || 'https://www.solarisfilms.it';
const SITEMAP_INDEX = `${LIVE_ORIGIN}/sitemap_index.xml`;
const OUTPUT_DIR = path.join(__dirname, 'public', 'wp-data');
const PAGES_DIR = path.join(OUTPUT_DIR, 'live-pages');
const INDEX_FILE = path.join(OUTPUT_DIR, 'live-pages-index.json');
const INVENTORY_FILE = path.join(OUTPUT_DIR, 'live-seo-inventory.json');
const URL_MAP_FILE = path.join(OUTPUT_DIR, 'url-map.json');
const URL_MAP_CSV_FILE = path.join(OUTPUT_DIR, 'url-map.csv');
const SITEMAP_FILE = path.join(__dirname, 'public', 'sitemap.xml');
const RETIRED_PRODUCT_TERMS = ['l' + 'cd', 'stra' + 'tum'];
const RETIRED_PRODUCT_SLUGS = ['pellicole-' + 'l' + 'cd-switch'];

function hasRetiredProductReference(value = '') {
  const lower = String(value).toLowerCase();
  return RETIRED_PRODUCT_TERMS.some((term) => lower.includes(term))
    || RETIRED_PRODUCT_SLUGS.some((slug) => lower.includes(slug));
}

function fetchText(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'SolarisFilmsMirror/1.0' } }, (res) => {
      const status = res.statusCode || 0;
      if ([301, 302, 303, 307, 308].includes(status) && res.headers.location) {
        if (redirectCount > 5) {
          reject(new Error(`Too many redirects for ${url}`));
          return;
        }
        const nextUrl = new URL(res.headers.location, url).toString();
        resolve(fetchText(nextUrl, redirectCount + 1));
        return;
      }

      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (status >= 400) {
          reject(new Error(`HTTP ${status} for ${url}`));
          return;
        }
        resolve(body);
      });
    });
    req.setTimeout(20000, () => {
      req.destroy(new Error(`Timeout fetching ${url}`));
    });
    req.on('error', reject);
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function decodeEntities(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([a-fA-F0-9]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function normalizeText(value = '') {
  return decodeEntities(value)
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(html = '') {
  return normalizeText(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  );
}

function getAttr(tag, attr) {
  const re = new RegExp(`${attr}\\s*=\\s*["']([^"']*)["']`, 'i');
  return decodeEntities((tag.match(re) || [])[1] || '');
}

function firstMatch(text, re) {
  const match = text.match(re);
  return match ? decodeEntities(match[1].trim()) : '';
}

function extractTags(html, tagName) {
  const re = new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'gi');
  return html.match(re) || [];
}

function extractMeta(html) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  const meta = {};

  for (const tag of metaTags) {
    const key = getAttr(tag, 'name') || getAttr(tag, 'property');
    const content = getAttr(tag, 'content');
    if (key && content && !key.toLowerCase().startsWith('generator')) {
      meta[key] = content;
    }
  }

  const canonicalTag = linkTags.find((tag) => getAttr(tag, 'rel').toLowerCase() === 'canonical');
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const schemas = extractTags(html, 'script')
    .filter((tag) => /type=["']application\/ld\+json["']/i.test(tag))
    .map((tag) => firstMatch(tag, /<script\b[^>]*>([\s\S]*?)<\/script>/i))
    .filter(Boolean);

  return {
    title,
    description: meta.description || meta['og:description'] || '',
    robots: meta.robots || '',
    canonical: canonicalTag ? getAttr(canonicalTag, 'href') : '',
    og: Object.fromEntries(Object.entries(meta).filter(([key]) => key.startsWith('og:'))),
    twitter: Object.fromEntries(Object.entries(meta).filter(([key]) => key.startsWith('twitter:'))),
    article: Object.fromEntries(Object.entries(meta).filter(([key]) => key.startsWith('article:'))),
    schemas,
  };
}

function normalizeInternalLinks(html) {
  return html
    .replace(/href=["']https:\/\/www\.solarisfilms\.it([^"']*)["']/gi, 'href="$1"')
    .replace(/href=["']https:\/\/solarisfilms\.it([^"']*)["']/gi, 'href="$1"')
    .replace(/href=["']http:\/\/solarisfilms\.it([^"']*)["']/gi, 'href="$1"')
    .replace(/href=["']http:\/\/www\.solarisfilms\.it([^"']*)["']/gi, 'href="$1"')
    .replace(/href=["']\/["']/gi, 'href="/"')
    .replace(/\sdata-lazy-src=["']([^"']+)["']/gi, ' src="$1"')
    .replace(/\sdata-lazy-srcset=["']([^"']+)["']/gi, ' srcSet="$1"');
}

function cleanContentHtml(html) {
  return normalizeInternalLinks(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<a\b[^>]*class=["'][^"']*skip-link[^"']*["'][\s\S]*?<\/a>/gi, '')
    .replace(/<div\b[^>]*id=["']seo-aeo-score-widget["'][\s\S]*?<\/div>\s*<\/div>/gi, '')
    .replace(/\son[a-z]+=["'][^"']*["']/gi, '')
    .replace(/\sclass=["'][^"']*(elementor-motion-effects|e-lazyloaded)[^"']*["']/gi, '')
    .trim();
}

function extractMainHtml(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (main) return cleanContentHtml(main[1]);

  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  if (!body) return '';

  return cleanContentHtml(
    body[1]
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
  );
}

function normalizePath(url) {
  const parsed = new URL(url);
  let pathname = parsed.pathname || '/';
  if (!pathname.endsWith('/')) pathname += '/';
  return pathname;
}

function normalizeAppPath(pathname) {
  if (!pathname || pathname === '/') return '/';
  const clean = pathname.split('?')[0].split('#')[0];
  return clean.endsWith('/') ? clean : `${clean}/`;
}

function slugFromPath(pathname) {
  const parts = normalizeAppPath(pathname).split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

function pageFileName(pathname) {
  const normalized = pathname === '/' ? 'home' : pathname.replace(/^\/|\/$/g, '');
  const slug = normalized
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120) || 'page';
  const hash = crypto.createHash('sha1').update(pathname).digest('hex').slice(0, 10);
  return `${slug}-${hash}.json`;
}

function extractHeadings(contentHtml) {
  const headings = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match;
  while ((match = re.exec(contentHtml))) {
    const text = stripTags(match[2]);
    if (!hasRetiredProductReference(text)) {
      headings.push({ level: Number(match[1]), text });
    }
  }
  return headings;
}

function extractSitemapUrls(xml) {
  return unique([...xml.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/gi)].map((match) => decodeEntities(match[1])));
}

function removeRetiredProductSentences(value = '') {
  const text = String(value || '');
  if (!hasRetiredProductReference(text)) return text;

  return text
    .replace(/[^.!?<>]*(?:l\s*c\s*d|stra\s*tum)[^.!?<>]*[.!?]/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function cleanRetiredProductBlocks(blocks = []) {
  return blocks
    .map((block) => {
      if (block.type === 'list') {
        const items = (block.items || [])
          .map((item) => ({
            ...item,
            html: removeRetiredProductSentences(item.html),
            text: removeRetiredProductSentences(item.text),
          }))
          .filter((item) => item.text && !hasRetiredProductReference(item.text));

        return {
          ...block,
          items,
          text: items.map((item) => item.text).join(' '),
        };
      }

      return {
        ...block,
        html: removeRetiredProductSentences(block.html),
        text: removeRetiredProductSentences(block.text),
      };
    })
    .filter(
      (block) =>
        block.type === 'image' ||
        (block.text && !hasRetiredProductReference(block.text) && !hasRetiredProductReference(block.html))
    );
}

function nodeAttr(node, name) {
  if (!node?.attribs) return '';
  return node.attribs[name] || node.attribs[name.toLowerCase()] || '';
}

function nodeClasses(node) {
  return nodeAttr(node, 'class').split(/\s+/).filter(Boolean);
}

function hasClass(node, className) {
  return nodeClasses(node).includes(className);
}

function hasClassContaining(node, fragment) {
  return nodeClasses(node).some((className) => className.includes(fragment));
}

function nodeText(node) {
  if (!node) return '';
  return normalizeText(DomUtils.textContent(node) || '');
}

function isHiddenNode(node) {
  const id = nodeAttr(node, 'id');
  const style = nodeAttr(node, 'style').toLowerCase();
  return (
    id === 'seo-aeo-score-widget'
    || hasClass(node, 'screen-reader-text')
    || hasClassContaining(node, 'elementor-hidden')
    || style.includes('display:none')
    || style.includes('display: none')
  );
}

function normalizeAssetUrl(value) {
  if (!value) return '';
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/')) return `${LIVE_ORIGIN}${value}`;
  return value;
}

function srcFromSrcset(value = '') {
  const candidates = value
    .split(',')
    .map((item) => item.trim().split(/\s+/))
    .filter(([url]) => Boolean(url));

  if (!candidates.length) return '';
  return candidates[candidates.length - 1][0];
}

function imageFromNode(node) {
  let src = nodeAttr(node, 'src');
  const srcset = nodeAttr(node, 'srcset') || nodeAttr(node, 'srcSet');
  if ((!src || src.startsWith('data:image/svg+xml')) && srcset) {
    src = srcFromSrcset(srcset);
  }

  src = normalizeAssetUrl(src);
  if (!src || src.startsWith('data:')) return null;

  return {
    type: 'image',
    src,
    alt: nodeAttr(node, 'alt'),
    width: Number(nodeAttr(node, 'width')) || null,
    height: Number(nodeAttr(node, 'height')) || null,
  };
}

function safeHref(value) {
  let href = normalizeInternalLinks(value || '').replace(/^href=["']|["']$/g, '');
  if (!href || /^javascript:/i.test(href)) return '';
  if (href.startsWith('/wp-content/')) href = `${LIVE_ORIGIN}${href}`;
  return href;
}

function sanitizeInlineHtml(html = '') {
  let output = normalizeInternalLinks(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?(?!a\b|strong\b|b\b|em\b|i\b|br\b|sup\b|sub\b)[^>]+>/gi, '')
    .replace(/<(strong|b|em|i|sup|sub)\b[^>]*>/gi, '<$1>')
    .replace(/<br\b[^>]*>/gi, '<br>');

  output = output.replace(/<a\b([^>]*)>/gi, (tag, attrs) => {
    const href = safeHref((attrs.match(/\bhref=["'][^"']*["']/i) || [''])[0]);
    if (!href) return '<span>';
    const external = /^https?:\/\//i.test(href) && !href.includes('solarisfilms.it');
    return `<a href="${href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>`;
  });

  output = output.replace(/<\/a>/gi, '</a>').replace(/<\/span>/gi, '</span>');
  return output.trim();
}

function addBlock(blocks, block) {
  const text = normalizeText(block.text || stripTags(block.html || ''));
  if (!text && block.type !== 'image') return;

  const normalizedBlock = { ...block, text };
  const previous = blocks[blocks.length - 1];
  if (previous && previous.type === normalizedBlock.type && previous.text === normalizedBlock.text) return;

  blocks.push(normalizedBlock);
}

function extractListItems(node) {
  return (node.children || [])
    .filter((child) => child.type === 'tag' && child.name?.toLowerCase() === 'li')
    .map((child) => ({
      html: sanitizeInlineHtml(DomUtils.getInnerHTML(child)),
      text: nodeText(child),
    }))
    .filter((item) => item.text);
}

function progressFromNode(node) {
  const label = nodeText(DomUtils.findOne((child) => hasClass(child, 'elementor-title'), node.children || [], true) || node);
  const percentageNode = DomUtils.findOne((child) => hasClass(child, 'elementor-progress-percentage'), node.children || [], true);
  const wrapper = DomUtils.findOne((child) => hasClass(child, 'elementor-progress-wrapper'), node.children || [], true);
  const percentage = nodeText(percentageNode) || (nodeAttr(wrapper, 'aria-valuenow') ? `${nodeAttr(wrapper, 'aria-valuenow')}%` : '');

  if (!label || !percentage) return null;
  return {
    type: 'metric',
    label,
    value: percentage,
    text: `${label} ${percentage}`,
  };
}

function counterFromNode(node) {
  const labelNode = DomUtils.findOne((child) => hasClass(child, 'elementor-counter-title'), node.children || [], true);
  const numberNode = DomUtils.findOne((child) => hasClass(child, 'elementor-counter-number'), node.children || [], true);
  const label = nodeText(labelNode);
  const value = normalizeText(nodeAttr(numberNode, 'data-to-value') || nodeText(numberNode));

  if (!label || !value) return null;
  return {
    type: 'metric',
    label,
    value,
    text: `${label} ${value}`,
  };
}

function extractContentBlocks(contentHtml) {
  const doc = parseDocument(contentHtml, { decodeEntities: false });
  const blocks = [];

  function walk(nodes) {
    for (const node of nodes || []) {
      if (node.type !== 'tag') {
        continue;
      }

      const tagName = node.name?.toLowerCase();
      if (!tagName || isHiddenNode(node) || ['script', 'style', 'noscript', 'svg', 'form', 'iframe'].includes(tagName)) {
        continue;
      }

      if (/^h[1-6]$/.test(tagName)) {
        addBlock(blocks, {
          type: 'heading',
          level: Number(tagName.slice(1)),
          html: sanitizeInlineHtml(DomUtils.getInnerHTML(node)),
          text: nodeText(node),
        });
        continue;
      }

      if (tagName === 'p') {
        addBlock(blocks, {
          type: 'paragraph',
          html: sanitizeInlineHtml(DomUtils.getInnerHTML(node)),
          text: nodeText(node),
        });
        continue;
      }

      if (tagName === 'ul' || tagName === 'ol') {
        const items = extractListItems(node);
        if (items.length) {
          addBlock(blocks, {
            type: 'list',
            ordered: tagName === 'ol',
            items,
            text: items.map((item) => item.text).join(' '),
          });
        }
        continue;
      }

      if (tagName === 'img') {
        continue;
      }

      if (tagName === 'a' && hasClassContaining(node, 'elementor-button')) {
        addBlock(blocks, {
          type: 'cta',
          href: safeHref(nodeAttr(node, 'href')),
          text: nodeText(node),
        });
        continue;
      }

      if (hasClass(node, 'elementor-widget-progress')) {
        const metric = progressFromNode(node);
        if (metric) addBlock(blocks, metric);
        continue;
      }

      if (hasClass(node, 'elementor-widget-counter') || hasClass(node, 'elementor-counter')) {
        const metric = counterFromNode(node);
        if (metric) addBlock(blocks, metric);
        continue;
      }

      if (hasClass(node, 'elementor-heading-title')) {
        addBlock(blocks, {
          type: 'note',
          html: sanitizeInlineHtml(DomUtils.getInnerHTML(node)),
          text: nodeText(node),
        });
        continue;
      }

      walk(node.children);
    }
  }

  walk(doc.children);
  return blocks;
}

function classifyPath(pathname, sourceSitemap = '') {
  const normalized = normalizeAppPath(pathname);
  const slug = slugFromPath(normalized);
  const source = sourceSitemap.toLowerCase();

  if (normalized === '/') {
    return { type: 'home', label: 'Home', newPath: '/', confidence: 'high', needsReview: false };
  }

  if (normalized === '/pellicole-per-vetri/pellicole-per-vetri/lo-sapevi-che/' || slug === 'lo-sapevi-che') {
    return {
      type: 'knowledge-index',
      label: 'Lo sapevi che?',
      newPath: '/lo-sapevi-che/',
      confidence: 'high',
      needsReview: false,
    };
  }

  const directRoutes = new Map([
    ['/pellicole-per-vetri/contact/', { type: 'page', label: 'Contatti', newPath: '/contatti/' }],
    ['/pellicole-per-vetri/pellicole-per-vetri/preventivo/', { type: 'page', label: 'Preventivo', newPath: '/preventivo/' }],
    ['/pellicole-per-vetri/privacy-policy/', { type: 'legal', label: 'Privacy', newPath: '/privacy-policy/' }],
    ['/pellicole-per-vetri/profilo-solaris/', { type: 'company', label: 'Profilo Solaris', newPath: '/profilo-solaris/' }],
    ['/pellicole-per-vetri/pellicole-per-vetri/about/', { type: 'company', label: 'Chi siamo', newPath: '/chi-siamo/' }],
    ['/pellicole-per-vetri/guida-tecnica-pellicole-per-vetri-antisolari-sicurezza-e-privacy/', { type: 'guide', label: 'Guida tecnica', newPath: '/guida-tecnica/' }],
    ['/pellicole-per-vetri/pellicole-per-vetri/faq/', { type: 'faq', label: 'FAQ', newPath: '/faq/' }],
    ['/pellicole-per-vetri/pellicole-per-vetri/', { type: 'service-index', label: 'Pellicole per vetri', newPath: '/servizi/' }],
    ['/pellicole-per-vetri/llms-txt/', { type: 'utility', label: 'LLMS', newPath: '/llms.txt' }],
    ['/pellicole-per-vetri/zoho-callback/', { type: 'utility', label: 'Zoho callback', newPath: '/zoho-callback/' }],
    ['/pellicole-per-vetri/false-parent/', { type: 'utility', label: 'Pagina tecnica', newPath: '/false-parent/' }],
    ['/pellicole-per-vetri/thank-you/', { type: 'utility', label: 'Grazie', newPath: '/grazie/' }],
    ['/servizio-locale/', { type: 'local-index', label: 'Servizio locale', newPath: '/servizio-locale/' }],
    ['/pagina-info/', { type: 'info-index', label: 'Informazioni', newPath: '/info/' }],
    ['/pellicole-per-vetri/le-pellicole-antisolari/', { type: 'category', label: 'Pellicole antisolari', newPath: '/servizi/pellicole-antisolari/' }],
    ['/pellicole-per-vetri/pellicole-di-sicurezza/', { type: 'category', label: 'Pellicole di sicurezza', newPath: '/servizi/pellicole-sicurezza/' }],
    ['/pellicole-per-vetri/pellicole-decorative-per-vetri/', { type: 'category', label: 'Pellicole decorative', newPath: '/servizi/pellicole-decorative/' }],
  ]);

  if (directRoutes.has(normalized)) {
    return { ...directRoutes.get(normalized), confidence: 'high', needsReview: false };
  }

  if (normalized.startsWith('/pellicole-per-vetri/le-pellicole-antisolari/')
    || normalized.startsWith('/pellicole-per-vetri/pellicole-di-sicurezza/')
    || normalized.startsWith('/pellicole-per-vetri/pellicole-decorative-per-vetri/')
    || ['pellicole-antisolari-sitemap.xml', 'pellicole-sicurezza-sitemap.xml', 'pellicole-privacy-sitemap.xml'].some((part) => source.includes(part))) {
    return {
      type: 'product',
      label: 'Prodotto',
      newPath: `/prodotti/${slug}/`,
      confidence: 'high',
      needsReview: false,
    };
  }

  if (normalized.startsWith('/servizio-locale/')) {
    const city = slug.replace(/^pellicole-per-vetri-/, '');
    return {
      type: 'local-service',
      label: 'Servizio locale',
      newPath: `/servizio-locale/${city}/`,
      confidence: 'high',
      needsReview: false,
    };
  }

  if (normalized.startsWith('/pagina-info/')) {
    return {
      type: 'info',
      label: 'Pagina info',
      newPath: `/info/${slug}/`,
      confidence: 'high',
      needsReview: false,
    };
  }

  if (normalized.startsWith('/approfondimenti/category/')) {
    return {
      type: 'blog-category',
      label: 'Categoria blog',
      newPath: `/blog/categoria/${slug}/`,
      confidence: 'high',
      needsReview: false,
    };
  }

  if (normalized.startsWith('/approfondimenti/tipo-pellicola/')) {
    return {
      type: 'film-type',
      label: 'Tipo pellicola',
      newPath: `/blog/tipo-pellicola/${slug}/`,
      confidence: 'high',
      needsReview: false,
    };
  }

  if (normalized.startsWith('/approfondimenti/author/')) {
    return {
      type: 'author',
      label: 'Autore',
      newPath: `/blog/autore/${slug}/`,
      confidence: 'high',
      needsReview: false,
    };
  }

  if (normalized.startsWith('/approfondimenti/')) {
    return {
      type: 'article',
      label: 'Approfondimento',
      newPath: `/blog/${slug}/`,
      confidence: 'high',
      needsReview: false,
    };
  }

  if (source.includes('focus-tecnico') || /^\/pellicole-[^/]+\/$/.test(normalized)) {
    return {
      type: 'technical-focus',
      label: 'Focus tecnico',
      newPath: `/focus-tecnico/${slug}/`,
      confidence: 'high',
      needsReview: false,
    };
  }

  if (source.includes('post-sitemap.xml')) {
    return {
      type: 'article',
      label: 'Approfondimento',
      newPath: `/blog/${slug}/`,
      confidence: 'medium',
      needsReview: true,
    };
  }

  return {
    type: 'unclassified',
    label: 'Da verificare',
    newPath: normalized,
    confidence: 'low',
    needsReview: true,
  };
}

async function collectLiveUrls() {
  const indexXml = await fetchText(SITEMAP_INDEX);
  const sitemapUrls = extractSitemapUrls(indexXml).filter((url) => url.endsWith('.xml'));
  const pages = [];

  for (const sitemapUrl of sitemapUrls) {
    try {
      console.log(`Reading sitemap ${sitemapUrl}`);
      const xml = await fetchText(sitemapUrl);
      const urls = extractSitemapUrls(xml)
        .filter((url) => url.startsWith(LIVE_ORIGIN))
        .filter((url) => !hasRetiredProductReference(url));
      for (const url of urls) {
        pages.push({ url, sitemap: sitemapUrl });
      }
      console.log(`  -> ${urls.length} URLs`);
    } catch (err) {
      console.warn(`  -> failed: ${err.message}`);
    }
  }

  const byUrl = new Map();
  for (const page of pages) byUrl.set(page.url, page);
  return [...byUrl.values()];
}

async function buildPageRecord(entry, index, total) {
  console.log(`[${index + 1}/${total}] ${entry.url}`);
  const html = await fetchText(entry.url);
  const seo = extractMeta(html);
  const contentHtml = extractMainHtml(html);
  const headings = extractHeadings(contentHtml);
  const contentBlocks = cleanRetiredProductBlocks(extractContentBlocks(contentHtml));
  const text = contentBlocks.map((block) => block.text).filter(Boolean).join(' ');
  const route = classifyPath(normalizePath(entry.url), entry.sitemap);
  const primaryImage = '';

  return {
    url: entry.url,
    path: normalizePath(entry.url),
    route,
    sourceSitemap: entry.sitemap,
    seo,
    headings,
    h1: headings.find((heading) => heading.level === 1)?.text || '',
    primaryImage,
    contentBlocks,
    contentHtml: '',
    text,
    textLength: text.length,
    fetchedAt: new Date().toISOString(),
  };
}

function buildSitemap(pages) {
  const urls = pages
    .filter((page) => !/noindex/i.test(page.seo.robots || ''))
    .map((page) => `  <url><loc>${LIVE_ORIGIN}${page.route.newPath}</loc></url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildUrlMap(pages) {
  return pages.map((page) => ({
    oldUrl: page.url,
    oldPath: page.path,
    newPath: page.route.newPath,
    type: page.route.type,
    label: page.route.label,
    confidence: page.route.confidence,
    needsReview: page.route.needsReview,
    title: page.seo.title,
    h1: page.h1,
    sourceSitemap: page.sourceSitemap,
  }));
}

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function buildUrlMapCsv(urlMap) {
  const columns = ['oldUrl', 'oldPath', 'newPath', 'type', 'confidence', 'needsReview', 'h1', 'sourceSitemap'];
  const rows = [
    columns.join(','),
    ...urlMap.map((entry) => columns.map((column) => csvCell(entry[column])).join(',')),
  ];
  return `${rows.join('\n')}\n`;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.rmSync(PAGES_DIR, { recursive: true, force: true });
  fs.mkdirSync(PAGES_DIR, { recursive: true });
  const liveUrls = await collectLiveUrls();
  const pages = [];

  for (let i = 0; i < liveUrls.length; i += 1) {
    try {
      const page = await buildPageRecord(liveUrls[i], i, liveUrls.length);
      const file = pageFileName(page.path);
      fs.writeFileSync(path.join(PAGES_DIR, file), JSON.stringify(page));
      pages.push({ ...page, file });
    } catch (err) {
      console.warn(`  -> failed page: ${err.message}`);
    }
  }

  const index = {
    origin: LIVE_ORIGIN,
    pages: pages.map((page) => ({
      url: page.url,
      path: page.path,
      route: page.route,
      file: page.file,
      title: page.seo.title,
      description: page.seo.description,
      canonical: page.seo.canonical,
      robots: page.seo.robots,
      h1: page.h1,
      textLength: page.textLength,
      sourceSitemap: page.sourceSitemap,
    })),
  };

  const inventory = pages.map((page) => ({
    url: page.url,
    path: page.path,
    route: page.route,
    title: page.seo.title,
    description: page.seo.description,
    canonical: page.seo.canonical,
    robots: page.seo.robots,
    h1: page.h1,
    textLength: page.textLength,
    sourceSitemap: page.sourceSitemap,
  }));

  const urlMap = buildUrlMap(pages);

  fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
  fs.writeFileSync(INVENTORY_FILE, JSON.stringify(inventory, null, 2));
  fs.writeFileSync(URL_MAP_FILE, JSON.stringify(urlMap, null, 2));
  fs.writeFileSync(URL_MAP_CSV_FILE, buildUrlMapCsv(urlMap));
  fs.writeFileSync(SITEMAP_FILE, buildSitemap(pages));

  console.log(`\nSaved ${pages.length} live page files to ${PAGES_DIR}`);
  console.log(`Saved live page index to ${INDEX_FILE}`);
  console.log(`Saved SEO inventory to ${INVENTORY_FILE}`);
  console.log(`Saved URL map to ${URL_MAP_FILE}`);
}

main().catch((err) => {
  console.error('Live mirror fetch failed:', err);
  process.exit(1);
});
