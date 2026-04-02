import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

const defaultReferences = [
  { nome: 'Banca d\'Italia', logo: '' },
  { nome: 'EUR Spa - Nuvola Roma', logo: '' },
  { nome: 'Università di Bologna', logo: '' },
  { nome: 'Aeroporto di Bologna', logo: '' },
  { nome: 'Ministero dell\'Interno', logo: '' },
  { nome: 'CNR', logo: '' },
  { nome: 'Sapienza Università', logo: '' },
  { nome: 'Palazzo Pitti Firenze', logo: '' },
  { nome: 'Reggimento Corazzieri', logo: '' },
  { nome: 'Accademia Navale Livorno', logo: '' },
  { nome: 'Crédit Agricole', logo: '' },
  { nome: 'H-Farm', logo: '' },
  { nome: 'Cassa Depositi e Prestiti', logo: '' },
];

const References = () => {
  const s = useSettings();

  // WP returns array of {nome, logo} objects
  const references = (s.references && s.references.length > 0)
    ? s.references.map(r => typeof r === 'string' ? { nome: r, logo: '' } : r)
    : defaultReferences;

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

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0F1C] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0F1C] to-transparent z-10" />
        <motion.div
          className="flex gap-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        >
          {[...references, ...references].map((ref, index) => (
            <div
              key={index}
              className="flex-shrink-0 flex items-center gap-3 py-3 px-5 rounded-xl border border-white/5 bg-[#111827]/60 hover:border-[#EAB308]/20 hover:bg-[#111827] transition-all"
              data-testid={`reference-${index}`}
            >
              {ref.logo ? (
                <img
                  src={ref.logo}
                  alt={ref.nome}
                  className="h-8 w-auto max-w-[80px] object-contain brightness-0 invert opacity-70"
                />
              ) : null}
              <span className="text-sm font-medium text-white/70 whitespace-nowrap">
                {ref.nome}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default References;
