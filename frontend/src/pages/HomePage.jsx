import Header from '../components/Header';
import Hero from '../components/Hero';
import TrustBar from '../components/TrustBar';
import NeedGuide from '../components/NeedGuide';
import Services from '../components/Services';
import DecisionProof from '../components/DecisionProof';
import FocusTecnici from '../components/FocusTecnici';
import Process from '../components/Process';
import LoSapeviChe from '../components/LoSapeviChe';
import CaseStudy from '../components/CaseStudy';
import Gallery from '../components/Gallery';
import References from '../components/References';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO, { buildOrganizationSchema } from '../components/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Buildings, Camera, Ruler } from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';

const CTASection = () => {
  const s = useSettings();
  const quickItems = [
    {
      icon: Buildings,
      title: s.home_cta_item1_title || 'Tipo edificio',
      text: s.home_cta_item1_text || 'ufficio, casa, negozio o stabilimento',
    },
    {
      icon: Ruler,
      title: s.home_cta_item2_title || 'Misure indicative',
      text: s.home_cta_item2_text || 'metri quadri o numero di vetrate',
    },
    {
      icon: Camera,
      title: s.home_cta_item3_title || 'Foto facoltative',
      text: s.home_cta_item3_text || 'utili per valutare esposizione e vincoli',
    },
  ];

  return (
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
          {s.home_cta_title || 'Descrivici il tuo edificio'}
          <br />
          <span className="text-gradient">{s.home_cta_highlight || 'ti diciamo quale pellicola usare'}</span>
        </h2>
        <p className="text-[#94A3B8] text-xl mb-10 max-w-xl mx-auto">
          {s.cta_subtitle || 'Preventivo gratuito. Risposta in 24 ore.'}
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
          {quickItems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2563EB]/20 to-[#EAB308]/20 border border-white/10 mb-4">
                <item.icon size={22} weight="light" className="text-[#EAB308]" />
              </div>
              <div className="text-white font-semibold">{item.title}</div>
              <p className="text-[#94A3B8] text-sm mt-2 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/preventivo" className="btn-yellow group" data-testid="cta-preventivo-bottom">
            <span>{s.hero_cta_text}</span>
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
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="home-page">
      <SEO path="/" jsonLd={buildOrganizationSchema()} />
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <NeedGuide />
        <Services />
        <DecisionProof />
        <FocusTecnici />
        <Process />
        <LoSapeviChe />
        <CaseStudy />
        <Gallery />
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
