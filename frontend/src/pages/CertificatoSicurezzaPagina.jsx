import { Helmet } from 'react-helmet-async';
import { ArrowRight, QrCode, ShieldCheck } from 'lucide-react';

const safetyClasses = [
  {
    product: 'MADICO CL 700',
    className: 'Classe 1B1',
    description:
      'Pellicola di sicurezza trasparente ad alte prestazioni. Quando il certificato dell’intervento indica CL 700, il vetro trattato viene dichiarato in classe 1B1 secondo UNI EN 12600:2004.',
  },
  {
    product: 'MADICO CL 400',
    className: 'Classe 2B2',
    description:
      'Pellicola di sicurezza trasparente per la messa in sicurezza del vetro esistente. Quando il certificato dell’intervento indica CL 400, il vetro trattato viene dichiarato in classe 2B2 secondo UNI EN 12600:2004.',
  },
];

const normativeReferences = [
  {
    title: 'UNI EN 12600:2004',
    subtitle:
      'Vetro per edilizia - Prova del pendolo - Metodo della prova di impatto e classificazione per il vetro piano.',
    text:
      'È la norma che classifica il comportamento del vetro piano all’impatto e la modalità di rottura. Le classi 1B1 e 2B2 indicano livelli diversi di prestazione del sistema vetrato sottoposto a prova.',
  },
  {
    title: 'UNI 7697:2021',
    subtitle: 'Criteri di sicurezza nelle applicazioni vetrarie.',
    text:
      'Definisce i criteri per scegliere il vetro idoneo in base alla destinazione d’uso e ai requisiti minimi di sicurezza per le persone.',
  },
  {
    title: 'D.Lgs. 9 aprile 2008, n. 81',
    subtitle:
      'Attuazione dell’articolo 1 della legge 3 agosto 2007, n. 123, in materia di tutela della salute e della sicurezza nei luoghi di lavoro.',
    text:
      'Nei luoghi di lavoro, la messa in sicurezza delle superfici vetrate si collega agli obblighi di prevenzione e tutela delle persone presenti negli ambienti.',
  },
];

export default function CertificatoSicurezzaPagina() {
  const canonical = 'https://www.solarisfilms.it/certificato-di-sicurezza/';
  const title = 'Certificato di sicurezza vetro trattato | Solaris Films';
  const description =
    'Pagina QR Solaris Films per verificare il significato della messa in sicurezza del vetro trattato con pellicole MADICO certificate secondo UNI EN 12600:2004 e conformi ai criteri UNI 7697:2021.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    url: canonical,
    description,
    publisher: {
      '@type': 'Organization',
      name: 'Solaris Films',
      url: 'https://www.solarisfilms.it/',
    },
    about: {
      '@type': 'Service',
      name: 'Verifica QR certificato di sicurezza vetro trattato',
      serviceType: 'Pellicole di sicurezza certificate per superfici vetrate',
    },
  };

  return (
    <main className="bg-[#F4F7FB] text-[#0B1726]">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative overflow-hidden bg-[#07111F] text-white">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#0F7C80]/40 to-transparent" />
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-10 md:py-20">
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F8C400]/40 bg-[#F8C400]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#F8C400]">
              <QrCode size={18} />
              QR sul vetro trattato
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
              Questo vetro è stato trasformato in vetro di sicurezza
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#D8E3F0]">
              Il QR che hai scansionato si trova sul singolo vetro trattato. Quel vetro, prima
              dell’intervento, era una superficie vetrata non classificata come vetro di sicurezza.
              Con l’applicazione della pellicola di sicurezza MADICO installata da Solaris Films è
              stato portato a una classificazione di sicurezza secondo UNI EN 12600:2004, in
              conformità ai criteri della UNI 7697:2021.
            </p>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-[#F8C400] p-3 text-[#07111F]">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#F8C400]">
                  Classe del vetro scansionato
                </p>
                <h2 className="mt-2 text-2xl font-bold">CL 700 classe 1B1 · CL 400 classe 2B2</h2>
                <p className="mt-3 leading-7 text-[#D8E3F0]">
                  Se sul certificato dell’intervento è indicata pellicola MADICO CL 700, la classe
                  dichiarata è 1B1. Se è indicata MADICO CL 400, la classe dichiarata è 2B2. Il
                  certificato nominale collega il prodotto installato a quel vetro, al luogo di posa
                  e alla documentazione dell’intervento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-[#DDE6F1]">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0F7C80]">
            Cosa significa questa scansione
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            Il QR collega il vetro trattato alla sua messa in sicurezza
          </h2>
          <p className="mt-4 max-w-4xl leading-7 text-[#3A4A5F]">
            La pellicola di sicurezza applicata sul vetro modifica il comportamento della lastra in
            caso di urto e rottura: il film trattiene i frammenti, limita la dispersione delle
            schegge e riduce il rischio di ferite. La classificazione dichiarata riguarda il sistema
            vetrato trattato e deve essere coerente con il prodotto installato, la posa e la
            documentazione rilasciata per l’intervento.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14 md:px-10">
        <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-[#DDE6F1]">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0F7C80]">
            Classi di sicurezza
          </p>
          <h2 className="mt-3 text-3xl font-bold">CL 700 e CL 400 nei certificati Solaris</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {safetyClasses.map((item) => (
              <div key={item.product} className="rounded-xl border border-[#DDE6F1] bg-[#F8FAFC] p-5">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#0F7C80]">
                  {item.product}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-[#07111F]">{item.className}</h3>
                <p className="mt-3 text-sm leading-6 text-[#3A4A5F]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14 md:px-10">
        <div className="rounded-2xl bg-[#EAF3F4] p-7 ring-1 ring-[#C6DADC]">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#0F7C80]">
            Riferimenti normativi
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#07111F]">
            Perché si parla di UNI EN 12600:2004 e UNI 7697:2021
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {normativeReferences.map((item) => (
              <div key={item.title} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-[#DDE6F1]">
                <h3 className="text-xl font-bold text-[#07111F]">{item.title}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#0F7C80]">{item.subtitle}</p>
                <p className="mt-3 text-sm leading-6 text-[#3A4A5F]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="rounded-2xl bg-[#07111F] p-7 text-white md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#F8C400]">
              Approfondimento tecnico
            </p>
            <h2 className="mt-3 text-3xl font-bold">Pellicole di sicurezza Solaris</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#D8E3F0]">
              Per approfondire classi, prodotti e campi di applicazione, consulta la pagina tecnica
              dedicata alle pellicole di sicurezza per vetri.
            </p>
          </div>
          <a
            href="/pellicole-di-sicurezza/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F8C400] px-5 py-4 font-bold text-[#07111F] md:mt-0"
          >
            Vai alla pagina sicurezza
            <ArrowRight size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}
