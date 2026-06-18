/**
 * Snippet — renders the Orchestra featured-snippet (answer-box) block baked into
 * orchestra-fixes.json for a page. Additive over the .it body; hidden when empty.
 * Accepts an `html` prop (passed by OrchestraConnector for the current path).
 */
export default function Snippet({ html }) {
  if (!html) return null;
  return (
    <section className="py-20 section-light border-y border-[#E2E8F0]" data-testid="snippet-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div
          className="[&_p]:text-[#475569] [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-[#0A0F1C] [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-[#475569] [&_ul]:text-lg [&_ul]:space-y-2 [&_li]:mb-1 [&_a]:text-[#2563EB] [&_a]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
