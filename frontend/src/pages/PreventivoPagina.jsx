import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import QuoteForm from '../components/QuoteForm';
import { motion } from 'framer-motion';
import {
  Buildings,
  Camera,
  CheckCircle,
  Clock,
  Phone,
  Ruler,
  ShieldCheck,
  WhatsappLogo,
} from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';
import { buildWhatsAppHref } from '../utils/contactLinks';

const benefits = [
  'Preventivo in 24 ore',
  'Consulenza gratuita',
  'Sopralluogo senza impegno',
  'Garanzia fino a 10 anni',
];

const quoteContext = [
  {
    icon: Buildings,
    title: 'Edificio e contesto',
    text: 'Casa, ufficio, scuola, negozio o facciata vetrata: il contesto cambia la scelta della pellicola.',
  },
  {
    icon: Ruler,
    title: 'Misure e superfici',
    text: 'Metri quadri, numero di vetri e dimensioni aiutano a dare una prima stima credibile.',
  },
  {
    icon: Camera,
    title: 'Foto e obiettivo',
    text: 'Calore, sicurezza, privacy o design: una foto del vetro accelera la verifica tecnica Solaris.',
  },
];

const processSteps = [
  'Analisi della richiesta e delle condizioni del vetro',
  'Individuazione della famiglia MADICO più adatta',
  'Stima economica o richiesta di sopralluogo quando serve',
];

const PreventivoPagina = () => {
  const settings = useSettings();

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="preventivo-page">
      <SEO
        title="Richiedi Preventivo Gratuito"
        description="Richiedi un preventivo gratuito e senza impegno per pellicole antisolari, di sicurezza o privacy MADICO. Risposta in 24 ore."
        path="/preventivo"
      />
      <Header />

      <main className="pt-24">
        <section className="py-14 md:py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 items-center">
              <div className="max-w-3xl">
                <div className="accent-bar w-16 mb-6" />
                <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">
                  Preventivo tecnico Solaris
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                  Richiedi il tuo
                  <br />
                  <span className="text-gradient">preventivo</span>
                </h1>
                <p className="text-lg text-[#94A3B8] leading-relaxed">
                  Raccontaci cosa vuoi ottenere dai vetri. Solaris valuta superficie, obiettivo tecnico, foto e
                  contesto prima di indicare prodotto e posa corretti.
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                  {['Calore e abbagliamento', 'Sicurezza vetri', 'Privacy e design'].map((item) => (
                    <span key={item} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white/75">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <figure className="relative min-h-[230px] overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src="/assets/generated/main-pages/preventivo-misure-foto.webp"
                    alt="Foto, misure e campioni vetro per preparare un preventivo Solaris"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/85 via-[#0A0F1C]/10 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#EAB308]">Dati utili</span>
                    <p className="mt-2 text-sm leading-relaxed text-white">Foto e misure aiutano a leggere il caso reale prima della stima.</p>
                  </figcaption>
                </figure>

                <aside className="card-glass rounded-2xl p-6 md:p-8" aria-label="Dati utili per il preventivo">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#EAB308]/15 border border-[#EAB308]/25 flex items-center justify-center">
                      <ShieldCheck size={22} weight="fill" className="text-[#EAB308]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#94A3B8]">Risposta qualificata</p>
                      <h2 className="text-xl font-medium text-white">Cosa serve per stimare bene</h2>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {quoteContext.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="flex gap-3">
                          <Icon size={20} weight="light" className="text-[#EAB308] shrink-0 mt-1" />
                          <div>
                            <h3 className="text-sm font-medium text-white">{item.title}</h3>
                            <p className="text-sm text-[#94A3B8] mt-1">{item.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section className="preventivo-form-light py-14 md:py-20 bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <p className="text-[#B45309] text-sm font-medium uppercase tracking-wider mb-3">Dati richiesta</p>
                  <h2 className="text-3xl md:text-4xl font-medium text-[#0A0F1C]">Raccontaci il caso reale</h2>
                  <p className="text-[#475569] mt-3 max-w-2xl">
                    Anche una descrizione breve va bene: se servono dettagli, il team Solaris li richiede prima della
                    proposta finale.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-10 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
                  <QuoteForm />
                </div>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm"
                >
                  <h3 className="font-medium text-white mb-4">Perché scegliere Solaris</h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-3">
                        <CheckCircle size={18} weight="fill" className="text-[#EAB308]" />
                        <span className="text-sm text-[#94A3B8]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 }}
                  className="rounded-2xl p-6 bg-white border border-[#E2E8F0] shadow-sm"
                >
                  <h3 className="font-medium text-white mb-4">Dopo l'invio</h3>
                  <ol className="space-y-3">
                    {processSteps.map((step, index) => (
                      <li key={step} className="flex gap-3 text-sm text-[#94A3B8]">
                        <span className="w-6 h-6 rounded-full bg-[#EAB308]/15 text-[#EAB308] flex items-center justify-center text-xs shrink-0">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.16 }}
                  className="rounded-2xl p-6 bg-white border border-[#E2E8F0] shadow-sm"
                >
                  <h3 className="font-medium text-white mb-4">Preferisci parlare?</h3>
                  <div className="space-y-4">
                    <a
                      href="tel:+390559107621"
                      className="flex items-center gap-3 text-[#94A3B8] hover:text-[#EAB308] transition-colors"
                      data-testid="preventivo-phone"
                    >
                      <Phone size={18} weight="light" className="text-[#EAB308]" />
                      <span className="text-sm">+39 055 910 7621</span>
                    </a>
                    <a
                      href={buildWhatsAppHref(settings.whatsapp, 'Ciao, preferisco parlare con Solaris Films per un preventivo.')}
                      className="flex items-center gap-3 text-[#94A3B8] hover:text-[#25D366] transition-colors"
                      data-testid="preventivo-whatsapp"
                    >
                      <WhatsappLogo size={18} weight="fill" className="text-[#25D366]" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24 }}
                  className="rounded-2xl p-6"
                  style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={20} weight="light" className="text-white" />
                    <span className="font-medium text-white">Risposta in 24h</span>
                  </div>
                  <p className="text-sm text-white/80">Garantiamo una risposta entro 24 ore lavorative.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default PreventivoPagina;
