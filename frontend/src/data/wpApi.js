/**
 * WordPress Headless API Service
 * - In production (Vercel): reads pre-fetched static JSON from /wp-data/
 * - In development: fetches directly from WP REST API
 */

const DEFAULT_WP_URL = 'https://wordpress-jc4e.srv1502079.hstgr.cloud';
const WP_URL = (process.env.REACT_APP_WP_URL || DEFAULT_WP_URL).replace(/\/$/, '');
const IS_PROD = typeof window !== 'undefined' && window.location.protocol === 'https:';

const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

async function fetchStaticJson(filename) {
  const cacheKey = `static_${filename}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;

  try {
    const res = await fetch(`/wp-data/${filename}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    cache.set(cacheKey, { data, time: Date.now() });
    return data;
  } catch {
    return null;
  }
}

async function wpFetch(endpoint, params = {}) {
  if (!WP_URL && !IS_PROD) return null;

  // On production, use pre-fetched static JSON
  if (IS_PROD) {
    const nameMap = {
      'prodotto': 'prodotti',
      'focus_tecnico': 'focus-tecnici',
      'pagina_info': 'pagine-info',
      'servizio_locale': 'servizi-locali',
    };
    const staticName = nameMap[endpoint];
    if (staticName) return fetchStaticJson(staticName);
  }

  // In development, fetch directly from WP
  const query = new URLSearchParams({ per_page: 100, ...params }).toString();
  const url = `${WP_URL}/wp-json/wp/v2/${endpoint}?${query}`;
  const cacheKey = url;

  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;

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

// ===== SERVIZI LOCALI =====
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
  if (IS_PROD) {
    return fetchStaticJson('settings');
  }
  const cacheKey = 'settings';
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) return cached.data;
  try {
    const res = await fetch(`${WP_URL}/wp-json/solaris/v1/settings`);
    if (!res.ok) throw new Error(`Settings API error: ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, { data, time: Date.now() });
    return data;
  } catch (err) {
    console.warn('Settings API fallback:', err.message);
    return null;
  }
}
