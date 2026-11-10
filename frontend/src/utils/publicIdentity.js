const DEFAULT_PUBLIC_SITE_ORIGIN = 'https://www.solarisfilms.it';

export const PUBLIC_SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN
  || process.env.REACT_APP_SITE_ORIGIN
  || process.env.SITE_ORIGIN
  || DEFAULT_PUBLIC_SITE_ORIGIN
).replace(/\/+$/, '');

const normalizeHostname = (hostname = '') => String(hostname)
  .trim()
  .toLocaleLowerCase('en')
  .replace(/^www\./, '');

const PUBLIC_SITE_HOSTNAME = normalizeHostname(new URL(PUBLIC_SITE_ORIGIN).hostname);

export const isPublicSiteHost = (hostname) => (
  normalizeHostname(hostname) === PUBLIC_SITE_HOSTNAME
);

export const buildPublicIdentityUrl = (path = '/') => {
  const rawPath = String(path || '/').trim() || '/';
  let parsed;

  try {
    parsed = new URL(rawPath, `${PUBLIC_SITE_ORIGIN}/`);
  } catch {
    parsed = new URL('/', `${PUBLIC_SITE_ORIGIN}/`);
  }

  return new URL(`${parsed.pathname || '/'}${parsed.search || ''}`, `${PUBLIC_SITE_ORIGIN}/`).toString();
};
