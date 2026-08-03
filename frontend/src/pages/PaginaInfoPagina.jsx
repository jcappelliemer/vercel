import { useParams, Link } from '@/next/router-shim';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, ShieldCheck } from '@phosphor-icons/react';
import { pagineInfoData } from '../data/siteContent';
import { useWPData } from '../hooks/useWPData';

const infoContentOverrides = {
  'norme': [
    'Quando si lavora su una vetrata esistente, le norme servono a decidere bene prima della posa: si parte dal rischio reale, si verifica il vetro e si sceglie la soluzione più adatta per persone, ambienti e continuità d’uso.',
    'La UNI 7697 è il riferimento iniziale per impostare il livello di sicurezza del vetro. Da lì si integrano le altre norme in base allo scenario: urto accidentale, attacco manuale, pressione da esplosione o altri eventi critici.',
    'In pratica, la norma non è un passaggio finale: è la base per confrontare con chiarezza le opzioni tra adeguamento minimo, rinforzo con pellicola o protezione avanzata.',
  ],
  'norma-brc': [
    'La norma BRC è uno standard internazionale per la sicurezza alimentare. Nelle aree produttive richiede che il rischio di contaminazione da rottura vetro venga gestito in modo preventivo.',
    'Sulle vetrate esposte, la funzione chiave della pellicola di sicurezza è trattenere i frammenti in caso di rottura, riducendo la dispersione verso linee, macchinari e zone di lavorazione.',
    'Questo approccio aiuta a mantenere più alto il controllo operativo durante audit, verifiche interne e gestione delle non conformità.',
  ],
  'sicurezza-a-norma-di-legge': [
    'Il D.Lgs. 81/2008 richiede di valutare e ridurre i rischi per la sicurezza nei luoghi di lavoro, incluse le superfici vetrate che possono causare infortuni in caso di impatto o rottura.',
    'Quando la sostituzione dei vetri non è immediatamente praticabile, l’adeguamento con pellicole di sicurezza certificate può essere una via efficace per aumentare la protezione e ridurre i tempi di intervento.',
    'L’obiettivo non è solo essere conformi, ma mettere in sicurezza persone e processi con una soluzione coerente con il contesto dell’edificio.',
  ],
  'testo-unico-sulla-salute-e-sicurezza-sul-lavoro': [
    'Il Testo Unico è il riferimento principale per la sicurezza nei luoghi di lavoro. Per le vetrate, il punto centrale è prevenire danni alle persone in caso di urto o rottura.',
    'L’art. 64 richiama la necessità di ambienti conformi ai requisiti di sicurezza: questo include anche la gestione del rischio legato ai vetri in passaggi, uffici, aree operative e zone comuni.',
    'Le pellicole certificate UNI EN 12600 sono uno strumento pratico per migliorare il comportamento del vetro in caso di rottura e impostare un adeguamento graduale senza bloccare l’attività.',
  ],
  'sistemi-filtranti-dpr-59-09': [
    'Il DPR 59/09 inquadra i requisiti energetici degli edifici e considera i sistemi filtranti tra le soluzioni utili per ridurre il carico termico estivo.',
    'Nel lavoro su edifici esistenti, le pellicole antisolari permettono di intervenire sull’involucro vetrato senza opere invasive, migliorando comfort interno e stabilità termica degli ambienti.',
    'La valutazione corretta parte sempre da orientamento, tipo vetro e uso reale degli spazi: così il beneficio energetico è misurabile e coerente con l’obiettivo del progetto.',
  ],
  'i-punti-di-forza': [
    'I punti di forza delle pellicole Solaris non sono solo tecnici: diventano valore reale quando migliorano comfort, protezione UV, gestione dell’abbagliamento e qualità visiva degli ambienti.',
    'La scelta corretta dipende dall’equilibrio tra luce naturale, controllo del calore e resa estetica della facciata o dello spazio interno.',
    'Per questo ogni soluzione va letta come combinazione tra prodotto, vetro esistente e obiettivo finale, non come semplice codice di catalogo.',
  ],
  'istruzioni-e-manutenzione': [
    'Una manutenzione corretta protegge la resa della pellicola nel tempo: trasparenza, riflessione e uniformità ottica dipendono molto dalla qualità della pulizia ordinaria.',
    'Nella fase iniziale dopo posa è normale una leggera opacizzazione temporanea: è parte del processo di assestamento e adesione completa sul vetro.',
    'Prodotti neutri, strumenti non abrasivi e frequenza di pulizia adeguata sono la base per mantenere prestazioni e durata, soprattutto su superfici molto esposte.',
  ],
  'glossario-termini': [
    'Questa sezione traduce i termini tecnici più usati nelle schede pellicola in indicazioni comprensibili anche per chi deve solo decidere quale soluzione adottare.',
    'Conoscere parametri come trasmissione luminosa, riflessione, fattore solare e protezione UV aiuta a confrontare i prodotti in modo più oggettivo.',
    'Il glossario è utile soprattutto in fase di preventivo: riduce i dubbi e rende più chiaro il legame tra dato tecnico e risultato atteso sul vetro.',
  ],
};

const PaginaInfoPagina = ({ forcedSlug = null }) => {
  const { slug: routeSlug } = useParams();
  const slug = forcedSlug || routeSlug;
  const { data: allInfo } = useWPData('info');
  const localPagina = pagineInfoData.find(p => p.slug === slug);
  const wpPagina = allInfo.find(p => p.slug === slug);
  const preferLocal = slug === 'garanzie' || slug === 'istruzioni-e-manutenzione' || slug === 'certificazione-nfrc';
  const basePagina = (preferLocal ? localPagina : wpPagina) || wpPagina || localPagina;
  const isGaranzie = slug === 'garanzie';
  const pagina = basePagina
    ? {
        ...basePagina,
        contenuto: infoContentOverrides[slug] || basePagina.contenuto,
      }
    : null;

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
      <SEO title={pagina.titolo} description={pagina.contenuto?.[0]?.substring(0, 160) || `${pagina.titolo} — Informazioni e normative sulle pellicole per vetri.`} path={`/pagina-info/${pagina.slug}`} />
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

        {isGaranzie && (
          <section className="py-16 section-light">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
              <div className="mb-10">
                <p className="text-sm font-semibold tracking-[0.24em] uppercase text-[#EAB308] mb-3">Percorso garanzie Solaris</p>
                <h2 className="text-2xl sm:text-3xl font-medium text-[#0A0F1C] mb-3">La garanzia si legge insieme all’intervento</h2>
                <p className="text-[#475569] leading-relaxed max-w-3xl">
                  Una garanzia convenzionale funziona quando prodotto, vetro, posa e manutenzione sono coerenti
                  con le regole previste dal produttore.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Prodotto corretto',
                    text: 'La pellicola deve essere compatibile con supporto, posizione della superficie e obiettivo dell’intervento.',
                  },
                  {
                    title: 'Posa qualificata',
                    text: 'L’installazione deve rispettare metodo, supporto e condizioni previste per quel prodotto.',
                  },
                  {
                    title: 'Gestione nel tempo',
                    text: 'La superficie trattata va mantenuta con pulizia e accorgimenti compatibili con la pellicola installata.',
                  },
                ].map((item) => (
                  <div key={item.title} className="card-light rounded-xl p-6">
                    <ShieldCheck size={24} weight="fill" className="text-[#2563EB] mb-4" />
                    <h3 className="font-medium text-[#0A0F1C] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#475569] leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {isGaranzie && pagina.garanzie && (
          <section className="py-16">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
                  <div>
                    <p className="text-sm font-semibold tracking-[0.24em] uppercase text-[#EAB308] mb-3">Cosa deve essere chiaro</p>
                    <h2 className="text-2xl font-medium text-white mb-3">Una garanzia convenzionale, non una promessa generica</h2>
                    <p className="text-[#94A3B8] leading-relaxed">
                      Questa pagina non espone le condizioni complete: chiarisce gli elementi che devono essere coerenti
                      perché la documentazione di garanzia sia letta nel modo corretto.
                    </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {pagina.garanzie.map((g, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-[#0F172A] p-4">
                        <div className="text-xs uppercase tracking-[0.18em] text-[#EAB308] mb-2">{g.tipo}</div>
                        <div className="text-sm font-medium text-white leading-snug">{g.durata}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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

        {pagina.garanzie && slug !== 'garanzie' && (
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

        {pagina.faq && (
          <section className="py-16 section-light">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-medium text-[#0A0F1C] mb-8">{isGaranzie ? 'Domande utili sulle garanzie' : 'FAQ Garanzie'}</h2>
              <div className="space-y-3">
                {pagina.faq.map((item, i) => (
                  <div key={i} className="card-light rounded-xl p-5">
                    <h4 className="font-medium text-[#0A0F1C] mb-2">{item.q}</h4>
                    <p className="text-sm text-[#475569] leading-relaxed">{item.a}</p>
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
  const { data: allInfo } = useWPData('info');
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="info-index">
      <SEO title="Informazioni e Normative" description="Norme, garanzie, certificazioni e informazioni utili sulle pellicole per vetri. UNI EN 12600, D.Lgs. 81/2008, DPR 59/09, BRC e molto altro." path="/info" />
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
              {allInfo.map((pagina, i) => (
                <motion.div key={pagina.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/pagina-info/${pagina.slug}`} className="card-light rounded-xl p-6 group block h-full" data-testid={`info-link-${pagina.slug}`}>
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
