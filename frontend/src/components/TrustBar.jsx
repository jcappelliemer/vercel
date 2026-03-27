import { motion } from 'framer-motion';
import { ShieldCheck, Medal, Certificate, Leaf } from '@phosphor-icons/react';

const trustItems = [
  { icon: Certificate, label: 'ISO 9001', value: 'Certificato' },
  { icon: Medal, label: 'MADICO', value: 'Esclusivista' },
  { icon: ShieldCheck, label: 'UNI EN 12600', value: 'Sicurezza' },
  { icon: Leaf, label: 'Green', value: 'Eco-friendly' },
];

const TrustBar = () => {
  return (
    <section className="py-12 border-y border-white/5" data-testid="trust-bar">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00D4FF]/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#00D4FF]/10 to-[#7C3AED]/10 group-hover:from-[#00D4FF]/20 group-hover:to-[#7C3AED]/20 transition-all">
                <item.icon size={22} weight="light" className="text-[#00D4FF]" />
              </div>
              <div>
                <div className="text-white font-medium">{item.label}</div>
                <div className="text-xs text-[#8B9AB8] uppercase tracking-wider">{item.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
