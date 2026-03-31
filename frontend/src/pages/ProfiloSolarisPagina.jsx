import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';

const ProfiloSolarisPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="profilo-solaris-page">
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
              Profilo <span className="text-gradient">Solaris</span>
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-3xl">
              Distributore esclusivo MADICO U.S.A. per l'Italia. Oltre 40 anni di esperienza 
              nelle pellicole per vetri, al servizio di privati, aziende e istituzioni.
            </p>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-medium text-[#0A0F1C] mb-6">Chi siamo</h2>
                <p className="text-[#475569] leading-relaxed mb-4">
                  Solaris Films è un'azienda italiana con sede centrale in Toscana che da oltre 40 anni opera 
                  in tutta Italia ed in Europa nel campo delle pellicole per vetri.
                </p>
                <p className="text-[#475569] leading-relaxed mb-4">
                  Dal 2020 siamo il <strong className="text-[#0A0F1C]">DISTRIBUTORE ESCLUSIVO PER L'ITALIA</strong> delle 
                  pellicole MADICO U.S.A., il top dei prodotti a livello mondiale. Nel 2026 abbiamo iniziato 
                  la distribuzione anche in Spagna e Isole Canarie.
                </p>
                <p className="text-[#475569] leading-relaxed mb-6">
                  L'esperienza sul campo, maturata lavorando su oltre 45.000 edifici, ci permette di risolvere 
                  sempre in modo efficace ogni problematica delle superfici vetrate.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-medium text-[#0A0F1C] mb-6">Numeri chiave</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '40+', label: 'Anni di esperienza' },
                    { value: '45.000+', label: 'Edifici trattati' },
                    { value: '100.000+', label: 'Mq installati/anno' },
                    { value: '10', label: 'Anni di garanzia' },
                  ].map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                      className="card-light rounded-xl p-5 text-center"
                    >
                      <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                      <div className="text-sm text-[#64748B] mt-1">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-medium text-white mb-8">Certificazioni e Qualità</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'ISO 9001', desc: 'Sistema di gestione qualità certificato.' },
                { title: 'Distributore Esclusivo MADICO', desc: 'Unico distributore autorizzato per l\'Italia delle pellicole MADICO U.S.A.' },
                { title: 'Installatori Certificati', desc: 'Personale formato e certificato per l\'installazione professionale.' },
              ].map((cert, i) => (
                <div key={i} className="card-glass rounded-xl p-6">
                  <CheckCircle size={28} weight="fill" className="text-[#EAB308] mb-4" />
                  <h3 className="font-medium text-white mb-2">{cert.title}</h3>
                  <p className="text-sm text-[#94A3B8]">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-medium text-[#0A0F1C] mb-6">Lavora con noi</h2>
            <p className="text-[#64748B] text-lg mb-8">Contattaci per un preventivo o per diventare partner.</p>
            <Link to="/contatti" className="btn-primary group">
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

export default ProfiloSolarisPagina;
