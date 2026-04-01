/**
 * WordPress Headless API Service
 * Fetches content from WordPress REST API with static fallback
 */

const WP_URL = process.env.REACT_APP_WP_URL || '';

// Use proxy path on Vercel (HTTPS) to avoid mixed-content blocking
function getApiBase() {
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && WP_URL) {
    return '/wp-api';
  }
  return WP_URL ? `${WP_URL}/wp-json` : '';
}

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function wpFetch(endpoint, params = {}) {
  const apiBase = getApiBase();
  if (!apiBase) return null;
  const query = new URLSearchParams({ per_page: 100, ...params }).toString();
  const url = `${apiBase}/wp/v2/${endpoint}?${query}`;
  const cacheKey = url;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`WP API error: ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, { data, time: Date.now() });
    return data;
  } catch (err) {
    console.warn(`WP API fallback for ${endpoint}:`, err.message);
    return null;
  }
}

function decodeHtml(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

// ===== PRODOTTI =====
function mapProdotto(wp) {
  const m = wp.solaris_meta || wp.meta || {};
  return {
    slug: wp.slug,
    nome: decodeHtml(wp.title.rendered),
    descrizione: wp.content?.rendered?.replace(/<[^>]*>/g, '').trim() || '',
    categoria: m.categoria || '',
    sottocategoria: m.sottocategoria || '',
    applicazione: m.applicazione || '',
    certificazione: m.certificazione || '',
    garanzia: m.garanzia || '',
    tipoVetro: m.tipo_vetro || '',
    energiaTrasmessa: m.energia_trasmessa || '',
    energiaRiflessa: m.energia_riflessa || '',
    energiaAssorbita: m.energia_assorbita || '',
    vlt: m.vlt || '',
    vlrEsterno: m.vlr_esterno || '',
    vlrInterno: m.vlr_interno || '',
    riduzioneAbbaglio: m.riduzione_abbaglio || '',
    irRespinti: m.ir_respinti || '',
    uvTrasmessi: m.uv_trasmessi || '',
    energiaRespinta: m.energia_respinta || '',
    caratteristiche: m.caratteristiche ? m.caratteristiche.split('\n').filter(Boolean) : [],
  };
}

export async function fetchProdotti() {
  const data = await wpFetch('prodotto');
  if (!data) return null;
  return data.map(mapProdotto);
}

// ===== FOCUS TECNICI =====
function mapFocus(wp) {
  const m = wp.solaris_meta || wp.meta || {};
  return {
    slug: wp.slug,
    titolo: decodeHtml(wp.title.rendered),
    descrizione: wp.content?.rendered?.replace(/<[^>]*>/g, '').trim() || '',
    categoria: m.categoria || '',
    caratteristiche: m.caratteristiche ? m.caratteristiche.split('\n').filter(Boolean) : [],
  };
}

export async function fetchFocusTecnici() {
  const data = await wpFetch('focus_tecnico');
  if (!data) return null;
  return data.map(mapFocus);
}

// ===== PAGINE INFO =====
function mapPaginaInfo(wp) {
  return {
    slug: wp.slug,
    titolo: decodeHtml(wp.title.rendered),
    sottotitolo: '',
    contenuto: wp.content?.rendered?.replace(/<[^>]*>/g, '').split('\n').filter(Boolean) || [],
    htmlContent: wp.content?.rendered || '',
  };
}

export async function fetchPagineInfo() {
  const data = await wpFetch('pagina_info');
  if (!data) return null;
  return data.map(mapPaginaInfo);
}

// ===== SERVIZI LOCALI (Città) =====
function mapCitta(wp) {
  const m = wp.solaris_meta || wp.meta || {};
  return {
    slug: wp.slug,
    nome: m.nome_citta || decodeHtml(wp.title.rendered),
    regione: m.regione || '',
  };
}

export async function fetchCitta() {
  const data = await wpFetch('servizio_locale');
  if (!data) return null;
  return data.map(mapCitta);
}

// ===== SETTINGS =====
export async function fetchSettings() {
  const apiBase = getApiBase();
  if (!apiBase) return null;
  const cacheKey = 'settings';
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }
  try {
    const res = await fetch(`${apiBase}/solaris/v1/settings`);
    if (!res.ok) throw new Error(`Settings API error: ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, { data, time: Date.now() });
    return data;
  } catch (err) {
    console.warn('Settings API fallback:', err.message);
    return null;
  }
}
