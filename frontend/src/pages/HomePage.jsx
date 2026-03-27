import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Services from '../components/Services';
import Process from '../components/Process';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';

const CTASection = () => (
  <section className="py-32 bg-gradient-to-br from-[#0891B2] to-[#0E7490] relative overflow-hidden" data-testid="cta-section">
    {/* Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="h-full w-full" style={{
        backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
    </div>
    
    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70 mb-6 block">
          Inizia Ora
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white mb-6">
          Pronto a trasformare<br />
          i tuoi spazi?
        </h2>
        <p className="text-white/80 mb-10 max-w-xl mx-auto">
          Richiedi un preventivo gratuito. Ti ricontatteremo entro 24 ore 
          con una soluzione personalizzata.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/preventivo"
            className="btn-primary bg-white text-[#0891B2] hover:bg-slate-100"
            data-testid="cta-preventivo-bottom"
          >
            Richiedi Preventivo
            <ArrowRight size={18} weight="bold" />
          </Link>
          <Link 
            to="/contatti"
            className="btn-secondary border-white text-white hover:bg-white hover:text-[#0891B2]"
            data-testid="cta-contatti-bottom"
          >
            Contattaci
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFC]" data-testid="home-page">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Process />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default HomePage;
