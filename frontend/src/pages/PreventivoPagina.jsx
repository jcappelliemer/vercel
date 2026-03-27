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
    <div className="min-h-screen bg-[#FAFBFC]" data-testid="preventivo-page">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="accent-line" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#0891B2]">
                  Preventivo Gratuito
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-[#0F172A] mb-6">
                Richiedi il tuo<br />
                <span className="text-gradient font-medium">preventivo</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed">
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
                <div className="bg-white border border-slate-200 p-8 md:p-10">
                  <QuoteForm />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Benefits */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-slate-200 p-6"
                >
                  <h3 className="font-medium text-[#0F172A] mb-4">Perché sceglierci</h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle size={18} weight="fill" className="text-[#0891B2]" />
                        <span className="text-sm text-slate-500">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quick Contact */}
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0F172A] p-6"
                >
                  <h3 className="font-medium text-white mb-4">Preferisci parlare?</h3>
                  <div className="space-y-4">
                    <a 
                      href="tel:+390000000000"
                      className="flex items-center gap-3 text-slate-300 hover:text-[#0891B2] transition-colors"
                      data-testid="preventivo-phone"
                    >
                      <Phone size={18} weight="light" className="text-[#0891B2]" />
                      <span className="text-sm">+39 000 000 0000</span>
                    </a>
                    <a 
                      href="https://wa.me/390000000000"
                      className="flex items-center gap-3 text-slate-300 hover:text-[#25D366] transition-colors"
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
                  className="bg-gradient-to-br from-[#0891B2] to-[#0E7490] p-6"
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
