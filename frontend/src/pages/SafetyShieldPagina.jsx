import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { Link } from '@/next/router-shim';
import { ArrowRight, DownloadSimple, ShieldCheck } from '@phosphor-icons/react';

const metriche = [
  { label: 'Spessore SafetyShield 800', value: '240 micron' },
  { label: 'Spessore SafetyShield 1500', value: '432 micron' },
  { label: 'Adesione del film', value: '4.5-5.5 kg / 2.5 cm' },
  { label: 'Test su SafetyShield 800', value: '28 kPa / 193 kPa·ms' },
  { label: 'Test su SafetyShield 1500 con ancoraggio', value: '48 kPa / 365 kPa·ms' },
  { label: 'Classe rilevata in prova EN 356', value: 'P2A su vetro 6 mm' },
];

const confrontoSafetyShield = [
  {
    serie: 'SafetyShield G2 800',
    spessore: '240 micron',
    scenario: 'Mitigazione frammentazione e primo livello di rinforzo in contesti professionali.',
    blast: '28 kPa / 193 kPa·ms (H4)',
  },
  {
    serie: 'SafetyShield G2 1500',
    spessore: '432 micron',
    scenario: 'Configurazioni ad alto rischio con richiesta di tenuta superiore.',
    blast: '48 kPa / 365 kPa·ms (H2) con ancoraggio',
  },
];

const criteriScelta = [
  'Tipo di vetro esistente e configurazione del serramento.',
  'Livello di rischio reale: urto, intrusione, scenario ad alta energia.',
  "Obiettivo del progetto: contenimento frammenti, ritardo intrusione, protezione dell'area.",
  'Scelta del sistema di ancoraggio in funzione del contesto (FrameGard o GullWing).',
];

const percorsoOperativo = [
  {
    title: '1. Analisi del rischio',
    text: "Si parte dall'evento da mitigare: urto accidentale, tentata intrusione o scenario ad alta energia.",
  },
  {
    title: '2. Verifica vetro e telaio',
    text: 'Si controllano stratigrafia, dimensioni, appoggi e punti critici del serramento prima di definire film e ancoraggio.',
  },
  {
    title: '3. Configurazione SafetyShield',
    text: 'Si confrontano G2 800 e G2 1500 con sistema di ancoraggio coerente (FrameGard o GullWing).',
  },
  {
    title: '4. Posa e controllo finale',
    text: 'Installazione tecnica e verifica conclusiva della configurazione applicata sul caso reale.',
  },
];

const estrattiSolaris = [
  'SafetyShield 800: orientata alla trasformazione di vetri monolitici in configurazioni rinforzate con approccio antieffrazione/antiesplosione.',
  'SafetyShield 1500: soluzione piu robusta per richieste di sicurezza avanzata e test su classi superiori.',
  'GullWing: ancoraggio dedicato usato per aumentare la tenuta del sistema vetro + film in eventi ad alta sollecitazione.',
];

const casiUsoDettagliati = [
  {
    title: 'Scuole e ambienti formativi',
    text: 'Quando il vetro è vicino a zone di passaggio, SafetyShield aiuta a ridurre il rischio legato alla frammentazione e a gestire meglio gli impatti accidentali.',
  },
  {
    title: 'Retail e uffici con vetrate esposte',
    text: 'Nei fronti strada o nelle vetrine estese, la combinazione film + ancoraggio permette di alzare il livello di protezione senza sostituzione completa dei vetri.',
  },
  {
    title: 'Sanità e strutture ad alta frequentazione',
    text: 'In contesti con afflusso continuo, il controllo della rottura del vetro e la tenuta del sistema diventano un requisito operativo, non solo tecnico.',
  },
  {
    title: 'Siti industriali e aree sensibili',
    text: 'Quando il rischio è più elevato, la scelta tra G2 800 e G2 1500 va fatta insieme al dettaglio dell’ancoraggio e delle condizioni reali di posa.',
  },
];

const noteImportanti = [
  'I risultati di test non vanno letti come claim universale: valgono nelle condizioni specifiche di prova.',
  'La classificazione finale dipende dal sistema completo: vetro, telaio, ancoraggio e installazione.',
  'Un film corretto su vetro non compatibile può ridurre l’efficacia del progetto: la verifica preliminare resta obbligatoria.',
];

const faqSafetyShield = [
  {
    q: 'SafetyShield 800 e 1500 sostituiscono sempre il vetro stratificato?',
    a: 'No. In alcuni casi possono migliorare in modo significativo la sicurezza del vetro esistente, ma la soluzione va definita su progetto e requisito reale.',
  },
  {
    q: 'FrameGard e GullWing sono alternativi?',
    a: 'Sono sistemi con logiche diverse. La scelta dipende da obiettivo, configurazione del serramento e livello di rischio da gestire.',
  },
  {
    q: 'Basta scegliere il prodotto dalla scheda tecnica?',
    a: 'No. Le schede orientano, ma la decisione corretta richiede analisi del vetro reale e impostazione della posa.',
  },
];

const supportiUfficiali = [
  {
    label: 'Data Sheet SafetyShield G2 800 (Madico)',
    href: 'https://madico-images.nyc3.digitaloceanspaces.com/m956473-safetyshield-g2-800-data-sheet-9-2-2025.pdf',
  },
  {
    label: 'Data Sheet SafetyShield G2 1500 (Madico)',
    href: 'https://madico-images.nyc3.digitaloceanspaces.com/m956474-safetyshield-g2-1500-data-sheet-9-2-2025.pdf',
  },
  {
    label: 'FrameGard Sell Sheet (Madico)',
    href: 'https://madico-images.nyc3.digitaloceanspaces.com/m956071-framegard-sell-sheet.pdf',
  },
  {
    label: 'GullWing Sell Sheet (Madico)',
    href: 'https://madico-images.nyc3.digitaloceanspaces.com/pdfs/m956070-gullwing-sell-sheet.pdf',
  },
];

const SafetyShieldPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="safetyshield-page">
      <SEO
        title="Madico SafetyShield | Solaris Films"
        description="Sezione dedicata Madico SafetyShield con focus su protezione vetro, sistema FrameGard e ancoraggio GullWing."
        path="/focus-tecnico/safetyshield"
      />
      <Header />

      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
              <div className="max-w-3xl">
                <div className="accent-bar w-16 mb-6" />
                <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">Sezione dedicata</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                  Madico <span className="text-gradient">SafetyShield</span>
                </h1>
                <p className="text-lg text-[#CBD5E1] leading-relaxed mb-5">
                  Pagina dedicata esclusivamente a SafetyShield e ai sistemi di ancoraggio FrameGard e GullWing.
                  Il percorso parte dal rischio reale sul vetro e arriva alla configurazione corretta di film, ancoraggio e posa.
                </p>
                <p className="text-[#94A3B8] leading-relaxed">
                  Qui trovi confronto tra SafetyShield 800 e 1500, criteri di scelta, dati in metrica europea e supporti ufficiali Madico.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link to="/preventivo" className="btn-yellow group">
                    Richiedi verifica SafetyShield
                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/prodotti/madico-safetyshield-800/" className="btn-secondary">
                    Scheda prodotto 800
                  </Link>
                  <Link to="/prodotti/madico-safetyshield-1500/" className="btn-secondary">
                    Scheda prodotto 1500
                  </Link>
                </div>
              </div>

              <figure className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[340px]">
                <img
                  src="/assets/safetyshield/madico-safetyshield-hero.jpg"
                  alt="Madico SafetyShield su facciate vetrate"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/90 via-[#0A0F1C]/25 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[#EAB308] text-sm font-medium uppercase tracking-wider">SafetyShield</span>
                  <p className="text-white text-xl font-medium mt-2">Protezione del vetro in scenari ad alto impatto.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Come funziona</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Cosa succede davvero quando il vetro subisce un impatto
              </h2>
              <p className="text-[#475569] leading-relaxed mb-4">
                SafetyShield lavora come un sistema, non come una semplice pellicola. Quando il vetro viene colpito, il film aiuta a
                trattenere i frammenti e a mantenere più stabile la lastra. Questo riduce la dispersione di schegge e rende meno immediata
                la rottura completa del varco.
              </p>
              <p className="text-[#475569] leading-relaxed">
                Il risultato finale non dipende solo dal prodotto scelto: contano vetro esistente, telaio, ancoraggio e qualità della posa.
                Per questo Solaris parte sempre da una verifica concreta sul caso reale.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 section-light border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Numeri utili</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                SafetyShield in metrica europea
              </h2>
              <p className="text-[#475569] leading-relaxed">
                Questi valori servono per orientarsi. La conferma finale arriva sempre dopo la verifica del sistema completo in opera.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {metriche.map((item) => (
                <article key={item.label} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <p className="text-xs uppercase tracking-wider text-[#64748B]">{item.label}</p>
                  <p className="mt-2 text-xl font-medium text-[#0A0F1C]">{item.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Quale scegliere</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                SafetyShield 800 o SafetyShield 1500
              </h2>
              <p className="text-[#94A3B8] leading-relaxed">
                Entrambi migliorano la sicurezza del vetro, ma hanno un livello di risposta diverso. In generale, 800 è adatto
                quando serve un rinforzo solido su scenari standard; 1500 entra in gioco quando il rischio richiede una tenuta più alta.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              {confrontoSafetyShield.map((item) => (
                <article key={item.serie} className="card-glass rounded-xl p-6">
                  <h3 className="text-2xl font-medium text-white">{item.serie}</h3>
                  <div className="mt-4 space-y-2 text-[#CBD5E1]">
                    <p><strong className="text-white">Spessore:</strong> {item.spessore}</p>
                    <p><strong className="text-white">Quando ha senso:</strong> {item.scenario}</p>
                    <p><strong className="text-white">Valore di riferimento:</strong> {item.blast}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Dove si usa</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                Casi d&apos;uso dove SafetyShield fa davvero differenza
              </h2>
              <p className="text-[#94A3B8] leading-relaxed">
                Questi sono i contesti in cui SafetyShield viene richiesto più spesso.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {casiUsoDettagliati.map((item) => (
                <article key={item.title} className="card-glass rounded-xl p-6">
                  <h3 className="text-xl font-medium text-white">{item.title}</h3>
                  <p className="mt-3 text-[#CBD5E1] leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-8">
              <article className="card-glass rounded-xl overflow-hidden">
                <img src="/assets/safetyshield/madico-framegard.jpg" alt="Sistema FrameGard Madico" className="w-full h-64 object-cover" loading="lazy" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck size={24} className="text-[#EAB308]" />
                    <h3 className="text-2xl font-medium text-white">FrameGard</h3>
                  </div>
                  <p className="text-[#CBD5E1] leading-relaxed">
                    Sistema perimetrale studiato per mantenere il vetro nel vano in caso di rottura, riducendo la proiezione di frammenti verso l&apos;interno.
                  </p>
                </div>
              </article>

              <article className="card-glass rounded-xl overflow-hidden">
                <img src="/assets/safetyshield/madico-gullwing.jpg" alt="Sistema GullWing Madico" className="w-full h-64 object-cover" loading="lazy" />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck size={24} className="text-[#EAB308]" />
                    <h3 className="text-2xl font-medium text-white">GullWing</h3>
                  </div>
                  <p className="text-[#CBD5E1] leading-relaxed">
                    Sistema di ancoraggio meccanico usato quando serve aumentare la tenuta complessiva del sistema vetro + film.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Percorso Solaris</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                Come si struttura una scelta SafetyShield
              </h2>
              <p className="text-[#94A3B8] leading-relaxed">
                La scelta parte dal problema reale, non dal nome del prodotto.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {percorsoOperativo.map((item) => (
                <article key={item.title} className="card-glass rounded-xl p-6">
                  <h3 className="text-xl font-medium text-white">{item.title}</h3>
                  <p className="mt-3 text-[#CBD5E1] leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Cosa valutiamo</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Criteri tecnici di scelta sul vetro reale
              </h2>
              <p className="text-[#475569] leading-relaxed">
                Sono i punti che aiutano a fare una scelta chiara e coerente.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {criteriScelta.map((item) => (
                <article key={item} className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                  <p className="text-[#0A0F1C]">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Punti importanti</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                Tre aspetti da chiarire prima di decidere
              </h2>
            </div>
            <div className="space-y-3">
              {noteImportanti.map((item) => (
                <article key={item} className="card-glass rounded-xl p-5 flex items-start gap-3">
                  <ShieldCheck size={18} className="text-[#EAB308] mt-1 shrink-0" />
                  <p className="text-[#CBD5E1]">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Supporti ufficiali</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">Documenti ufficiali Madico</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {supportiUfficiali.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="rounded-xl border border-[#E2E8F0] bg-white p-5 flex items-start gap-3">
                  <DownloadSimple size={20} className="text-[#2563EB] mt-0.5" />
                  <span className="text-[#0A0F1C] font-medium">{item.label}</span>
                </a>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-[#E2E8F0] bg-white p-6">
              <h3 className="text-xl font-medium text-[#0A0F1C] mb-4">In sintesi</h3>
              <ul className="space-y-3">
                {estrattiSolaris.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#334155]">
                    <ShieldCheck size={18} className="text-[#2563EB] mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">FAQ rapide</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Domande frequenti su SafetyShield
              </h2>
            </div>
            <div className="space-y-4">
              {faqSafetyShield.map((item) => (
                <article key={item.q} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <h3 className="text-xl font-medium text-[#0A0F1C]">{item.q}</h3>
                  <p className="mt-3 text-[#475569] leading-relaxed">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-medium text-white mb-4">Vuoi capire se SafetyShield è adatta al tuo edificio?</h2>
            <p className="text-[#94A3B8] mb-8">
              Partiamo dal vetro reale, dal rischio e dall&apos;obiettivo tecnico prima di proporre il sistema di posa.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/preventivo" className="btn-yellow">Richiedi analisi SafetyShield</Link>
              <a href="tel:+390559107621" className="btn-secondary">055 9107621</a>
            </div>
            <p className="mt-6 text-sm text-[#64748B]">
              Fonti: madico.com (SafetyShield, FrameGard, GullWing datasheet/sell sheet) e contenuti tecnici Solaris rielaborati in formato UX.
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default SafetyShieldPagina;
