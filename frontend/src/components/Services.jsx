import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sun, ShieldCheck, Eye, Bomb } from '@phosphor-icons/react';

const services = [
  {
    id: 'antisolari',
    name: 'Pellicole Antisolari',
    subtitle: 'Risparmio Energetico',
    description: 'Riducono il calore fino a 8°C, risparmio energetico fino al 50%. Protezione UV 99%.',
    icon: Sun,
    image: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/41cd0458add26ba29df8fb0b010533e357770d6fb0f027d6a8eea3a954452d5f.png',
    colSpan: 'lg:col-span-8',
    rowSpan: 'lg:row-span-2',
    featured: true,
  },
  {
    id: 'safety-shield',
    name: 'Safety Shield',
    subtitle: 'Anti-Esplosione',
    description: 'Protezione certificata contro esplosioni e intrusioni. MADICO USA.',
    icon: Bomb,
    image: 'https://images.pexels.com/photos/5483051/pexels-photo-5483051.jpeg?w=800',
    colSpan: 'lg:col-span-4',
  },
  {
    id: 'sicurezza',
    name: 'Sicurezza',
    subtitle: 'UNI EN 12600',
    description: 'Vetri di sicurezza certificati. D.Lgs. 81/2008.',
    icon: ShieldCheck,
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=800',
    colSpan: 'lg:col-span-4',
  },
  {
    id: 'privacy',
    name: 'Privacy e Design',
    subtitle: 'Personalizzabile',
    description: 'Pellicole opacizzanti, satinate e decorative su misura.',
    icon: Eye,
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=800',
    colSpan: 'lg:col-span-8',
  },
];

const Services = () => {
  return (
    <section className="py-32 relative section-light" data-testid="services-section">
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
              Soluzioni
              <span className="text-gradient"> premium</span>
            </h2>
          </div>
          <p className="max-w-md lg:text-right text-lg" style={{ color: '#64748B' }}>
            Tecnologie certificate MADICO USA per ogni esigenza.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl border border-black/5 hover:border-[#EAB308]/40 transition-all duration-500 shadow-lg hover:shadow-xl ${service.colSpan} ${service.rowSpan || ''}`}
              data-testid={`service-card-${service.id}`}
            >
              <Link to={`/servizi#${service.id}`} className="block h-full">
                <div className={`relative h-full ${service.featured ? 'min-h-[500px]' : 'min-h-[250px]'}`}>
                  <motion.img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/70 to-[#0A0F1C]/30" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 bg-white/20 backdrop-blur border border-white/20"
                    >
                      <service.icon size={26} weight="light" className="text-[#EAB308]" />
                    </motion.div>

                    <div className="flex items-end justify-between">
                      <div style={{ textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>
                        <span className="text-[#EAB308] text-sm font-semibold uppercase tracking-wider">{service.subtitle}</span>
                        <h3 className="text-2xl lg:text-3xl font-semibold text-white mt-1">{service.name}</h3>
                        <p className="text-white/80 mt-2 text-sm font-medium">{service.description}</p>
                      </div>
                      <motion.div
                        whileHover={{ x: 5, y: -5 }}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#EAB308] group-hover:bg-[#EAB308]/10 transition-all"
                      >
                        <ArrowUpRight size={20} className="text-white group-hover:text-[#EAB308] transition-colors" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
