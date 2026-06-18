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

export default function OrchestraConnector({ path }) {
  const loc = useLocation();
  const key = normPath(path || (loc && loc.pathname) || '/');
  const entry = fixes && fixes.byPath ? fixes.byPath[key] : null;
  if (!entry) return null;

  const aeo = entry.aeo || {};
  const meta = entry.meta || {};
  const faqItems = Array.isArray(aeo.faq)
    ? aeo.faq.map((x) => ({ q: x.q || x.question || '', a: x.a || x.answer || '' })).filter((x) => x.q && x.a)
    : [];
  const hasHead = meta.title || meta.description || aeo.schema_jsonld;

  return (
    <>
      {hasHead ? (
        <Helmet>
          {meta.title ? <title>{meta.title}</title> : null}
          {meta.description ? <meta name="description" content={meta.description} /> : null}
          {aeo.schema_jsonld ? (
            <script type="application/ld+json">{JSON.stringify(aeo.schema_jsonld)}</script>
          ) : null}
        </Helmet>
      ) : null}
      {aeo.authority_html ? <Authority html={aeo.authority_html} /> : null}
      {faqItems.length ? <FAQ items={faqItems} /> : null}
      {aeo.snippet_html ? <Snippet html={aeo.snippet_html} /> : null}
    </>
  );
}
