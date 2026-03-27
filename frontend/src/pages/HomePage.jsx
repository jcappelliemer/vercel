import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Services from '../components/Services';
import Stats from '../components/Stats';
import WhyUs from '../components/WhyUs';
import References from '../components/References';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';

const CTASection = () => (
  <section className="py-24 bg-[#002FA7]" data-testid="cta-section">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-white uppercase mb-6">
          Pronto a migliorare<br />i tuoi spazi?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Richiedi un preventivo gratuito e personalizzato. 
          Ti risponderemo entro 24 ore con la soluzione perfetta per le tue esigenze.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/preventivo"
            className="px-8 py-4 bg-white text-[#002FA7] font-bold uppercase tracking-wide hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-2"
            data-testid="cta-preventivo-bottom"
          >
            Preventivo Gratuito
            <ArrowRight size={20} weight="bold" />
          </Link>
          <a 
            href="https://wa.me/390000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wide hover:bg-white hover:text-[#002FA7] transition-colors"
            data-testid="cta-whatsapp-bottom"
          >
            WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div className="min-h-screen" data-testid="home-page">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <Stats />
        <WhyUs />
        <References />
        <CTASection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default HomePage;
