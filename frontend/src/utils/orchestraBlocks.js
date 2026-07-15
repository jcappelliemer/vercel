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
      q: item?.q || item?.question || item?.name || item?.headline || '',
      a: item?.a || item?.answer || item?.acceptedAnswer?.text || item?.acceptedAnswer?.answerText || '',
    }))
    .filter((item) => item.q && item.a && !isAuthorityFaqItem(item));
}

export function parseJsonValue(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function normalizeConnectorArray(value, keys = []) {
  const parsed = parseJsonValue(value);
  if (Array.isArray(parsed)) return parsed;
  if (!parsed || typeof parsed !== 'object') return [];

  for (const key of keys) {
    if (Array.isArray(parsed[key])) return parsed[key];
  }

  return [];
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
