import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { Phone, EnvelopeSimple, MapPin, WhatsappLogo, Clock, CheckCircle } from '@phosphor-icons/react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContattiPagina = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    messaggio: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post(`${API}/contact`, formData);
      setIsSuccess(true);
      setFormData({ nome: '', cognome: '', email: '', telefono: '', messaggio: '' });
    } catch (err) {
      console.error('Contact submission error:', err);
      setError('Si è verificato un errore. Riprova o contattaci direttamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" data-testid="contatti-page">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
                Contatti
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#0A0A0A] uppercase mb-6">
                Parliamo del<br />
                <span className="text-[#002FA7]">tuo progetto</span>
              </h1>
              <p className="text-lg text-[#0A0A0A]/70 leading-relaxed">
                Compila il form o contattaci direttamente. Siamo a tua disposizione per 
                qualsiasi informazione sulle nostre pellicole per vetri.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                {/* Phone */}
                <motion.a
                  href="tel:+390000000000"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 bg-white border border-[#E5E7EB] p-6 hover:border-[#002FA7] transition-colors"
                  data-testid="contact-phone"
                >
                  <div className="w-12 h-12 bg-[#002FA7] flex items-center justify-center flex-shrink-0">
                    <Phone size={24} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0A0A] mb-1">Telefono</h3>
                    <p className="text-[#002FA7] font-medium">+39 000 000 0000</p>
                    <p className="text-sm text-[#0A0A0A]/60 mt-1">Lun-Ven 9:00-18:00</p>
                  </div>
                </motion.a>

                {/* WhatsApp */}
                <motion.a
                  href="https://wa.me/390000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 bg-[#25D366] p-6 text-white"
                  data-testid="contact-whatsapp"
                >
                  <div className="w-12 h-12 bg-white/20 flex items-center justify-center flex-shrink-0">
                    <WhatsappLogo size={24} weight="fill" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">WhatsApp</h3>
                    <p className="font-medium">Chatta con noi</p>
                    <p className="text-sm text-white/80 mt-1">Risposta immediata</p>
                  </div>
                </motion.a>

                {/* Email */}
                <motion.a
                  href="mailto:info@solarisfilms.it"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4 bg-white border border-[#E5E7EB] p-6 hover:border-[#002FA7] transition-colors"
                  data-testid="contact-email"
                >
                  <div className="w-12 h-12 bg-[#002FA7] flex items-center justify-center flex-shrink-0">
                    <EnvelopeSimple size={24} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0A0A] mb-1">Email</h3>
                    <p className="text-[#002FA7] font-medium">info@solarisfilms.it</p>
                    <p className="text-sm text-[#0A0A0A]/60 mt-1">Risposta in 24h</p>
                  </div>
                </motion.a>

                {/* Address */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-start gap-4 bg-white border border-[#E5E7EB] p-6"
                >
                  <div className="w-12 h-12 bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0A0A0A] mb-1">Sede</h3>
                    <p className="text-[#0A0A0A]/70">Toscana, Italia</p>
                    <p className="text-sm text-[#0A0A0A]/60 mt-1">Operiamo in tutta Italia e Europa</p>
                  </div>
                </motion.div>

                {/* Hours */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#0A0A0A] text-white p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={24} weight="bold" />
                    <h3 className="font-bold">Orari</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                      <span className="text-white/70">Lunedì - Venerdì</span>
                      <span>9:00 - 18:00</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-white/70">Sabato - Domenica</span>
                      <span>Chiuso</span>
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-[#E5E7EB] p-8">
                  <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">
                    Inviaci un messaggio
                  </h2>

                  {isSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                      data-testid="contact-success"
                    >
                      <CheckCircle size={64} weight="fill" className="text-[#22C55E] mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Messaggio Inviato!</h3>
                      <p className="text-[#0A0A0A]/70 mb-6">Ti risponderemo entro 24 ore.</p>
                      <button 
                        onClick={() => setIsSuccess(false)}
                        className="btn-outline"
                      >
                        Invia un altro messaggio
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                      {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Nome *</label>
                          <input
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            required
                            className="form-input"
                            data-testid="contact-nome"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Cognome *</label>
                          <input
                            type="text"
                            name="cognome"
                            value={formData.cognome}
                            onChange={handleChange}
                            required
                            className="form-input"
                            data-testid="contact-cognome"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                            data-testid="contact-email-input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Telefono *</label>
                          <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            className="form-input"
                            data-testid="contact-telefono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#0A0A0A] mb-2">Messaggio *</label>
                        <textarea
                          name="messaggio"
                          value={formData.messaggio}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="form-input resize-none"
                          data-testid="contact-messaggio"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full disabled:opacity-50"
                        data-testid="contact-submit"
                      >
                        {isSubmitting ? 'Invio in corso...' : 'Invia Messaggio'}
                      </button>

                      <p className="text-xs text-[#0A0A0A]/50 text-center">
                        Inviando questo form accetti la nostra Privacy Policy.
                      </p>
                    </form>
                  )}
                </div>
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

export default ContattiPagina;
