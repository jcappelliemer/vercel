import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { Link } from '@/next/router-shim';
import { ArrowRight, DownloadSimple, ShieldCheck } from '@phosphor-icons/react';

const pillarCards = [
  {
    title: 'Mitigazione esplosione',
    text: 'SafetyShield è progettata per scenari ad alta energia, con l’obiettivo di ridurre la proiezione di frammenti e contenere meglio la rottura del vetro.',
  },
  {
    title: 'Protezione persone',
    text: 'Il focus principale è la sicurezza delle persone presenti all’interno dell’edificio, soprattutto in ambienti ad alta frequentazione.',
  },
  {
    title: 'Risposta in emergenza',
    text: 'In caso di eventi estremi, la combinazione film + ancoraggio aiuta a preservare la tenuta del sistema vetrato più a lungo.',
  },
];

const confrontoSafetyShield = [
  {
    serie: 'SafetyShield 800',
    posizionamento: 'Configurazioni avanzate di protezione su scenari ad alta criticità.',
    spessore: '240 micron',
    riferimento: '28 kPa / 193 kPa·ms',
  },
  {
    serie: 'SafetyShield 1500',
    posizionamento: 'Configurazioni ad altissimo livello quando serve una tenuta superiore del sistema.',
    spessore: '432 micron',
    riferimento: '48 kPa / 365 kPa·ms con ancoraggio',
  },
];

const ancoraggi = [
  {
    nome: 'FrameGard',
    testo:
      'Sistema perimetrale che lavora con il film per trattenere meglio la lastra nel vano in caso di rottura violenta.',
    image: '/assets/safetyshield/madico-framegard.jpg',
  },
  {
    nome: 'GullWing',
    testo:
      'Sistema di ancoraggio meccanico dedicato ai contesti in cui la tenuta strutturale del vetro deve salire di livello.',
    image: '/assets/safetyshield/madico-gullwing.jpg',
  },
];

const scenari = [
  'Sedi istituzionali e siti sensibili.',
  'Infrastrutture critiche e aree industriali strategiche.',
  'Scuole, sanità e spazi pubblici ad alta presenza di persone.',
  'Edifici esposti a eventi estremi come uragani e forti pressioni da impatto.',
];

const liveSolarisNarrative = [
  'Dalle pagine storiche Solaris emerge una linea chiara: SafetyShield non viene proposta come “pellicola standard”, ma come soluzione speciale quando l’obiettivo principale è la protezione delle persone.',
  'Nel racconto live, la scelta tra 800 e 1500 parte sempre dallo scenario reale. Il prodotto arriva dopo, insieme al sistema di ancoraggio più adatto. È questa combinazione che alza il livello di sicurezza del vetro.',
  'In altre parole, il valore non è nel singolo codice prodotto: è nel sistema completo che aiuta a gestire meglio eventi estremi e a ridurre l’impatto sugli occupanti.',
];

const faqSpecifiche = [
  {
    q: 'SafetyShield è una normale pellicola anti-effrazione?',
    a: 'No. SafetyShield è trattata come soluzione speciale per scenari ad alto rischio, con focus su mitigazione esplosione e protezione delle persone.',
  },
  {
    q: 'Che differenza operativa c’è tra SafetyShield 800 e 1500?',
    a: 'Entrambe sono orientate alla sicurezza avanzata, ma la 1500 è usata quando serve una risposta più alta del sistema complessivo, soprattutto se abbinata ad ancoraggi dedicati.',
  },
  {
    q: 'FrameGard e GullWing servono davvero o sono opzionali?',
    a: 'Nei contesti più critici non sono dettagli secondari: sono componenti chiave della configurazione, perché contribuiscono alla tenuta del vetro in eventi ad alta energia.',
  },
  {
    q: 'È una soluzione utile anche contro eventi naturali estremi, come uragani?',
    a: 'Sì, la logica di progetto include anche scenari di forte impatto ambientale. La valutazione viene fatta sul caso reale, considerando vetro, telaio e condizioni dell’edificio.',
  },
  {
    q: 'Come si decide la configurazione corretta?',
    a: 'Si parte da un’analisi tecnica del rischio e delle superfici vetrate. Solo dopo si definisce la combinazione 800/1500 e il tipo di ancoraggio.',
  },
];

const supportiUfficiali = [
  {
    label: 'Data Sheet SafetyShield 800 (Madico)',
    href: 'https://madico-images.nyc3.digitaloceanspaces.com/m956473-safetyshield-g2-800-data-sheet-9-2-2025.pdf',
  },
  {
    label: 'Data Sheet SafetyShield 1500 (Madico)',
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
        title="SafetyShield Special Security System | Solaris Films"
        description="SafetyShield: sistema speciale anti-esplosione con ancoraggi FrameGard e GullWing per protezione persone in scenari estremi."
        path="/focus-tecnico/safetyshield"
      />
      <Header />

      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <div className="max-w-3xl">
                <div className="accent-bar w-16 mb-6" />
                <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">Special Security System</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                  SafetyShield: sicurezza speciale antiesplosione per la protezione delle persone
                </h1>
                <p className="text-lg text-[#CBD5E1] leading-relaxed mb-5">
                  Questa non è una normale pellicola di sicurezza. SafetyShield è una soluzione di livello superiore
                  progettata per scenari ad alto impatto, dove l’obiettivo è proteggere le persone e ridurre gli effetti
                  della rottura del vetro in eventi estremi.
                </p>
                <p className="text-[#94A3B8] leading-relaxed">
                  Il valore reale nasce dalla combinazione di film SafetyShield 800/1500 e sistemi di ancoraggio dedicati
                  FrameGard e GullWing.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link to="/preventivo" className="btn-yellow group">
                    Richiedi valutazione SafetyShield
                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/contatti" className="btn-secondary">Parla con un tecnico</Link>
                </div>
              </div>

              <figure className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[360px]">
                <img
                  src="/assets/safetyshield/madico-safetyshield-hero.jpg"
                  alt="Sistema SafetyShield su edificio ad alta esposizione"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/90 via-[#0A0F1C]/25 to-transparent" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[#EAB308] text-sm font-medium uppercase tracking-wider">SafetyShield</span>
                  <p className="text-white text-xl font-medium mt-2">Sistema speciale per scenari di rischio elevato.</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Valore di sicurezza</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Perché SafetyShield è una categoria a parte
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {pillarCards.map((item) => (
                <article key={item.title} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <h3 className="text-xl font-medium text-[#0A0F1C]">{item.title}</h3>
                  <p className="mt-3 text-[#475569] leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Serie SafetyShield</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                800 e 1500: due livelli per scenari diversi
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-5">
              {confrontoSafetyShield.map((item) => (
                <article key={item.serie} className="card-glass rounded-xl p-6">
                  <h3 className="text-2xl font-medium text-white">{item.serie}</h3>
                  <div className="mt-4 space-y-2 text-[#CBD5E1]">
                    <p><strong className="text-white">Posizionamento:</strong> {item.posizionamento}</p>
                    <p><strong className="text-white">Spessore:</strong> {item.spessore}</p>
                    <p><strong className="text-white">Riferimento dati:</strong> {item.riferimento}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Ancoraggi dedicati</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                FrameGard e GullWing: il cuore del sistema in scenari estremi
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {ancoraggi.map((item) => (
                <article key={item.nome} className="card-glass rounded-xl overflow-hidden">
                  <img src={item.image} alt={item.nome} className="w-full h-64 object-cover" loading="lazy" />
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck size={24} className="text-[#EAB308]" />
                      <h3 className="text-2xl font-medium text-white">{item.nome}</h3>
                    </div>
                    <p className="text-[#CBD5E1] leading-relaxed">{item.testo}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Scenari di impiego</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                Dove la protezione speciale è davvero necessaria
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {scenari.map((item) => (
                <article key={item} className="card-glass rounded-xl p-5 flex items-start gap-3">
                  <ShieldCheck size={18} className="text-[#EAB308] mt-1 shrink-0" />
                  <p className="text-[#CBD5E1]">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#EAB308] mb-4">Posizionamento SafetyShield</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-5">
                Una soluzione speciale per scenari di rischio elevato
              </h2>
              <p className="text-[#94A3B8] leading-relaxed">
                SafetyShield viene adottata quando la priorità è proteggere le persone e ridurre le conseguenze della rottura del vetro.
              </p>
            </div>
            <div className="space-y-4">
              {liveSolarisNarrative.map((item) => (
                <article key={item} className="card-glass rounded-xl p-6">
                  <p className="text-[#CBD5E1] leading-relaxed">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">FAQ SafetyShield</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Domande frequenti su scenari speciali
              </h2>
            </div>
            <div className="space-y-4">
              {faqSpecifiche.map((item) => (
                <article key={item.q} className="rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <h3 className="text-xl font-medium text-[#0A0F1C]">{item.q}</h3>
                  <p className="mt-3 text-[#475569] leading-relaxed">{item.a}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Supporti ufficiali</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">Documenti Madico</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {supportiUfficiali.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="rounded-xl border border-[#E2E8F0] bg-white p-5 flex items-start gap-3">
                  <DownloadSimple size={20} className="text-[#2563EB] mt-0.5" />
                  <span className="text-[#0A0F1C] font-medium">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-medium text-white mb-4">Attiviamo un percorso SafetyShield sul tuo edificio</h2>
            <p className="text-[#94A3B8] mb-8">
              Se il contesto richiede protezione speciale contro scenari estremi, Solaris imposta la configurazione completa:
              film, ancoraggio e posa tecnica.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/preventivo" className="btn-yellow">Richiedi analisi SafetyShield</Link>
              <a href="tel:+390559107621" className="btn-secondary">055 9107621</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default SafetyShieldPagina;
