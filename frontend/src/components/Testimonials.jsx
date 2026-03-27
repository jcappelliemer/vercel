import { motion } from 'framer-motion';
import { Quotes, Star } from '@phosphor-icons/react';

const testimonials = [
  {
    quote: "Riduzione del 45% sui costi di climatizzazione. ROI in meno di 2 anni.",
    author: "Marco Bellini",
    role: "Facility Manager",
    rating: 5,
  },
  {
    quote: "Le pellicole SafetyShield hanno messo in sicurezza l'intero edificio. Massima protezione, zero impatto estetico.",
    author: "Laura Conti",
    role: "Architetto",
    rating: 5,
  },
  {
    quote: "Messa in sicurezza rapida e senza interruzioni. Team altamente professionale.",
    author: "Paolo Ricci",
    role: "HSE Manager",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-32 relative" data-testid="testimonials-section">
      <div className="absolute inset-0 bg-[#111827]/50" />
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="accent-bar w-16 mx-auto mb-6" />
          <h2 className="text-4xl lg:text-5xl font-medium text-white">
            Cosa dicono di <span className="text-gradient">noi</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="card-glass rounded-2xl p-8 transition-all duration-500"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} weight="fill" className="text-[#EAB308]" />
                ))}
              </div>
              
              <Quotes size={32} weight="fill" className="text-[#EAB308]/30 mb-4" />
              
              <p className="text-white/90 text-lg leading-relaxed mb-8">
                "{item.quote}"
              </p>
              
              <div className="border-t border-white/10 pt-6">
                <div className="font-medium text-white">{item.author}</div>
                <div className="text-sm text-[#EAB308]">{item.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
