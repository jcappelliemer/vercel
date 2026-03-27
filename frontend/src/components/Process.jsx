import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from '@phosphor-icons/react';

const steps = [
  {
    number: '01',
    title: 'Sopralluogo Gratuito',
    description: 'Analisi tecnico-energetica delle vetrate e consulenza personalizzata.',
  },
  {
    number: '02',
    title: 'Preventivo Dettagliato',
    description: 'Proposta su misura con calcolo del risparmio energetico atteso.',
  },
  {
    number: '03',
    title: 'Installazione Professionale',
    description: 'Intervento rapido senza interruzioni, con personale specializzato.',
  },
  {
    number: '04',
    title: 'Garanzia 10 Anni',
    description: 'Assistenza completa e garanzia estesa su prodotto e posa.',
  },
];

const Process = () => {
  return (
    <section className="py-24 md:py-32 bg-[#FAFBFC] relative overflow-hidden" data-testid="process-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="accent-line" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0891B2]">
                Come Lavoriamo
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#0F172A] mb-6">
              Un processo<br />
              <span className="text-gradient font-medium">semplice e chiaro</span>
            </h2>
            <p className="text-slate-500 mb-8 max-w-md">
              Dalla consulenza all'installazione, ti accompagniamo in ogni fase 
              con trasparenza e professionalità.
            </p>
            <Link 
              to="/preventivo"
              className="btn-cyan"
              data-testid="process-cta"
            >
              Inizia Ora
              <ArrowRight size={18} weight="bold" />
            </Link>
          </motion.div>

          {/* Right - Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group bg-white border border-slate-200 p-6 hover:border-[#0891B2]/30 hover:shadow-lg transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl font-light text-[#0891B2]/30 group-hover:text-[#0891B2]/60 transition-colors">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-[#0F172A] mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500">{step.description}</p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-8 h-8 border border-slate-200 flex items-center justify-center group-hover:border-[#0891B2]/50 group-hover:bg-[#0891B2]/10 transition-all">
                      <Check size={16} weight="bold" className="text-[#0891B2] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
