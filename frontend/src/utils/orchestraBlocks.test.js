import {
  applyOrchestraIntroRewrite,
  normalizeOrchestraIntroText,
  rewriteOrchestraHtmlIdentityUrls,
} from './orchestraBlocks';

describe('Orchestra managed HTML identity', () => {
  test('rebases only absolute links owned by the WordPress source', () => {
    const html = [
      '<a href="https://wordpress-jc4e.srv1502079.hstgr.cloud/servizi/?ref=1#film">Servizi</a>',
      '<a href="/contatti/">Contatti</a>',
      '<a href="https://example.com/partner/">Partner</a>',
    ].join('');

    expect(rewriteOrchestraHtmlIdentityUrls(
      html,
      'https://wordpress-jc4e.srv1502079.hstgr.cloud',
      'https://www.solarisfilms.it'
    )).toBe([
      '<a href="https://www.solarisfilms.it/servizi/?ref=1#film">Servizi</a>',
      '<a href="/contatti/">Contatti</a>',
      '<a href="https://example.com/partner/">Partner</a>',
    ].join(''));
  });

  test('fails closed when the source or target identity is unavailable', () => {
    const html = '<a href="https://wordpress-jc4e.srv1502079.hstgr.cloud/servizi/">Servizi</a>';
    expect(rewriteOrchestraHtmlIdentityUrls(html, '', 'https://www.solarisfilms.it')).toBe(html);
    expect(rewriteOrchestraHtmlIdentityUrls(html, 'https://wordpress-jc4e.srv1502079.hstgr.cloud', '')).toBe(html);
  });
});

describe('Orchestra REWRITE_INTRO bridge', () => {
  const before = 'Questa è un’introduzione sufficientemente lunga per descrivere il servizio e il suo obiettivo tecnico.';
  const after = 'Questa introduzione chiarisce subito il beneficio tecnico, il contesto di utilizzo e il risultato atteso.';

  test('replaces only the exact first substantial paragraph without mutating the mirror', () => {
    const page = {
      contentBlocks: [
        { type: 'paragraph', html: 'Nota breve.', text: 'Nota breve.' },
        { type: 'paragraph', html: 'Questa &egrave; un&rsquo;introduzione sufficientemente lunga per descrivere il servizio e il suo obiettivo tecnico.' },
        { type: 'paragraph', html: before },
      ],
    };

    const result = applyOrchestraIntroRewrite(page, {
      before_html: before,
      after_html: `<strong>${after}</strong>`,
    });

    expect(result).not.toBe(page);
    expect(result.contentBlocks).not.toBe(page.contentBlocks);
    expect(result.contentBlocks[0]).toBe(page.contentBlocks[0]);
    expect(result.contentBlocks[1].html).toBe(`<strong>${after}</strong>`);
    expect(result.contentBlocks[1].orchestraManagedAction).toBe('REWRITE_INTRO');
    expect(result.contentBlocks[2]).toBe(page.contentBlocks[2]);
    expect(page.contentBlocks[1].orchestraManagedAction).toBeUndefined();
  });

  test('fails closed when the committed first paragraph has drifted', () => {
    const page = {
      contentBlocks: [{
        type: 'paragraph',
        html: 'Il mirror contiene ormai una introduzione diversa, sufficientemente lunga e aggiornata dal team editoriale.',
      }],
    };

    expect(applyOrchestraIntroRewrite(page, {
      before_html: before,
      after_html: after,
    })).toBe(page);
  });

  test('normalizes entities, typography and whitespace but rejects a no-op', () => {
    expect(normalizeOrchestraIntroText('Questa&nbsp;è un’introduzione'))
      .toBe("Questa è un'introduzione");

    const page = { contentBlocks: [{ type: 'paragraph', html: before }] };
    expect(applyOrchestraIntroRewrite(page, {
      before_html: before,
      after_html: before,
    })).toBe(page);
  });
});
