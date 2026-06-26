import fixes from '../data/orchestra-fixes.json';
import { useLocation } from '@/next/router-shim';
import { normalizeOrchestraPath, normalizeTrustSignals } from '../utils/orchestraBlocks';

function removeAuthorityHeading(html) {
  return String(html || '')
    .replace(/<h[1-6][^>]*>[\s\S]*?(?:autorit(?:à|a|&agrave;|&#224;)|authority)[\s\S]*?<\/h[1-6]>/i, '')
    .trim();
}

export default function Authority({ html: htmlProp, path, trustSignals: trustSignalsProp }) {
  const loc = useLocation();
  const key = normalizeOrchestraPath(path || (loc && loc.pathname) || '/');
  const aeo = fixes?.byPath?.[key]?.aeo || {};
  const rawHtml = (typeof htmlProp === 'string' && htmlProp)
    ? htmlProp
    : aeo.authority_html;
  const html = removeAuthorityHeading(rawHtml);
  const trustSignals = normalizeTrustSignals(trustSignalsProp || aeo.trust_signals);

  if (!html && !trustSignals.length) return null;

  return (
    <section className="py-20 bg-[#0A0F1C] border-t border-white/10" data-testid="authority-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="rounded-2xl border border-[#EAB308]/25 bg-white/[0.04] p-6 md:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          {trustSignals.length ? (
            <div
              className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm font-semibold text-white md:px-5"
              data-testid="authority-trust-strip"
            >
              {trustSignals.map((signal) => (
                <span key={signal} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#EAB308]" aria-hidden="true" />
                  <span>{signal}</span>
                </span>
              ))}
            </div>
          ) : null}

          {html ? (
            <>
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EAB308]">
                    Perché Solaris
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                    Authority
                  </h2>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-[#EAB308]/70 to-transparent md:w-64" />
              </div>
              <div
                className="[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mb-4 [&_p]:text-[#CBD5E1] [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-4 [&_strong]:text-white [&_ul]:grid [&_ul]:gap-3 [&_ul]:pl-0 [&_ul]:text-[#CBD5E1] [&_li]:list-none [&_li]:rounded-xl [&_li]:border [&_li]:border-white/10 [&_li]:bg-white/[0.04] [&_li]:px-4 [&_li]:py-3 [&_a]:text-[#FACC15] [&_a]:underline"
                data-testid="authority-body"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
