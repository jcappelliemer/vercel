import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, ShieldCheck } from '@phosphor-icons/react';
import { pagineInfoData } from '../data/siteContent';

const PaginaInfoPagina = () => {
  const { slug } = useParams();
  const pagina = pagineInfoData.find(p => p.slug === slug);

  if (!pagina) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-24">
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
              <h1 className="text-4xl font-medium text-white mb-6">Pagina non trovata</h1>
              <Link to="/info" className="btn-yellow">Tutte le pagine info</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`info-${pagina.slug}`}>
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <Link to="/info" className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#EAB308] transition-colors text-sm mb-8">
              <ArrowLeft size={16} />
              Tutte le pagine info
            </Link>
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-medium text-white mb-4">{pagina.titolo}</h1>
            <p className="text-lg text-[#EAB308] uppercase tracking-wider font-medium">{pagina.sottotitolo}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-6">
            {pagina.contenuto.map((para, i) => (
              <motion.p key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-[#94A3B8] leading-relaxed text-lg"
              >
                {para}
              </motion.p>
            ))}
          </div>
        </section>

        {pagina.norme && (
          <section className="py-16 section-light">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-medium text-[#0A0F1C] mb-8">Norme di Riferimento</h2>
              <div className="space-y-3">
                {pagina.norme.map((norma, i) => (
                  <div key={i} className="card-light rounded-xl p-5 flex items-start gap-4">
                    <ShieldCheck size={22} weight="fill" className="text-[#2563EB] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#0A0F1C]">{norma.sigla}</span>
                      <span className="text-[#475569]"> — {norma.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {pagina.garanzie && (
          <section className="py-16 section-light">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-medium text-[#0A0F1C] mb-8">Dettaglio Garanzie</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {pagina.garanzie.map((g, i) => (
                  <div key={i} className="card-light rounded-xl p-5">
                    <div className="text-sm text-[#475569] mb-1">{g.tipo}</div>
                    <div className="text-xl font-bold text-gradient">{g.durata}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {pagina.istruzioni && (
          <section className="py-16 section-light">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-medium text-[#0A0F1C] mb-8">Istruzioni per la Pulizia</h2>
              <div className="space-y-3">
                {pagina.istruzioni.map((istr, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} weight="fill" className="text-[#EAB308] flex-shrink-0 mt-0.5" />
                    <span className="text-[#475569]">{istr}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {pagina.puntiForza && (
          <section className="py-16 section-light">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-medium text-[#0A0F1C] mb-8">I Punti di Forza</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {pagina.puntiForza.map((pf, i) => (
                  <div key={i} className="card-light rounded-xl p-6">
                    <h4 className="font-medium text-[#0A0F1C] mb-2">{pf.nome}</h4>
                    <p className="text-sm text-[#475569]">{pf.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {pagina.glossario && (
          <section className="py-16 section-light">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-medium text-[#0A0F1C] mb-8">Glossario</h2>
              <div className="space-y-3">
                {pagina.glossario.map((g, i) => (
                  <div key={i} className="card-light rounded-xl p-5">
                    <h4 className="font-medium text-[#0A0F1C] mb-1">{g.termine}</h4>
                    <p className="text-sm text-[#475569]">{g.def}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <p className="text-[#94A3B8] text-lg mb-6">Vuoi scoprire la soluzione migliore per le tue vetrate?</p>
            <Link to="/contatti" className="btn-yellow group">
              <span>Contattaci</span>
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

// Index page listing all info pages
export const PaginaInfoIndexPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="info-index">
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-medium text-white mb-6">
              Informazioni <span className="text-gradient">utili</span>
            </h1>
            <p className="text-lg text-[#94A3B8]">Normative, garanzie, istruzioni e approfondimenti tecnici.</p>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pagineInfoData.map((pagina, i) => (
                <motion.div key={pagina.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/info/${pagina.slug}`} className="card-light rounded-xl p-6 group block h-full" data-testid={`info-link-${pagina.slug}`}>
                    <h3 className="font-medium text-[#0A0F1C] group-hover:text-[#2563EB] transition-colors mb-2">{pagina.titolo}</h3>
                    <p className="text-sm text-[#64748B] line-clamp-2">{pagina.sottotitolo}</p>
                  </Link>
                </motion.div>
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

export default PaginaInfoPagina;
