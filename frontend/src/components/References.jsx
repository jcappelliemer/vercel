import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';

const references = [
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
  return (
    <section className="py-20 bg-white" data-testid="references-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
            Ci hanno scelto
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A0A0A]">
            Le nostre referenze
          </h2>
        </motion.div>
      </div>

      <Marquee speed={30} gradient gradientColor="#ffffff" gradientWidth={100}>
        {references.map((ref, index) => (
          <div 
            key={index}
            className="mx-8 py-4 px-6 border border-[#E5E7EB] bg-[#F9FAFB]"
          >
            <span className="text-sm font-medium text-[#0A0A0A] whitespace-nowrap">
              {ref}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default References;
