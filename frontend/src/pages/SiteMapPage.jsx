import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, WarningCircle } from '@phosphor-icons/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { useLivePages } from '../hooks/useLivePages';
import { LIVE_GROUPS, byTitle, filterByTypes, getLivePath, getLiveTitle } from '../utils/liveContent';

const extraGroups = [
  { key: 'utility', label: 'Utility', types: ['utility', 'faq', 'legal', 'company', 'guide', 'page', 'local-index', 'info-index', 'home'] },
];

const SiteMapPage = () => {
  const { pages, loading, error } = useLivePages();
  const groups = [...LIVE_GROUPS, ...extraGroups].map((group) => ({
    ...group,
    pages: filterByTypes(pages, group.types).sort(byTitle),
  })).filter((group) => group.pages.length > 0 || loading);

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="site-map-page">
      <SEO title="Mappa sito" description="Tutti gli URL importati dal sito live Solaris Films e ricollocati nella nuova architettura." path="/mappa-sito" />
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <div className="accent-bar w-16 mb-6" />
              <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">Architettura contenuti</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                Mappa <span className="text-gradient">sito</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Tutti gli URL del sito live sono importati qui e ricondotti alla nuova struttura. Questa pagina serve anche per controllare la copertura prima dei redirect 301.
              </p>
              <div className="inline-flex items-center gap-2 mt-8 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm">
                <Compass size={16} />
                {loading ? 'Caricamento URL...' : `${pages.length} URL importati dal live`}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            {error && (
              <div className="card-light rounded-xl p-6 flex gap-3 text-[#0A0F1C]">
                <WarningCircle size={22} className="text-[#EAB308] shrink-0" />
                <span>Indice live non disponibile.</span>
              </div>
            )}

            <div className="space-y-14">
              {groups.map((group) => (
                <div key={group.key}>
                  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-medium text-[#0A0F1C]">{group.label}</h2>
                      <p className="text-sm text-[#64748B] mt-1">{group.pages.length} URL</p>
                    </div>
                    {group.path && (
                      <Link to={group.path} className="text-sm font-medium text-[#2563EB] hover:text-[#EAB308] inline-flex items-center gap-2">
                        Apri sezione
                        <ArrowRight size={14} weight="bold" />
                      </Link>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    {group.pages.map((page, index) => (
                      <motion.div
                        key={`${page.path}-${page.route?.newPath}`}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: Math.min(index * 0.015, 0.2) }}
                      >
                        <Link to={getLivePath(page)} className="card-light rounded-xl p-5 block group">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-[#0A0F1C] group-hover:text-[#2563EB] transition-colors">{getLiveTitle(page)}</h3>
                              <p className="text-xs text-[#64748B] mt-2">{getLivePath(page)}</p>
                              <p className="text-xs text-[#94A3B8] mt-1">Live: {page.path}</p>
                            </div>
                            <ArrowRight size={16} weight="bold" className="text-[#EAB308] shrink-0 mt-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default SiteMapPage;
