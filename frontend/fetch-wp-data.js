/**
 * Pre-build script: Fetches all WordPress data and saves as static JSON.
 * Also downloads images referenced in settings to avoid mixed content issues.
 * This runs during `yarn build` on Vercel, where HTTP requests are allowed.
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

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

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

/**
 * Download an image from a URL and return the local path.
 * Returns the original URL if download fails.
 */
async function localizeImage(imageUrl, imagesDir, prefix) {
  if (!imageUrl || imageUrl.trim() === '') return '';

  try {
    const parsed = new URL(imageUrl);
    const ext = path.extname(parsed.pathname) || '.jpg';
    const filename = `${prefix}${ext}`;
    const destPath = path.join(imagesDir, filename);

    console.log(`  Downloading image: ${imageUrl} -> ${filename}`);
    await downloadFile(imageUrl, destPath);
    return `/wp-data/images/${filename}`;
  } catch (err) {
    console.warn(`  Failed to download image ${imageUrl}: ${err.message}`);
    return imageUrl; // fallback to original URL
  }
}

async function main() {
  const outputDir = path.join(__dirname, 'public', 'wp-data');
  const imagesDir = path.join(outputDir, 'images');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });

  // 1. Fetch all endpoints
  const endpoints = {
    'settings': `${WP_URL}/wp-json/solaris/v1/settings`,
    'prodotti': `${WP_URL}/wp-json/wp/v2/prodotto?per_page=100`,
    'focus-tecnici': `${WP_URL}/wp-json/wp/v2/focus_tecnico?per_page=100`,
    'pagine-info': `${WP_URL}/wp-json/wp/v2/pagina_info?per_page=100`,
    'servizi-locali': `${WP_URL}/wp-json/wp/v2/servizio_locale?per_page=100`,
  };

  const fetchedData = {};
  for (const [name, url] of Object.entries(endpoints)) {
    try {
      console.log(`Fetching ${name} from ${url}...`);
      const data = await fetchJson(url);
      fetchedData[name] = data;
      console.log(`  -> Fetched ${name} (${Array.isArray(data) ? data.length + ' items' : 'object'})`);
    } catch (err) {
      console.warn(`  -> FAILED ${name}: ${err.message}`);
      fetchedData[name] = null;
    }
  }

  // 2. Download and localize images from settings
  const settings = fetchedData['settings'];
  if (settings && typeof settings === 'object') {
    console.log('\nLocalizing settings images...');

    // Hero image
    if (settings.hero_image) {
      settings.hero_image = await localizeImage(settings.hero_image, imagesDir, 'hero');
    }

    // Logo
    if (settings.logo_url) {
      settings.logo_url = await localizeImage(settings.logo_url, imagesDir, 'logo');
    }

    // Case studies images
    if (settings.case_studies && Array.isArray(settings.case_studies)) {
      for (let i = 0; i < settings.case_studies.length; i++) {
        if (settings.case_studies[i].image) {
          settings.case_studies[i].image = await localizeImage(
            settings.case_studies[i].image, imagesDir, `cs-${i + 1}`
          );
        }
      }
    }

    // Gallery images
    if (settings.gallery_items && Array.isArray(settings.gallery_items)) {
      for (let i = 0; i < settings.gallery_items.length; i++) {
        if (settings.gallery_items[i].image) {
          settings.gallery_items[i].image = await localizeImage(
            settings.gallery_items[i].image, imagesDir, `gal-${i + 1}`
          );
        }
      }
    }

    // Reference logos
    if (settings.references && Array.isArray(settings.references)) {
      for (let i = 0; i < settings.references.length; i++) {
        if (settings.references[i].logo) {
          settings.references[i].logo = await localizeImage(
            settings.references[i].logo, imagesDir, `ref-${i + 1}`
          );
        }
      }
    }
  }

  // 3. Write all JSON files
  console.log('\nWriting JSON files...');
  for (const [name, data] of Object.entries(fetchedData)) {
    const filePath = path.join(outputDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log(`  -> Saved ${name}.json`);
  }

  console.log('\nWP data fetch complete!');
}

main().catch(err => {
  console.error('WP fetch script error:', err);
  process.exit(0); // Don't fail the build
});
