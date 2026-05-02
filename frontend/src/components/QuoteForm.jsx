import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Phone, WhatsappLogo } from '@phosphor-icons/react';
import axios from 'axios';
import { useSettings } from '../hooks/useSettings';
import { buildWhatsAppHref } from '../utils/contactLinks';
import { appendSourceFields, getPublicCrmApiBase } from '../utils/publicApi';

const pellicoleTipi = [
  { value: 'Pellicole Antisolari', label: 'Pellicole Antisolari' },
  { value: 'Safety Shield anti-esplosione', label: 'Safety Shield anti-esplosione' },
  { value: 'Pellicole di Sicurezza', label: 'Pellicole di Sicurezza' },
  { value: 'Pellicole Privacy/Design', label: 'Pellicole Privacy/Design' },
  { value: 'Altro / Non so', label: 'Altro / Non so' },
];

const emptyQuote = {
  nome: '',
  cognome: '',
  ragione_sociale: '',
  citta: '',
  telefono: '',
  email: '',
  superficie_mq: '',
  tipo_pellicola: '',
  richiesta: '',
  privacy_accettata: false,
};

const fileInputClasses = 'block w-full text-sm text-[#94A3B8] file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-white/15';
const acceptedFiles = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar,image/*';

const QuoteForm = () => {
  const settings = useSettings();
  const [formData, setFormData] = useState(emptyQuote);
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
    setFormData(emptyQuote);
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
      payload.append('surface_sqm', formData.superficie_mq);
      payload.append('product_interest', formData.tipo_pellicola);
      payload.append('request_notes', formData.richiesta);
      payload.append('privacy_acceptance', String(formData.privacy_accettata));
      payload.append('messaggio', formData.richiesta);
      appendSourceFields(payload, 'richiedi_preventivo');
      files.forEach((file) => payload.append('attachment_image', file));

      await axios.post(`${getPublicCrmApiBase()}/public/forms/quote-request/plain`, payload);
      setIsSuccess(true);
      resetForm();
    } catch (err) {
      console.error('Quote submission error:', err);
      setError('Si e verificato un errore. Riprova o contattaci direttamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
        data-testid="quote-success"
      >
        <div className="w-20 h-20 rounded-2xl bg-[#EAB308]/10 border border-[#EAB308]/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} weight="light" className="text-[#EAB308]" />
        </div>
        <h3 className="text-2xl font-medium text-white mb-4">Richiesta inviata</h3>
        <p className="text-[#94A3B8] mb-8 max-w-sm mx-auto">
          Ti risponderemo entro 24 ore con un preventivo personalizzato.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href={buildWhatsAppHref(settings.whatsapp, 'Ciao, ho appena inviato una richiesta di preventivo dal sito Solaris Films.')} className="btn-secondary" data-testid="quote-success-whatsapp">
            <WhatsappLogo size={18} weight="fill" />
            WhatsApp
          </a>
          <button onClick={() => setIsSuccess(false)} className="btn-secondary">Nuova richiesta</button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-testid="quote-form">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Nome *</label>
          <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="form-input-dark" data-testid="quote-nome" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Cognome *</label>
          <input type="text" name="cognome" value={formData.cognome} onChange={handleChange} required className="form-input-dark" data-testid="quote-cognome" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Azienda</label>
          <input type="text" name="ragione_sociale" value={formData.ragione_sociale} onChange={handleChange} className="form-input-dark" data-testid="quote-ragione-sociale" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Citta *</label>
          <input type="text" name="citta" value={formData.citta} onChange={handleChange} required className="form-input-dark" data-testid="quote-citta" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Telefono *</label>
          <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required className="form-input-dark" data-testid="quote-telefono" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Email *</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input-dark" data-testid="quote-email" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Superficie (mq) *</label>
          <input type="number" step="0.1" min="0" name="superficie_mq" value={formData.superficie_mq} onChange={handleChange} required className="form-input-dark" data-testid="quote-superficie-mq" />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Prodotto di interesse *</label>
          <input
            type="text"
            name="tipo_pellicola"
            value={formData.tipo_pellicola}
            onChange={handleChange}
            required
            className="form-input-dark"
            list="quote-product-options"
            data-testid="quote-tipo-pellicola"
          />
          <datalist id="quote-product-options">
            {pellicoleTipi.map((tipo) => (
              <option key={tipo.value} value={tipo.label} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Richiesta *</label>
        <textarea name="richiesta" value={formData.richiesta} onChange={handleChange} rows={4} required className="form-input-dark resize-none" data-testid="quote-richiesta" />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[#94A3B8] mb-3">Caricamento file</label>
        <input
          key={`quote-main-files-${fileInputVersion}`}
          type="file"
          multiple
          accept={acceptedFiles}
          onChange={(event) => addFiles(event.target.files)}
          className={fileInputClasses}
          data-testid="quote-files"
        />
        <p className="mt-2 text-xs text-[#94A3B8]/70">Puoi allegare fino a 10 file tutti insieme</p>
        <details className="mt-3">
          <summary className="inline-block cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
            aggiungi file separatamente
          </summary>
          <div className="mt-3 grid gap-3">
            {[0, 1, 2].map((item) => (
              <input
                key={`quote-extra-file-${fileInputVersion}-${item}`}
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
          data-testid="quote-privacy"
        />
        <span>Accetto i termini e dichiaro di aver letto l'informativa privacy *</span>
      </label>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button type="submit" disabled={isSubmitting} className="btn-yellow flex-1 disabled:opacity-50" data-testid="quote-submit">
          {isSubmitting ? 'Invio in corso...' : 'Invia richiesta'}
          <ArrowRight size={18} weight="bold" />
        </button>
        <a href="tel:+390559107621" className="btn-secondary" data-testid="quote-call">
          <Phone size={18} weight="light" />
          Chiama
        </a>
      </div>

      <p className="text-xs text-[#94A3B8]/50 text-center">
        I dati saranno utilizzati per rispondere alla richiesta di preventivo.
      </p>
    </form>
  );
};

export default QuoteForm;
