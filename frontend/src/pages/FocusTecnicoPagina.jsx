import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from '@phosphor-icons/react';
import { focusTecnicoData } from '../data/siteContent';

const FocusTecnicoPagina = () => {
  const { slug } = useParams();
  const focus = focusTecnicoData.find(f => f.slug === slug);

  if (!focus) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-24">
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
              <h1 className="text-4xl font-medium text-white mb-6">Pagina non trovata</h1>
              <Link to="/focus-tecnico" className="btn-yellow">Tutti i focus tecnici</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`focus-${focus.slug}`}>
      <SEO title={focus.titolo} description={focus.descrizione?.substring(0, 160)} path={`/focus-tecnico/${focus.slug}`} />
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <Link to="/focus-tecnico" className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#EAB308] transition-colors text-sm mb-8">
              <ArrowLeft size={16} />
              Tutti i focus tecnici
            </Link>
            <span className="block text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">{focus.categoria}</span>
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-medium text-white mb-6">{focus.titolo}</h1>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <p className="text-[#94A3B8] text-lg leading-relaxed mb-10">{focus.descrizione}</p>

            <div className="space-y-3 mb-10">
              {focus.caratteristiche.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-4 card-glass rounded-xl"
                >
                  <CheckCircle size={20} weight="fill" className="text-[#EAB308] flex-shrink-0" />
                  <span className="text-white">{c}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 section-light">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-2xl font-medium text-[#0A0F1C] mb-4">Vuoi saperne di più?</h2>
            <p className="text-[#64748B] mb-8">Richiedi una consulenza gratuita sul prodotto.</p>
            <Link to="/preventivo" className="btn-primary group">
              <span>Richiedi Preventivo</span>
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

// Index page
export const FocusTecnicoIndexPagina = () => {
  const categorie = [...new Set(focusTecnicoData.map(f => f.categoria))];

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="focus-tecnico-index">
      <SEO title="Focus Tecnico" description="Approfondimenti tecnici su tutte le tipologie di pellicole per vetri MADICO: sputtered, sunscape, spettro-selettive, sicurezza, privacy e decorative." path="/focus-tecnico" />
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-medium text-white mb-6">
              Focus <span className="text-gradient">tecnico</span>
            </h1>
            <p className="text-lg text-[#94A3B8]">Approfondimenti tecnici su tutte le nostre tipologie di pellicole.</p>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
            {categorie.map((cat) => (
              <div key={cat}>
                <h2 className="text-2xl font-medium text-[#0A0F1C] mb-6">{cat}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {focusTecnicoData.filter(f => f.categoria === cat).map((focus, i) => (
                    <motion.div key={focus.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                      <Link to={`/focus-tecnico/${focus.slug}`} className="card-light rounded-xl p-6 group block h-full" data-testid={`focus-link-${focus.slug}`}>
                        <h3 className="font-medium text-[#0A0F1C] group-hover:text-[#2563EB] transition-colors mb-2">{focus.titolo}</h3>
                        <p className="text-sm text-[#64748B] line-clamp-2">{focus.descrizione}</p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default FocusTecnicoPagina;
