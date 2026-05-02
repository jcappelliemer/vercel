import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, FolderOpen, LinkSimple } from '@phosphor-icons/react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { useLivePages } from '../hooks/useLivePages';
import {
  DIRECTORY_CONFIG,
  byTitle,
  filterByTypes,
  getLiveDescription,
  getLivePath,
  getLiveTitle,
  groupPages,
} from '../utils/liveContent';

const DirectoryCard = ({ page, index, light = true }) => {
  const title = getLiveTitle(page);
  const description = getLiveDescription(page);
  const path = getLivePath(page);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.035, 0.3) }}
    >
      <Link
        to={path}
        className={`block h-full rounded-xl p-6 group transition-all ${light ? 'card-light' : 'card-glass'}`}
        data-testid={`live-directory-link-${page.route?.type || 'page'}-${index}`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-11 h-11 rounded-xl bg-[#EAB308]/12 border border-[#EAB308]/25 flex items-center justify-center">
            <LinkSimple size={20} weight="bold" className="text-[#EAB308]" />
          </div>
          <span className={`text-xs font-medium uppercase ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
            {page.route?.label || 'Pagina'}
          </span>
        </div>
        <h3 className={`font-medium mb-3 transition-colors ${light ? 'text-[#0A0F1C] group-hover:text-[#2563EB]' : 'text-white group-hover:text-[#EAB308]'}`}>
          {title}
        </h3>
        {description ? (
          <p className={`text-sm line-clamp-3 ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
            {description}
          </p>
        ) : (
          <p className={`text-sm ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
            Contenuto importato dal sito live.
          </p>
        )}
        <span className="inline-flex items-center gap-2 mt-5 text-[#EAB308] text-sm font-medium">
          Apri pagina
          <ArrowRight size={15} weight="bold" className="group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </motion.div>
  );
};

const LiveDirectoryPage = ({ kind }) => {
  const config = DIRECTORY_CONFIG[kind] || DIRECTORY_CONFIG.blog;
  const { pages, loading, error, stats } = useLivePages();
  const primaryPages = filterByTypes(pages, config.types).sort(byTitle);
  const secondaryPages = filterByTypes(pages, config.secondaryTypes || []).sort(byTitle);
  const grouped = groupPages(primaryPages, kind);

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`live-directory-${kind}`}>
      <SEO title={config.title} description={config.description} path={config.path} />
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <div className="accent-bar w-16 mb-6" />
              <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">{config.eyebrow}</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                {config.title}
                <span className="text-gradient"> {config.highlight}</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed">{config.description}</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm">
                  <FolderOpen size={16} />
                  {loading ? 'Caricamento...' : `${primaryPages.length} pagine`}
                </span>
                <Link to="/mappa-sito" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/25 text-[#EAB308] text-sm hover:bg-[#EAB308]/15 transition-colors">
                  Tutti gli URL live
                  <ArrowRight size={15} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            {error && (
              <div className="card-light rounded-xl p-6 text-[#0A0F1C]">
                Non riesco a caricare l'indice live in questo momento.
              </div>
            )}

            {!error && !loading && primaryPages.length === 0 && (
              <div className="card-light rounded-xl p-6 text-[#0A0F1C]">{config.emptyText}</div>
            )}

            <div className="space-y-14">
              {Object.entries(grouped).map(([group, groupPagesList]) => (
                <div key={group}>
                  <div className="flex items-end justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-medium text-[#0A0F1C]">{group}</h2>
                      <p className="text-sm text-[#64748B] mt-1">{groupPagesList.length} URL importati</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupPagesList.map((page, index) => (
                      <DirectoryCard key={`${page.path}-${page.route?.newPath}`} page={page} index={index} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {secondaryPages.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-medium text-[#0A0F1C] mb-6">Archivi e tassonomie</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {secondaryPages.map((page, index) => (
                    <DirectoryCard key={`${page.path}-${page.route?.newPath}`} page={page} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <p className="text-[#94A3B8] mb-6">
              Indice contenuti live: {Object.values(stats).reduce((sum, value) => sum + value, 0)} URL totali importati.
            </p>
            <Link to="/preventivo" className="btn-yellow group">
              Richiedi consulenza
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default LiveDirectoryPage;
