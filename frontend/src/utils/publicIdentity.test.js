import {
  PUBLIC_SITE_ORIGIN,
  buildPublicIdentityUrl,
  isPublicSiteHost,
} from './publicIdentity';

describe('public identity URLs', () => {
  test('keeps canonical identity on the configured public origin', () => {
    expect(PUBLIC_SITE_ORIGIN).toBe('https://www.solarisfilms.it');
    expect(buildPublicIdentityUrl('/servizi/?area=sicurezza#details'))
      .toBe('https://www.solarisfilms.it/servizi/?area=sicurezza');
  });

  test('rebases a technical runtime URL without leaking its host', () => {
    expect(buildPublicIdentityUrl('https://wordpress-jc4e.srv1502079.hstgr.cloud/guida-tecnica/'))
      .toBe('https://www.solarisfilms.it/guida-tecnica/');
  });

  test('recognizes both public hostname variants only', () => {
    expect(isPublicSiteHost('www.solarisfilms.it')).toBe(true);
    expect(isPublicSiteHost('solarisfilms.it')).toBe(true);
    expect(isPublicSiteHost('wordpress-jc4e.srv1502079.hstgr.cloud')).toBe(false);
  });
});
