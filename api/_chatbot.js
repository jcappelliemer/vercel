const DEFAULT_CRM_WEBHOOK_URL = 'https://crm.solarisfilms.it/api/webhook/wordpress-lead';
const DEFAULT_CRM_KNOWLEDGE_SEARCH_URL = 'https://crm.solarisfilms.it/api/public/chatbot/knowledge/search';

const HIGH_PRIORITY_TERMS = [
  'safety',
  'shield',
  'anti-esplosione',
  'antiesplosione',
  'blast',
  'sicurezza',
  'antisfondamento',
  'intrusione',
  'urgente',
];

const MEDIUM_PRIORITY_TERMS = [
  'preventivo',
  'consulenza',
  'sopralluogo',
  'azienda',
  'ufficio',
  'mq',
  'metri',
  'caldo',
  'antisolare',
];

const ALLOWED_ORIGINS = [
  'https://solarisfilms.vercel.app',
  'https://solarisfilms.it',
  'https://www.solarisfilms.it',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:64349',
];

function setCors(req, res) {
  const origin = req.headers.origin;
  if (!origin) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Solaris-Source, X-Solaris-Key');
}

function handleOptions(req, res) {
  setCors(req, res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? JSON.parse(raw) : {};
}

function sendJson(req, res, status, body) {
  setCors(req, res);
  res.status(status).json(body);
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeForSearch(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function buildPriority(data) {
  const transcript = Array.isArray(data.transcript) ? data.transcript : [];
  const searchable = [
    data.interesse,
    data.messaggio,
    data.page_path,
    ...transcript.map((item) => item?.text || item?.content || ''),
  ].join(' ').toLowerCase();

  if (HIGH_PRIORITY_TERMS.some((term) => searchable.includes(term))) return 'alta';
  if (MEDIUM_PRIORITY_TERMS.some((term) => searchable.includes(term))) return 'media';
  return 'standard';
}

function formatUtm(utm) {
  if (!utm || typeof utm !== 'object') return '';
  return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    .map((key) => {
      const value = normalizeText(utm[key]);
      return value ? `${key}=${value}` : '';
    })
    .filter(Boolean)
    .join(', ');
}

function formatTranscript(transcript) {
  if (!Array.isArray(transcript)) return '';
  return transcript.slice(-12).map((item) => {
    const role = item?.type === 'user' ? 'Cliente' : 'Assistente';
    const text = normalizeText(item?.text || item?.content);
    return text ? `${role}: ${text}` : '';
  }).filter(Boolean).join('\n');
}

function resolveSourceSite(data) {
  const explicit = normalizeText(data.source_site);
  if (explicit) return explicit;

  const sourceUrl = normalizeText(data.source_url || data.source_page);
  if (sourceUrl) {
    try {
      return new URL(sourceUrl).hostname || 'solarisfilms.it';
    } catch {
      return sourceUrl.replace(/^https?:\/\//, '').split('/')[0] || 'solarisfilms.it';
    }
  }

  return 'solarisfilms.it';
}

function buildCrmPayload(data, leadId) {
  const name = [data.nome, data.cognome].map(normalizeText).filter(Boolean).join(' ')
    || normalizeText(data.email)
    || normalizeText(data.telefono)
    || 'Lead chatbot Solaris';
  const priority = data.priority || buildPriority(data);
  const utmText = formatUtm(data.utm);
  const transcript = formatTranscript(data.transcript);

  const messageParts = [
    'Lead generato dal chatbot Solaris Films.',
    `Priorita: ${priority}`,
    `Interesse: ${normalizeText(data.interesse) || 'Non specificato'}`,
    `Citta: ${normalizeText(data.citta) || 'Non specificata'}`,
    `Pagina: ${normalizeText(data.page_path) || 'Non disponibile'}`,
    `URL completo: ${normalizeText(data.source_url) || 'Non disponibile'}`,
    `Referrer: ${normalizeText(data.referrer) || 'Non disponibile'}`,
    `Sessione chat: ${normalizeText(data.session_id) || 'Non disponibile'}`,
    `ID lead staging: ${leadId}`,
  ];

  if (utmText) messageParts.push(`Campagna: ${utmText}`);
  if (normalizeText(data.messaggio)) messageParts.push('', 'Messaggio cliente:', normalizeText(data.messaggio));
  if (transcript) messageParts.push('', 'Ultimi messaggi chat:', transcript);

  return {
    name,
    email: normalizeText(data.email),
    phone: normalizeText(data.telefono),
    company: normalizeText(data.ragione_sociale),
    message: messageParts.join('\n').trim(),
    source: 'chatbot',
    product_interest: normalizeText(data.interesse),
    source_page: normalizeText(data.source_url) || normalizeText(data.page_path),
    source_site: resolveSourceSite(data),
    priority,
  };
}

function buildWhatsAppCrmPayload(data, leadId) {
  const phone = normalizeText(data.telefono || data.phone || data.from || data.wa_phone);
  const name = normalizeText(data.nome || data.name || data.contact_name)
    || phone
    || 'Lead WhatsApp Solaris';
  const message = normalizeText(data.messaggio || data.message || data.text || data.body);
  const interest = normalizeText(data.interesse || data.product_interest) || 'WhatsApp';
  const sourcePage = normalizeText(data.source_url || data.source_page || data.page_path);
  const priority = data.priority || buildPriority({
    ...data,
    interesse: interest,
    messaggio: message,
  });

  const messageParts = [
    'Lead generato da WhatsApp Solaris Films.',
    'Canale: WhatsApp',
    `Priorita: ${priority}`,
    `Interesse: ${interest || 'Non specificato'}`,
    `Telefono WhatsApp: ${phone || 'Non disponibile'}`,
    `Pagina: ${sourcePage || 'Non disponibile'}`,
    `ID lead staging: ${leadId}`,
  ];

  if (message) messageParts.push('', 'Messaggio WhatsApp:', message);

  return {
    name,
    email: normalizeText(data.email),
    phone,
    company: normalizeText(data.ragione_sociale || data.company),
    message: messageParts.join('\n').trim(),
    source: 'whatsapp',
    product_interest: interest,
    source_page: sourcePage,
    source_site: resolveSourceSite(data),
    priority,
  };
}

async function sendCrmLead(payload, source = 'chatbot') {
  if (String(process.env.CRM_WEBHOOK_ENABLED || 'true').toLowerCase() === 'false') {
    return { status: 'disabled', ok: false };
  }

  const webhookUrl = normalizeText(process.env.CRM_WEBHOOK_URL) || DEFAULT_CRM_WEBHOOK_URL;
  const headers = {
    'Content-Type': 'application/json',
    'X-Solaris-Source': source,
  };
  const webhookKey = normalizeText(process.env.CRM_WEBHOOK_KEY);
  if (webhookKey) headers['X-Solaris-Key'] = webhookKey;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { status: 'sent', ok: true, status_code: response.status };
    }

    const errorText = (await response.text()).slice(0, 500);
    return { status: 'error', ok: false, status_code: response.status, error: errorText };
  } catch (error) {
    return { status: 'error', ok: false, error: error.message };
  }
}

async function fetchKnowledgeContext({ message, pagePath }) {
  const searchUrl = normalizeText(process.env.CRM_KNOWLEDGE_SEARCH_URL) || DEFAULT_CRM_KNOWLEDGE_SEARCH_URL;
  const webhookKey = normalizeText(process.env.CRM_WEBHOOK_KEY);
  const headers = {
    'Content-Type': 'application/json',
    'X-Solaris-Source': 'chatbot',
  };
  if (webhookKey) headers['X-Solaris-Key'] = webhookKey;

  try {
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        page_path: pagePath || '',
        limit: 4,
      }),
    });
    if (!response.ok) {
      return { sources: [], status: 'error', status_code: response.status };
    }
    const data = await response.json();
    return {
      sources: Array.isArray(data.sources) ? data.sources : [],
      tokens: Array.isArray(data.tokens) ? data.tokens : [],
      status: 'ok',
    };
  } catch (error) {
    return { sources: [], status: 'error', error: error.message };
  }
}

function relevantHighlight(source, tokens) {
  const snippet = normalizeText(source?.snippet);
  if (!snippet) return '';
  const sentences = snippet
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 35 && item.length <= 220);
  const normalizedTokens = (tokens || []).map(normalizeForSearch);
  const scored = sentences.map((sentence) => {
    const normalized = normalizeForSearch(sentence);
    const score = normalizedTokens.reduce((sum, token) => sum + (token && normalized.includes(token) ? 1 : 0), 0);
    return { sentence, score };
  }).filter((item) => item.score > 0);
  return (scored.sort((a, b) => b.score - a.score)[0]?.sentence || sentences[0] || '').replace(/^\.{3}/, '');
}

function sourceTypeLabel(value) {
  return {
    solaris: 'Solaris',
    internal: 'Solaris',
    producer: 'produttore',
    regulation: 'normativa',
    sector: 'settore',
    competitor: 'settore',
  }[value] || 'fonte';
}

function buildKnowledgeResponse(message, knowledge = {}) {
  const sources = Array.isArray(knowledge.sources) ? knowledge.sources : [];
  if (!sources.length) return '';

  const text = normalizeForSearch(message);
  const top = sources[0];
  const highlights = sources
    .map((source) => relevantHighlight(source, knowledge.tokens))
    .filter(Boolean)
    .slice(0, 2);
  const references = sources
    .slice(0, 3)
    .map((source) => `${source.title} (${sourceTypeLabel(source.source_type)})`)
    .join(', ');

  let opener = 'Ho trovato informazioni nella knowledge base Solaris.';
  if (text.includes('safety') || text.includes('sicurezza') || text.includes('antisfondamento') || text.includes('anti esplosione') || text.includes('antiesplosione')) {
    opener = 'Per una richiesta di sicurezza o Safety Shield partirei da obiettivo, tipo di vetro e livello di rischio.';
  } else if (text.includes('caldo') || text.includes('sole') || text.includes('antisolare') || text.includes('abbagliamento')) {
    opener = 'Per caldo, sole e abbagliamento la scelta va fatta su esposizione, superficie vetrata e trasparenza desiderata.';
  } else if (text.includes('privacy') || text.includes('decor') || text.includes('satin') || text.includes('opaca')) {
    opener = 'Per privacy e resa estetica conviene distinguere tra schermatura visiva, decorazione e luminosita da mantenere.';
  } else if (text.includes('prezzo') || text.includes('preventivo') || text.includes('costo') || text.includes('mq')) {
    opener = 'Per stimare correttamente un preventivo servono metri quadri, citta, foto delle vetrate e obiettivo tecnico.';
  } else if (normalizeForSearch(top?.title).includes('madico') || text.includes('madico')) {
    opener = 'Per i prodotti Madico conviene partire dalla esigenza applicativa e poi scegliere la famiglia tecnica corretta.';
  }

  const body = highlights.length
    ? `Dalle fonti attive risulta questo: ${highlights.join(' ')}`
    : 'Posso orientarti sulle famiglie di pellicole e poi passare la richiesta al team tecnico per una verifica puntuale.';

  return `${opener} ${body}\n\nRiferimenti usati: ${references}.\n\nSe mi lasci citta, metri quadri indicativi e una foto o descrizione delle vetrate, passo la richiesta al team Solaris con il contesto della chat.`;
}

function createChatResponse(message, knowledge = {}) {
  const knowledgeResponse = buildKnowledgeResponse(message, knowledge);
  if (knowledgeResponse) return knowledgeResponse;

  const text = normalizeForSearch(message);

  if (text.includes('safety') || text.includes('sicurezza') || text.includes('antisfondamento') || text.includes('blindat')) {
    return 'Per sicurezza e protezione delle vetrate valuterei le soluzioni Safety Shield: servono a trattenere i frammenti e aumentare la resistenza del vetro. Per consigliarti bene mi servono tipo di vetro, dimensioni e obiettivo: antieffrazione, anti-infortunio o protezione da esplosione.';
  }

  if (text.includes('caldo') || text.includes('sole') || text.includes('antisolare') || text.includes('abbagliamento')) {
    return 'Per caldo e abbagliamento la famiglia corretta e quella delle pellicole antisolari. La scelta dipende da esposizione, dimensione delle vetrate e livello di trasparenza desiderato. Se mi lasci i dati dal modulo posso far preparare una consulenza mirata.';
  }

  if (text.includes('privacy') || text.includes('decor') || text.includes('satin') || text.includes('opaca')) {
    return "Per privacy e resa estetica si lavora con pellicole decorative, satinate o schermanti. Possiamo mantenere luminosita e ridurre la visibilita dall'esterno, scegliendo finitura e grado di copertura in base agli ambienti.";
  }

  if (text.includes('preventivo') || text.includes('prezzo') || text.includes('costo') || text.includes('mq')) {
    return 'Per un preventivo servono pochi dati: citta, metri quadri indicativi, tipo di esigenza e qualche foto delle vetrate. Puoi lasciare nome, email o telefono qui nel chatbot e il team Solaris ti ricontatta.';
  }

  if (text.includes('madico')) {
    return 'Solaris Films distribuisce soluzioni MADICO USA in Italia. Per scegliere il prodotto giusto conviene partire dall’esigenza: controllo solare, sicurezza, privacy o riqualificazione energetica.';
  }

  return 'Posso aiutarti a orientarti tra pellicole antisolari, Safety Shield, privacy/decorative e consulenza tecnica. Dimmi che problema vuoi risolvere, oppure lascia i dati nel modulo del chatbot per far gestire la richiesta al team Solaris.';
}

module.exports = {
  buildCrmPayload,
  buildWhatsAppCrmPayload,
  createChatResponse,
  fetchKnowledgeContext,
  handleOptions,
  readJson,
  sendCrmLead,
  sendJson,
};
