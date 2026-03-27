import { motion } from 'framer-motion';
import { Quotes } from '@phosphor-icons/react';

const testimonials = [
  {
    quote: "L'intervento di Solaris Films ha ridotto del 45% i nostri costi di climatizzazione. Un investimento che si è ripagato in meno di 2 anni.",
    author: "Ing. Marco Bellini",
    role: "Facility Manager",
    company: "Gruppo Industriale Toscano",
  },
  {
    quote: "Professionalità impeccabile. Le pellicole LCD Switch hanno trasformato le nostre sale riunioni in spazi versatili e hi-tech.",
    author: "Arch. Laura Conti",
    role: "Studio Architettura",
    company: "Conti & Partners",
  },
  {
    quote: "La messa in sicurezza dei vetri secondo la normativa è stata rapida e senza interruzioni per il personale. Altamente consigliati.",
    author: "Dott. Paolo Ricci",
    role: "Responsabile Sicurezza",
    company: "Ospedale San Giovanni",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-[#0B101E]" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#00E5FF]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF]">
              Testimonianze
            </span>
            <span className="w-8 h-px bg-[#00E5FF]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            La voce dei nostri <span className="text-gradient">clienti</span>
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 group hover:border-[#00E5FF]/20 transition-all duration-500"
            >
              <Quotes size={32} weight="fill" className="text-[#00E5FF]/30 mb-6" />
              <p className="text-slate-300 leading-relaxed mb-8 italic">
                "{item.quote}"
              </p>
              <div className="border-t border-white/10 pt-6">
                <div className="font-medium text-white">{item.author}</div>
                <div className="text-sm text-[#00E5FF]">{item.role}</div>
                <div className="text-xs text-slate-500 mt-1">{item.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
