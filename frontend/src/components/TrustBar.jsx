import { motion } from 'framer-motion';
import { ShieldCheck, Medal, Certificate, Leaf } from '@phosphor-icons/react';

const trustItems = [
  { icon: Certificate, label: 'ISO 9001', desc: 'Certificato' },
  { icon: Medal, label: 'MADICO USA', desc: 'Esclusivista Italia' },
  { icon: ShieldCheck, label: 'UNI EN 12600', desc: 'Sicurezza Certificata' },
  { icon: Leaf, label: 'Sostenibilità', desc: 'Eco-friendly' },
];

const TrustBar = () => {
  return (
    <section className="py-16 bg-[#0B101E] border-y border-white/5" data-testid="trust-bar">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 group"
            >
              <div className="w-14 h-14 border border-white/10 flex items-center justify-center group-hover:border-[#00E5FF]/30 transition-colors">
                <item.icon size={24} weight="light" className="text-[#00E5FF]" />
              </div>
              <div>
                <div className="text-white font-medium">{item.label}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
