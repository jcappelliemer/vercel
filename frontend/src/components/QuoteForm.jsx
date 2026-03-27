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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
        data-testid="quote-success"
      >
        <div className="w-20 h-20 bg-[#0891B2]/10 border border-[#0891B2] flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} weight="light" className="text-[#0891B2]" />
        </div>
        <h3 className="text-2xl font-light text-[#0F172A] mb-4">
          Richiesta Inviata
        </h3>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Ti risponderemo entro 24 ore con un preventivo personalizzato.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="https://wa.me/390000000000"
            className="btn-secondary"
            data-testid="quote-success-whatsapp"
          >
            <WhatsappLogo size={18} weight="fill" />
            WhatsApp
          </a>
          <button
            onClick={() => setIsSuccess(false)}
            className="btn-secondary"
          >
            Nuova Richiesta
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8" data-testid="quote-form">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3">
            Nome *
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="form-input-luxury"
            data-testid="quote-nome"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3">
            Cognome *
          </label>
          <input
            type="text"
            name="cognome"
            value={formData.cognome}
            onChange={handleChange}
            required
            className="form-input-luxury"
            data-testid="quote-cognome"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input-luxury"
            data-testid="quote-email"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3">
            Telefono *
          </label>
          <input
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            className="form-input-luxury"
            data-testid="quote-telefono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3">
            Ragione Sociale
          </label>
          <input
            type="text"
            name="ragione_sociale"
            value={formData.ragione_sociale}
            onChange={handleChange}
            className="form-input-luxury"
            data-testid="quote-ragione-sociale"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3">
            Città *
          </label>
          <input
            type="text"
            name="citta"
            value={formData.citta}
            onChange={handleChange}
            required
            className="form-input-luxury"
            data-testid="quote-citta"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3">
          Tipo di Pellicola *
        </label>
        <select
          name="tipo_pellicola"
          value={formData.tipo_pellicola}
          onChange={handleChange}
          required
          className="form-input-luxury bg-transparent"
          data-testid="quote-tipo-pellicola"
        >
          <option value="">Seleziona</option>
          {pellicoleTipi.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-slate-400 mb-3">
          Messaggio
        </label>
        <textarea
          name="messaggio"
          value={formData.messaggio}
          onChange={handleChange}
          rows={4}
          className="form-input-luxury resize-none"
          placeholder="Descrivi le tue esigenze..."
          data-testid="quote-messaggio"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-cyan flex-1 disabled:opacity-50"
          data-testid="quote-submit"
        >
          {isSubmitting ? 'Invio in corso...' : 'Richiedi Preventivo'}
          <ArrowRight size={18} weight="bold" />
        </button>
        <a
          href="tel:+390000000000"
          className="btn-secondary"
          data-testid="quote-call"
        >
          <Phone size={18} weight="light" />
          Chiama
        </a>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Inviando questo form accetti la nostra Privacy Policy.
      </p>
    </form>
  );
};

export default QuoteForm;
