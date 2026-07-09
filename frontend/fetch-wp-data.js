/**
 * Pre-build script: Fetches all WordPress data and saves as static JSON.
 * Also downloads images referenced in settings to avoid mixed content issues.
 * This runs during `yarn build` on Vercel, where HTTP requests are allowed.
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

const DEFAULT_WP_URL = 'https://wordpress-jc4e.srv1502079.hstgr.cloud';
const WP_URL = (process.env.REACT_APP_WP_URL || process.env.WP_URL || DEFAULT_WP_URL).replace(/\/$/, '');
const FETCH_TIMEOUT_MS = Number(process.env.WP_FETCH_TIMEOUT_MS || 3000);
const BLOCKED_SOLARIS_DATA_RE = /\bNT\s*20\b|\bNT\s*35\b|\bserie\s*NT\b|tecnosolar|fotocromatic|cromia|llms-txt|zoho-callback|false-parent/i;
const FRESH_WP_HEADERS = {
  'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

if (!WP_URL || process.env.SKIP_WP_FETCH === '1') {
  console.log('WP data fetch skipped');
  process.exit(0);
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: FRESH_WP_HEADERS }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error(`Invalid JSON from ${url}`)); }
      });
    }).on('error', reject);
    req.setTimeout(FETCH_TIMEOUT_MS, () => {
      req.destroy(new Error(`Timeout after ${FETCH_TIMEOUT_MS}ms for ${url}`));
    });
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(destPath);
    const req = client.get(url, { headers: FRESH_WP_HEADERS }, (res) => {
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
    req.setTimeout(FETCH_TIMEOUT_MS, () => {
      req.destroy(new Error(`Timeout after ${FETCH_TIMEOUT_MS}ms for ${url}`));
    });
  });
}

/**
 * Download an image from a URL and return the local path.
 * Returns the original URL if download fails.
 */
async function localizeImage(imageUrl, imagesDir, prefix) {
  if (!imageUrl || imageUrl.trim() === '') return '';

  let tempPath = '';
  try {
    const parsed = new URL(imageUrl);
    const ext = path.extname(parsed.pathname) || '.jpg';
    tempPath = path.join(imagesDir, `${prefix}.tmp${ext}`);

    console.log(`  Downloading image: ${imageUrl} -> ${path.basename(tempPath)}`);
    await downloadFile(imageUrl, tempPath);

    const hash = crypto.createHash('sha1').update(fs.readFileSync(tempPath)).digest('hex').slice(0, 10);
    const filename = `${prefix}-${hash}${ext}`;
    const destPath = path.join(imagesDir, filename);
    if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    fs.renameSync(tempPath, destPath);
    return `/wp-data/images/${filename}`;
  } catch (err) {
    if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
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
    'headless-seo': `${WP_URL}/wp-json/solaris/v1/seo-map`,
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
      const existingPath = path.join(outputDir, `${name}.json`);
      if (fs.existsSync(existingPath)) {
        try {
          fetchedData[name] = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
          console.warn(`  -> Using existing ${name}.json fallback`);
        } catch {
          fetchedData[name] = null;
        }
      } else {
        fetchedData[name] = null;
      }
    }
  }

  if (Array.isArray(fetchedData.prodotti)) {
    fetchedData.prodotti = fetchedData.prodotti.filter((item) => {
      const searchable = JSON.stringify({
        slug: item?.slug,
        title: item?.title,
        content: item?.content,
        excerpt: item?.excerpt,
        meta: item?.solaris_meta,
      });
      return !BLOCKED_SOLARIS_DATA_RE.test(searchable);
    });
  }

  if (Array.isArray(fetchedData['headless-seo'])) {
    fetchedData['headless-seo'] = fetchedData['headless-seo'].filter((item) => {
      const searchable = JSON.stringify({
        slug: item?.slug,
        path: item?.path,
        canonical: item?.canonical,
        title: item?.title,
        description: item?.description,
      });
      return !BLOCKED_SOLARIS_DATA_RE.test(searchable);
    });
  } else if (fetchedData['headless-seo'] && Array.isArray(fetchedData['headless-seo'].items)) {
    fetchedData['headless-seo'].items = fetchedData['headless-seo'].items.filter((item) => {
      const searchable = JSON.stringify({
        slug: item?.slug,
        path: item?.path,
        canonical: item?.canonical,
        title: item?.title,
        description: item?.description,
      });
      return !BLOCKED_SOLARIS_DATA_RE.test(searchable);
    });
    fetchedData['headless-seo'].count = fetchedData['headless-seo'].items.length;
  }

  // 2. Download and localize images from settings
  const settings = fetchedData['settings'];
  if (settings && typeof settings === 'object') {
    settings.stat1_value = '30+';
    settings.stat2_value = '+45k';
    settings.whatsapp = '3926578067';
    settings.footer_text = 'Distributore esclusivo MADICO USA per l\'Italia. 30+ anni di esperienza, +45k edifici trattati.';

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
