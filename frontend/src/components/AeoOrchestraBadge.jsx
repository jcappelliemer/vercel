export default function AeoOrchestraBadge() {
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
