import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown, Question } from '@phosphor-icons/react';

const faqItems = [
  {
    q: 'Quanto costa installare le pellicole per vetri?',
    a: 'Il costo dipende dal tipo di pellicola, dalle dimensioni delle superfici e dalla complessità dell\'installazione. Offriamo sopralluogo e preventivo gratuiti entro 24 ore. L\'investimento si ammortizza tipicamente in 2-3 anni grazie al risparmio energetico.',
  },
  {
    q: 'Le pellicole antisolari funzionano anche in inverno?',
    a: 'Sì. In estate riducono il calore in ingresso fino a 8°C e i costi di climatizzazione del 30-50%. In inverno contribuiscono a trattenere il calore interno, migliorando l\'isolamento termico complessivo dell\'edificio.',
  },
  {
    q: 'Quanto durano le pellicole MADICO?',
    a: 'Le pellicole MADICO hanno garanzia fino a 10 anni per le versioni sputtered e sunscape installate in esterno. La vita media reale è spesso superiore ai 15-20 anni. Le pellicole di sicurezza interne hanno durata ancora maggiore.',
  },
  {
    q: 'L\'installazione richiede lavori invasivi?',
    a: 'Assolutamente no. L\'installazione è rapida, pulita e non richiede alcun lavoro strutturale. Non interrompe le attività produttive e non modifica gli infissi esistenti. Il nostro personale è altamente specializzato.',
  },
  {
    q: 'Le pellicole SafetyShield proteggono davvero dalle esplosioni?',
    a: 'Sì. Le pellicole SafetyShield MADICO sono testate secondo standard GSA (3A, 3B), ASTM F1642 (Blast Mitigation), ASTM F3561 (Forced Entry) e EN 356. Il sistema FrameGard brevettato tiene il vetro in posizione con una forza di 500-800 libbre per piede lineare.',
  },
  {
    q: 'Operate in tutta Italia?',
    a: 'Sì, operiamo in tutta Italia e in Europa. La nostra sede è in Toscana ma il nostro network di installatori certificati copre l\'intero territorio nazionale. Dal 2026 distribuiamo anche in Spagna e Isole Canarie.',
  },
  {
    q: 'Le pellicole sono conformi alle normative sulla sicurezza sul lavoro?',
    a: 'Sì. Le nostre pellicole di sicurezza ottemperano ai requisiti del D.Lgs. 81/2008 (Testo Unico sulla Sicurezza) in materia di microclima e sicurezza delle superfici vetrate, risultando un\'opzione per rispettare i requisiti minimi.',
  },
  {
    q: 'Posso installare le pellicole su vetri doppi o Low-E?',
    a: 'Sì, nella maggior parte dei casi le pellicole possono essere installate su vetri singoli, vetrocamera e anche vetri Low-E. Il nostro team effettua sempre una valutazione tecnica durante il sopralluogo gratuito.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-32 relative" data-testid="faq-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Question size={32} weight="light" className="text-[#EAB308]" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-medium text-white mb-4">
            Domande <span className="text-gradient">frequenti</span>
          </h2>
          <p className="text-[#94A3B8] text-lg">
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
              className="card-glass rounded-xl overflow-hidden"
              data-testid={`faq-item-${index}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-white font-medium pr-4">{item.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <CaretDown size={20} className={`${openIndex === index ? 'text-[#EAB308]' : 'text-white/40'} transition-colors`} />
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
                      <div className="h-px bg-white/5 mb-4" />
                      <p className="text-[#94A3B8] leading-relaxed">{item.a}</p>
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
