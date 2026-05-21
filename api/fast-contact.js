module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ detail: 'Method not allowed' }));
    return;
  }

  const toRaw = String((req.query && req.query.to) || '393925466518');
  const textRaw = String((req.query && req.query.text) || '');
  const to = toRaw.replace(/\D/g, '') || '393925466518';
  const text = textRaw ? `?text=${encodeURIComponent(textRaw)}` : '';
  const destination = `https://wa.me/${to}${text}`;

  res.statusCode = 302;
  res.setHeader('Location', destination);
  res.end();
};
