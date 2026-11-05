import {
  applyOrchestraIntroRewrite,
  normalizeOrchestraIntroText,
} from './orchestraBlocks';

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
