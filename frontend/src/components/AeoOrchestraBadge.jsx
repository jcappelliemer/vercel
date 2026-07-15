import fixes from '../data/orchestra-fixes.json';

// Il badge e VALUE-LESS by design: mai numeri/punteggi (il manifest li emette
// null dal plugin v3.74.18). Reso solo se il sito ha almeno una pagina gestita
// da Orchestra (flag optimized_by_orchestra dal manifest, fallback: byPath).
const SITE_OPTIMIZED = (() => {
  const entries = fixes && fixes.byPath ? Object.values(fixes.byPath) : [];
  if (!entries.length) return false;
  return entries.some((e) => e && e.optimized_by_orchestra !== false);
})();

export default function AeoOrchestraBadge() {
  if (!SITE_OPTIMIZED) return null;
  return (
    <a
      className="aeo-orchestra-badge"
      href="https://aeo-orchestra.com"
      target="_blank"
      rel="noopener"
      aria-label="Sito ottimizzato con AEO Orchestra per la citabilita nelle AI"
    >
      <span className="aeo-orchestra-badge__mark">AEO</span>
      <span className="aeo-orchestra-badge__body">
        <span className="aeo-orchestra-badge__brand">Ottimizzato con AEO Orchestra</span>
        <span className="aeo-orchestra-badge__text">Citabile dalle AI</span>
        <span className="aeo-orchestra-badge__detail">
          ChatGPT, Claude, Gemini, Perplexity
        </span>
      </span>
      <span className="aeo-orchestra-badge__arrow" aria-hidden="true">
        &rarr;
      </span>
    </a>
  );
}
