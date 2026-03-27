import { motion } from 'framer-motion';
import { Lightbulb } from '@phosphor-icons/react';

const facts = [
  {
    question: 'Le pellicole antisolari sostituiscono i vetri?',
    answer: 'No! Le pellicole si applicano sui vetri esistenti, migliorandone le prestazioni senza lavori strutturali. Dopo 20 giorni diventano un corpo unico con il vetro.',
  },
  {
    question: 'Le pellicole riducono la luminosità interna?',
    answer: 'Le pellicole eliminano la sensazione di irraggiamento e il riflesso solare, ma mantengono la luminosità naturale. Puoi scegliere tra pellicole chiare, riflettenti e semi-riflettenti in diversi colori.',
  },
  {
    question: 'Quanto si risparmia davvero?',
    answer: 'Il risparmio medio va dal 30% al 50% sui costi di climatizzazione estiva. L\'investimento si ammortizza in massimo 3 anni, a fronte di una garanzia fino a 10 anni.',
  },
  {
    question: 'Le pellicole di sicurezza resistono davvero alle esplosioni?',
    answer: 'Il sistema SafetyShield MADICO è testato contro cariche esplosive fino a 1.100 kg e soddisfa gli standard GSA, ISO e DIN-52,290. Tiene il vetro in posizione anche dopo l\'onda d\'urto.',
  },
  {
    question: 'Si possono installare su qualsiasi vetro?',
    answer: 'Sì, su vetri singoli, vetrocamera, vetri a taglio termico e anche Low-E. Il nostro team valuta sempre la compatibilità durante il sopralluogo gratuito.',
  },
  {
    question: 'Le pellicole resistono nel tempo?',
    answer: 'Le pellicole MADICO hanno una garanzia fino a 10 anni per le versioni sputtered e sunscape, con una vita media reale spesso superiore ai 15-20 anni.',
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
            Risposte alle domande più frequenti sulle pellicole per vetri.
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
