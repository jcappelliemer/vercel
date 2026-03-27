import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, WhatsappLogo, EnvelopeSimple } from '@phosphor-icons/react';

const Hero = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1719437354892-f64ea7e03d4e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHw0fHxtb2Rlcm4lMjBnbGFzcyUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3J8ZW58MHx8fHwxNzc0NjM2MzUwfDA&ixlib=rb-4.1.0&q=85"
          alt="Modern glass building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Overline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-6"
          >
            Distributore Esclusivo MADICO USA
          </motion.p>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-[#0A0A0A] uppercase leading-[0.95] mb-6"
          >
            Pellicole per Vetri
            <span className="block text-[#002FA7]">Professionali</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#0A0A0A]/70 leading-relaxed mb-8 max-w-xl"
          >
            Oltre il vetro, proteggiamo il vostro spazio. 
            <strong className="text-[#0A0A0A]"> 40 anni di esperienza</strong>, 
            certificazione ISO 9001, garanzia 10 anni.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-12"
          >
            <Link 
              to="/preventivo"
              className="btn-primary flex items-center justify-center gap-2 text-center animate-pulse-glow"
              data-testid="cta-preventivo-hero"
            >
              Richiedi Preventivo Gratuito
              <ArrowRight size={20} weight="bold" />
            </Link>
            <a 
              href="tel:+390000000000"
              className="btn-outline flex items-center justify-center gap-2 text-center"
              data-testid="cta-chiama-hero"
            >
              <Phone size={20} weight="bold" />
              Chiama Ora
            </a>
          </motion.div>

          {/* Quick Contact */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-6"
          >
            <a 
              href="https://wa.me/390000000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[#0A0A0A] hover:text-[#25D366] transition-colors"
              data-testid="cta-whatsapp-hero"
            >
              <WhatsappLogo size={24} weight="fill" className="text-[#25D366]" />
              <span className="text-sm font-medium">WhatsApp</span>
            </a>
            <a 
              href="mailto:info@solarisfilms.it"
              className="flex items-center gap-2 text-[#0A0A0A] hover:text-[#002FA7] transition-colors"
              data-testid="cta-email-hero"
            >
              <EnvelopeSimple size={24} weight="bold" className="text-[#002FA7]" />
              <span className="text-sm font-medium">info@solarisfilms.it</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-[#0A0A0A]/30 rounded-full flex justify-center pt-2">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#002FA7] rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
