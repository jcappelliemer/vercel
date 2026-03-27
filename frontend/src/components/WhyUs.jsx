import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';

const benefits = [
  'Nessun lavoro strutturale invasivo',
  'Installazione rapida senza interruzioni',
  'Risparmio energetico fino al 50%',
  'Conformità normative D.Lgs. 81/2008',
  'Personale altamente specializzato',
  'Assistenza post-installazione garantita',
];

const WhyUs = () => {
  return (
    <section className="py-32 relative" data-testid="why-us-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10">
              <img 
                src="https://images.pexels.com/photos/5691531/pexels-photo-5691531.jpeg?w=800"
                alt="Installazione professionale"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent" />
              {/* Badge */}
              <div className="absolute bottom-6 right-6 card-glass rounded-xl p-5">
                <div className="text-4xl font-bold text-[#EAB308]">40+</div>
                <div className="text-xs uppercase tracking-wider text-white/60">Anni Esperienza</div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="accent-bar w-16 mb-6" />
            <h2 className="text-4xl lg:text-5xl font-medium text-white mb-6">
              Affidati ai
              <span className="text-gradient"> professionisti</span>
            </h2>
            <p className="text-[#94A3B8] leading-relaxed mb-8 text-lg">
              Siamo un'azienda italiana con sede in Toscana che da 40 anni opera in tutta Italia 
              ed Europa. L'esperienza maturata su oltre 45.000 edifici ci permette di risolvere 
              sempre in modo efficace ogni problematica delle superfici vetrate.
            </p>

            <ul className="space-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle size={22} weight="fill" className="text-[#EAB308] flex-shrink-0" />
                  <span className="text-white/80 font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Link 
              to="/chi-siamo"
              className="btn-secondary group"
              data-testid="why-us-cta"
            >
              Scopri di Più
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
