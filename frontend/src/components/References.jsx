import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

const defaultReferences = [
  'Banca d\'Italia',
  'EUR Spa - Nuvola Roma',
  'Università di Bologna',
  'Aeroporto di Bologna',
  'Ministero dell\'Interno',
  'CNR',
  'Sapienza Università',
  'Palazzo Pitti Firenze',
  'Reggimento Corazzieri',
  'Accademia Navale Livorno',
  'Crédit Agricole',
  'H-Farm',
  'Cassa Depositi e Prestiti',
];

const References = () => {
  const s = useSettings();

  // Use WP references if available (array from settings), otherwise fallback
  const references = (s.references && s.references.length > 0) ? s.references : defaultReferences;

  return (
    <section className="py-24 relative overflow-hidden" data-testid="references-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="accent-bar w-16 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-medium text-white mb-4">
            Ci hanno <span className="text-gradient">scelto</span>
          </h2>
          <p className="text-[#94A3B8] text-lg">Le nostre referenze più importanti</p>
        </motion.div>
      </div>

      {/* Marquee row 1 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0F1C] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0F1C] to-transparent z-10" />
        <motion.div 
          className="flex gap-4"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          {[...references, ...references].map((ref, index) => (
            <div 
              key={index}
              className="flex-shrink-0 py-3 px-6 rounded-lg border border-white/5 bg-[#111827]/50 hover:border-[#EAB308]/20 transition-all"
            >
              <span className="text-sm font-medium text-white/70 whitespace-nowrap">
                {ref}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default References;
