import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown, Question } from '@phosphor-icons/react';
import fixes from '../data/orchestra-fixes.json';

const FALLBACK_FAQ = [
  {
    q: 'Quanto costa installare le pellicole per vetri?',
    a: 'Il costo dipende dal tipo di pellicola, dalla superficie da trattare, dalla posizione dei vetri e dalla complessità della posa. Per questo Solaris parte sempre da una verifica del caso reale: dimensioni, tipo di vetro, obiettivo e condizioni di installazione.',
  },
  {
    q: 'Cosa sono le pellicole per vetri?',
    a: 'Sono film tecnici applicati sulle superfici vetrate esistenti per migliorare comfort, sicurezza, privacy o comunicazione visiva. A seconda della famiglia scelta possono ridurre calore e abbaglio, trattenere i frammenti in caso di rottura, proteggere la privacy o trasformare il vetro in una superficie decorativa.',
  },
  {
    q: 'Le pellicole antisolari funzionano anche in inverno?',
    a: 'La loro funzione principale è ridurre l’irraggiamento solare, il calore e l’abbaglio quando il sole incide sulle vetrate. Il beneficio più evidente si misura quindi nei mesi caldi e nelle esposizioni critiche; in ogni progetto va comunque verificato il tipo di vetro e l’obiettivo da raggiungere.',
  },
  {
    q: 'Quanto durano le pellicole Madico?',
    a: 'La durata dipende dalla famiglia prodotto, dall’esposizione e dalla corretta installazione. Le pellicole Madico distribuite da Solaris prevedono garanzie convenzionali specifiche, in molti casi fino a 10 anni, se posate da personale qualificato e su supporti idonei.',
  },
  {
    q: 'L’installazione richiede lavori invasivi?',
    a: 'No. La posa avviene sul vetro esistente, senza sostituire infissi o modificare la struttura. Il vetro viene pulito, preparato e trattato con procedure specifiche; nella maggior parte dei casi l’intervento è rapido e compatibile con uffici, negozi, abitazioni e ambienti produttivi.',
  },
  {
    q: 'Le pellicole vanno installate all’interno o all’esterno?',
    a: 'Dipende dal prodotto e dal vetro. Alcune pellicole sono pensate per posa interna, altre per posa esterna, soprattutto quando servono controllo solare elevato, compatibilità con vetrocamera o prestazioni particolari. La scelta corretta si fa dopo la verifica tecnica della vetrata.',
  },
  {
    q: 'Come si sceglie la pellicola corretta?',
    a: 'Si parte dal problema da risolvere: calore, abbaglio, sicurezza, privacy, protezione da urti o valorizzazione estetica. Poi si verifica il tipo di vetro, l’esposizione, il contesto architettonico e le prestazioni attese. Solo dopo si sceglie la famiglia di prodotto più adatta.',
  },
  {
    q: 'Le pellicole SafetyShield proteggono davvero dalle esplosioni?',
    a: 'SafetyShield è una linea speciale per scenari ad alto rischio. Abbinata a sistemi di ancoraggio come FrameGard e GullWing, aiuta a trattenere il vetro e a ridurre la proiezione di frammenti in caso di esplosioni, urti violenti o eventi estremi. La configurazione va sempre progettata sul caso reale.',
  },
  {
    q: 'Operate in tutta Italia?',
    a: 'Sì. Solaris lavora su tutto il territorio nazionale con interventi diretti, rete tecnica e pagine locali dedicate. La valutazione parte sempre dall’esigenza dell’edificio e dalla città di riferimento.',
  },
  {
    q: 'Le pellicole sono conformi alle normative sulla sicurezza sul lavoro?',
    a: 'Le pellicole di sicurezza certificate possono contribuire alla messa in sicurezza delle superfici vetrate esistenti, in relazione agli obblighi di valutazione del rischio e alle prestazioni richieste. Per questo Solaris collega sempre prodotto, certificazione e contesto applicativo.',
  },
  {
    q: 'Posso installare le pellicole su vetri doppi o Low-E?',
    a: 'In molti casi sì, ma non si decide a catalogo. Vetrocamera, basso emissivo, esposizione e posizione della pellicola cambiano la scelta del prodotto. La verifica preliminare serve proprio a evitare incompatibilità e a scegliere una soluzione coerente con il vetro esistente.',
  },
  {
    q: 'Perché scegliere Solaris?',
    a: 'Perché il lavoro non si ferma alla vendita della pellicola. Solaris unisce distribuzione Madico, esperienza applicativa, verifica del vetro, scelta del prodotto, posa qualificata e documentazione tecnica, così il risultato è coerente con l’obiettivo dell’intervento.',
  },
];

// Orchestra-managed FAQ for the home ('/'), with the hardcoded list as fallback.
// Supports both {q,a} and {question,answer} shapes. Zero visual change downstream.
const _orchFaq = fixes && fixes.byPath && fixes.byPath['/'] && fixes.byPath['/'].aeo
  ? fixes.byPath['/'].aeo.faq
  : null;
const HOME_FAQ = (Array.isArray(_orchFaq) && _orchFaq.length)
  ? _orchFaq
      .map((x) => ({ q: x.q || x.question || '', a: x.a || x.answer || '' }))
      .filter((x) => x.q && x.a)
  : FALLBACK_FAQ;

// A.4: reusable across templates — pass `items` (per-path FAQ from the connector);
// no prop = home behaviour (orchestra '/' or hardcoded fallback). Zero home change.
const FAQ = ({ items }) => {
  const faqItems = (Array.isArray(items) && items.length) ? items : HOME_FAQ;
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-32 section-light border-y border-[#E2E8F0]" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Question size={32} weight="light" className="text-[#2563EB]" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-medium text-[#0A0F1C] mb-4">
            Domande <span className="text-gradient">frequenti</span>
          </h2>
          <p className="text-[#475569] text-lg">
            Tutto quello che devi sapere sulle pellicole per vetri.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-white shadow-sm"
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="text-[#0A0F1C] font-medium pr-4">{item.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <CaretDown size={20} className={`${openIndex === index ? 'text-[#EAB308]' : 'text-[#64748B]'} transition-colors`} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="h-px bg-[#E2E8F0] mb-4" />
                      <p className="text-[#475569] leading-relaxed">{item.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
