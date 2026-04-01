/**
 * Pre-build script: Fetches all WordPress data and saves as static JSON
 * This runs during `yarn build` on Vercel, where HTTP requests are allowed
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const WP_URL = process.env.REACT_APP_WP_URL || '';

if (!WP_URL) {
  console.log('No REACT_APP_WP_URL set, skipping WP data fetch');
  process.exit(0);
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`Invalid JSON from ${url}`)); }
      });
    }).on('error', reject);
  });
}

async function main() {
  const outputDir = path.join(__dirname, 'public', 'wp-data');
  fs.mkdirSync(outputDir, { recursive: true });

  const endpoints = {
    'settings': `${WP_URL}/wp-json/solaris/v1/settings`,
    'prodotti': `${WP_URL}/wp-json/wp/v2/prodotto?per_page=100`,
    'focus-tecnici': `${WP_URL}/wp-json/wp/v2/focus_tecnico?per_page=100`,
    'pagine-info': `${WP_URL}/wp-json/wp/v2/pagina_info?per_page=100`,
    'servizi-locali': `${WP_URL}/wp-json/wp/v2/servizio_locale?per_page=100`,
  };

  for (const [name, url] of Object.entries(endpoints)) {
    try {
      console.log(`Fetching ${name} from ${url}...`);
      const data = await fetchJson(url);
      const filePath = path.join(outputDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data));
      console.log(`  -> Saved ${name}.json (${Array.isArray(data) ? data.length + ' items' : 'object'})`);
    } catch (err) {
      console.warn(`  -> FAILED ${name}: ${err.message}`);
      // Write empty fallback
      const filePath = path.join(outputDir, `${name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(null));
    }
  }

  console.log('WP data fetch complete!');
}

main().catch(err => {
  console.error('WP fetch script error:', err);
  process.exit(0); // Don't fail the build
});
