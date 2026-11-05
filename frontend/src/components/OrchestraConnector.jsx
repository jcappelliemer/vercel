import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/next/router-shim';
import fixes from '../data/orchestra-fixes.json';
import FAQ from './FAQ';
import Snippet from './Snippet';
import { filterFaqItemsAgainstBody, isAuthorityFaqItem, normalizeFaqItems, resolveOrchestraPath } from '../utils/orchestraBlocks';

const SITE_ORIGIN = String(
  process.env.NEXT_PUBLIC_SITE_URL
  || process.env.NEXT_PUBLIC_SITE_ORIGIN
  || 'https://solarisfilms.vercel.app'
).replace(/\/+$/, '');
const WP_ORIGIN = String(
  process.env.NEXT_PUBLIC_WP_ORIGIN
  || process.env.REACT_APP_WP_URL
  || 'https://wordpress-jc4e.srv1502079.hstgr.cloud'
).replace(/\/+$/, '');
const SCHEMA_IDENTITY_URL_KEYS = new Set(['@id', 'url', 'mainEntityOfPage', 'item']);

/**
 * OrchestraConnector — A.4: renders the Orchestra AEO blocks (faq, snippet)
 * + head (schema_jsonld, meta) for the CURRENT route, read from
 * orchestra-fixes.json by path. ADDITIVE over the .it-sourced body (does not
 * replace it). Renders nothing when the path has no Orchestra entry (graceful —
 * no hardcoded fallback outside the home). Blocks appear only after a rebuild
 * (build-time connector); byPath holds only pages with applied blocks.
 *
 * The app mounts the head globally and the body blocks immediately before the
 * footer. The path is read from the router (useLocation); pass `path` and
 * `page` when rendering a mirrored WordPress page so visible FAQ items can be
 * deduplicated against the page body.
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

function urlOrigin(value) {
  try {
    return new URL(String(value || '')).origin;
  } catch {
    return '';
  }
}

function rewriteSchemaIdentityUrls(value, sourceOrigin, targetOrigin, key = '') {
  if (!value || !sourceOrigin || !targetOrigin) return value;
  if (Array.isArray(value)) {
    return value.map((item) => rewriteSchemaIdentityUrls(item, sourceOrigin, targetOrigin, key));
  }
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [
      childKey,
      rewriteSchemaIdentityUrls(childValue, sourceOrigin, targetOrigin, childKey),
    ]));
  }
  if (typeof value !== 'string' || !SCHEMA_IDENTITY_URL_KEYS.has(key)) return value;

  try {
    const parsed = new URL(value);
    if (parsed.origin !== sourceOrigin) return value;
    return `${targetOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return value;
  }
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

export default function OrchestraConnector({ path, headOnly, bodyOnly, page }) {
  const loc = useLocation();
  const entries = fixes && fixes.byPath ? fixes.byPath : {};
  const key = resolveOrchestraPath(path || (loc && loc.pathname) || '/', entries);
  const entry = entries[key] || null;
  if (!entry && key !== '/') return null;

  const aeo = entry?.aeo || {};
  const meta = entry?.meta || {};
  const sourceOrigin = urlOrigin(entry?.wp_url) || urlOrigin(WP_ORIGIN);
  const targetOrigin = SITE_ORIGIN || urlOrigin(entry?.frontend_url);
  const faqItems = normalizeFaqItems(aeo.faq);
  // Fix C (BUG FAQ #2) — l'accordion salta le domande gia presenti come sezione
  // nel corpo (prop page dal mirror); il FAQPage JSON-LD resta sul set COMPLETO.
  // The home already renders its manifest-backed FAQ in the main page flow.
  const visibleFaqItems = key === '/' ? [] : filterFaqItemsAgainstBody(faqItems, page);
  const organizationSchema = rewriteSchemaIdentityUrls(
    buildOrganizationJsonLd(aeo.organization),
    sourceOrigin,
    targetOrigin
  );
  const rawSchemaJsonLd = organizationSchema
    ? removeTopLevelSchemaType(aeo.schema_jsonld, 'Organization')
    : aeo.schema_jsonld;
  const schemaJsonLd = rewriteSchemaIdentityUrls(
    sanitizeSchemaJsonLd(rawSchemaJsonLd),
    sourceOrigin,
    targetOrigin
  );
  const faqSchema = faqItems.length && !hasSchemaType(schemaJsonLd, 'FAQPage')
    ? buildFaqSchema(faqItems)
    : null;
  const hasHead = meta.title || meta.description || meta.keywords || organizationSchema || schemaJsonLd || faqSchema;

  return (
    <>
      {!bodyOnly && hasHead ? (
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
      {/* Head and body mounts are split so every route receives metadata once. */}
      {!headOnly && visibleFaqItems.length ? <FAQ items={visibleFaqItems} /> : null}
      {!headOnly && aeo.snippet_html ? <Snippet html={aeo.snippet_html} /> : null}
    </>
  );
}
