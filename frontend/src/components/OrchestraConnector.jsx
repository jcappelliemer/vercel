import { Helmet } from 'react-helmet-async';
import { useLocation } from '@/next/router-shim';
import fixes from '../data/orchestra-fixes.json';
import Authority from './Authority';
import FAQ from './FAQ';
import Snippet from './Snippet';

/**
 * OrchestraConnector — A.4: renders the Orchestra AEO blocks (authority, faq,
 * snippet) + head (schema_jsonld, meta) for the CURRENT route, read from
 * orchestra-fixes.json by path. ADDITIVE over the .it-sourced body (does not
 * replace it). Renders nothing when the path has no Orchestra entry (graceful —
 * no hardcoded fallback outside the home). Blocks appear only after a rebuild
 * (build-time connector); byPath holds only pages with applied blocks.
 *
 * Drop `<OrchestraConnector />` right before the template's <Footer/>. The path
 * is read from the router (useLocation); pass `path` to override.
 */
function normPath(p) {
  let s = String(p || '/');
  const cut = s.search(/[?#]/);
  if (cut >= 0) s = s.slice(0, cut);
  if (!s.startsWith('/')) s = '/' + s;
  if (s.length > 1) s = s.replace(/\/+$/, ''); // trailing-slash normalization (matches fetcher)
  return s || '/';
}

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
  const key = normPath(path || (loc && loc.pathname) || '/');
  const entry = fixes && fixes.byPath ? fixes.byPath[key] : null;
  if (!entry) return null;

  const aeo = entry.aeo || {};
  const meta = entry.meta || {};
  const faqItems = Array.isArray(aeo.faq)
    ? aeo.faq.map((x) => ({ q: x.q || x.question || '', a: x.a || x.answer || '' })).filter((x) => x.q && x.a)
    : [];
  const faqSchema = faqItems.length && !hasSchemaType(aeo.schema_jsonld, 'FAQPage')
    ? buildFaqSchema(faqItems)
    : null;
  const hasHead = meta.title || meta.description || meta.keywords || aeo.schema_jsonld || faqSchema;

  return (
    <>
      {hasHead ? (
        <Helmet>
          {meta.title ? <title>{meta.title}</title> : null}
          {meta.description ? <meta name="description" content={meta.description} /> : null}
          {meta.keywords ? <meta name="keywords" content={meta.keywords} /> : null}
          {aeo.schema_jsonld ? (
            <script type="application/ld+json">{JSON.stringify(aeo.schema_jsonld)}</script>
          ) : null}
          {faqSchema ? (
            <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
          ) : null}
        </Helmet>
      ) : null}
      {/* headOnly: la Home rende già FAQ (A.2) + Authority (A.3) nel body → evita doppioni */}
      {!headOnly && aeo.authority_html ? <Authority html={aeo.authority_html} /> : null}
      {!headOnly && faqItems.length ? <FAQ items={faqItems} /> : null}
      {!headOnly && aeo.snippet_html ? <Snippet html={aeo.snippet_html} /> : null}
    </>
  );
}
