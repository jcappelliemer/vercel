import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import References from '../components/References';
import { motion } from 'framer-motion';
import { Link } from '@/next/router-shim';
import {
  ArrowRight,
  Buildings,
  Certificate,
  CheckCircle,
  Eye,
  Handshake,
  Leaf,
  ShieldCheck,
  Target,
} from '@phosphor-icons/react';

const referenze = [
  'Palazzo Hyundai - sede centrale Milano',
  'Still S.p.A. - sede centrale Milano',
  'Palazzo Lancia - Torino',
  'Capitaneria di Porto di Genova',
  'Fercam Italia - Bolzano',
  'Groom - Torino',
  'Ministero della Cultura - Roma',
  'Philip Morris - Bologna',
  "Banca d'Italia",
  'EUR Spa - Nuvola e Palazzo dei Congressi di Roma',
  'Università di Bologna',
  'Sapienza Università di Roma',
  'Aeroporto di Bologna "Guglielmo Marconi"',
  'Aeroporto di Forlì "Luigi Ridolfi"',
  "Ministero dell'Interno",
  'Ministero della Difesa',
  'CNR - Consiglio Nazionale delle Ricerche',
  'CNR - Milano',
  'Reggimento Corazzieri - Roma',
  'Accademia Navale di Livorno',
  'Guardia di Finanza di Prato',
  'DIA Firenze',
  'Comando Regione Carabinieri Calabria',
  'Palazzo Pitti - Firenze',
  'Careggi - Firenze',
  'Sistema Museale Fiorentino',
  "Opera del Duomo di Siena",
  "Galleria Nazionale dell'Umbria",
  'Cassa Depositi e Prestiti - Roma',
  'Crédit Agricole Sede di Ravenna',
  'H-Farm - Treviso',
  'Prima Industrie - Verona',
];

const referenzeGruppi = [
  {
    title: 'Istituzioni e difesa',
    items: [
      "Banca d'Italia",
      "Ministero dell'Interno",
      'Ministero della Difesa',
      'Guardia di Finanza di Prato',
      'DIA Firenze',
      'Comando Regione Carabinieri Calabria',
      'Reggimento Corazzieri - Roma',
      'Cassa Depositi e Prestiti - Roma',
    ],
  },
  {
    title: 'Infrastrutture e trasporti',
    items: [
      'Aeroporto di Bologna "Guglielmo Marconi"',
      'Aeroporto di Forli "Luigi Ridolfi"',
      'Capitaneria di Porto di Genova',
      'Accademia Navale di Livorno',
      'Fercam Italia - Bolzano',
      'Palazzo Lancia - Torino',
    ],
  },
  {
    title: 'Corporate e industria',
    items: [
      'Palazzo Hyundai - sede centrale Milano',
      'Still S.p.A. - sede centrale Milano',
      'Philip Morris - Bologna',
      'Credit Agricole Sede di Ravenna',
      'H-Farm - Treviso',
      'Prima Industrie - Verona',
      'Groom - Torino',
      'EUR Spa - Nuvola e Palazzo dei Congressi di Roma',
    ],
  },
  {
    title: 'Cultura, universita e ricerca',
    items: [
      'Ministero della Cultura - Roma',
      'Universita di Bologna',
      'Sapienza Universita di Roma',
      'CNR - Consiglio Nazionale delle Ricerche',
      'CNR - Milano',
      'Palazzo Pitti - Firenze',
      'Careggi - Firenze',
      'Sistema Museale Fiorentino',
      "Opera del Duomo di Siena",
      "Galleria Nazionale dell'Umbria",
    ],
  },
];

const stats = [
  { value: '30+', label: 'anni di esperienza' },
  { value: '+45k', label: 'edifici trattati' },
  { value: '2015', label: 'Solaris Films Srl' },
  { value: 'MADICO', label: 'distribuzione ufficiale' },
];

const identityCards = [
  {
    title: 'Una storia iniziata nel 1987',
    text: 'L’esperienza nasce in ambito familiare e diventa, nel 2015, una struttura specializzata nelle superfici vetrate e trasparenti.',
    icon: Buildings,
  },
  {
    title: 'Distribuzione MADICO',
    text: "Dal 2020 Solaris è distributore ufficiale MADICO per l'Italia; dal 2026 la presenza si estende anche a Spagna e Isole Canarie.",
    icon: Certificate,
  },
  {
    title: 'Scelte guidate dal caso reale',
    text: 'Prima si capiscono edificio, vetro, uso degli ambienti e obiettivo del cliente; poi si sceglie la soluzione più adatta.',
    icon: Target,
  },
];

const milestones = [
  {
    year: '1987',
    title: 'Origine familiare',
    text: 'Nasce l’esperienza che ancora oggi orienta il modo Solaris di leggere vetri, ambienti ed esigenze.',
  },
  {
    year: '2015',
    title: 'Nasce Solaris Films Srl',
    text: 'L’attività diventa una società specializzata, con una struttura pensata per seguire interventi in tutta Italia.',
  },
  {
    year: '2017',
    title: 'Superfici plastiche',
    text: 'Il lavoro si estende a policarbonato, plexiglass, lucernari e coperture che richiedono soluzioni dedicate.',
  },
  {
    year: '2019',
    title: 'Interventi complessi',
    text: 'Solaris consolida procedure e squadra per edifici sensibili, grandi superfici e cantieri con vincoli operativi.',
  },
  {
    year: '2020',
    title: 'MADICO Italia',
    text: 'Solaris diventa distributore ufficiale delle pellicole MADICO U.S.A. per il mercato italiano.',
  },
  {
    year: '2026',
    title: 'Spagna e Isole Canarie',
    text: 'La presenza MADICO si amplia oltre l’Italia, con apertura verso Spagna e Isole Canarie.',
  },
];

const solutionAreas = [
  {
    title: 'Schermatura solare',
    text: 'Riduzione del calore, controllo dell’abbagliamento, protezione UV, comfort e minori consumi.',
    icon: Target,
  },
  {
    title: 'Sicurezza',
    text: 'Messa in sicurezza delle vetrate, protezione anti-scheggia, anti-effrazione e sistemi per contesti sensibili.',
    icon: ShieldCheck,
  },
  {
    title: 'Privacy e design',
    text: 'Pellicole decorative, opacizzanti, vetrofanie e personalizzazioni per ambienti professionali e istituzionali.',
    icon: Eye,
  },
  {
    title: 'Superfici plastiche',
    text: 'Interventi su policarbonato, plexiglass, lucernari e coperture dove servono soluzioni specifiche ad alte prestazioni.',
    icon: Buildings,
  },
];

const benefits = [
  'ambienti meno caldi',
  'meno abbagliamento',
  'protezione dai raggi UV',
  'vetri più sicuri',
  'maggiore riservatezza',
  'superfici più curate',
];

const missionVision = [
  {
    title: 'Missione',
    text: 'Risolvere i problemi delle superfici vetrate con tecnologie professionali, personale preparato e un percorso che accompagna il cliente dalla richiesta alla posa.',
    icon: Target,
    tone: 'blue',
  },
  {
    title: 'Visione',
    text: 'Migliorare comfort, sicurezza e sostenibilità degli edifici intervenendo sul vetro esistente quando la pellicola è la soluzione più coerente.',
    icon: Eye,
    tone: 'yellow',
  },
];

const qualityPoints = [
  { title: 'Sistema qualità ISO 9001', desc: 'Processi e gestione orientati a continuità, controllo e affidabilità del servizio.' },
  { title: 'Prodotti MADICO originali', desc: 'Gamma professionale per controllo solare, sicurezza, privacy, decorazione e protezione del vetro.' },
  { title: 'Posa tecnica', desc: 'Installatori formati, materiali corretti e indicazioni di manutenzione dopo l’intervento.' },
];

const sustainabilityPoints = [
  { title: 'Intervento non invasivo', desc: 'La pellicola lavora sul vetro esistente e riduce opere, tempi e materiali rispetto alla sostituzione del serramento.' },
  { title: 'Comfort sul caso reale', desc: 'Calore, abbagliamento, protezione UV e privacy vengono valutati rispetto all’edificio e all’uso degli ambienti.' },
  { title: 'Durata e garanzie', desc: 'Prodotto, posa e manutenzione vengono gestiti come un sistema, non come un semplice materiale.' },
];

const workSteps = [
  'Partiamo da ciò che non funziona: troppo calore, abbagliamento, poca privacy, vetri da mettere in sicurezza o immagine da valorizzare.',
  'Raccogliamo le informazioni utili su vetro, esposizione, dimensioni, uso degli spazi e vincoli dell’edificio.',
  'Proponiamo la pellicola più coerente e accompagniamo il cliente fino a posa, manutenzione e garanzia.',
];

const profileNarrative = [
  {
    title: 'Chi siamo',
    paragraphs: [
      'Solaris Films nasce nel 2015 dall’evoluzione di una realtà familiare attiva fin dal 1987. La specializzazione è rimasta chiara: migliorare le superfici trasparenti quando il vetro incide su comfort, sicurezza, privacy o immagine dell’edificio.',
      'Dalla sede in Toscana, Solaris segue clienti privati, aziende, progettisti, enti pubblici, scuole, musei, banche, aeroporti e spazi commerciali in tutta Italia e anche in Europa.',
      'In oltre 30 anni di esperienza, l’azienda ha affrontato problemi molto diversi: ambienti troppo caldi, abbagliamento, vetrate da mettere in sicurezza, protezione UV, superfici plastiche e contesti architettonici complessi.',
    ],
  },
  {
    title: 'Cosa facciamo',
    paragraphs: [
      'Solaris applica pellicole professionali su vetri esistenti per controllo solare, sicurezza, privacy, decorazione, vetrofanie, protezione antigraffiti e protezione delle superfici. L’obiettivo è ottenere un miglioramento concreto senza sostituire il serramento quando non serve.',
      'La gamma MADICO permette di intervenire su facciate vetrate, uffici esposti al sole, scuole, abitazioni, negozi, ambienti sanitari, musei e sedi direzionali. Dal 2017 Solaris lavora anche su policarbonato, plexiglass, lucernari e coperture dove servono valutazioni più specifiche.',
    ],
  },
  {
    title: 'Come lavoriamo',
    paragraphs: [
      'Il percorso parte dall’esigenza, non dal catalogo. Solaris valuta superficie, esposizione, uso degli ambienti e risultato atteso, poi individua la famiglia di pellicole più coerente.',
      'Dal 2019 la struttura segue anche interventi complessi e lavorazioni in quota. È un’esperienza utile quando entrano in gioco grandi superfici, edifici sensibili, norme, sicurezza o vincoli estetici.',
      'La proposta può portare a una pellicola solare, di sicurezza, privacy, decorativa o a una soluzione per superfici plastiche. Quando una scelta non è adatta, viene chiarito prima della posa.',
    ],
  },
];

const operatingDetails = [
  {
    title: 'Analisi del vetro',
    text: 'Osserviamo vetro o superficie plastica, esposizione, dimensioni e uso degli ambienti per capire quale risultato è realistico.',
  },
  {
    title: 'Scelta della pellicola',
    text: 'La soluzione viene scelta in base a priorità del cliente, resa visiva, compatibilità e prestazione attesa.',
  },
  {
    title: 'Posa e controllo',
    text: 'L’installazione è gestita da personale formato, con attenzione a preparazione del supporto, finitura e tempi di asciugatura.',
  },
  {
    title: 'Assistenza',
    text: 'Dopo la posa restano indicazioni chiare per manutenzione, garanzia e uso corretto delle superfici trattate.',
  },
];

const ChiSiamoPagina = ({ canonicalPath = '/company-profile' }) => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="company-profile-page">
      <SEO
        title="Company Profile Solaris"
        description="Company profile Solaris Films: storia, metodo, distribuzione MADICO, referenze e soluzioni per migliorare vetri e superfici trasparenti."
        path={canonicalPath}
      />
      <Header />

      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-16 items-center">
              <div>
                <div className="accent-bar w-16 mb-6" />
                <p className="text-sm uppercase tracking-[0.35em] text-[#EAB308] mb-4">Company Profile</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                  Company Profile
                  <span className="text-gradient"> Solaris</span>
                </h1>
                <p className="text-lg text-[#CBD5E1] leading-relaxed mb-6">
                  Solaris Films aiuta aziende, enti, progettisti e privati a migliorare vetri e superfici
                  trasparenti con pellicole professionali per comfort, sicurezza, privacy e immagine.
                </p>
                <p className="text-[#94A3B8] leading-relaxed mb-8">
                  Dal percorso iniziato nel 1987 alla distribuzione MADICO, l’azienda ha costruito
                  un modo di lavorare concreto: ascoltare il problema, leggere l’edificio e proporre
                  una soluzione che possa essere installata e mantenuta nel tempo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/preventivo" className="btn-yellow group">
                    <span>Richiedi verifica</span>
                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/servizi" className="btn-secondary">
                    Vedi servizi
                  </Link>
                </div>
              </div>

              <motion.figure
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <img
                  src="/assets/generated/company-profile/company-profile-heritage.webp"
                  alt="Campioni vetro e pellicole in ambiente Solaris"
                  className="h-[440px] w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/25 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-xs uppercase tracking-[0.28em] text-[#EAB308]">Vetro, edificio, prestazione</span>
                  <p className="mt-2 max-w-md text-xl font-medium leading-snug text-white">
                    Materiali, vetri e metodo: il punto di partenza di ogni progetto Solaris.
                  </p>
                </figcaption>
              </motion.figure>
            </div>
          </div>
        </section>

        <section className="py-12 section-light border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-5 text-center"
                >
                  <div className="text-3xl font-bold text-gradient">{stat.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-[#64748B]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-white/5 bg-[#111827]/60">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Percorso Solaris</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                Una specializzazione costruita nel tempo
              </h2>
              <p className="text-[#94A3B8] leading-relaxed">
                Ogni passaggio ha aggiunto qualcosa al modo in cui Solaris lavora oggi: esperienza,
                organizzazione, nuove superfici da trattare, cantieri più complessi e presenza MADICO
                su più mercati.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {milestones.map((item, index) => (
                <motion.article
                  key={`${item.year}-${item.title}`}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl border border-white/10 bg-[#0A0F1C]/70 p-5"
                >
                  <div className="mb-4 text-3xl font-semibold text-gradient">{item.year}</div>
                  <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#94A3B8]">{item.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden py-24 section-light border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[0.72fr_1.28fr] gap-12 items-start">
              <div className="lg:sticky lg:top-28">
                <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Profilo aziendale</p>
                <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                  Una realtà costruita intorno alle superfici trasparenti
                </h2>
                <p className="text-[#475569] leading-relaxed">
                  Dietro ogni intervento c’è una domanda semplice: cosa deve migliorare davvero?
                  Da qui Solaris collega esigenza, prodotto, posa e manutenzione in un percorso
                  comprensibile anche per chi non conosce già le pellicole.
                </p>
                <figure className="mt-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
                  <img
                    src="/assets/generated/company-profile/company-profile-assessment.webp"
                    alt="Valutazione tecnica Solaris su vetri e pellicole"
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="p-4 text-sm leading-relaxed text-[#64748B]">
                    Ogni scelta parte dall’edificio: esposizione, vetro, obiettivo e risultato atteso.
                  </figcaption>
                </figure>
              </div>

              <div className="space-y-8">
                {profileNarrative.map((block, index) => (
                  <motion.article
                    key={block.title}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="rounded-xl border border-[#E2E8F0] bg-white p-7"
                  >
                    <h3 className="text-2xl font-medium text-[#0A0F1C] mb-4">{block.title}</h3>
                    <div className="space-y-4">
                      {block.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="text-[#475569] leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 border-y border-white/5 bg-[#111827]/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Identità</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                Dalla storia aziendale al metodo di intervento
              </h2>
              <p className="text-[#94A3B8] leading-relaxed">
                Solaris non si limita a fornire materiali. Lavoro sul campo, distribuzione MADICO
                e posa professionale servono a dare risposte chiare quando il vetro diventa un problema
                di comfort, sicurezza o privacy.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {identityCards.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="card-glass rounded-xl p-6"
                  >
                    <Icon size={26} weight="light" className="text-[#EAB308] mb-4" />
                    <h3 className="text-xl font-medium text-white mb-3">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-[#94A3B8]">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-12 items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Soluzioni</p>
                <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                  Soluzioni su misura per ogni esigenza
                </h2>
                <p className="text-[#475569] leading-relaxed">
                  Solaris studia, progetta e realizza interventi professionali per migliorare
                  prestazioni, comfort, sicurezza e qualità estetica delle superfici trasparenti.
                </p>
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {benefits.map((item) => (
                    <div key={item} className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#475569]">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {solutionAreas.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.article
                      key={item.title}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06 }}
                      className="rounded-xl border border-[#E2E8F0] bg-white p-6"
                    >
                      <Icon size={26} weight="light" className="text-[#2563EB] mb-4" />
                      <h3 className="text-lg font-medium text-[#0A0F1C] mb-3">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-[#475569]">{item.text}</p>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 border-y border-white/5 bg-[#111827]/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Metodo Solaris</p>
                <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                  Dal dubbio iniziale alla soluzione installata
                </h2>
                <p className="text-[#94A3B8] leading-relaxed">
                  La richiesta può nascere da un ufficio troppo caldo, da una scuola da mettere in sicurezza
                  o da una vetrata che deve garantire più privacy. Il percorso resta lo stesso: capire,
                  scegliere, installare e lasciare indicazioni chiare.
                </p>
                <figure className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                  <img
                    src="/assets/generated/company-profile/company-profile-installation.webp"
                    alt="Posa professionale di pellicole per vetri Solaris"
                    className="h-72 w-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="p-4 text-sm leading-relaxed text-[#94A3B8]">
                    Dalla valutazione alla posa, il risultato dipende dalla coerenza tra prodotto, vetro e installazione.
                  </figcaption>
                </figure>
              </div>

              <div className="space-y-4">
                {workSteps.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex gap-4 rounded-xl border border-white/10 bg-[#0A0F1C]/70 p-5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAB308]/15 text-sm font-semibold text-[#EAB308]">
                      {index + 1}
                    </div>
                    <p className="text-[#CBD5E1] leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 section-light border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Operatività</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Un percorso semplice, dall’idea alla posa
              </h2>
              <p className="text-[#475569] leading-relaxed">
                Non serve conoscere già il nome della pellicola. Basta raccontare il problema,
                condividere qualche informazione utile e lasciare che Solaris trasformi quella richiesta
                in una proposta leggibile.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {operatingDetails.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EAB308]/15 text-sm font-semibold text-[#EAB308]">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-medium text-[#0A0F1C] mb-3">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#475569]">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 gap-8">
              {missionVision.map((item, index) => {
                const Icon = item.icon;
                const isYellow = item.tone === 'yellow';
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.12 }}
                    className={`rounded-2xl p-8 border ${isYellow ? 'border-[#EAB308]/20' : 'border-[#2563EB]/20'} bg-white/[0.03]`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isYellow ? 'bg-[#EAB308]/15' : 'bg-[#2563EB]/15'}`}>
                      <Icon size={26} weight="light" className={isYellow ? 'text-[#EAB308]' : 'text-[#3B82F6]'} />
                    </div>
                    <h2 className="text-2xl font-medium text-white mb-4">{item.title}</h2>
                    <p className="text-[#94A3B8] leading-relaxed">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-3">Qualità e affidabilità</p>
                <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C]">
                  Certificazioni, prodotti e posa nella stessa filiera
                </h2>
              </div>
              <ShieldCheck size={38} weight="light" className="text-[#2563EB]" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {qualityPoints.map((item) => (
                <div key={item.title} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <CheckCircle size={24} weight="fill" className="text-[#22C55E] mb-3" />
                  <h3 className="font-medium text-[#0A0F1C] mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#475569]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-y border-white/5 bg-[#111827]/50">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-4 mb-8">
              <Leaf size={28} weight="light" className="text-[#22C55E]" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#22C55E] mb-2">Sostenibilità applicata</p>
                <h2 className="text-2xl font-medium text-white">Migliorare il vetro esistente, quando ha senso farlo</h2>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {sustainabilityPoints.map((item) => (
                <div key={item.title} className="card-glass rounded-xl p-6">
                  <CheckCircle size={24} weight="fill" className="text-[#22C55E] mb-3" />
                  <h3 className="font-medium text-white mb-2">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-[#94A3B8]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hidden py-24 section-light border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <div className="accent-bar w-16 mx-auto mb-6" />
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Esperienza sul campo</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C]">
                Realtà che hanno scelto <span className="text-gradient">Solaris</span>
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {referenze.map((ref, index) => (
                <motion.div
                  key={ref}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.02 }}
                  className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-center shadow-sm hover:border-[#EAB308]/40 transition-all"
                >
                  <span className="text-sm text-[#475569]">{ref}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <References
          theme="light"
          title="Realtà che hanno scelto Solaris"
          subtitle="Referenze clienti dal portfolio Solaris"
          sectionClassName="py-20 section-light border-b border-[#E2E8F0] relative overflow-hidden"
        />

        <section className="py-16 section-light border-b border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-3">Elenco completo</p>
              <h2 className="text-2xl lg:text-3xl font-medium text-[#0A0F1C]">Referenze organizzate per contesto</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {referenzeGruppi.map((group) => (
                <div key={group.title} className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0F172A] mb-3">{group.title}</h3>
                  <ul className="space-y-2">
                    {group.items.map((item) => (
                      <li key={item} className="text-sm leading-relaxed text-[#475569]">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#EAB308]/10" />
          <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
            <Handshake size={34} weight="light" className="mx-auto mb-5 text-[#EAB308]" />
            <h2 className="text-3xl lg:text-4xl font-medium text-white mb-6">
              Hai un progetto o una vetrata da valutare?
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              Invia foto, misure e obiettivo: Solaris collega esigenza, prodotto, posa e assistenza al caso reale.
            </p>
            <Link to="/preventivo" className="btn-yellow group">
              <span>Richiedi verifica Solaris</span>
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
