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
    colSpan: 'lg:col-span-7',
    featured: true,
  },
  {
    id: 'safety-shield',
    name: 'Safety Shield',
    subtitle: 'Anti-Esplosione',
    description: 'Protezione certificata contro esplosioni e intrusioni. MADICO USA.',
    icon: Bomb,
    image: 'https://images.pexels.com/photos/5483051/pexels-photo-5483051.jpeg?w=800',
    colSpan: 'lg:col-span-5',
    featured: true,
  },
  {
    id: 'sicurezza',
    name: 'Sicurezza',
    subtitle: 'UNI EN 12600',
    description: 'Vetri di sicurezza certificati. D.Lgs. 81/2008.',
    icon: ShieldCheck,
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=800',
    colSpan: 'lg:col-span-6',
  },
  {
    id: 'privacy',
    name: 'Privacy e Design',
    subtitle: 'Personalizzabile',
    description: 'Pellicole opacizzanti, satinate e decorative su misura.',
    icon: Eye,
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=800',
    colSpan: 'lg:col-span-6',
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
              className={`group relative overflow-hidden rounded-2xl border border-black/5 bg-[#07111F] hover:border-[#EAB308]/50 transition-all duration-500 shadow-lg hover:shadow-2xl ${service.colSpan}`}
              data-testid={`service-card-${service.id}`}
            >
              <Link
                to={`/servizi#${service.id}`}
                className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label={`Apri ${service.name}`}
              >
                <div className={`relative h-full ${service.featured ? 'min-h-[520px]' : 'min-h-[330px]'}`}>
                  <motion.img
                    src={service.image}
                    alt={service.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-70"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#0A0F1C]/90 to-[#0A0F1C]/20" />
                  <div className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-[#EAB308]/30 transition-colors" />

                  <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="w-14 h-14 rounded-xl flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
                      >
                        <service.icon size={26} weight="light" className="text-[#EAB308]" />
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 5, y: -5 }}
                        className="w-12 h-12 rounded-full border border-white/20 bg-[#020617]/45 backdrop-blur-md flex items-center justify-center group-hover:border-[#EAB308] group-hover:bg-[#EAB308]/15 transition-all"
                      >
                        <ArrowUpRight size={20} className="text-white group-hover:text-[#EAB308] transition-colors" />
                      </motion.div>
                    </div>

                    <div className="max-w-[620px] service-card-copy" data-testid={`service-card-text-${service.id}`}>
                      <span className="service-kicker inline-flex w-fit items-center rounded-full border border-[#EAB308]/35 bg-[#EAB308]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_0_18px_rgba(234,179,8,0.16)]">
                        {service.subtitle}
                      </span>
                      <h3 className={`service-title ${service.featured ? 'text-3xl lg:text-4xl' : 'text-2xl lg:text-3xl'} font-semibold mt-4 leading-tight drop-shadow-[0_3px_14px_rgba(0,0,0,0.65)]`}>
                        {service.name}
                      </h3>
                      <p className={`service-description ${service.featured ? 'text-base' : 'text-sm'} mt-3 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]`}>
                        {service.description}
                      </p>
                      <div className="service-cta mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                        <span>Scopri la soluzione</span>
                        <ArrowUpRight size={16} weight="bold" />
                      </div>
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
