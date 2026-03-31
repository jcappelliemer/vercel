import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';

const steps = [
  { number: '01', title: 'Sopralluogo', desc: 'Analisi gratuita delle tue vetrate e delle problematiche da risolvere.' },
  { number: '02', title: 'Preventivo', desc: 'Proposta dettagliata su misura, con analisi costi/benefici.' },
  { number: '03', title: 'Installazione', desc: 'Intervento rapido e professionale, senza interrompere attività.' },
  { number: '04', title: 'Garanzia', desc: 'Fino a 10 anni di copertura totale e assistenza post-vendita.' },
];

const Process = () => {
  return (
    <section className="py-32 relative section-light" data-testid="process-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="accent-bar w-16 mb-6" />
            <h2 className="text-4xl lg:text-5xl font-medium mb-6">
              Processo
              <span className="text-gradient"> semplice</span>
            </h2>
            <p className="text-lg mb-10 max-w-md" style={{ color: '#64748B' }}>
              Dalla consulenza all'installazione, ti accompagniamo con trasparenza in ogni fase.
            </p>
            <Link to="/preventivo" className="btn-primary group">
              <span>Inizia Ora</span>
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ x: 10 }}
                className="group flex items-center gap-6 p-6 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#EAB308]/40 hover:shadow-lg transition-all cursor-default"
              >
                <div className="text-5xl font-bold text-gradient opacity-60 group-hover:opacity-100 transition-opacity">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-[#0A0F1C] group-hover:text-[#2563EB] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: '#64748B' }}>{step.desc}</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#EAB308]/30 group-hover:bg-[#EAB308] transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
