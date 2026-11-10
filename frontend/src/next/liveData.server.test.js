import {
  normalizeSeoIdentityMetadata,
  rebasePublicIdentityUrl,
} from './liveData.server';

describe('live mirror public identity metadata', () => {
  const publicOrigin = 'https://www.solarisfilms.it';

  test('rebases legacy Vercel and WordPress identities without touching external URLs', () => {
    expect(rebasePublicIdentityUrl(
      'https://solarisfilms.vercel.app/lo-sapevi-che/example/?ref=1#intro',
      publicOrigin
    )).toBe('https://www.solarisfilms.it/lo-sapevi-che/example/?ref=1#intro');

    expect(rebasePublicIdentityUrl(
      'https://wordpress-jc4e.srv1502079.hstgr.cloud/example/',
      publicOrigin
    )).toBe('https://www.solarisfilms.it/example/');

    expect(rebasePublicIdentityUrl('https://schema.org/Article', publicOrigin))
      .toBe('https://schema.org/Article');
  });

  test('normalizes canonical, Open Graph and Twitter identities together', () => {
    const source = {
      canonical: 'https://solarisfilms.vercel.app/old/',
      og: {
        'og:url': 'https://solarisfilms.vercel.app/old/',
        'og:image': 'https://cdn.example.com/image.webp',
      },
      twitter: {
        'twitter:url': 'https://solarisfilms.vercel.app/old/',
        'twitter:image': 'https://cdn.example.com/image.webp',
      },
    };

    expect(normalizeSeoIdentityMetadata(source, publicOrigin)).toEqual({
      canonical: 'https://www.solarisfilms.it/old/',
      og: {
        'og:url': 'https://www.solarisfilms.it/old/',
        'og:image': 'https://cdn.example.com/image.webp',
      },
      twitter: {
        'twitter:url': 'https://www.solarisfilms.it/old/',
        'twitter:image': 'https://cdn.example.com/image.webp',
      },
    });
  });
});
