import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { Link } from '@/next/router-shim';
import { ArrowRight, CheckCircle, DownloadSimple, ShieldCheck } from '@phosphor-icons/react';

const metriche = [
  { label: 'Spessore SafetyShield G2 800', value: '240 micron' },
  { label: 'Spessore SafetyShield G2 1500', value: '432 micron' },
  { label: 'Peel strength', value: '4.5-5.5 kg / 2.5 cm' },
  { label: 'Blast G2 800', value: '28 kPa / 193 kPa·ms (H4)' },
  { label: 'Blast G2 1500 con ancoraggio', value: '48 kPa / 365 kPa·ms (H2)' },
  { label: 'EN 356 (condizione testata)', value: 'P2A su vetro 6 mm' },
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
                  Questa pagina parla solo di SafetyShield e dei sistemi di ancoraggio dedicati. Il percorso parte dal rischio reale
                  sul vetro e arriva alla configurazione corretta con film, telaio e posa.
                </p>
                <p className="text-[#94A3B8] leading-relaxed">
                  Se il tema Ã¨ sicurezza avanzata su superfici vetrate, qui trovi dati, supporti ufficiali e differenze operative
                  tra FrameGard e GullWing.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  <Link to="/preventivo" className="btn-yellow group">
                    Richiedi verifica SafetyShield
                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
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
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Dati tecnici</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                SafetyShield in metrica europea
              </h2>
              <p className="text-[#475569] leading-relaxed">
                Valori chiave da usare per un confronto serio prima del sopralluogo.
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
                    Sistema perimetrale studiato per mantenere il vetro nel vano in caso di rottura, riducendo la proiezione di
                    frammenti verso l'interno.
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
                    Sistema di ancoraggio meccanico utilizzato in configurazioni dove serve una maggiore tenuta complessiva del
                    sistema vetro + film.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.3em] text-[#2563EB] mb-4">Supporti ufficiali</p>
              <h2 className="text-3xl lg:text-4xl font-medium text-[#0A0F1C] mb-5">
                Documenti Madico e riferimenti Solaris
              </h2>
              <p className="text-[#475569] leading-relaxed">
                Materiale di riferimento per dati, test e configurazioni SafetyShield.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {supportiUfficiali.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noreferrer" className="rounded-xl border border-[#E2E8F0] bg-white p-5 flex items-start gap-3">
                  <DownloadSimple size={20} className="text-[#2563EB] mt-0.5" />
                  <span className="text-[#0A0F1C] font-medium">{item.label}</span>
                </a>
              ))}
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              <a href="https://www.solarisfilms.it/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-800/" target="_blank" rel="noreferrer" className="rounded-xl border border-[#E2E8F0] bg-white p-5 flex items-center justify-between">
                <span className="text-[#0A0F1C] font-medium">Pagina live Solaris: SafetyShield 800</span>
                <ArrowRight size={18} className="text-[#2563EB]" />
              </a>
              <a href="https://www.solarisfilms.it/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-1500/" target="_blank" rel="noreferrer" className="rounded-xl border border-[#E2E8F0] bg-white p-5 flex items-center justify-between">
                <span className="text-[#0A0F1C] font-medium">Pagina live Solaris: SafetyShield 1500</span>
                <ArrowRight size={18} className="text-[#2563EB]" />
              </a>
            </div>
          </div>
        </section>

        <section className="py-20 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-medium text-white mb-4">Vuoi capire se SafetyShield Ã¨ adatta al tuo edificio?</h2>
            <p className="text-[#94A3B8] mb-8">
              Partiamo dal vetro reale, dal rischio e dall'obiettivo tecnico prima di proporre il sistema di posa.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/preventivo" className="btn-yellow">Richiedi analisi SafetyShield</Link>
              <a href="tel:+390559107621" className="btn-secondary">055 9107621</a>
            </div>
            <p className="mt-6 text-sm text-[#64748B]">
              Fonti principali: madico.com (SafetyShield, FrameGard, GullWing datasheet/sell sheet) e sito live solarisfilms.it.
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
