import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';

const Hero = () => {
  const settings = useSettings();
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" data-testid="hero-section">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#2563EB]/15 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#EAB308]/10 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(37,99,235,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#EAB308]/30 bg-[#EAB308]/10 backdrop-blur mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-widest text-[#EAB308]">
                  Distributore Esclusivo MADICO USA
                </span>
              </motion.div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-white leading-[1.05] mb-8">
                {settings.hero_title ? (
                  <>
                    {settings.hero_title.split(' ').slice(0, 3).join(' ')}
                    <br />
                    <span className="text-gradient">{settings.hero_title.split(' ').slice(3).join(' ')}</span>
                  </>
                ) : (
                  <>
                    Il futuro del
                    <br />
                    <span className="text-gradient">vetro è qui</span>
                  </>
                )}
              </h1>

              <p className="text-xl text-[#94A3B8] leading-relaxed mb-10 max-w-xl">
                {settings.hero_subtitle}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/preventivo" className="btn-yellow group" data-testid="cta-preventivo-hero">
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

          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src="https://images.pexels.com/photos/3195642/pexels-photo-3195642.jpeg"
                  alt="Smart glass technology"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent" />
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="absolute -left-8 top-1/4 card-glass rounded-xl p-5 animate-float"
              >
                <div className="text-4xl font-bold text-gradient">40+</div>
                <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Anni Esperienza</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05, y: -5 }}
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
                className="absolute left-1/4 -bottom-6 card-glass rounded-xl p-5 glow-yellow animate-float"
                style={{ animationDelay: '2s' }}
              >
                <div className="text-4xl font-bold text-[#EAB308]">-40%</div>
                <div className="text-xs uppercase tracking-widest text-white/50 mt-1">Bolletta Energia</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/50 to-transparent" />
    </section>
  );
};

export default Hero;
