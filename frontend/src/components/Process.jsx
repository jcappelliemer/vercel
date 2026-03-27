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
    <section className="py-24 md:py-32 bg-[#05050A] relative overflow-hidden" data-testid="process-section">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#00E5FF]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF]">
                Come Lavoriamo
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-6">
              Un processo<br />
              <span className="text-gradient">semplice e chiaro</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-md">
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
          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group glass p-6 hover:border-[#00E5FF]/30 transition-all duration-500"
              >
                <div className="flex items-start gap-6">
                  <div className="text-4xl font-light text-[#00E5FF]/30 group-hover:text-[#00E5FF]/60 transition-colors">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-400">{step.description}</p>
                  </div>
                  <div className="ml-auto hidden sm:block">
                    <div className="w-8 h-8 border border-white/10 flex items-center justify-center group-hover:border-[#00E5FF]/50 group-hover:bg-[#00E5FF]/10 transition-all">
                      <Check size={16} weight="bold" className="text-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
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
