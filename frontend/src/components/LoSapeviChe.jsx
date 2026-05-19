import { motion } from 'framer-motion';
import { Lightbulb } from '@phosphor-icons/react';

const facts = [
  {
    question: 'Serve sostituire i vetri per migliorare comfort e calore?',
    answer: 'Spesso no. Se il vetro è compatibile, una pellicola professionale può migliorare controllo solare, raggi UV e abbagliamento senza lavori invasivi sui serramenti.',
  },
  {
    question: 'Una pellicola antisolare deve per forza scurire molto?',
    answer: 'No. Esistono finiture più neutre, riflettenti o selettive: la scelta dipende da esposizione, tipo di vetro, luminosità desiderata e risultato estetico.',
  },
  {
    question: 'La sicurezza del vetro dipende solo dallo spessore?',
    answer: 'No. Contano anche destinazione d\'uso, telaio, superficie, rischio da ridurre e norma di riferimento. Per questo la verifica tecnica viene prima del prodotto.',
  },
  {
    question: 'Privacy significa sempre perdere luce?',
    answer: 'Non necessariamente. Pellicole satinate, decorative o privacy possono schermare la vista mantenendo ambienti leggibili, ordinati e coerenti con il progetto.',
  },
  {
    question: 'Si può scegliere solo dal nome della pellicola?',
    answer: 'Meglio di no. Codice prodotto e famiglia aiutano, ma la scelta corretta nasce da vetro, esposizione, obiettivo, resa estetica e condizioni di posa.',
  },
  {
    question: 'Da cosa parte un preventivo più preciso?',
    answer: 'Foto, misure indicative, destinazione d\'uso e problema da risolvere aiutano Solaris a capire se serve controllo solare, sicurezza, privacy o una combinazione.',
  },
];

const LoSapeviChe = () => {
  return (
    <section className="py-32 bg-[#111827]/50 border-y border-white/5" data-testid="lo-sapevi-che-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb size={32} weight="light" className="text-[#EAB308]" />
              <h2 className="text-4xl lg:text-5xl font-medium text-white">
                Lo sapevi <span className="text-gradient">che?</span>
              </h2>
            </div>
          </div>
          <p className="text-[#94A3B8] max-w-md lg:text-right text-lg">
            Dubbi pratici sulle pellicole per vetri, spiegati in modo semplice prima della verifica Solaris.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facts.map((fact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className="card-glass rounded-2xl p-7 group"
              data-testid={`fact-${index}`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#EAB308]/10 flex items-center justify-center mb-5 group-hover:bg-[#EAB308]/20 transition-all">
                <span className="text-[#EAB308] font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="text-white font-medium mb-3 leading-snug group-hover:text-[#EAB308] transition-colors">
                {fact.question}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{fact.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LoSapeviChe;
