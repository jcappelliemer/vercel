import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sun, ShieldCheck, Eye, Lightning, Sparkle } from '@phosphor-icons/react';

const services = [
  {
    id: 'lcd-switch',
    name: 'LCD Switch',
    subtitle: 'Smart Glass Technology',
    description: 'Da opaca a trasparente con un click. Controllo smartphone e proiezione 4K.',
    icon: Lightning,
    image: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/e8649b92ae1cac102c10dcb549bc56fc73e517786dc90eeef30de1c82db1c77f.png',
    featured: true,
    colSpan: 'md:col-span-5 lg:col-span-7',
    rowSpan: 'md:row-span-2',
  },
  {
    id: 'antisolari',
    name: 'Pellicole Antisolari',
    subtitle: 'Thermal Control',
    description: 'Riduzione calore fino a 8°C. Risparmio energetico 50%.',
    icon: Sun,
    image: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/41cd0458add26ba29df8fb0b010533e357770d6fb0f027d6a8eea3a954452d5f.png',
    featured: false,
    colSpan: 'md:col-span-3 lg:col-span-5',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 'sicurezza',
    name: 'Pellicole Sicurezza',
    subtitle: 'UNI EN 12600 Certified',
    description: 'Protezione anti-sfondamento certificata.',
    icon: ShieldCheck,
    image: 'https://images.pexels.com/photos/5483051/pexels-photo-5483051.jpeg?w=800',
    featured: false,
    colSpan: 'md:col-span-3 lg:col-span-5',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 'privacy',
    name: 'Privacy & Design',
    subtitle: 'Custom Solutions',
    description: 'Design personalizzato per ambienti esclusivi.',
    icon: Eye,
    image: 'https://images.unsplash.com/photo-1772001936267-b6058748eff4?w=800',
    featured: false,
    colSpan: 'md:col-span-4 lg:col-span-4',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 'fotocromatiche',
    name: 'Fotocromatiche',
    subtitle: 'Adaptive Technology',
    description: 'Si adattano automaticamente alla luce. Zero energia.',
    icon: Sparkle,
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=800',
    featured: false,
    colSpan: 'md:col-span-4 lg:col-span-3',
    rowSpan: 'md:row-span-1',
  },
];

const Services = () => {
  return (
    <section className="py-24 md:py-32 bg-[#05050A]" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#00E5FF]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF]">
                Soluzioni
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white">
              Tecnologie<br />
              <span className="text-gradient">all'avanguardia</span>
            </h2>
          </div>
          <p className="text-slate-400 max-w-md lg:text-right">
            Pellicole certificate MADICO USA per ogni esigenza: 
            dal controllo solare alla sicurezza, dalla privacy allo smart glass.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-12 gap-4 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`luxury-card group ${service.colSpan} ${service.rowSpan}`}
              data-testid={`service-card-${service.id}`}
            >
              <Link to={`/servizi#${service.id}`} className="block h-full">
                {/* Image */}
                <div className={`relative overflow-hidden ${service.featured ? 'h-full min-h-[400px]' : 'h-48 md:h-56'}`}>
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-[#05050A]/50 to-transparent" />
                  
                  {/* Icon */}
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 glass flex items-center justify-center group-hover:border-[#00E5FF]/50 transition-colors">
                      <service.icon size={22} weight="light" className="text-[#00E5FF]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-xs uppercase tracking-widest text-[#00E5FF] mb-2 block">
                      {service.subtitle}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-medium text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:text-[#00E5FF] transition-colors">
                      Scopri
                      <ArrowUpRight size={16} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
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
