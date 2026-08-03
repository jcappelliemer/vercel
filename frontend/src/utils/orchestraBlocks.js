export function normalizeOrchestraPath(pathname) {
  let normalized = String(pathname || '/');
  const cut = normalized.search(/[?#]/);
  if (cut >= 0) normalized = normalized.slice(0, cut);
  if (!normalized.startsWith('/')) normalized = `/${normalized}`;
  if (normalized.length > 1) normalized = normalized.replace(/\/+$/, '');
  return normalized || '/';
}

function stripAccents(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function isAuthorityFaqItem(item) {
  const question = stripAccents(item?.q || item?.question || '');
  return question.includes('autorita') || question.includes('authority');
}

export function normalizeFaqItems(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => ({
      q: decodeHtmlEntities(item?.q || item?.question || ''),
      a: decodeHtmlEntities(item?.a || item?.answer || ''),
    }))
    .filter((item) => item.q && item.a && !isAuthorityFaqItem(item));
}

export function normalizeTrustSignals(signals) {
  if (!Array.isArray(signals)) return [];

  return signals
    .map((signal) => {
      if (typeof signal === 'string') return signal;
      if (!signal || typeof signal !== 'object') return '';
      return signal.label || signal.text || signal.title || signal.value || signal.name || '';
    })
    .map((signal) => String(signal || '').trim())
    .filter(Boolean);
}

// Fix C (BUG FAQ #2 doppioni) — chiave di confronto domanda: entita comuni
// decodificate, apostrofi/virgolette tipografiche normalizzate, lowercase,
// spazi collassati, punteggiatura terminale rimossa. Speculare alla norm PHP
// di merge_faq (plugin v3.66.2/v3.74.17).
export function normalizeQuestionKey(value) {
  return String(value || '')
    .replace(/&#0?39;|&apos;|&rsquo;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/&nbsp;/gi, ' ')
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[\s?!.:]+$/g, '')
    .trim();
}

// Fix C — filtra dall'ACCORDION le domande gia presenti come sezione nel corpo
// della pagina (headings del mirror o testo integrale): la stessa Q&A non deve
// apparire due volte sul servito (58/162 pagine jc4e affette). Il nodo FAQPage
// JSON-LD resta costruito dal set COMPLETO, a monte di questo filtro.
export function filterFaqItemsAgainstBody(items, page) {
  if (!Array.isArray(items) || !items.length || !page) return Array.isArray(items) ? items : [];
  const headingKeys = new Set(
    (Array.isArray(page.headings) ? page.headings : [])
      .map((h) => normalizeQuestionKey(h && (h.text || h.title || h)))
      .filter(Boolean)
  );
  const bodyText = normalizeQuestionKey(page.text || '');
  return items.filter((item) => {
    const key = normalizeQuestionKey(item && (item.q || item.question));
    if (!key || key.length < 8) return true;
    if (headingKeys.has(key)) return false;
    if (bodyText && bodyText.includes(key)) return false;
    return true;
  });
}

// Residuo encoding (2026-07-15) — le fonti dati runtime (prodotti.json baked dal
// build, REST jc4e) portano ancora entita HTML nei testi; React le stampa come
// testo letterale ("un&#039;avanzata"). Decode PURO JS (niente DOM) cosi SSR e
// client producono la stessa stringa (no hydration mismatch). Copre numeriche
// dec/hex e le named comuni dei contenuti italiani.
const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  agrave: 'à', egrave: 'è', eacute: 'é', igrave: 'ì',
  ograve: 'ò', ugrave: 'ù', Agrave: 'À', Egrave: 'È',
  Eacute: 'É', deg: '°', middot: '·', hellip: '…',
  ndash: '–', mdash: '—',
};

export function decodeHtmlEntities(value) {
  const text = String(value || '');
  if (text.indexOf('&') === -1) return text;
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = parseInt(hex, 16);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : _;
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : _;
    })
    .replace(/&([a-z]+);/gi, (m, name) =>
      Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, name) ? NAMED_ENTITIES[name] : m
    );
}
