const crypto = require('crypto');
const {
  buildWhatsAppCrmPayload,
  handleOptions,
  readJson,
  sendCrmLead,
  sendJson,
} = require('../_chatbot');

function clean(value) {
  return String(value || '').trim();
}

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') {
    return sendJson(req, res, 405, { detail: 'Method not allowed' });
  }

  const webhookKey = clean(process.env.WHATSAPP_WEBHOOK_KEY);
  if (webhookKey && clean(req.headers['x-solaris-key']) !== webhookKey) {
    return sendJson(req, res, 401, { detail: 'Invalid webhook key' });
  }

  try {
    const body = await readJson(req);
    const phone = clean(body.telefono || body.phone || body.from || body.wa_phone);
    const message = clean(body.messaggio || body.message || body.text || body.body);

    if (!phone && !message && !clean(body.email)) {
      return sendJson(req, res, 422, { detail: 'Inserisci almeno telefono, email o messaggio WhatsApp' });
    }

    const leadId = crypto.randomUUID();
    const payload = buildWhatsAppCrmPayload(body, leadId);
    const crmResult = await sendCrmLead(payload, 'whatsapp');

    return sendJson(req, res, 200, {
      id: leadId,
      status: 'created',
      crm_status: crmResult.status || 'unknown',
    });
  } catch (error) {
    return sendJson(req, res, 500, {
      detail: 'WhatsApp lead temporarily unavailable',
      error: error.message,
    });
  }
};
