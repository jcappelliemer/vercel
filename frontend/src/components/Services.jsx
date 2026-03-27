import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sun, ShieldCheck, Eye, Lightning, Sparkle } from '@phosphor-icons/react';

const services = [
  {
    id: 'lcd-switch',
    name: 'LCD Switch',
    subtitle: 'Smart Glass',
    description: 'Da opaca a trasparente istantaneamente. Il futuro è adesso.',
    icon: Lightning,
    image: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/e8649b92ae1cac102c10dcb549bc56fc73e517786dc90eeef30de1c82db1c77f.png',
    colSpan: 'lg:col-span-8',
    rowSpan: 'lg:row-span-2',
    featured: true,
  },
  {
    id: 'antisolari',
    name: 'Antisolari',
    subtitle: '-8°C',
    description: 'Controllo termico avanzato.',
    icon: Sun,
    image: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/41cd0458add26ba29df8fb0b010533e357770d6fb0f027d6a8eea3a954452d5f.png',
    colSpan: 'lg:col-span-4',
    featured: false,
  },
  {
    id: 'sicurezza',
    name: 'Sicurezza',
    subtitle: 'Certificato',
    description: 'UNI EN 12600.',
    icon: ShieldCheck,
    image: 'https://images.pexels.com/photos/5483051/pexels-photo-5483051.jpeg?w=800',
    colSpan: 'lg:col-span-4',
    featured: false,
  },
  {
    id: 'privacy',
    name: 'Privacy',
    subtitle: 'Design',
    description: 'Soluzioni su misura.',
    icon: Eye,
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=800',
    colSpan: 'lg:col-span-6',
    featured: false,
  },
  {
    id: 'fotocromatiche',
    name: 'Fotocromatiche',
    subtitle: 'Auto',
    description: 'Si adattano alla luce.',
    icon: Sparkle,
    image: 'https://images.pexels.com/photos/3195642/pexels-photo-3195642.jpeg?w=800',
    colSpan: 'lg:col-span-6',
    featured: false,
  },
];

const Services = () => {
  return (
    <section className="py-32 relative" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="accent-bar w-16 mb-6" />
            <h2 className="text-4xl lg:text-5xl font-medium text-white">
              Soluzioni
              <span className="text-gradient"> premium</span>
            </h2>
          </div>
          <p className="text-[#8B9AB8] max-w-md lg:text-right text-lg">
            Tecnologie certificate MADICO USA per ogni esigenza.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-2xl ${service.colSpan} ${service.rowSpan || ''}`}
              data-testid={`service-card-${service.id}`}
            >
              <Link to={`/servizi#${service.id}`} className="block h-full">
                <div className={`relative h-full ${service.featured ? 'min-h-[500px]' : 'min-h-[250px]'}`}>
                  {/* Image */}
                  <motion.img 
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0C1222] via-[#0C1222]/60 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Icon */}
                    <motion.div 
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(124,58,237,0.2) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <service.icon size={26} weight="light" className="text-[#00D4FF]" />
                    </motion.div>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[#00D4FF] text-sm font-medium uppercase tracking-wider">
                          {service.subtitle}
                        </span>
                        <h3 className="text-2xl lg:text-3xl font-medium text-white mt-1">
                          {service.name}
                        </h3>
                        <p className="text-[#8B9AB8] mt-2 text-sm">{service.description}</p>
                      </div>
                      <motion.div 
                        whileHover={{ x: 5, y: -5 }}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#00D4FF] group-hover:bg-[#00D4FF]/10 transition-all"
                      >
                        <ArrowUpRight size={20} className="text-white group-hover:text-[#00D4FF] transition-colors" />
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
