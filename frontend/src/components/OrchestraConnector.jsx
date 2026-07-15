import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/next/router-shim';
import fixes from '../data/orchestra-fixes.json';
import FAQ from './FAQ';
import Snippet from './Snippet';
import {
  isAuthorityFaqItem,
  normalizeConnectorArray,
  normalizeFaqItems,
  normalizeOrchestraPath,
  parseJsonValue,
} from '../utils/orchestraBlocks';

/**
 * OrchestraConnector — A.4: renders the Orchestra AEO blocks (content, faq,
 * snippet) + head (schema_jsonld/schema_json, meta) for the CURRENT route, read from
 * orchestra-fixes.json by path. ADDITIVE over the .it-sourced body (does not
 * replace it). Renders nothing when the path has no Orchestra entry (graceful —
 * no hardcoded fallback outside the home). Blocks appear only after a rebuild
 * (build-time connector); byPath holds only pages with applied blocks.
 *
 * Drop `<OrchestraConnector />` before the authority/footer slot. The path is
 * read from the router (useLocation); pass `path` to override.
 */
function hasSchemaType(schema, type) {
  if (!schema) return false;
  if (Array.isArray(schema)) return schema.some((item) => hasSchemaType(item, type));
  if (typeof schema !== 'object') return false;

  const schemaType = schema['@type'];
  if (Array.isArray(schemaType) && schemaType.includes(type)) return true;
  if (schemaType === type) return true;
  if (schema['@graph']) return hasSchemaType(schema['@graph'], type);

  return false;
}

function isSchemaType(schema, type) {
  const schemaType = schema?.['@type'];
  if (Array.isArray(schemaType)) return schemaType.includes(type);
  return schemaType === type;
}

function sanitizeSchemaJsonLd(schema) {
  if (!schema) return null;
  if (Array.isArray(schema)) {
    const cleaned = schema.map(sanitizeSchemaJsonLd).filter(Boolean);
    return cleaned.length ? cleaned : null;
  }
  if (typeof schema !== 'object') return schema;

  if (isSchemaType(schema, 'FAQPage')) {
    const mainEntity = Array.isArray(schema.mainEntity)
      ? schema.mainEntity.filter((item) => !isAuthorityFaqItem({ q: item?.name || item?.question || item?.headline || '' }))
      : schema.mainEntity;
    if (Array.isArray(mainEntity) && !mainEntity.length) return null;
    return { ...schema, mainEntity };
  }

  if (schema['@graph']) {
    const graph = sanitizeSchemaJsonLd(schema['@graph']);
    return graph ? { ...schema, '@graph': graph } : { ...schema, '@graph': [] };
  }

  return schema;
}

function removeTopLevelSchemaType(schema, type) {
  if (!schema) return null;
  if (Array.isArray(schema)) {
    const cleaned = schema
      .filter((item) => !isSchemaType(item, type))
      .map((item) => removeTopLevelSchemaType(item, type))
      .filter(Boolean);
    return cleaned.length ? cleaned : null;
  }
  if (typeof schema !== 'object') return schema;
  if (isSchemaType(schema, type)) return null;

  if (schema['@graph']) {
    const graph = Array.isArray(schema['@graph'])
      ? schema['@graph'].filter((item) => !isSchemaType(item, type))
      : schema['@graph'];
    return { ...schema, '@graph': graph };
  }

  return schema;
}

function parseJsonObject(value) {
  if (!value) return null;
  if (typeof value === 'object' && !Array.isArray(value)) return value;
  if (typeof value !== 'string') return null;

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function buildOrganizationJsonLd(value) {
  const organization = parseJsonObject(value);
  if (!organization) return null;

  return {
    ...organization,
    '@context': organization['@context'] || 'https://schema.org',
    '@type': organization['@type'] || 'Organization',
  };
}

function cleanSchemaText(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildFaqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: cleanSchemaText(item.q),
      acceptedAnswer: {
        '@type': 'Answer',
        text: cleanSchemaText(item.a),
      },
    })),
  };
}

function normalizeConnectorFaqItems(aeo) {
  const candidates = [aeo.faq_items_json, aeo.faq_items, aeo.faq];

  for (const candidate of candidates) {
    const arrayValue = normalizeConnectorArray(candidate, ['items', 'faq', 'faqs', 'questions', 'mainEntity']);
    const normalized = normalizeFaqItems(arrayValue.length ? arrayValue : candidate);
    if (normalized.length) return normalized;
  }

  return [];
}

function normalizeSchemaJsonLd(value) {
  const parsed = parseJsonValue(value);
  if (!parsed) return null;
  if (Array.isArray(parsed)) return parsed.length ? parsed : null;
  if (typeof parsed !== 'object') return null;

  if (parsed.schema) return normalizeSchemaJsonLd(parsed.schema);
  if (parsed.schema_json) return normalizeSchemaJsonLd(parsed.schema_json);
  if (parsed.schema_jsonld) return normalizeSchemaJsonLd(parsed.schema_jsonld);
  if (parsed.jsonld) return normalizeSchemaJsonLd(parsed.jsonld);
  if (parsed.json_ld) return normalizeSchemaJsonLd(parsed.json_ld);

  return parsed;
}

function sanitizeHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<form[\s\S]*?<\/form>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed[\s\S]*?>/gi, '')
    .replace(/\son\w+=(["']).*?\1/gi, '')
    .replace(/\son\w+=\S+/gi, '')
    .replace(/\s(?:href|src)=(["'])\s*javascript:[\s\S]*?\1/gi, '')
    .replace(/\s(?:href|src)=\s*javascript:\S+/gi, '');
}

function stripTags(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function isUsefulText(value) {
  return stripTags(value).length > 0;
}

function safeHref(value) {
  const href = String(value || '').trim();
  if (!href) return '';
  if (href.startsWith('/') || /^https?:\/\//i.test(href)) return href;
  return '';
}

function normalizeConnectorBlocks(aeo) {
  const rawBlocks = [
    ...normalizeConnectorArray(aeo.content_blocks_json, ['blocks', 'content_blocks', 'items']),
    ...normalizeConnectorArray(aeo.content_blocks, ['blocks', 'content_blocks', 'items']),
    ...normalizeConnectorArray(aeo.contentBlocks, ['blocks', 'content_blocks', 'items']),
  ];

  return rawBlocks
    .map((block) => {
      if (typeof block === 'string') {
        const html = sanitizeHtml(block);
        if (!isUsefulText(html)) return null;
        return html.includes('<') ? { type: 'html', html } : { type: 'paragraph', text: html };
      }

      if (!block || typeof block !== 'object') return null;

      const type = String(block.type || block.block_type || block.kind || 'paragraph').toLowerCase();
      const html = sanitizeHtml(block.html || block.content || block.body || '');
      const text = stripTags(block.text || block.plain_text || block.title || block.heading || html);
      const items = Array.isArray(block.items) ? block.items : [];

      if (['heading', 'title', 'h2', 'h3', 'h4'].includes(type)) {
        const explicitLevel = type.match(/^h([2-4])$/)?.[1];
        const level = Number(block.level || explicitLevel || 2);
        return text ? { type: 'heading', level: Math.min(Math.max(level, 2), 4), text } : null;
      }

      if (['list', 'ul', 'ol'].includes(type)) {
        const normalizedItems = items
          .map((item) => (typeof item === 'string' ? item : item?.text || item?.html || item?.label || ''))
          .map((item) => sanitizeHtml(item))
          .filter(isUsefulText);
        return normalizedItems.length ? { type: 'list', ordered: type === 'ol' || block.ordered === true, items: normalizedItems } : null;
      }

      if (['cta', 'link', 'button'].includes(type)) {
        const href = safeHref(block.href || block.url || block.link || '');
        return href && text ? { type: 'cta', href, text } : null;
      }

      if (html && isUsefulText(html)) return { type: 'html', html };
      return text ? { type: 'paragraph', text } : null;
    })
    .filter(Boolean);
}

function normalizeInternalLinks(aeo) {
  const rawLinks = [
    ...normalizeConnectorArray(aeo.internal_links_json, ['links', 'items', 'internal_links']),
    ...normalizeConnectorArray(aeo.internal_links, ['links', 'items', 'internal_links']),
    ...normalizeConnectorArray(aeo.internalLinks, ['links', 'items', 'internal_links']),
  ];
  const seen = new Set();

  return rawLinks
    .map((link) => {
      if (typeof link === 'string') return { href: safeHref(link), label: stripTags(link) };
      if (!link || typeof link !== 'object') return null;

      const href = safeHref(link.href || link.url || link.link || link.path || '');
      const label = stripTags(link.label || link.title || link.text || link.anchor || href);
      return href && label ? { href, label } : null;
    })
    .filter(Boolean)
    .filter((link) => {
      const key = `${link.href}|${link.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function OrchestraContentBlocks({ blocks, links }) {
  if (!blocks.length && !links.length) return null;

  return (
    <section className="py-20 section-light border-y border-[#E2E8F0]" data-testid="orchestra-content-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {blocks.length ? (
          <article className="live-prose" data-testid="orchestra-content-blocks">
            {blocks.map((block, index) => {
              if (block.type === 'heading') {
                const HeadingTag = `h${block.level || 2}`;
                return (
                  <HeadingTag
                    key={`heading-${index}`}
                    className={`live-prose-heading live-prose-heading-${block.level || 2}`}
                  >
                    {block.text}
                  </HeadingTag>
                );
              }

              if (block.type === 'list') {
                const ListTag = block.ordered ? 'ol' : 'ul';
                return (
                  <ListTag key={`list-${index}`} className="live-prose-list">
                    {block.items.map((item, itemIndex) => (
                      <li key={`${index}-${itemIndex}`} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ListTag>
                );
              }

              if (block.type === 'cta') {
                return (
                  <p key={`cta-${index}`} className="mt-8">
                    <a href={block.href} className="btn-yellow">{block.text}</a>
                  </p>
                );
              }

              if (block.type === 'html') {
                return <div key={`html-${index}`} className="live-prose-paragraph" dangerouslySetInnerHTML={{ __html: block.html }} />;
              }

              return <p key={`paragraph-${index}`} className="live-prose-paragraph">{block.text}</p>;
            })}
          </article>
        ) : null}

        {links.length ? (
          <nav
            className="mt-10 rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm"
            aria-label="Link correlati Orchestra"
            data-testid="orchestra-internal-links"
          >
            <ul className="grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <a href={link.href} className="font-semibold text-[#2563EB] hover:underline">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </section>
  );
}

export default function OrchestraConnector({ path, headOnly }) {
  const loc = useLocation();
  const key = normalizeOrchestraPath(path || (loc && loc.pathname) || '/');
  const entry = fixes && fixes.byPath ? fixes.byPath[key] : null;
  if (!entry && key !== '/') return null;

  const aeo = entry?.aeo || {};
  const meta = entry?.meta || {};
  const faqItems = normalizeConnectorFaqItems(aeo);
  const contentBlocks = normalizeConnectorBlocks(aeo);
  const internalLinks = normalizeInternalLinks(aeo);
  const organizationSchema = buildOrganizationJsonLd(aeo.organization);
  const schemaSource = normalizeSchemaJsonLd(aeo.schema_jsonld) || normalizeSchemaJsonLd(aeo.schema_json);
  const rawSchemaJsonLd = organizationSchema
    ? removeTopLevelSchemaType(schemaSource, 'Organization')
    : schemaSource;
  const schemaJsonLd = sanitizeSchemaJsonLd(rawSchemaJsonLd);
  const faqSchema = faqItems.length && !hasSchemaType(schemaJsonLd, 'FAQPage')
    ? buildFaqSchema(faqItems)
    : null;
  const hasHead = meta.title || meta.description || meta.keywords || organizationSchema || schemaJsonLd || faqSchema;

  return (
    <>
      {hasHead ? (
        <Helmet>
          {meta.title ? <title>{meta.title}</title> : null}
          {meta.description ? <meta name="description" content={meta.description} /> : null}
          {meta.keywords ? <meta name="keywords" content={meta.keywords} /> : null}
          {organizationSchema ? (
            <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
          ) : null}
          {schemaJsonLd ? (
            <script type="application/ld+json">{JSON.stringify(schemaJsonLd)}</script>
          ) : null}
          {faqSchema ? (
            <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
          ) : null}
        </Helmet>
      ) : null}
      {/* headOnly: la Home rende gia le FAQ nel body; authority vive nello slot pre-footer dedicato. */}
      {!headOnly && (contentBlocks.length || internalLinks.length) ? (
        <OrchestraContentBlocks blocks={contentBlocks} links={internalLinks} />
      ) : null}
      {!headOnly && faqItems.length ? <FAQ items={faqItems} /> : null}
      {!headOnly && aeo.snippet_html ? <Snippet html={aeo.snippet_html} /> : null}
    </>
  );
}
