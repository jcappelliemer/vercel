const normalizePhone = (value = '') => String(value).replace(/[^\d]/g, '');

export default function handler(req, res) {
  const phone = normalizePhone(req.query.to || '3925466518');
  const rawText = req.query.text || req.query['amp;text'] || '';
  const text = Array.isArray(rawText) ? rawText[0] : rawText;
  const params = text ? `?text=${encodeURIComponent(text)}` : '';

  res.writeHead(302, {
    Location: `https://wa.me/${phone}${params}`,
    'Cache-Control': 'no-store',
  });
  res.end();
}
