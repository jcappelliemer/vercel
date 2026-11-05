/**
 * InternalLinks renders the validated Orchestra link block baked into the
 * headless manifest. The plugin already limits same-site targets to real,
 * published WordPress content and sanitizes the saved HTML.
 */
export default function InternalLinks({ html }) {
  if (!html) return null;

  return (
    <section
      className="border-t border-[#E2E8F0] bg-white py-12"
      aria-label="Collegamenti interni"
      data-testid="internal-links-section"
    >
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <div
          className="[&_ul]:grid [&_ul]:gap-x-10 [&_ul]:gap-y-4 [&_ul]:pl-0 md:[&_ul]:grid-cols-2 [&_li]:list-none [&_li]:border-l-2 [&_li]:border-[#EAB308] [&_li]:pl-4 [&_li]:text-sm [&_li]:leading-relaxed [&_li]:text-[#64748B] [&_a]:font-semibold [&_a]:text-[#0A0F1C] [&_a]:no-underline hover:[&_a]:text-[#2563EB] hover:[&_a]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </section>
  );
}
