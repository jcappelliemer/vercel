import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import Services from '../components/Services';
import FocusTecnici from '../components/FocusTecnici';
import Process from '../components/Process';
import LoSapeviChe from '../components/LoSapeviChe';
import CaseStudy from '../components/CaseStudy';
import References from '../components/References';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';

const CTASection = () => (
  <section className="py-32 relative overflow-hidden" data-testid="cta-section">
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 via-transparent to-[#EAB308]/10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#EAB308]/8 rounded-full blur-[150px]" />
    </div>

    <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="accent-bar w-16 mx-auto mb-8" />
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
          Il futuro del tuo
          <br />
          <span className="text-gradient">spazio inizia qui</span>
        </h2>
        <p className="text-[#94A3B8] text-xl mb-10 max-w-xl mx-auto">
          Preventivo gratuito. Risposta in 24 ore.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/preventivo" className="btn-yellow group" data-testid="cta-preventivo-bottom">
            <span>Richiedi Preventivo</span>
            <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/contatti" className="btn-secondary" data-testid="cta-contatti-bottom">
            Contattaci
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="home-page">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <FocusTecnici />
        <Process />
        <LoSapeviChe />
        <CaseStudy />
        <References />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default HomePage;
