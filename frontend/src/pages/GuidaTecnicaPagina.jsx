import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Link } from '@/next/router-shim';
import {
  ArrowRight,
  CheckCircle,
  Drop,
  Eye,
  Lightning,
  ShieldCheck,
  Sun,
  Thermometer,
} from '@phosphor-icons/react';

const purposeCards = [
  {
    title: 'Capire da quale esigenza partire',
    text: 'Calore, sicurezza, privacy e immagine non richiedono lo stesso prodotto. La guida aiuta a separare i problemi prima di scegliere.',
    icon: Sun,
  },
  {
    title: 'Preparare una richiesta tecnica',
    text: 'Foto, misure, esposizione, destinazione d’uso e tipo di vetro rendono più rapida e precisa la verifica Solaris.',
    icon: CheckCircle,
  },
  {
    title: 'Evitare scelte solo per nome',
    text: 'Due pellicole possono sembrare simili ma cambiare molto per luce, calore, sicurezza, posa e resa estetica.',
    icon: ShieldCheck,
  },
];

const problemRoutes = [
  {
    need: 'Entra troppo calore o c’è abbagliamento',
    route: 'Controllo solare',
    text: 'Si valutano esposizione, luce naturale desiderata, tipo di vetro e impatto estetico.',
    icon: Thermometer,
    link: '/servizi#antisolari',
  },
  {
    need: 'Il vetro deve essere più sicuro',
    route: 'Sicurezza vetri',
    text: 'Si guarda a rischio, posizione del vetro, telaio, destinazione d’uso e norme applicabili.',
    icon: ShieldCheck,
    link: '/servizi#sicurezza',
  },
  {
    need: 'Serve privacy senza perdere luce',
    route: 'Privacy e design',
    text: 'Si bilanciano visibilità, luce, estetica interna, brand e uso quotidiano degli spazi.',
    icon: Eye,
    link: '/servizi#privacy',
  },
  {
    need: 'Il caso è delicato o ad alto rischio',
    route: 'Safety Shield',
    text: 'Si verifica se servono film rinforzati, sistemi di ancoraggio e valutazioni su telaio e superficie.',
    icon: Lightning,
    link: '/servizi#safety-shield',
  },
];

const requestData = [
  'Foto della vetrata dall’interno e dall’esterno, se possibile.',
  'Misure indicative e numero di vetri da trattare.',
  'Esposizione o momento della giornata in cui il problema è più evidente.',
  'Obiettivo principale: calore, sicurezza, privacy, UV, estetica o combinazione di esigenze.',
  'Informazioni note sul vetro o sul serramento, quando disponibili.',
];

const technicalTerms = [
  { label: 'VLT', desc: 'Indica quanta luce visibile attraversa il vetro: aiuta a non scegliere una pellicola troppo scura o troppo luminosa.' },
  { label: 'UV', desc: 'Riguarda la protezione dai raggi ultravioletti e la riduzione del rischio di scolorimento di arredi e materiali.' },
  { label: 'Calore', desc: 'Non si valuta solo con una percentuale: contano esposizione, superficie, ambiente, vetro e comfort desiderato.' },
  { label: 'UNI EN 12600', desc: 'Riferimento utile quando il tema è la sicurezza delle persone in caso di urto o rottura del vetro.' },
];

const GuidaTecnicaPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="guida-tecnica-page">
      <SEO
        title="Guida alla scelta delle pellicole per vetri"
        description="Guida Solaris per capire quale pellicola valutare, quali dati preparare e quando richiedere una verifica tecnica sul vetro reale."
        path="/guida-tecnica"
      />
      <Header />

      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
              <div className="max-w-3xl">
                <div className="accent-bar w-16 mb-6" />
                <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">Guida Solaris</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                  Guida alla scelta delle
                  <span className="text-gradient"> pellicole per vetri</span>
                </h1>
                <p className="text-lg text-[#CBD5E1] leading-relaxed mb-5">
                  Questa pagina non è un catalogo e non sostituisce una verifica tecnica. Serve a capire
                  quale problema vuoi risolvere, quali informazioni raccogliere e quale percorso Solaris aprire.
                </p>
                <p className="text-[#94A3B8] leading-relaxed">
                  Se hai già foto e misure puoi andare direttamente alla richiesta. Se invece vuoi orientarti
                  tra controllo solare, sicurezza, privacy e prestazioni, parti da qui.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link to="/preventivo" className="btn-yellow group">
                    Richiedi verifica
                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/servizi" className="btn-secondary">
                    Vedi servizi
                  </Link>
                </div>
              </div>

              <figure className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[340px]">
                <img
                  src="/assets/generated/main-pages/guida-tecnica-scelta.webp"
                  alt="Valutazione Solaris per scegliere la pellicola corretta"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/90 via-[#0A0F1C]/20 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[#EAB308] text-sm font-medium uppercase tracking-wider">Sequenza corretta</span>
                  <p className="text-white text-xl font-medium mt-2">Problema, dati del vetro, famiglia prodotto, posa.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">A cosa serve</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Una pagina ponte tra dubbio iniziale e verifica Solaris
              </h2>
              <p className="text-[#475569] leading-relaxed">
                La scelta della pellicola non parte dalla sigla del prodotto. Parte da una domanda più semplice:
                che cosa deve fare meglio quel vetro?
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {purposeCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-6"
                  >
                    <Icon size={28} weight="light" className="text-[#2563EB] mb-4" />
                    <h3 className="text-xl font-medium text-[#0A0F1C] mb-3">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[#475569]">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-24 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Da dove parti</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                Quattro esigenze, quattro percorsi diversi
              </h2>
              <p className="text-[#94A3B8] leading-relaxed">
                Questa è la parte pratica della guida: scegli l’esigenza più vicina al tuo caso e passa alla
                pagina servizio collegata.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {problemRoutes.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.route}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="card-glass rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAB308]/15">
                        <Icon size={25} weight="light" className="text-[#EAB308]" />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-[#94A3B8] mb-2">{item.need}</p>
                        <h3 className="text-2xl font-medium text-white mb-3">{item.route}</h3>
                        <p className="text-sm leading-relaxed text-[#94A3B8] mb-5">{item.text}</p>
                        <Link to={item.link} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#EAB308]">
                          Apri percorso
                          <ArrowRight size={15} weight="bold" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Prima della verifica</p>
                <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                  Le informazioni che rendono utile il confronto
                </h2>
                <p className="text-[#475569] leading-relaxed">
                  Non serve conoscere già la sigla della pellicola. Serve descrivere bene il vetro e il risultato atteso.
                </p>
              </div>

              <div className="space-y-3">
                {requestData.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4"
                  >
                    <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-[#22C55E]" />
                    <p className="text-sm leading-relaxed text-[#475569]">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#EEF4FF] border-y border-[#D8E4F3]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Termini essenziali</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Poche parole tecniche, spiegate in funzione della scelta
              </h2>
              <p className="text-[#475569] leading-relaxed">
                I dati tecnici servono quando aiutano a decidere. Senza vetro reale, esposizione e obiettivo,
                restano numeri difficili da interpretare.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {technicalTerms.map((term, index) => (
                <motion.div
                  key={term.label}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-xl border border-[#D8E4F3] bg-white p-6 shadow-sm"
                >
                  <div className="text-3xl font-bold text-gradient">{term.label}</div>
                  <p className="mt-4 text-sm leading-relaxed text-[#475569]">{term.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#EAB308]/10" />
          <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
            <Drop size={34} weight="light" className="mx-auto mb-5 text-[#EAB308]" />
            <h2 className="text-3xl lg:text-4xl font-medium text-white mb-6">
              La guida orienta. La verifica decide.
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              Quando hai chiarito l’esigenza, Solaris valuta il vetro reale e ti indirizza verso
              controllo solare, sicurezza, privacy o una soluzione combinata.
            </p>
            <Link to="/preventivo" className="btn-yellow group">
              <span>Richiedi verifica</span>
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
