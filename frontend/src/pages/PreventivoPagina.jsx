import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
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
    <div className="min-h-screen bg-[#F9FAFB]" data-testid="preventivo-page">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
                Preventivo Gratuito
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#0A0A0A] uppercase mb-6">
                Richiedi il tuo<br />
                <span className="text-[#002FA7]">preventivo</span>
              </h1>
              <p className="text-lg text-[#0A0A0A]/70 leading-relaxed">
                Compila il form e riceverai un preventivo personalizzato entro 24 ore. 
                Il nostro team ti contatterà per capire al meglio le tue esigenze.
              </p>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-[#E5E7EB] p-8">
                  <QuoteForm />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Benefits */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-[#E5E7EB] p-6"
                >
                  <h3 className="font-bold text-lg text-[#0A0A0A] mb-4">
                    Perché sceglierci
                  </h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle size={20} weight="fill" className="text-[#22C55E]" />
                        <span className="text-sm text-[#0A0A0A]">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quick Contact */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0A0A0A] text-white p-6"
                >
                  <h3 className="font-bold text-lg mb-4">
                    Preferisci parlare?
                  </h3>
                  <p className="text-white/70 text-sm mb-6">
                    Contattaci direttamente per una consulenza immediata.
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="tel:+390000000000"
                      className="flex items-center gap-3 text-white hover:text-[#002FA7] transition-colors"
                      data-testid="preventivo-phone"
                    >
                      <Phone size={20} weight="bold" />
                      <span>+39 000 000 0000</span>
                    </a>
                    <a 
                      href="https://wa.me/390000000000"
                      className="flex items-center gap-3 text-white hover:text-[#25D366] transition-colors"
                      data-testid="preventivo-whatsapp"
                    >
                      <WhatsappLogo size={20} weight="fill" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </motion.div>

                {/* Response Time */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-[#002FA7] text-white p-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={24} weight="bold" />
                    <span className="font-bold">Risposta in 24h</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    Garantiamo una risposta entro 24 ore lavorative dalla ricezione della richiesta.
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
