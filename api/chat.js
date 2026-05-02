const crypto = require('crypto');
const {
  createChatResponse,
  fetchKnowledgeContext,
  handleOptions,
  readJson,
  sendJson,
} = require('./_chatbot');

module.exports = async function handler(req, res) {
  if (handleOptions(req, res)) return;
  if (req.method !== 'POST') {
    return sendJson(req, res, 405, { detail: 'Method not allowed' });
  }

  try {
    const body = await readJson(req);
    const message = String(body.message || '').trim();

    if (!message) {
      return sendJson(req, res, 422, { detail: 'Message is required' });
    }

    const sessionId = body.session_id || crypto.randomUUID();
    const knowledge = await fetchKnowledgeContext({
      message,
      pagePath: body.page_path || body.source_url || '',
    });

    return sendJson(req, res, 200, {
      response: createChatResponse(message, knowledge),
      session_id: sessionId,
      sources: (knowledge.sources || []).map((source) => ({
        title: source.title,
        source_type: source.source_type,
        origin_url: source.origin_url,
        score: source.score,
      })),
      knowledge_status: knowledge.status,
    });
  } catch (error) {
    return sendJson(req, res, 500, {
      detail: 'Chat temporarily unavailable',
      error: error.message,
    });
  }
};
