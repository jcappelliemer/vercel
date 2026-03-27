import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" data-testid="hero-section">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/3195642/pexels-photo-3195642.jpeg"
          alt="Luxury modern architecture"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#05050A]/90 to-[#05050A]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]/30" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(0,229,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.1) 1px, transparent 1px)',
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="max-w-3xl">
          {/* Overline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="w-12 h-px bg-[#00E5FF]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF]">
              Distributore Esclusivo MADICO USA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.1] mb-8"
          >
            Innovazione e
            <br />
            <span className="text-gradient">tecnologia</span>
            <br />
            per i tuoi spazi
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed mb-12 max-w-xl"
          >
            Pellicole per vetri di ultima generazione. 40 anni di eccellenza 
            al servizio dell'efficienza energetica e del design.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link 
              to="/preventivo"
              className="btn-primary"
              data-testid="cta-preventivo-hero"
            >
              Richiedi Preventivo
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link 
              to="/servizi"
              className="btn-secondary"
              data-testid="cta-servizi-hero"
            >
              Esplora Soluzioni
            </Link>
          </motion.div>
        </div>

        {/* Stats - floating */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2"
        >
          <div className="glass p-8 space-y-8">
            <div className="text-center">
              <div className="text-5xl font-light text-white tracking-tight">40<span className="text-[#00E5FF]">+</span></div>
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">Anni</div>
            </div>
            <div className="w-full h-px bg-white/10" />
            <div className="text-center">
              <div className="text-5xl font-light text-white tracking-tight">45k<span className="text-[#00E5FF]">+</span></div>
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">Edifici</div>
            </div>
            <div className="w-full h-px bg-white/10" />
            <div className="text-center">
              <div className="text-5xl font-light text-white tracking-tight">10</div>
              <div className="text-xs uppercase tracking-widest text-slate-500 mt-2">Anni Garanzia</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-xs uppercase tracking-widest text-slate-500">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-[#00E5FF] to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
