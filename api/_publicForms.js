const { Readable } = require('node:stream');

const DEFAULT_CRM_API_BASE = 'https://crm.solarisfilms.it/api';
const MAX_BODY_BYTES = 32 * 1024 * 1024;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_FILE_BYTES = 28 * 1024 * 1024;
const MAX_FILES = 10;

const TARGET_PATHS = Object.freeze({
  contact: '/public/forms/contact/plain',
  quote: '/public/forms/quote-request/plain',
});

const ALLOWED_FIELDS = new Set([
  'nome', 'cognome', 'ragione_sociale', 'citta', 'telefono', 'email',
  'superficie_mq', 'tipo_pellicola', 'richiesta', 'privacy_accettata',
  'first_name', 'last_name', 'company_name', 'city', 'phone',
  'surface_sqm', 'product_interest', 'request_notes', 'privacy_acceptance',
  'messaggio', 'form_code', 'source_page', 'source_site',
]);

const httpError = (status, message) => Object.assign(new Error(message), { status });

const sendJson = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
};

const normalizeFileName = (name) => (
  String(name || 'allegato')
    .split(/[\\/]/)
    .pop()
    .replace(/[\r\n"]/g, '_')
    .slice(0, 180) || 'allegato'
);

const isFileValue = (value) => (
  value
  && typeof value === 'object'
  && typeof value.name === 'string'
  && typeof value.size === 'number'
  && typeof value.arrayBuffer === 'function'
);

const isAcceptedPrivacy = (form) => {
  const value = form.get('privacy_acceptance') ?? form.get('privacy_accettata');
  return ['1', 'true', 'on', 'yes'].includes(String(value || '').toLowerCase());
};

async function* limitedRequestBody(req) {
  let totalBytes = 0;
  for await (const chunk of req) {
    totalBytes += Buffer.byteLength(chunk);
    if (totalBytes > MAX_BODY_BYTES) {
      throw httpError(413, 'Request body too large');
    }
    yield chunk;
  }
}

async function parsePublicForm(req) {
  const contentType = String(req.headers?.['content-type'] || '');
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
    throw httpError(415, 'Unsupported content type');
  }

  const contentLength = Number(req.headers?.['content-length'] || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw httpError(413, 'Request body too large');
  }

  const request = new Request('http://localhost/form', {
    method: 'POST',
    headers: { 'content-type': contentType },
    body: Readable.toWeb(Readable.from(limitedRequestBody(req))),
    duplex: 'half',
  });
  const incoming = await request.formData();
  const outgoing = new FormData();
  let fileCount = 0;
  let totalFileBytes = 0;

  for (const [rawKey, value] of incoming.entries()) {
    const key = rawKey === 'attachment_image[]' ? 'attachment_image' : rawKey;
    if (isFileValue(value)) {
      if (key !== 'attachment_image') continue;
      fileCount += 1;
      totalFileBytes += value.size;
      if (fileCount > MAX_FILES) throw httpError(413, 'Too many attachments');
      if (value.size > MAX_FILE_BYTES) throw httpError(413, 'Attachment too large');
      if (totalFileBytes > MAX_TOTAL_FILE_BYTES) throw httpError(413, 'Attachments too large');
      outgoing.append('attachment_image', value, normalizeFileName(value.name));
      continue;
    }
    if (ALLOWED_FIELDS.has(key)) {
      outgoing.append(key, String(value).slice(0, 100000));
    }
  }

  return outgoing;
}

async function proxyPublicForm(req, res, formType) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== 'POST' || !TARGET_PATHS[formType]) {
    sendJson(res, 405, { detail: 'Method not allowed' });
    return;
  }

  try {
    const form = await parsePublicForm(req);
    if (!isAcceptedPrivacy(form)) {
      sendJson(res, 422, { detail: 'Privacy non accettata' });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    let upstream;
    try {
      const base = String(process.env.CRM_PUBLIC_API_URL || DEFAULT_CRM_API_BASE).replace(/\/$/, '');
      upstream = await fetch(`${base}${TARGET_PATHS[formType]}`, {
        method: 'POST',
        headers: { 'X-Solaris-Source': 'headless-proxy' },
        body: form,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const responseBody = Buffer.from(await upstream.arrayBuffer());
    res.statusCode = upstream.status;
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(responseBody);
  } catch (error) {
    sendJson(res, error.status || 502, {
      detail: error.status ? error.message : 'Form temporarily unavailable',
    });
  }
}

module.exports = {
  parsePublicForm,
  proxyPublicForm,
};
