import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Target, Eye, Leaf } from '@phosphor-icons/react';

const referenze = [
  'Banca d\'Italia',
  'EUR Spa - Nuvola e Palazzo dei Congressi di Roma',
  'Università di Bologna',
  'Sapienza Università di Roma',
  'Aeroporto di Bologna "Guglielmo Marconi"',
  'Aeroporto di Forlì "Luigi Ridolfi"',
  'Ministero dell\'Interno',
  'Ministero della Difesa',
  'CNR - Consiglio Nazionale delle Ricerche',
  'Reggimento Corazzieri - Roma',
  'Accademia Navale di Livorno',
  'Guardia di Finanza di Prato',
  'DIA Firenze',
  'Comando Regione Carabinieri Calabria',
  'Palazzo Pitti - Firenze',
  'Sistema Museale Fiorentino',
  'Opera del Duomo di Siena',
  'Galleria Nazionale dell\'Umbria',
  'Cassa Depositi e Prestiti - Roma',
  'Crédit Agricole Sede di Ravenna',
  'H-Farm - Treviso',
  'Prima Industrie - Verona',
];

const ChiSiamoPagina = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]" data-testid="chi-siamo-page">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
                  Chi Siamo
                </p>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#0A0A0A] uppercase mb-6">
                  La nostra<br />
                  <span className="text-[#002FA7]">storia</span>
                </h1>
                <p className="text-lg text-[#0A0A0A]/70 leading-relaxed mb-6">
                  Siamo un'azienda italiana con sede centrale in Toscana che da <strong className="text-[#0A0A0A]">40 anni</strong> opera 
                  in tutta Italia ed in Europa nel campo delle pellicole per vetri e trattamenti speciali per superfici trasparenti.
                </p>
                <p className="text-lg text-[#0A0A0A]/70 leading-relaxed mb-6">
                  Dal 2020 siamo il <strong className="text-[#002FA7]">DISTRIBUTORE ESCLUSIVO PER L'ITALIA</strong> delle 
                  pellicole MADICO U.S.A. Nel 2026 inizieremo ufficialmente anche la distribuzione in Spagna e Isole Canarie.
                </p>
                <p className="text-[#0A0A0A]/70 leading-relaxed">
                  L'esperienza sul campo, maturata lavorando su oltre <strong className="text-[#0A0A0A]">45.000 edifici</strong>, 
                  ci permette di risolvere sempre in modo efficace ed efficiente varie tipologie di problemi.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/5691531/pexels-photo-5691531.jpeg?w=800"
                  alt="Team Solaris Films"
                  className="w-full h-auto"
                />
                <div className="absolute -bottom-6 -left-6 bg-[#002FA7] text-white p-6">
                  <div className="text-5xl font-black">40+</div>
                  <div className="text-sm uppercase tracking-wider">Anni di Esperienza</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-[#E5E7EB] p-8"
              >
                <div className="w-12 h-12 bg-[#002FA7] flex items-center justify-center mb-6">
                  <Target size={28} weight="bold" className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A0A0A] uppercase mb-4">Mission</h3>
                <p className="text-[#0A0A0A]/70 leading-relaxed">
                  Vogliamo risolvere qualsiasi problema relativo alle superfici vetrate. 
                  Per questo impieghiamo le tecnologie più all'avanguardia e prepariamo al meglio 
                  il nostro personale perché sia in grado di analizzare le problematiche rilevate 
                  dai nostri clienti ed offrire sempre la migliore soluzione.
                </p>
                <p className="text-[#0A0A0A]/70 leading-relaxed mt-4">
                  <strong className="text-[#0A0A0A]">Il cliente è il protagonista del nostro business</strong>, 
                  e viene accompagnato in ogni fase, ritagliando la soluzione perfetta per le sue esigenze.
                </p>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#0A0A0A] text-white p-8"
              >
                <div className="w-12 h-12 bg-[#002FA7] flex items-center justify-center mb-6">
                  <Eye size={28} weight="bold" className="text-white" />
                </div>
                <h3 className="text-2xl font-bold uppercase mb-4">Vision</h3>
                <p className="text-white/80 leading-relaxed">
                  Intendiamo portare una visione ecocompatibile in edilizia, implementando soluzioni 
                  in grado di abbassare le emissioni, il consumo di energia e migliorare la 
                  sostenibilità ambientale degli edifici.
                </p>
                <p className="text-white/80 leading-relaxed mt-4">
                  Noi di Solaris Films vogliamo garantire un futuro alle prossime generazioni, 
                  perché <strong className="text-white">non ereditiamo la terra dai nostri antenati, 
                  la prendiamo in prestito dai nostri figli</strong>.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-8">
              <Leaf size={32} weight="bold" className="text-[#22C55E]" />
              <h2 className="text-2xl font-bold text-[#0A0A0A] uppercase">Sostenibilità</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Riduzione CO2', desc: 'Meno consumi energetici = meno emissioni' },
                { title: 'Efficienza', desc: 'Risparmio energetico fino al 50%' },
                { title: 'Durabilità', desc: 'Prodotti garantiti fino a 10 anni' },
              ].map((item, i) => (
                <div key={i} className="bg-[#F9FAFB] p-6 border border-[#E5E7EB]">
                  <CheckCircle size={24} weight="fill" className="text-[#22C55E] mb-3" />
                  <h4 className="font-bold text-[#0A0A0A] mb-2">{item.title}</h4>
                  <p className="text-sm text-[#0A0A0A]/70">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* References */}
        <section className="py-24 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
                Le Nostre Referenze
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-[#0A0A0A] uppercase">
                Ci hanno scelto
              </h2>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {referenze.map((ref, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-white border border-[#E5E7EB] p-4 text-center hover:border-[#002FA7] transition-colors"
                >
                  <span className="text-sm text-[#0A0A0A]">{ref}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#002FA7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase mb-6">
              Affidati ai professionisti
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Scegli Solaris Films per le tue pellicole per vetri. 40 anni di esperienza al tuo servizio.
            </p>
            <Link 
              to="/preventivo"
              className="px-8 py-4 bg-white text-[#002FA7] font-bold uppercase tracking-wide hover:bg-[#F9FAFB] transition-colors inline-flex items-center gap-2"
            >
              Richiedi Preventivo
              <ArrowRight size={20} weight="bold" />
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
