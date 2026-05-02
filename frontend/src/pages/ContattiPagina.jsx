import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Phone, EnvelopeSimple, MapPin, WhatsappLogo, Clock, CheckCircle } from '@phosphor-icons/react';
import axios from 'axios';
import { useSettings } from '../hooks/useSettings';
import { buildWhatsAppHref } from '../utils/contactLinks';
import { appendSourceFields, getPublicCrmApiBase } from '../utils/publicApi';

const acceptedFiles = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar,image/*';
const fileInputClasses = 'block w-full text-sm text-[#94A3B8] file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-white/15';

const emptyContact = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  ragione_sociale: '',
  citta: '',
  richiesta: '',
  privacy_accettata: false,
};

const ContattiPagina = () => {
  const settings = useSettings();
  const [formData, setFormData] = useState(emptyContact);
  const [files, setFiles] = useState([]);
  const [fileInputVersion, setFileInputVersion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const addFiles = (fileList) => {
    const selected = Array.from(fileList || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 10));
  };

  const resetForm = () => {
    setFormData(emptyContact);
    setFiles([]);
    setFileInputVersion((version) => version + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });
      payload.append('first_name', formData.nome);
      payload.append('last_name', formData.cognome);
      payload.append('company_name', formData.ragione_sociale);
      payload.append('city', formData.citta);
      payload.append('phone', formData.telefono);
      payload.append('request_notes', formData.richiesta);
      payload.append('privacy_acceptance', String(formData.privacy_accettata));
      payload.append('messaggio', formData.richiesta);
      appendSourceFields(payload, 'contattaci');
      files.forEach((file) => payload.append('attachment_image', file));

      await axios.post(`${getPublicCrmApiBase()}/public/forms/contact/plain`, payload);
      setIsSuccess(true);
      resetForm();
    } catch (err) {
      setError('Si e verificato un errore. Riprova o contattaci direttamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="contatti-page">
      <SEO title="Contatti" description="Contatta Solaris Films per informazioni sulle pellicole per vetri MADICO. Richiedi una consulenza gratuita o un preventivo senza impegno." path="/contatti" />
      <Header />

      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl">
              <div className="accent-bar w-16 mb-6" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                Parliamo del
                <br />
                <span className="text-gradient">tuo progetto</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Compila il form o contattaci direttamente. Siamo a tua disposizione.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="space-y-4">
                <motion.a href="tel:+390559107621" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 card-glass rounded-xl p-5 hover:border-[#EAB308]/30 transition-all" data-testid="contact-phone"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#2563EB]/20">
                    <Phone size={22} weight="light" className="text-[#3B82F6]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Telefono</h3>
                    <p className="text-[#EAB308] font-medium text-sm">+39 055 910 7621</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Lun-Ven 9:00-18:00</p>
                  </div>
                </motion.a>

                <motion.a href={buildWhatsAppHref(settings.whatsapp, 'Ciao, vorrei informazioni sulle pellicole per vetri.')} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 rounded-xl p-5 bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/40 transition-all" data-testid="contact-whatsapp"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#25D366]/20">
                    <WhatsappLogo size={22} weight="fill" className="text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">WhatsApp</h3>
                    <p className="text-[#25D366] font-medium text-sm">Chatta con noi</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Risposta immediata</p>
                  </div>
                </motion.a>

                <motion.a href="mailto:info@solarisfilms.it" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                  className="flex items-start gap-4 card-glass rounded-xl p-5 hover:border-[#EAB308]/30 transition-all" data-testid="contact-email"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#EAB308]/20">
                    <EnvelopeSimple size={22} weight="light" className="text-[#EAB308]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">Email</h3>
                    <p className="text-[#EAB308] font-medium text-sm">info@solarisfilms.it</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Risposta in 24h</p>
                  </div>
                </motion.a>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="card-glass rounded-xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5">
                      <MapPin size={22} weight="light" className="text-white/60" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Sede</h3>
                      <p className="text-sm text-[#94A3B8]">Toscana, Italia</p>
                      <p className="text-xs text-[#94A3B8] mt-1">Operiamo in tutta Italia e Europa</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="rounded-xl p-5 bg-[#111827] border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={20} weight="light" className="text-[#EAB308]" />
                    <h3 className="font-medium text-white">Orari</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span className="text-[#94A3B8]">Lunedi - Venerdi</span><span className="text-white">9:00 - 18:00</span></p>
                    <p className="flex justify-between"><span className="text-[#94A3B8]">Sabato - Domenica</span><span className="text-white/50">Chiuso</span></p>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-2">
                <div className="card-glass rounded-2xl p-8">
                  <h2 className="text-2xl font-medium text-white mb-8">Inviaci un messaggio</h2>

                  {isSuccess ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12" data-testid="contact-success">
                      <CheckCircle size={64} weight="light" className="text-[#EAB308] mx-auto mb-4" />
                      <h3 className="text-xl font-medium text-white mb-2">Messaggio inviato</h3>
                      <p className="text-[#94A3B8] mb-6">Ti risponderemo entro 24 ore.</p>
                      <button onClick={() => setIsSuccess(false)} className="btn-secondary">Invia un altro messaggio</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                      {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Nome *</label>
                          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="form-input-dark" data-testid="contact-nome" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Cognome *</label>
                          <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} required className="form-input-dark" data-testid="contact-cognome" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input-dark" data-testid="contact-email-input" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Telefono *</label>
                          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className="form-input-dark" data-testid="contact-telefono" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Ragione sociale</label>
                          <input type="text" name="ragione_sociale" value={formData.ragione_sociale} onChange={handleChange} className="form-input-dark" data-testid="contact-ragione-sociale" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Citta *</label>
                          <input type="text" name="citta" value={formData.citta} onChange={handleChange} required className="form-input-dark" data-testid="contact-citta" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Richiesta</label>
                        <textarea name="richiesta" value={formData.richiesta} onChange={handleChange} rows={6} className="form-input-dark resize-none" data-testid="contact-richiesta" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Caricamento file</label>
                        <input
                          key={`contact-main-files-${fileInputVersion}`}
                          type="file"
                          multiple
                          accept={acceptedFiles}
                          onChange={(event) => addFiles(event.target.files)}
                          className={fileInputClasses}
                          data-testid="contact-files"
                        />
                        <p className="mt-2 text-xs text-[#94A3B8]/70">Puoi allegare fino a 10 file tutti insieme</p>
                        <details className="mt-3">
                          <summary className="inline-block cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
                            aggiungi file separatamente
                          </summary>
                          <div className="mt-3 grid gap-3">
                            {[0, 1, 2].map((item) => (
                              <input
                                key={`contact-extra-file-${fileInputVersion}-${item}`}
                                type="file"
                                accept={acceptedFiles}
                                onChange={(event) => addFiles(event.target.files)}
                                className={fileInputClasses}
                              />
                            ))}
                          </div>
                        </details>
                        {files.length > 0 && (
                          <p className="mt-3 text-xs text-[#94A3B8]/70">{files.length} file selezionati</p>
                        )}
                      </div>
                      <label className="flex items-start gap-3 text-sm text-[#94A3B8]">
                        <input
                          type="checkbox"
                          name="privacy_accettata"
                          checked={formData.privacy_accettata}
                          onChange={handleChange}
                          required
                          className="mt-1"
                          data-testid="contact-privacy"
                        />
                        <span>Dichiaro di aver letto e accettato le privacy policy *</span>
                      </label>
                      <button type="submit" disabled={isSubmitting} className="btn-yellow w-full disabled:opacity-50" data-testid="contact-submit">
                        {isSubmitting ? 'Invio in corso...' : 'Invia richiesta'}
                      </button>
                      <p className="text-xs text-[#94A3B8]/50 text-center">I dati saranno utilizzati per rispondere alla tua richiesta.</p>
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
