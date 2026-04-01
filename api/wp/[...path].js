export default async function handler(req, res) {
  const wpUrl = process.env.REACT_APP_WP_URL || process.env.WP_URL || '';
  if (!wpUrl) {
    return res.status(500).json({ error: 'WP_URL not configured' });
  }

  const wpPath = req.url.replace('/api/wp', '');
  const targetUrl = `${wpUrl}/wp-json${wpPath}`;

  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
