import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import QuoteForm from '../components/QuoteForm';
import { motion } from 'framer-motion';
import { Phone, WhatsappLogo, Clock, CheckCircle } from '@phosphor-icons/react';

const benefits = [
  'Preventivo in 24 ore',
  'Consulenza gratuita',
  'Sopralluogo senza impegno',
  'Garanzia fino a 10 anni',
];

const PreventivoPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="preventivo-page">
      <SEO title="Richiedi Preventivo Gratuito" description="Richiedi un preventivo gratuito e senza impegno per pellicole antisolari, di sicurezza o privacy MADICO. Risposta in 24 ore." path="/preventivo" />
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl">
              <div className="accent-bar w-16 mb-6" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                Richiedi il tuo
                <br />
                <span className="text-gradient">preventivo</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Compila il form e riceverai un preventivo personalizzato entro 24 ore.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="card-glass rounded-2xl p-8 md:p-10">
                  <QuoteForm />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card-glass rounded-2xl p-6"
                >
                  <h3 className="font-medium text-white mb-4">Perché sceglierci</h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle size={18} weight="fill" className="text-[#EAB308]" />
                        <span className="text-sm text-[#94A3B8]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl p-6 bg-[#111827] border border-white/10"
                >
                  <h3 className="font-medium text-white mb-4">Preferisci parlare?</h3>
                  <div className="space-y-4">
                    <a href="tel:+390000000000" className="flex items-center gap-3 text-[#94A3B8] hover:text-[#EAB308] transition-colors" data-testid="preventivo-phone">
                      <Phone size={18} weight="light" className="text-[#EAB308]" />
                      <span className="text-sm">+39 000 000 0000</span>
                    </a>
                    <a href="https://wa.me/390000000000" className="flex items-center gap-3 text-[#94A3B8] hover:text-[#25D366] transition-colors" data-testid="preventivo-whatsapp">
                      <WhatsappLogo size={18} weight="fill" className="text-[#25D366]" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={20} weight="light" className="text-white" />
                    <span className="font-medium text-white">Risposta in 24h</span>
                  </div>
                  <p className="text-sm text-white/80">
                    Garantiamo una risposta entro 24 ore lavorative.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default PreventivoPagina;
