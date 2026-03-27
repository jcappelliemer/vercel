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
    <section className="py-24 bg-[#F9FAFB]" data-testid="why-us-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/5691531/pexels-photo-5691531.jpeg?w=800"
                alt="Installazione professionale"
                className="w-full h-auto"
              />
              {/* Badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#002FA7] text-white p-6">
                <div className="text-4xl font-black">40+</div>
                <div className="text-xs uppercase tracking-wider">Anni Esperienza</div>
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
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
              Perché Sceglierci
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-[#0A0A0A] uppercase mb-6">
              Affidati ai<br />
              <span className="text-[#002FA7]">professionisti</span>
            </h2>
            <p className="text-[#0A0A0A]/70 leading-relaxed mb-8">
              Siamo un'azienda italiana con sede in Toscana che da 40 anni opera in tutta Italia 
              ed Europa. L'esperienza maturata su oltre 45.000 edifici ci permette di risolvere 
              sempre in modo efficace ogni problematica delle superfici vetrate.
            </p>

            {/* Benefits List */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle size={24} weight="fill" className="text-[#22C55E] flex-shrink-0" />
                  <span className="text-[#0A0A0A] font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Link 
              to="/chi-siamo"
              className="btn-outline inline-flex items-center gap-2"
              data-testid="why-us-cta"
            >
              Scopri di Più
              <ArrowRight size={20} weight="bold" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
