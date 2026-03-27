import { motion } from 'framer-motion';
import { Thermometer, Lightning, ShieldCheck, Leaf, Sun, Drop } from '@phosphor-icons/react';

const focusItems = [
  {
    icon: Thermometer,
    title: 'Riduzione Temperatura',
    value: '-8°C',
    desc: 'Le pellicole antisolari riducono la temperatura interna fino a 7-8°C riflettendo la componente IR della radiazione solare.',
  },
  {
    icon: Sun,
    title: 'Riflessione UV',
    value: '99%',
    desc: 'Bloccano fino al 99% dei raggi ultravioletti, proteggendo persone, arredi e pavimenti dallo sbiadimento.',
  },
  {
    icon: Lightning,
    title: 'Risparmio Energetico',
    value: '30-50%',
    desc: 'Riduzione dei costi di climatizzazione estiva dal 30% al 50%. Ammortamento investimento in max 3 anni.',
  },
  {
    icon: Drop,
    title: 'Riflessione IR',
    value: '85%',
    desc: 'Riflessione fino all\'85% dei raggi infrarossi, la componente che trasmette calore attraverso il vetro.',
  },
  {
    icon: ShieldCheck,
    title: 'SafetyShield G2',
    value: '500+ lbs',
    desc: 'Il sistema FrameGard tiene vetro e pellicola con forza di 500-800 libbre per piede lineare. Testato contro esplosioni.',
  },
  {
    icon: Leaf,
    title: 'Sostenibilità',
    value: '-CO₂',
    desc: 'Meno energia consumata significa meno emissioni. Contribuisce all\'efficientamento energetico degli edifici.',
  },
];

const FocusTecnici = () => {
  return (
    <section className="py-32 relative" data-testid="focus-tecnici-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="accent-bar w-16 mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-medium text-white mb-4">
            Focus <span className="text-gradient">tecnici</span>
          </h2>
          <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
            I numeri che fanno la differenza. Dati reali, testati e certificati.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {focusItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="card-glass rounded-2xl p-8 group"
              data-testid={`focus-item-${index}`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2563EB]/15 to-[#EAB308]/15 group-hover:from-[#2563EB]/25 group-hover:to-[#EAB308]/25 transition-all">
                  <item.icon size={28} weight="light" className="text-[#EAB308]" />
                </div>
                <span className="text-3xl font-bold text-gradient">{item.value}</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-3 group-hover:text-[#EAB308] transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusTecnici;
