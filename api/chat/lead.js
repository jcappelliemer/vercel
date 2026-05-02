const crypto = require('crypto');
const {
  buildCrmPayload,
  handleOptions,
  readJson,
  sendCrmLead,
  sendJson,
} = require('../_chatbot');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') {
    return sendJson(req, res, 405, { detail: 'Method not allowed' });
  }

  try {
    const body = await readJson(req);
    const hasContact = String(body.email || '').trim() || String(body.telefono || '').trim();

    if (!body.privacy_accettata) {
      return sendJson(req, res, 422, { detail: 'Privacy non accettata' });
    }

    if (!String(body.nome || '').trim()) {
      return sendJson(req, res, 422, { detail: 'Nome obbligatorio' });
    }

    if (!hasContact) {
      return sendJson(req, res, 422, { detail: 'Inserisci almeno email o telefono' });
    }

    const leadId = crypto.randomUUID();
    const payload = buildCrmPayload(body, leadId);
    const crmResult = await sendCrmLead(payload, 'chatbot');

    return sendJson(req, res, 200, {
      id: leadId,
      status: 'created',
      crm_status: crmResult.status || 'unknown',
      session_id: body.session_id || null,
    });
  } catch (error) {
    return sendJson(req, res, 500, {
      detail: 'Lead temporarily unavailable',
      error: error.message,
    });
  }
};
