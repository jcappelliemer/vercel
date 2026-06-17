import fixes from '../data/orchestra-fixes.json';

/**
 * Authority — renders the Orchestra E-E-A-T "authority" block baked into
 * orchestra-fixes.json (key = page path, '/' for home). The block HTML already
 * carries its own <h2> + body (v3.57.5 structured block), so we only style the
 * injected children. Hidden when empty (fail-soft: no manifest → renders null).
 *
 * Accepts an optional `html` prop so mirror pages can pass their own path's block.
 */
export default function Authority({ html: htmlProp }) {
  const html = (typeof htmlProp === 'string' && htmlProp)
    ? htmlProp
    : (fixes && fixes.byPath && fixes.byPath['/'] && fixes.byPath['/'].aeo
        ? fixes.byPath['/'].aeo.authority_html
        : null);

  if (!html) return null;

  return (
    <section className="py-28 section-light border-y border-[#E2E8F0]" data-testid="authority-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div
          className="[&_h2]:text-3xl [&_h2]:lg:text-4xl [&_h2]:font-medium [&_h2]:text-[#0A0F1C] [&_h2]:mb-5 [&_p]:text-[#475569] [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-[#475569] [&_ul]:text-lg [&_ul]:space-y-2 [&_li]:mb-1 [&_a]:text-[#2563EB] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
