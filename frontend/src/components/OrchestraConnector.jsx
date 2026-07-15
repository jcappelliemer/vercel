import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/next/router-shim';
import fixes from '../data/orchestra-fixes.json';
import AeoOrchestraBadge from './AeoOrchestraBadge';
import FAQ from './FAQ';
import Snippet from './Snippet';
import { isAuthorityFaqItem, normalizeFaqItems, normalizeOrchestraPath } from '../utils/orchestraBlocks';

/**
 * OrchestraConnector — A.4: renders the Orchestra AEO blocks (faq, snippet)
 * + head (schema_jsonld, meta) for the CURRENT route, read from
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

export default function OrchestraConnector({ path, headOnly }) {
  const loc = useLocation();
  const key = normalizeOrchestraPath(path || (loc && loc.pathname) || '/');
  const entry = fixes && fixes.byPath ? fixes.byPath[key] : null;
  if (!entry && key !== '/') return null;

  const aeo = entry?.aeo || {};
  const meta = entry?.meta || {};
  const faqItems = normalizeFaqItems(aeo.faq);
  const organizationSchema = buildOrganizationJsonLd(aeo.organization);
  const rawSchemaJsonLd = organizationSchema
    ? removeTopLevelSchemaType(aeo.schema_jsonld, 'Organization')
    : aeo.schema_jsonld;
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
      {!headOnly && entry ? (
        <section className="aeo-orchestra-badge-section" data-testid="aeo-orchestra-badge-section">
          <AeoOrchestraBadge />
        </section>
      ) : null}
      {!headOnly && faqItems.length ? <FAQ items={faqItems} /> : null}
      {!headOnly && aeo.snippet_html ? <Snippet html={aeo.snippet_html} /> : null}
    </>
  );
}
