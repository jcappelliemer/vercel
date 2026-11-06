const {
  buildOrchestraFallbackPage,
  contentToBlocks,
  normalizeMirrorPath,
} = require('../../scripts/orchestra-fallback.cjs');

describe('Orchestra-only WordPress page fallback', () => {
  test('parses visible WordPress content and removes managed blocks rendered elsewhere', () => {
    const parsed = contentToBlocks(`
      <p>Introduzione verificabile.</p>
      <h2>Dettagli tecnici</h2>
      <ul><li>Primo dato</li><li>Secondo dato</li></ul>
      <!-- aeo-orchestra:faq-block --><div><h2>FAQ</h2><p>Doppione</p></div><!-- /aeo-orchestra:faq-block -->
    `);

    expect(parsed.cleanHtml).not.toContain('Doppione');
    expect(parsed.blocks).toEqual([
      { type: 'paragraph', html: 'Introduzione verificabile.', text: 'Introduzione verificabile.' },
      { type: 'heading', level: 2, html: 'Dettagli tecnici', text: 'Dettagli tecnici' },
      {
        type: 'list',
        ordered: false,
        items: [
          { html: 'Primo dato', text: 'Primo dato' },
          { html: 'Secondo dato', text: 'Secondo dato' },
        ],
        text: 'Primo dato Secondo dato',
      },
    ]);
  });

  test('builds a public-domain page payload from a connector detail', () => {
    const page = buildOrchestraFallbackPage({
      post_id: 511,
      meta: {
        title: 'Pagina QA — Solaris Films',
        description: 'Descrizione QA.',
      },
      content: '<p>Corpo della pagina.</p>',
      aeo: {
        schema_jsonld: { '@context': 'https://schema.org', '@type': 'WebPage', '@id': 'https://www.solarisfilms.it/qa/#webpage' },
      },
    }, '/qa', 'https://www.solarisfilms.it', { indexable: false });

    expect(normalizeMirrorPath('/qa')).toBe('/qa/');
    expect(page.path).toBe('/qa/');
    expect(page.h1).toBe('Pagina QA');
    expect(page.seo.canonical).toBe('https://www.solarisfilms.it/qa/');
    expect(page.seo.og['og:url']).toBe('https://www.solarisfilms.it/qa/');
    expect(page.seo.robots).toContain('noindex');
    expect(page.seo.schemas).toHaveLength(1);
    expect(JSON.stringify(page)).not.toContain('wordpress-jc4e.srv1502079.hstgr.cloud');
  });
});
