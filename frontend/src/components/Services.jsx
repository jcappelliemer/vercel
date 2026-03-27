import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, ShieldCheck, Eye, Lightning, Sparkle } from '@phosphor-icons/react';

const services = [
  {
    id: 'antisolari',
    name: 'Pellicole Antisolari',
    description: 'Riducono il calore fino a 7-8°C e bloccano il 99% dei raggi UV. Risparmio energetico garantito.',
    icon: Sun,
    image: 'https://images.unsplash.com/photo-1761706885595-02fdd9fe91bb?w=600&h=400&fit=crop',
    featured: true,
    colSpan: 'md:col-span-8',
    rowSpan: 'md:row-span-2',
  },
  {
    id: 'sicurezza',
    name: 'Pellicole di Sicurezza',
    description: 'Certificate UNI EN 12600. Trasformano qualsiasi vetro in vetro di sicurezza.',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1674829763557-19283dbde6e5?w=600&h=400&fit=crop',
    featured: false,
    colSpan: 'md:col-span-4',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 'privacy',
    name: 'Pellicole Privacy e Design',
    description: 'Satinate e decorative per privacy e design personalizzato.',
    icon: Eye,
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=600&h=400&fit=crop',
    featured: false,
    colSpan: 'md:col-span-4',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 'lcd-switch',
    name: 'Pellicole LCD Switch',
    description: 'Da opaca a trasparente con un interruttore. Tecnologia smart.',
    icon: Lightning,
    image: 'https://images.pexels.com/photos/5213546/pexels-photo-5213546.jpeg?w=600&h=400&fit=crop',
    featured: false,
    colSpan: 'md:col-span-4',
    rowSpan: 'md:row-span-1',
  },
  {
    id: 'fotocromatiche',
    name: 'Pellicole Fotocromatiche',
    description: 'Si scuriscono automaticamente con la luce solare. Zero elettricità.',
    icon: Sparkle,
    image: 'https://images.unsplash.com/photo-1719437354892-f64ea7e03d4e?w=600&h=400&fit=crop',
    featured: false,
    colSpan: 'md:col-span-4',
    rowSpan: 'md:row-span-1',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const Services = () => {
  return (
    <section className="py-24 bg-white" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
            I Nostri Servizi
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-[#0A0A0A] uppercase">
            Soluzioni per ogni<br />
            <span className="text-[#002FA7]">esigenza</span>
          </h2>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={`service-card group relative overflow-hidden ${service.colSpan} ${service.rowSpan}`}
              data-testid={`service-card-${service.id}`}
            >
              <Link to={`/servizi#${service.id}`} className="block h-full">
                {/* Image */}
                <div className={`relative ${service.featured ? 'h-64 md:h-full' : 'h-48'}`}>
                  <img 
                    src={service.image} 
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <service.icon size={24} weight="bold" className="text-[#002FA7]" />
                    <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#002FA7] text-sm font-semibold uppercase tracking-wide group-hover:gap-3 transition-all">
                    Scopri di più
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link 
            to="/preventivo"
            className="btn-primary inline-flex items-center gap-2"
            data-testid="services-cta"
          >
            Richiedi un Preventivo
            <ArrowRight size={20} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
