import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';

const steps = [
  { number: '01', title: 'Sopralluogo', desc: 'Analisi gratuita delle tue vetrate' },
  { number: '02', title: 'Preventivo', desc: 'Proposta dettagliata su misura' },
  { number: '03', title: 'Installazione', desc: 'Intervento rapido e professionale' },
  { number: '04', title: 'Garanzia', desc: '10 anni di copertura totale' },
];

const Process = () => {
  return (
    <section className="py-32 relative overflow-hidden" data-testid="process-section">
      {/* Background accent */}
      <div className="absolute top-1/2 left-0 w-1/2 h-[500px] bg-gradient-to-r from-[#7C3AED]/10 to-transparent blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="accent-bar w-16 mb-6" />
            <h2 className="text-4xl lg:text-5xl font-medium text-white mb-6">
              Processo
              <span className="text-gradient"> semplice</span>
            </h2>
            <p className="text-[#8B9AB8] text-lg mb-10 max-w-md">
              Dalla consulenza all'installazione, ti accompagniamo con trasparenza.
            </p>
            <Link to="/preventivo" className="btn-primary group">
              <span>Inizia Ora</span>
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
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
                whileHover={{ x: 10 }}
                className="group flex items-center gap-6 p-6 rounded-xl bg-[#131B2E]/50 border border-white/5 hover:border-[#00D4FF]/30 hover:bg-[#1A2540]/50 transition-all cursor-default"
              >
                <div className="text-5xl font-bold text-gradient opacity-50 group-hover:opacity-100 transition-opacity">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white group-hover:text-[#00D4FF] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#8B9AB8] mt-1">{step.desc}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#00D4FF]/30 group-hover:bg-[#00D4FF] group-hover:glow-cyan transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
