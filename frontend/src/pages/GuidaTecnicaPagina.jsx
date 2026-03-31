import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, ShieldCheck, Eye, Bomb, Thermometer, Drop, Lightning } from '@phosphor-icons/react';

const sections = [
  {
    id: 'cosa-sono',
    title: 'Cosa sono le pellicole per vetri?',
    content: 'Le pellicole per vetri sono dei film composti da strati protettivi in poliestere che, applicati sulle superfici vetrate, ne migliorano drasticamente le prestazioni. Agiscono per riflessione delle varie componenti dell\'energia solare, riducendo il passaggio di calore, bloccando i raggi UV e migliorando la sicurezza del vetro.',
    light: false,
  },
  {
    id: 'antisolari',
    title: 'Pellicole Antisolari',
    icon: Sun,
    content: 'Le pellicole antisolari riflettono la componente IR (infrarossi), i raggi UV e parte del visibile. Questo riduce drasticamente il passaggio di calore attraverso il vetro fino a 7-8°C, con un risparmio energetico del 30-50% sulla climatizzazione estiva.',
    details: [
      { label: 'Sputtered', desc: 'Prodotte per polverizzazione catodica. Massime prestazioni, garanzia 10 anni esterno. Aspetto neutro o semi-riflettente.' },
      { label: 'Sunscape', desc: 'Pellicole tinte nella massa. Aspetto più naturale, ideali per residenziale. Garanzia 10 anni esterno.' },
      { label: 'Spettro-selettive', desc: 'Riflettono l\'IR senza alterare la trasmissione luminosa. Massima luce naturale con protezione termica.' },
      { label: 'Oscuranti', desc: 'Alto fattore di riduzione luminosa per ambienti che necessitano di oscuramento come sale proiezione.' },
    ],
    light: true,
  },
  {
    id: 'sicurezza',
    title: 'Pellicole di Sicurezza',
    icon: ShieldCheck,
    content: 'Le pellicole di sicurezza rinforzano il vetro per impedirne la frantumazione anche a seguito di un urto. Certificate UNI EN 12600:2004, trasformano qualsiasi vetro in "vetro di sicurezza" conforme al D.Lgs. 81/2008.',
    details: [
      { label: 'Classe 1B1', desc: 'Massimo livello di protezione. Il vetro si frattura ma la pellicola trattiene tutti i frammenti.' },
      { label: 'Classe 2B2', desc: 'Protezione standard. Il vetro si fessura ma non proietta schegge pericolose.' },
      { label: 'Anti-intrusione', desc: 'Pellicole spesse (8-12 mil) che ritardano significativamente l\'effrazione.' },
    ],
    light: false,
  },
  {
    id: 'safety-shield',
    title: 'SafetyShield — Anti-Esplosione',
    icon: Bomb,
    content: 'Le pellicole SafetyShield® by MADICO sono la linea di difesa più collaudata contro il rischio di rottura da urto, esplosione ed eventi naturali. Testate secondo gli standard più severi al mondo (GSA, ISO, ASTM, EN), proteggono persone e proprietà 24 ore su 24.',
    details: [
      { label: 'SafetyShield 800', desc: 'Trasforma un vetro monolitico in antieffrazione e antiesplosione. Certificata EN 13123, EN 13124, US-GSA e ISO 16933 classe EXV 33C.' },
      { label: 'SafetyShield 1500', desc: 'Antieffrazione EN 356 classe P2A (3mm) e P3A (6mm stratificato). Certificata antiesplosione GSA.' },
      { label: 'Sistema GullWing®', desc: 'Ancoraggio brevettato che assorbe e disperde l\'energia dell\'onda d\'urto, trattenendo il vetro nel serramento.' },
      { label: 'FrameGard', desc: 'Sistema di ritenzione con forza di 500-800 libbre per piede lineare. Testato con cariche fino a 1.100 kg.' },
    ],
    light: true,
  },
  {
    id: 'privacy',
    title: 'Pellicole Privacy e Design',
    icon: Eye,
    content: 'Le pellicole decorative e privacy servono a rendere satinati i vetri impedendo la visione dall\'esterno, mantenendo la luminosità interna. Disponibili in numerose varianti di disegno e colorazioni, personalizzabili su misura.',
    details: [
      { label: 'Satinate', desc: 'Effetto vetro smerigliato. Ideali per uffici, bagni e sale riunioni.' },
      { label: 'Decorative', desc: 'Motivi geometrici, floreali o personalizzati. Stampabili in alta risoluzione.' },
      { label: 'Vetrofanie', desc: 'Pellicole stampabili e adesive per comunicazione e branding su vetrate.' },
    ],
    light: false,
  },
];

const techSpecs = [
  { icon: Thermometer, label: 'Riduzione Temperatura', value: '-7/8°C', desc: 'Temperatura interna' },
  { icon: Sun, label: 'Protezione UV', value: '99%', desc: 'Raggi bloccati' },
  { icon: Drop, label: 'Riflessione IR', value: '85%', desc: 'Infrarossi riflessi' },
  { icon: Lightning, label: 'Risparmio', value: '30-50%', desc: 'Costi climatizzazione' },
];

const GuidaTecnicaPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="guida-tecnica-page">
      <Header />

      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <div className="accent-bar w-16 mb-6" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                Guida
                <span className="text-gradient"> tecnica</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Tutto quello che devi sapere sulle pellicole per vetri: tipologie, 
                prestazioni, certificazioni e applicazioni.
              </p>
            </div>
          </div>
        </section>

        {/* Quick specs bar */}
        <section className="py-12 section-light border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {techSpecs.map((spec, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <spec.icon size={28} weight="light" className="text-[#2563EB] mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gradient">{spec.value}</div>
                  <div className="text-sm font-medium text-[#0A0F1C]">{spec.label}</div>
                  <div className="text-xs text-[#64748B]">{spec.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Content sections */}
        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={`py-20 ${section.light ? 'section-light' : ''} ${!section.light && index > 0 ? 'border-t border-white/5' : ''}`}
            data-testid={`guida-section-${section.id}`}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="max-w-3xl">
                  {section.icon && (
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${section.light ? 'bg-[#2563EB]/10' : 'bg-gradient-to-br from-[#2563EB]/15 to-[#EAB308]/15'}`}>
                      <section.icon size={28} weight="light" className={section.light ? 'text-[#2563EB]' : 'text-[#EAB308]'} />
                    </div>
                  )}
                  <h2 className={`text-3xl lg:text-4xl font-medium mb-6 ${section.light ? 'text-[#0A0F1C]' : 'text-white'}`}>
                    {section.title}
                  </h2>
                  <p className={`text-lg leading-relaxed mb-8 ${section.light ? 'text-[#475569]' : 'text-[#94A3B8]'}`}>
                    {section.content}
                  </p>
                </div>

                {section.details && (
                  <div className="grid md:grid-cols-2 gap-4 mt-8">
                    {section.details.map((detail, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                        className={`rounded-xl p-6 ${section.light ? 'bg-white border border-[#E2E8F0] shadow-sm' : 'card-glass'}`}
                      >
                        <h4 className={`font-medium mb-2 ${section.light ? 'text-[#0A0F1C]' : 'text-white'}`}>{detail.label}</h4>
                        <p className={`text-sm leading-relaxed ${section.light ? 'text-[#475569]' : 'text-[#94A3B8]'}`}>{detail.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#EAB308]/10" />
          <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-medium text-white mb-6">
              Hai bisogno di <span className="text-gradient">consulenza</span>?
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              I nostri esperti ti aiuteranno a scegliere la soluzione perfetta per le tue esigenze.
            </p>
            <Link to="/preventivo" className="btn-yellow group">
              <span>Preventivo Gratuito</span>
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

export default GuidaTecnicaPagina;
