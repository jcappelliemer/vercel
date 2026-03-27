import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from '@phosphor-icons/react';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" data-testid="hero-section">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#7C3AED]/20 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00D4FF]/15 rounded-full blur-[120px]" 
        />
        
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Content - 7 columns */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-widest text-white/70">
                  Distributore Esclusivo MADICO USA
                </span>
              </motion.div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.05] mb-8">
                Il futuro del
                <br />
                <span className="text-gradient">vetro è qui</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-[#8B9AB8] leading-relaxed mb-10 max-w-xl">
                Tecnologie smart glass, pellicole di nuova generazione. 
                <span className="text-white"> 40 anni</span> di innovazione.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                <Link to="/preventivo" className="btn-primary group" data-testid="cta-preventivo-hero">
                  <span>Richiedi Preventivo</span>
                  <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="btn-secondary group">
                  <Play size={18} weight="fill" />
                  <span>Guarda Video</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right side - Stats cards */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/3195642/pexels-photo-3195642.jpeg"
                  alt="Smart glass technology"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C1222] via-transparent to-transparent" />
              </div>

              {/* Floating stat cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -left-8 top-1/4 card-glass rounded-xl p-5 animate-float"
              >
                <div className="text-4xl font-bold text-gradient">40+</div>
                <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Anni Esperienza</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -right-4 top-1/2 card-glass rounded-xl p-5 animate-float"
                style={{ animationDelay: '1s' }}
              >
                <div className="text-4xl font-bold text-gradient">45k+</div>
                <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Edifici Trattati</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                className="absolute left-1/4 -bottom-6 card-glass rounded-xl p-5 glow-cyan animate-float"
                style={{ animationDelay: '2s' }}
              >
                <div className="text-4xl font-bold text-white">-40%</div>
                <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Bolletta Energia</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent" />
    </section>
  );
};

export default Hero;
