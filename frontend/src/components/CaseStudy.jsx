import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Buildings, Bank, GraduationCap } from '@phosphor-icons/react';

const caseStudies = [
  {
    titolo: 'Banca d\'Italia — Roma',
    categoria: 'Istituzionale',
    icon: Bank,
    image: 'https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?w=800',
    problema: 'Necessità di messa in sicurezza delle vetrate dell\'edificio storico senza alterare l\'estetica della facciata.',
    soluzione: 'Installazione pellicole di sicurezza MADICO certificate UNI EN 12600 classe 1B1 su tutte le superfici vetrate accessibili.',
    risultati: ['Conformità D.Lgs. 81/2008', 'Zero impatto estetico', 'Protezione anti-sfondamento', 'Installazione senza interruzioni'],
  },
  {
    titolo: 'EUR Spa — Nuvola di Roma',
    categoria: 'Commerciale',
    icon: Buildings,
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=800',
    problema: 'Surriscaldamento degli ambienti interni con elevati costi di climatizzazione nel complesso congressuale.',
    soluzione: 'Pellicole antisolari MADICO ad alta riflessione solare su oltre 3.000 mq di superfici vetrate.',
    risultati: ['Riduzione temperatura -7°C', 'Risparmio energetico 40%', 'ROI in 2 anni', 'Comfort migliorato'],
  },
  {
    titolo: 'Università di Bologna',
    categoria: 'Educazione',
    icon: GraduationCap,
    image: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-702420.jpeg?w=800',
    problema: 'Abbagliamento nelle aule e laboratori con esposizione diretta al sole. Necessità di protezione UV per strumentazione.',
    soluzione: 'Pellicole antisolari con protezione UV 99% e riduzione abbagliamento, preservando la luminosità naturale.',
    risultati: ['Protezione UV 99%', 'Riduzione abbagliamento', 'Luminosità preservata', 'Ambiente studio ottimale'],
  },
];

const CaseStudy = () => {
  return (
    <section className="py-32 relative" data-testid="case-study-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="accent-bar w-16 mb-6" />
            <h2 className="text-4xl lg:text-5xl font-medium text-white">
              Case <span className="text-gradient">study</span>
            </h2>
          </div>
          <p className="text-[#94A3B8] max-w-md lg:text-right text-lg">
            Alcuni dei progetti più significativi realizzati in 40 anni di attività.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((cs, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="card-glass rounded-2xl overflow-hidden group"
              data-testid={`case-study-${index}`}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img src={cs.image} alt={cs.titolo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#EAB308]/20 border border-[#EAB308]/30 rounded-lg px-3 py-1.5">
                  <cs.icon size={16} weight="light" className="text-[#EAB308]" />
                  <span className="text-xs font-medium text-[#EAB308] uppercase tracking-wider">{cs.categoria}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-medium text-white mb-4 group-hover:text-[#EAB308] transition-colors">
                  {cs.titolo}
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#94A3B8] font-medium">Problema</span>
                    <p className="text-sm text-white/70 mt-1">{cs.problema}</p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#EAB308] font-medium">Soluzione</span>
                    <p className="text-sm text-white/70 mt-1">{cs.soluzione}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {cs.risultati.map((r, i) => (
                    <div key={i} className="bg-white/[0.03] rounded-lg px-3 py-2 text-center">
                      <span className="text-xs text-[#EAB308] font-medium">{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/preventivo" className="btn-yellow group" data-testid="case-study-cta">
            <span>Diventa il prossimo caso di successo</span>
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudy;
