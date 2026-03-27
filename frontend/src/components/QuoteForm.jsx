import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Phone, WhatsappLogo } from '@phosphor-icons/react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const pellicoleTipi = [
  { value: 'antisolari', label: 'Pellicole Antisolari' },
  { value: 'sicurezza', label: 'Pellicole di Sicurezza' },
  { value: 'privacy', label: 'Pellicole Privacy/Design' },
  { value: 'lcd-switch', label: 'Pellicole LCD Switch' },
  { value: 'fotocromatiche', label: 'Pellicole Fotocromatiche' },
  { value: 'altro', label: 'Altro / Non so' },
];

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    ragione_sociale: '',
    citta: '',
    tipo_pellicola: '',
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
      await axios.post(`${API}/quote`, formData);
      setIsSuccess(true);
      setFormData({
        nome: '',
        cognome: '',
        email: '',
        telefono: '',
        ragione_sociale: '',
        citta: '',
        tipo_pellicola: '',
        messaggio: '',
      });
    } catch (err) {
      console.error('Quote submission error:', err);
      setError('Si è verificato un errore. Riprova o contattaci direttamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-[#E5E7EB] p-8 text-center"
        data-testid="quote-success"
      >
        <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} weight="fill" className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-[#0A0A0A] mb-4">
          Richiesta Inviata!
        </h3>
        <p className="text-[#0A0A0A]/70 mb-6">
          Grazie per averci contattato. Ti risponderemo entro 24 ore con un preventivo personalizzato.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://wa.me/390000000000"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white font-medium"
            data-testid="quote-success-whatsapp"
          >
            <WhatsappLogo size={20} weight="fill" />
            Contattaci su WhatsApp
          </a>
          <button
            onClick={() => setIsSuccess(false)}
            className="px-6 py-3 border-2 border-[#0A0A0A] font-medium hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            Nuova Richiesta
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="quote-form">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
            Nome *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Mario"
            data-testid="quote-nome"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
            Cognome *
          </label>
          <input
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Rossi"
            data-testid="quote-cognome"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="mario@email.com"
            data-testid="quote-email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
            Telefono *
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="+39 333 1234567"
            data-testid="quote-telefono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
            Ragione Sociale
          </label>
          <input
            type="text"
            name="ragione_sociale"
            value={formData.ragione_sociale}
            onChange={handleChange}
            className="form-input"
            placeholder="Nome Azienda (opzionale)"
            data-testid="quote-ragione-sociale"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
            Città *
          </label>
          <input
            type="text"
            name="citta"
            value={formData.citta}
            onChange={handleChange}
            required
            className="form-input"
            placeholder="Roma"
            data-testid="quote-citta"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
          Tipo di Pellicola *
        </label>
        <select
          name="tipo_pellicola"
          value={formData.tipo_pellicola}
          onChange={handleChange}
          required
          className="form-input"
          data-testid="quote-tipo-pellicola"
        >
          <option value="">Seleziona il tipo di pellicola</option>
          {pellicoleTipi.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
          Messaggio / Dettagli
        </label>
        <textarea
          name="messaggio"
          value={formData.messaggio}
          onChange={handleChange}
          rows={4}
          className="form-input resize-none"
          placeholder="Descrivi le tue esigenze: dimensioni vetrate, problemi da risolvere, ecc."
          data-testid="quote-messaggio"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
          data-testid="quote-submit"
        >
          {isSubmitting ? (
            'Invio in corso...'
          ) : (
            <>
              Richiedi Preventivo
              <ArrowRight size={20} weight="bold" />
            </>
          )}
        </button>
        <a
          href="tel:+390000000000"
          className="btn-outline flex items-center justify-center gap-2"
          data-testid="quote-call"
        >
          <Phone size={20} weight="bold" />
          Chiama Ora
        </a>
      </div>

      <p className="text-xs text-[#0A0A0A]/50 text-center">
        Inviando questo form accetti la nostra{' '}
        <a href="/privacy-policy" className="underline">Privacy Policy</a>. 
        Risposta garantita entro 24 ore.
      </p>
    </form>
  );
};

export default QuoteForm;
