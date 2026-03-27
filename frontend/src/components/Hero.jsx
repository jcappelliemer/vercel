import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from '@phosphor-icons/react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-[#FAFBFC] overflow-hidden" data-testid="hero-section">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(#0891B2 1px, transparent 1px), linear-gradient(90deg, #0891B2 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Gradient orb */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#0891B2]/20 to-[#0EA5E9]/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Overline */}
            <div className="flex items-center gap-4 mb-8">
              <div className="accent-line" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0891B2]">
                Distributore Esclusivo MADICO USA
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#0F172A] leading-[1.1] mb-8">
              Innovazione e
              <br />
              <span className="text-gradient font-medium">tecnologia</span>
              <br />
              per i tuoi spazi
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              Pellicole per vetri di ultima generazione. 40 anni di eccellenza 
              al servizio dell'efficienza energetica e del design.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
          </motion.div>

          {/* Right - Image + Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3195642/pexels-photo-3195642.jpeg"
                alt="Modern architecture"
                className="w-full h-[500px] object-cover"
              />
              
              {/* Floating stats card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-light text-[#0F172A]">40<span className="text-[#0891B2]">+</span></div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Anni</div>
                  </div>
                  <div className="text-center border-x border-slate-100 px-4">
                    <div className="text-3xl font-light text-[#0F172A]">45k<span className="text-[#0891B2]">+</span></div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Edifici</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-light text-[#0F172A]">10</div>
                    <div className="text-xs uppercase tracking-widest text-slate-400 mt-1">Garanzia</div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-[#0891B2] text-white px-5 py-3 shadow-lg">
                <div className="text-xs font-medium uppercase tracking-wider">Risparmio</div>
                <div className="text-2xl font-light">-40%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-xs uppercase tracking-widest text-slate-400">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#0891B2] to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
