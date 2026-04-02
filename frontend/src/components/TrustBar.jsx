import { motion } from 'framer-motion';
import { ShieldCheck, Medal, Certificate, Leaf } from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';

const icons = [Certificate, Medal, ShieldCheck, Leaf];

const TrustBar = () => {
  const s = useSettings();

  const trustItems = [
    { icon: icons[0], label: s.trust1_label, value: s.trust1_value },
    { icon: icons[1], label: s.trust2_label, value: s.trust2_value },
    { icon: icons[2], label: s.trust3_label, value: s.trust3_value },
    { icon: icons[3], label: s.trust4_label, value: s.trust4_value },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-[#111827]/50" data-testid="trust-bar">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#EAB308]/20 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#2563EB]/10 to-[#EAB308]/10 group-hover:from-[#2563EB]/20 group-hover:to-[#EAB308]/20 transition-all">
                <item.icon size={22} weight="light" className="text-[#EAB308]" />
              </div>
              <div>
                <div className="text-white font-medium">{item.label}</div>
                <div className="text-xs text-[#94A3B8] uppercase tracking-wider">{item.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
