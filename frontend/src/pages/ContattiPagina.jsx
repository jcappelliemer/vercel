import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Buildings,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  MapPin,
  Phone,
  ShieldCheck,
  WhatsappLogo,
} from '@phosphor-icons/react';
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

const contactProof = [
  'Consulenza su antisolari, sicurezza, privacy e design',
  'Possibilita di allegare foto, misure e documenti',
  'Risposta tecnica orientata al caso reale',
];

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
      <SEO
        title="Contatti"
        description="Contatta Solaris Films per informazioni sulle pellicole per vetri MADICO. Richiedi una consulenza gratuita o un preventivo senza impegno."
        path="/contatti"
      />
      <Header />

      <main className="pt-24">
        <section className="py-14 md:py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 items-center">
              <div className="max-w-3xl">
                <div className="accent-bar w-16 mb-6" />
                <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-4">Contatto diretto Solaris</p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                  Parliamo del
                  <br />
                  <span className="text-gradient">tuo progetto</span>
                </h1>
                <p className="text-lg text-[#94A3B8] leading-relaxed">
                  Scrivici cosa devi risolvere sui vetri: calore, sicurezza, privacy, design o manutenzione. Ti indirizziamo verso il percorso più adatto.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <a href="tel:+390559107621" className="btn-yellow" data-testid="contact-hero-phone">
                    <Phone size={18} weight="fill" />
                    Chiama Solaris
                  </a>
                  <a
                    href={buildWhatsAppHref(settings.whatsapp, 'Ciao, vorrei parlare con Solaris Films di un progetto sui vetri.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    data-testid="contact-hero-whatsapp"
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="space-y-5">
                <figure className="relative min-h-[230px] overflow-hidden rounded-2xl border border-white/10">
                  <img
                    src="/assets/generated/main-pages/contatti-consulenza.webp"
                    alt="Desk Solaris per consulenza tecnica e contatto diretto"
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/85 via-[#0A0F1C]/10 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-[#EAB308]">Contatto utile</span>
                    <p className="mt-2 text-sm leading-relaxed text-white">Il primo confronto collega richiesta, foto e percorso tecnico.</p>
                  </figcaption>
                </figure>

                <aside className="card-glass rounded-2xl p-6 md:p-8" aria-label="Metodo di contatto Solaris">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#EAB308]/15 border border-[#EAB308]/25 flex items-center justify-center">
                      <ShieldCheck size={22} weight="fill" className="text-[#EAB308]" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#94A3B8]">Prima risposta utile</p>
                      <h2 className="text-xl font-medium text-white">Cosa puoi inviarci</h2>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {contactProof.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-[#94A3B8]">
                        <CheckCircle size={18} weight="fill" className="text-[#EAB308] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-form-light py-14 md:py-20 bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              <div className="space-y-4 order-2 lg:order-1">
                <motion.a
                  href="tel:+390559107621"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-4 card-glass rounded-xl p-5 hover:border-[#EAB308]/30 transition-all"
                  data-testid="contact-phone"
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

                <motion.a
                  href={buildWhatsAppHref(settings.whatsapp, 'Ciao, vorrei informazioni sulle pellicole per vetri.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-4 rounded-xl p-5 bg-[#25D366]/10 border border-[#25D366]/20 hover:border-[#25D366]/40 transition-all"
                  data-testid="contact-whatsapp"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#25D366]/20">
                    <WhatsappLogo size={22} weight="fill" className="text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white mb-1">WhatsApp</h3>
                    <p className="text-[#25D366] font-medium text-sm">Chatta con noi</p>
                    <p className="text-xs text-[#94A3B8] mt-1">Rapido per foto e prime domande</p>
                  </div>
                </motion.a>

                <motion.a
                  href="mailto:info@solarisfilms.it"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-start gap-4 card-glass rounded-xl p-5 hover:border-[#EAB308]/30 transition-all"
                  data-testid="contact-email"
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

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card-glass rounded-xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0]">
                      <MapPin size={22} weight="light" className="text-[#64748B]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Sede</h3>
                      <p className="text-sm text-[#94A3B8]">Toscana, Italia</p>
                      <p className="text-xs text-[#94A3B8] mt-1">Operiamo in Italia e in Europa</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-xl p-5 bg-white border border-[#E2E8F0] shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={20} weight="light" className="text-[#EAB308]" />
                    <h3 className="font-medium text-white">Orari</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between gap-4">
                      <span className="text-[#94A3B8]">Lunedi - Venerdi</span>
                      <span className="text-[#0A0F1C]">9:00 - 18:00</span>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span className="text-[#94A3B8]">Sabato - Domenica</span>
                      <span className="text-[#64748B]">Chiuso</span>
                    </p>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-2 order-1 lg:order-2">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
                  <div className="mb-8">
                    <p className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-3">Messaggio al team</p>
                    <h2 className="text-2xl md:text-3xl font-medium text-white">Inviaci dettagli e allegati</h2>
                    <p className="text-[#94A3B8] mt-3">
                      Indica citta, obiettivo e tipo di edificio. Se hai foto dei vetri, allegale: aiutano a rispondere meglio.
                    </p>
                  </div>

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
                          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Nome" className="form-input-dark" data-testid="contact-nome" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Cognome *</label>
                          <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} required placeholder="Cognome" className="form-input-dark" data-testid="contact-cognome" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Email *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="nome@azienda.it" className="form-input-dark" data-testid="contact-email-input" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Telefono *</label>
                          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="+39 ..." className="form-input-dark" data-testid="contact-telefono" />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Ragione sociale</label>
                          <input type="text" name="ragione_sociale" value={formData.ragione_sociale} onChange={handleChange} placeholder="Azienda o ente" className="form-input-dark" data-testid="contact-ragione-sociale" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Citta *</label>
                          <input type="text" name="citta" value={formData.citta} onChange={handleChange} required placeholder="Citta intervento" className="form-input-dark" data-testid="contact-citta" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Richiesta</label>
                        <textarea name="richiesta" value={formData.richiesta} onChange={handleChange} rows={6} placeholder="Descrivi vetri, problema, obiettivo e tempi desiderati." className="form-input-dark resize-none" data-testid="contact-richiesta" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Foto o documenti</label>
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
                        <span>Dichiaro di aver letto e accettato l'informativa privacy *</span>
                      </label>
                      <button type="submit" disabled={isSubmitting} className="btn-yellow w-full disabled:opacity-50" data-testid="contact-submit">
                        {isSubmitting ? 'Invio in corso...' : 'Invia richiesta'}
                        <ArrowRight size={18} weight="bold" />
                      </button>
                      <p className="text-xs text-[#94A3B8]/50 text-center">I dati saranno utilizzati per rispondere alla tua richiesta.</p>
                    </form>
                  )}
                </div>

                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                    <Buildings size={22} weight="light" className="text-[#EAB308] mb-3" />
                    <h3 className="font-medium text-white">Progetti e aziende</h3>
                    <p className="text-sm text-[#94A3B8] mt-2">Uffici, scuole, retail, industria, strutture sanitarie e abitazioni private.</p>
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
                    <ShieldCheck size={22} weight="light" className="text-[#EAB308] mb-3" />
                    <h3 className="font-medium text-white">Risposta tecnica</h3>
                    <p className="text-sm text-[#94A3B8] mt-2">La prima risposta orienta prodotto, posa, eventuale sopralluogo e documentazione necessaria.</p>
                  </div>
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
