import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Buildings, Bank, GraduationCap, Factory, Hospital, Storefront } from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';

const iconMap = {
  'Istituzionale': Bank,
  'Commerciale': Buildings,
  'Educazione': GraduationCap,
  'Industriale': Factory,
  'Sanitario': Hospital,
  'Retail': Storefront,
};

const defaultCaseStudies = [
  {
    titolo: 'Banca d\'Italia — Roma',
    categoria: 'Istituzionale',
    image: 'https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?w=800',
    problema: 'Necessità di messa in sicurezza delle vetrate dell\'edificio storico senza alterare l\'estetica della facciata.',
    soluzione: 'Installazione pellicole di sicurezza MADICO certificate UNI EN 12600 classe 1B1 su tutte le superfici vetrate accessibili.',
    risultati: ['Conformità D.Lgs. 81/2008', 'Zero impatto estetico', 'Protezione anti-sfondamento', 'Installazione senza interruzioni'],
  },
  {
    titolo: 'EUR Spa — Nuvola di Roma',
    categoria: 'Commerciale',
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=800',
    problema: 'Surriscaldamento degli ambienti interni con elevati costi di climatizzazione nel complesso congressuale.',
    soluzione: 'Pellicole antisolari MADICO ad alta riflessione solare su oltre 3.000 mq di superfici vetrate.',
    risultati: ['Riduzione temperatura -7°C', 'Risparmio energetico 40%', 'ROI in 2 anni', 'Comfort migliorato'],
  },
  {
    titolo: 'Università di Bologna',
    categoria: 'Educazione',
    image: 'https://images.pexels.com/photos/159490/yale-university-landscape-universities-702420.jpeg?w=800',
    problema: 'Abbagliamento nelle aule e laboratori con esposizione diretta al sole. Necessità di protezione UV per strumentazione.',
    soluzione: 'Pellicole antisolari con protezione UV 99% e riduzione abbagliamento, preservando la luminosità naturale.',
    risultati: ['Protezione UV 99%', 'Riduzione abbagliamento', 'Luminosità preservata', 'Ambiente studio ottimale'],
  },
];

const CaseStudy = () => {
  const s = useSettings();

  // Use WP data if available, otherwise fallback to defaults
  const caseStudies = (s.case_studies && s.case_studies.length > 0) ? s.case_studies : defaultCaseStudies;

  return (
    <section className="py-32 relative section-light" data-testid="case-study-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="accent-bar w-16 mb-6" />
            <h2 className="text-4xl lg:text-5xl font-medium">
              Case <span className="text-gradient">study</span>
            </h2>
          </div>
          <p className="max-w-md lg:text-right text-lg" style={{ color: '#64748B' }}>
            Alcuni dei progetti più significativi realizzati nell'ultimo anno.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((cs, index) => {
            const Icon = iconMap[cs.categoria] || Buildings;
            const risultati = Array.isArray(cs.risultati) ? cs.risultati : [];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="card-light rounded-2xl overflow-hidden group"
                data-testid={`case-study-${index}`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={cs.image} alt={cs.titolo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/80 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#EAB308] rounded-lg px-3 py-1.5">
                    <Icon size={16} weight="light" className="text-[#0A0F1C]" />
                    <span className="text-xs font-bold text-[#0A0F1C] uppercase tracking-wider">{cs.categoria}</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-medium text-[#0A0F1C] mb-4 group-hover:text-[#2563EB] transition-colors">
                    {cs.titolo}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#64748B] font-medium">Problema</span>
                      <p className="text-sm text-[#475569] mt-1">{cs.problema}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#2563EB] font-medium">Soluzione</span>
                      <p className="text-sm text-[#475569] mt-1">{cs.soluzione}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {risultati.map((r, i) => (
                      <div key={i} className="bg-[#F1F5F9] rounded-lg px-3 py-2 text-center">
                        <span className="text-xs text-[#2563EB] font-medium">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/preventivo" className="btn-primary group" data-testid="case-study-cta">
            <span>Diventa il prossimo caso di successo</span>
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CaseStudy;
