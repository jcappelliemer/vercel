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
    <div className="min-h-screen bg-[#05050A]" data-testid="preventivo-page">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-[#00E5FF]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#00E5FF]">
                  Preventivo Gratuito
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white mb-6">
                Richiedi il tuo<br />
                <span className="text-gradient">preventivo</span>
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
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
                <div className="glass p-8 md:p-10">
                  <QuoteForm />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Benefits */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass p-6"
                >
                  <h3 className="font-medium text-white mb-4">Perché sceglierci</h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle size={18} weight="fill" className="text-[#00E5FF]" />
                        <span className="text-sm text-slate-400">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quick Contact */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0B101E] border border-white/10 p-6"
                >
                  <h3 className="font-medium text-white mb-4">Preferisci parlare?</h3>
                  <div className="space-y-4">
                    <a 
                      href="tel:+390000000000"
                      className="flex items-center gap-3 text-slate-400 hover:text-[#00E5FF] transition-colors"
                      data-testid="preventivo-phone"
                    >
                      <Phone size={18} weight="light" className="text-[#00E5FF]" />
                      <span className="text-sm">+39 000 000 0000</span>
                    </a>
                    <a 
                      href="https://wa.me/390000000000"
                      className="flex items-center gap-3 text-slate-400 hover:text-[#25D366] transition-colors"
                      data-testid="preventivo-whatsapp"
                    >
                      <WhatsappLogo size={18} weight="fill" className="text-[#25D366]" />
                      <span className="text-sm">WhatsApp</span>
                    </a>
                  </div>
                </motion.div>

                {/* Response Time */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-[#00E5FF]/20 to-transparent border border-[#00E5FF]/30 p-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={20} weight="light" className="text-[#00E5FF]" />
                    <span className="font-medium text-white">Risposta in 24h</span>
                  </div>
                  <p className="text-sm text-slate-400">
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
