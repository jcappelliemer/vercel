import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Target, Eye, Leaf } from '@phosphor-icons/react';

const referenze = [
  'Banca d\'Italia', 'EUR Spa - Nuvola e Palazzo dei Congressi di Roma',
  'Università di Bologna', 'Sapienza Università di Roma',
  'Aeroporto di Bologna "Guglielmo Marconi"', 'Aeroporto di Forlì "Luigi Ridolfi"',
  'Ministero dell\'Interno', 'Ministero della Difesa',
  'CNR - Consiglio Nazionale delle Ricerche', 'Reggimento Corazzieri - Roma',
  'Accademia Navale di Livorno', 'Guardia di Finanza di Prato',
  'DIA Firenze', 'Comando Regione Carabinieri Calabria',
  'Palazzo Pitti - Firenze', 'Sistema Museale Fiorentino',
  'Opera del Duomo di Siena', 'Galleria Nazionale dell\'Umbria',
  'Cassa Depositi e Prestiti - Roma', 'Crédit Agricole Sede di Ravenna',
  'H-Farm - Treviso', 'Prima Industrie - Verona',
];

const ChiSiamoPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="chi-siamo-page">
      <SEO title="Chi Siamo" description="Solaris Films: 40 anni di esperienza, distributore esclusivo MADICO USA per Italia e Spagna. Oltre 45.000 edifici trattati, certificazione ISO 9001." path="/chi-siamo" />
      <Header />
      
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="accent-bar w-16 mb-6" />
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                  La nostra
                  <span className="text-gradient"> storia</span>
                </h1>
                <p className="text-lg text-[#94A3B8] leading-relaxed mb-6">
                  Siamo un'azienda italiana con sede centrale in Toscana che da <span className="text-white font-medium">40 anni</span> opera 
                  in tutta Italia ed in Europa nel campo delle pellicole per vetri.
                </p>
                <p className="text-lg text-[#94A3B8] leading-relaxed mb-6">
                  Dal 2020 siamo il <span className="text-[#EAB308] font-medium">DISTRIBUTORE ESCLUSIVO PER L'ITALIA</span> delle 
                  pellicole MADICO U.S.A. Nel 2026 inizieremo la distribuzione anche in Spagna e Isole Canarie.
                </p>
                <p className="text-[#94A3B8] leading-relaxed">
                  L'esperienza sul campo, maturata lavorando su oltre <span className="text-white font-medium">45.000 edifici</span>, 
                  ci permette di risolvere in modo efficace ogni problematica delle superfici vetrate.
                </p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden border border-white/10">
                  <img src="https://images.pexels.com/photos/5691531/pexels-photo-5691531.jpeg?w=800" alt="Team Solaris Films" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent" />
                </div>
                <div className="absolute -bottom-4 -left-4 card-glass rounded-xl p-5">
                  <div className="text-4xl font-bold text-[#EAB308]">40+</div>
                  <div className="text-xs uppercase tracking-wider text-white/60">Anni Esperienza</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-glass rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#2563EB]/20 mb-6">
                  <Target size={26} weight="light" className="text-[#3B82F6]" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-4">Mission</h3>
                <p className="text-[#94A3B8] leading-relaxed">
                  Vogliamo risolvere qualsiasi problema relativo alle superfici vetrate. 
                  Per questo impieghiamo le tecnologie più all'avanguardia e prepariamo al meglio il nostro personale.
                </p>
                <p className="text-[#94A3B8] leading-relaxed mt-4">
                  <span className="text-white">Il cliente è il protagonista del nostro business</span>, 
                  e viene accompagnato in ogni fase.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="rounded-2xl p-8 border border-[#EAB308]/20" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.05), rgba(37,99,235,0.05))' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#EAB308]/20 mb-6">
                  <Eye size={26} weight="light" className="text-[#EAB308]" />
                </div>
                <h3 className="text-2xl font-medium text-white mb-4">Vision</h3>
                <p className="text-[#94A3B8] leading-relaxed">
                  Intendiamo portare una visione ecocompatibile in edilizia, implementando soluzioni 
                  in grado di abbassare le emissioni e migliorare la sostenibilità ambientale degli edifici.
                </p>
                <p className="text-[#94A3B8] leading-relaxed mt-4">
                  <span className="text-white">Non ereditiamo la terra dai nostri antenati, 
                  la prendiamo in prestito dai nostri figli</span>.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="py-16 bg-[#111827]/50 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-4 mb-8">
              <Leaf size={28} weight="light" className="text-[#22C55E]" />
              <h2 className="text-2xl font-medium text-white">Sostenibilità</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Riduzione CO2', desc: 'Meno consumi energetici = meno emissioni' },
                { title: 'Efficienza', desc: 'Risparmio energetico fino al 50%' },
                { title: 'Durabilità', desc: 'Prodotti garantiti fino a 10 anni' },
              ].map((item, i) => (
                <div key={i} className="card-glass rounded-xl p-6">
                  <CheckCircle size={24} weight="fill" className="text-[#22C55E] mb-3" />
                  <h4 className="font-medium text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-[#94A3B8]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* References */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <div className="accent-bar w-16 mx-auto mb-6" />
              <h2 className="text-3xl lg:text-4xl font-medium text-white">
                Ci hanno <span className="text-gradient">scelto</span>
              </h2>
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {referenze.map((ref, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.02 }}
                  className="card-glass rounded-lg p-4 text-center hover:border-[#EAB308]/20 transition-all"
                >
                  <span className="text-sm text-white/70">{ref}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#EAB308]/10" />
          <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-medium text-white mb-6">
              Affidati ai <span className="text-gradient">professionisti</span>
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              Scegli Solaris Films per le tue pellicole per vetri. 40 anni di esperienza.
            </p>
            <Link to="/preventivo" className="btn-yellow group">
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

export default ChiSiamoPagina;
