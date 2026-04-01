import http from 'http';
import https from 'https';
import { URL } from 'url';

export default async function handler(req, res) {
  const wpUrl = process.env.REACT_APP_WP_URL || process.env.WP_URL || '';
  if (!wpUrl) {
    return res.status(500).json({ error: 'WP_URL not configured' });
  }

  // Extract path after /api/wp
  const wpPath = req.url.replace(/^\/api\/wp/, '') || '/';
  const targetUrl = `${wpUrl}/wp-json${wpPath}`;

  try {
    const data = await new Promise((resolve, reject) => {
      const parsedUrl = new URL(targetUrl);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      
      client.get(targetUrl, (response) => {
        let body = '';
        response.on('data', chunk => body += chunk);
        response.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error('Invalid JSON from WP'));
          }
        });
      }).on('error', reject);
    });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: err.message, target: targetUrl });
  }
}
