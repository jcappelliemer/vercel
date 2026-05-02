import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatCircle, X, PaperPlaneTilt, Robot } from '@phosphor-icons/react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSettings } from '../hooks/useSettings';
import { buildWhatsAppHref } from '../utils/contactLinks';
import { getPublicCrmApiBase } from '../utils/publicApi';

const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');
const LOCAL_STAGING_API = 'https://solarisfilms.vercel.app/api';
const API = BACKEND_URL
  ? `${BACKEND_URL}/api`
  : (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? LOCAL_STAGING_API : '/api');
const CHAT_MESSAGES_KEY = 'solaris_chatbot_messages';
const CHAT_SESSION_KEY = 'solaris_chatbot_session';

const defaultQuickPrompts = [
  {
    label: 'Ridurre caldo',
    message: 'Vorrei ridurre caldo e abbagliamento sulle vetrate. Quale pellicola mi consigli?',
  },
  {
    label: 'Safety Shield',
    message: 'Mi interessa una soluzione Safety Shield per sicurezza e anti-esplosione.',
  },
  {
    label: 'Privacy',
    message: 'Vorrei migliorare privacy e design delle vetrate senza lavori invasivi.',
  },
];

const emptyLeadForm = {
  nome: '',
  cognome: '',
  email: '',
  telefono: '',
  ragione_sociale: '',
  citta: '',
  interesse: 'Consulenza tecnica',
  messaggio: '',
  privacy_accettata: false,
};

const createLocalChatResponse = (message) => {
  const text = String(message || '').toLowerCase();

  if (text.includes('safety') || text.includes('sicurezza') || text.includes('antisfondamento') || text.includes('blindat')) {
    return 'Per sicurezza e protezione delle vetrate valuterei le soluzioni Safety Shield: aiutano a trattenere i frammenti e aumentare la resistenza del vetro. Per consigliarti bene servono tipo di vetro, dimensioni e obiettivo: antieffrazione, anti-infortunio o protezione da esplosione.';
  }

  if (text.includes('caldo') || text.includes('sole') || text.includes('antisolare') || text.includes('abbagliamento')) {
    return 'Per caldo e abbagliamento la famiglia corretta e quella delle pellicole antisolari. La scelta dipende da esposizione, dimensione delle vetrate e livello di trasparenza desiderato. Se mi lasci i dati, il team Solaris puo preparare una consulenza mirata.';
  }

  if (text.includes('privacy') || text.includes('decor') || text.includes('satin') || text.includes('opaca')) {
    return 'Per privacy e resa estetica si lavora con pellicole decorative, satinate o schermanti. Possiamo mantenere luminosita e ridurre la visibilita, scegliendo finitura e grado di copertura in base agli ambienti.';
  }

  if (text.includes('preventivo') || text.includes('prezzo') || text.includes('costo') || text.includes('mq')) {
    return 'Per un preventivo servono pochi dati: citta, metri quadri indicativi, tipo di esigenza e qualche foto delle vetrate. Puoi lasciare nome, email o telefono qui nel chatbot e il team Solaris ti ricontatta.';
  }

  return 'Posso aiutarti a orientarti tra pellicole antisolari, Safety Shield, privacy/decorative e consulenza tecnica. Dimmi che problema vuoi risolvere, oppure lascia i dati nel modulo del chatbot per far gestire la richiesta al team Solaris.';
};

const buildPriority = (data, messages) => {
  const text = [
    data.interesse,
    data.messaggio,
    data.page_path,
    ...messages.map((msg) => msg.text),
  ].join(' ').toLowerCase();
  if (['safety', 'shield', 'anti-esplosione', 'antiesplosione', 'sicurezza', 'antisfondamento', 'urgente'].some((term) => text.includes(term))) return 'alta';
  if (['preventivo', 'consulenza', 'sopralluogo', 'azienda', 'ufficio', 'mq', 'metri', 'caldo', 'antisolare'].some((term) => text.includes(term))) return 'media';
  return 'standard';
};

const formatTranscript = (items) => items.slice(-12).map((msg) => {
  const role = msg.type === 'user' ? 'Cliente' : 'Assistente';
  return `${role}: ${msg.text}`;
}).join('\n');

const sendLeadDirectToCrm = async (data, messages) => {
  const name = [data.nome, data.cognome].map((value) => String(value || '').trim()).filter(Boolean).join(' ')
    || data.email
    || data.telefono
    || 'Lead chatbot Solaris';
  const context = readLeadContext();
  const priority = buildPriority(data, messages);
  const messageParts = [
    'Lead generato dal chatbot Solaris Films.',
    `Priorita: ${priority}`,
    `Interesse: ${data.interesse || 'Non specificato'}`,
    `Citta: ${data.citta || 'Non specificata'}`,
    `Pagina: ${data.page_path || 'Non disponibile'}`,
    `URL completo: ${context.source_url || 'Non disponibile'}`,
    `Referrer: ${context.referrer || 'Non disponibile'}`,
    `Sessione chat: ${data.session_id || 'Non disponibile'}`,
  ];

  if (data.messaggio) messageParts.push('', 'Messaggio cliente:', data.messaggio);
  const transcript = formatTranscript(messages);
  if (transcript) messageParts.push('', 'Ultimi messaggi chat:', transcript);

  await axios.post(`${getPublicCrmApiBase()}/webhook/wordpress-lead`, {
    name,
    email: data.email || '',
    phone: data.telefono || '',
    company: data.ragione_sociale || '',
    message: messageParts.join('\n').trim(),
    source: 'chatbot',
    product_interest: data.interesse || '',
    source_page: context.source_url || data.page_path || '',
    source_site: typeof window !== 'undefined' ? window.location.hostname : 'solarisfilms.it',
    priority,
  }, { timeout: 15000 });

  return { crm_status: 'sent' };
};

const readStoredMessages = (fallbackMessage) => {
  if (typeof window === 'undefined') return [{ type: 'bot', text: fallbackMessage }];

  try {
    const stored = window.localStorage.getItem(CHAT_MESSAGES_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ type: 'bot', text: fallbackMessage }];
  } catch {
    return [{ type: 'bot', text: fallbackMessage }];
  }
};

const readStoredSession = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(CHAT_SESSION_KEY);
};

const readLeadContext = () => {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
    const value = params.get(key);
    if (value) utm[key] = value;
  });

  return {
    source_url: window.location.href,
    referrer: document.referrer || '',
    user_agent: navigator.userAgent || '',
    utm,
  };
};

const ChatBot = () => {
  const { pathname } = useLocation();
  const settings = useSettings();
  const welcomeMessage = settings.chatbot_welcome || 'Ciao! Sono l\'assistente Solaris. Posso aiutarti a scegliere la pellicola giusta.';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => readStoredMessages(welcomeMessage));
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(readStoredSession);
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [leadForm, setLeadForm] = useState(emptyLeadForm);
  const [leadStatus, setLeadStatus] = useState('idle');
  const messagesEndRef = useRef(null);
  const leadFormRef = useRef(null);
  const whatsappHref = buildWhatsAppHref(
    settings.whatsapp,
    'Ciao, vorrei informazioni sulle pellicole per vetri.'
  );
  const isEnabled = settings.chatbot_enabled !== false && settings.chatbot_enabled !== 'false';
  const userMessagesCount = messages.filter((msg) => msg.type === 'user').length;
  const shouldShowLeadHint = userMessagesCount >= 2 && !isLeadFormOpen && leadStatus !== 'sent';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isLeadFormOpen) {
      leadFormRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, [isLeadFormOpen]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      // The chat still works if storage is unavailable.
    }
  }, [messages]);

  useEffect(() => {
    try {
      if (sessionId) window.localStorage.setItem(CHAT_SESSION_KEY, sessionId);
    } catch {
      // Ignore storage errors.
    }
  }, [sessionId]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('solaris-chatbot-state', { detail: { isOpen } }));
    return () => {
      window.dispatchEvent(new CustomEvent('solaris-chatbot-state', { detail: { isOpen: false } }));
    };
  }, [isOpen]);

  useEffect(() => {
    const updateVisibility = () => {
      setIsFloatingVisible(window.innerWidth >= 768 || window.scrollY > 420);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  if (!isEnabled || pathname.startsWith('/preventivo') || pathname.startsWith('/contatti')) {
    return null;
  }

  const handleSend = async (messageOverride) => {
    const userMessage = (messageOverride || input).trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!API) {
        throw new Error('Chat backend is not configured');
      }

      const response = await axios.post(`${API}/chat`, { message: userMessage, session_id: sessionId, page_path: pathname }, { timeout: 30000 });
      setSessionId(response.data.session_id);
      setMessages((prev) => [...prev, {
        type: 'bot',
        text: response.data.response,
        sources: Array.isArray(response.data.sources) ? response.data.sources : [],
      }]);
    } catch (error) {
      const fallbackSession = sessionId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`);
      setSessionId(fallbackSession);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: createLocalChatResponse(userMessage),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadForm = (field, value) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
  };

  const canSubmitLead = (
    leadForm.nome.trim()
    && (leadForm.email.trim() || leadForm.telefono.trim())
    && leadForm.privacy_accettata
    && leadStatus !== 'sending'
  );

  const handleLeadSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmitLead) return;

    setLeadStatus('sending');

    try {
      if (!API) {
        throw new Error('Chat backend is not configured');
      }

      const payload = {
        ...leadForm,
        session_id: sessionId,
        page_path: pathname,
        ...readLeadContext(),
        transcript: messages.slice(-12).map((msg) => ({
          type: msg.type,
          text: msg.text,
        })),
      };

      let responseData = null;
      try {
        const response = await axios.post(`${API}/chat/lead`, payload, { timeout: 20000 });
        responseData = response.data;
      } catch (apiError) {
        const status = apiError.response?.status;
        if (status && ![404, 405].includes(status)) {
          throw apiError;
        }
        responseData = await sendLeadDirectToCrm(payload, messages);
      }
      setLeadStatus('sent');
      setIsLeadFormOpen(false);
      setLeadForm(emptyLeadForm);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: responseData?.crm_status === 'sent'
            ? 'Perfetto, ho inviato la richiesta al team Solaris. Ti ricontatteremo usando i dati che hai lasciato.'
            : 'Perfetto, ho registrato la richiesta. Il team Solaris la prendera in carico appena possibile.',
        },
      ]);
    } catch {
      setLeadStatus('error');
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ y: -2 }}
        onClick={() => setIsOpen(true)}
        className={`contact-action contact-action-chat ${isOpen ? 'hidden' : ''} ${isFloatingVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
        data-testid="chatbot-toggle"
        aria-label="Apri assistente Solaris"
      >
        <ChatCircle size={26} weight="light" className="text-white" />
        <span className="contact-action-label">Assistente</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:bottom-8 md:right-8 z-50 md:w-[400px] bg-[#0A0F1C] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            style={{ height: '550px', maxHeight: 'calc(100vh - 80px)' }}
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(234,179,8,0.15) 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #EAB308 100%)' }}>
                  <Robot size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Assistente Solaris</p>
                  <p className="text-xs text-[#EAB308]">{settings.chatbot_status || 'Assistente tecnico'}</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white" data-testid="chatbot-close" aria-label="Chiudi assistente Solaris">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 pb-28 space-y-4">
              {messages.map((msg, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    {msg.type === 'bot' && Array.isArray(msg.sources) && msg.sources.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {msg.sources.slice(0, 3).map((source, sourceIndex) => (
                          source.origin_url ? (
                            <a
                              key={`${source.title}-${sourceIndex}`}
                              href={source.origin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border border-[#EAB308]/25 px-2 py-1 text-[10px] text-[#FACC15] hover:border-[#FACC15]/60"
                            >
                              {source.title}
                            </a>
                          ) : (
                            <span key={`${source.title}-${sourceIndex}`} className="rounded-full border border-[#EAB308]/25 px-2 py-1 text-[10px] text-[#FACC15]">
                              {source.title}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-2 h-2 rounded-full bg-[#EAB308]" />
                    ))}
                  </div>
                </div>
              )}
              {messages.length <= 1 && !isLoading && (
                <div className="grid gap-2 pt-1">
                  {defaultQuickPrompts.map((prompt) => (
                    <button
                      key={prompt.label}
                      type="button"
                      onClick={() => handleSend(prompt.message)}
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-white/80 transition-colors hover:border-[#EAB308]/35 hover:text-white"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              )}
              {shouldShowLeadHint && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[#EAB308]/25 bg-[#EAB308]/10 p-4"
                >
                  <p className="text-sm font-medium text-white">Vuoi passare la richiesta a un tecnico?</p>
                  <p className="mt-1 text-xs leading-relaxed text-white/55">
                    Posso inoltrare la chat al team, cosi chi ti richiama ha gia il contesto della richiesta.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLeadFormOpen(true)}
                    className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-medium text-[#0A0F1C] hover:bg-[#FACC15]"
                  >
                    Lascia contatto
                  </button>
                </motion.div>
              )}
              {isLeadFormOpen && (
                <form ref={leadFormRef} onSubmit={handleLeadSubmit} className="rounded-2xl border border-[#EAB308]/20 bg-white/[0.04] p-4 space-y-3">
                  <div>
                    <p className="text-sm font-medium text-white">Lascia un contatto</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/45">
                      La conversazione viene allegata alla richiesta per dare contesto al team tecnico.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={leadForm.nome}
                      onChange={(e) => updateLeadForm('nome', e.target.value)}
                      placeholder="Nome"
                      className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#EAB308]/50"
                      maxLength={80}
                      required
                    />
                    <input
                      type="text"
                      value={leadForm.cognome}
                      onChange={(e) => updateLeadForm('cognome', e.target.value)}
                      placeholder="Cognome"
                      className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#EAB308]/50"
                      maxLength={80}
                    />
                    <input
                      type="tel"
                      value={leadForm.telefono}
                      onChange={(e) => updateLeadForm('telefono', e.target.value)}
                      placeholder="Telefono"
                      className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#EAB308]/50"
                      maxLength={40}
                    />
                    <input
                      type="email"
                      value={leadForm.email}
                      onChange={(e) => updateLeadForm('email', e.target.value)}
                      placeholder="Email"
                      className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#EAB308]/50"
                      maxLength={120}
                    />
                    <input
                      type="text"
                      value={leadForm.ragione_sociale}
                      onChange={(e) => updateLeadForm('ragione_sociale', e.target.value)}
                      placeholder="Azienda"
                      className="col-span-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#EAB308]/50"
                      maxLength={120}
                    />
                    <input
                      type="text"
                      value={leadForm.citta}
                      onChange={(e) => updateLeadForm('citta', e.target.value)}
                      placeholder="Citta"
                      className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#EAB308]/50"
                      maxLength={80}
                    />
                    <select
                      value={leadForm.interesse}
                      onChange={(e) => updateLeadForm('interesse', e.target.value)}
                      className="col-span-2 sm:col-span-1 bg-[#111827] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EAB308]/50"
                    >
                      <option>Consulenza tecnica</option>
                      <option>Pellicole antisolari</option>
                      <option>Safety Shield</option>
                      <option>Pellicole di sicurezza</option>
                      <option>Privacy e decorative</option>
                    </select>
                    <textarea
                      value={leadForm.messaggio}
                      onChange={(e) => updateLeadForm('messaggio', e.target.value)}
                      placeholder="Note per il team Solaris"
                      className="col-span-2 min-h-16 resize-none bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#EAB308]/50"
                      maxLength={700}
                    />
                  </div>
                  <label className="flex items-start gap-2 text-xs leading-relaxed text-white/50">
                    <input
                      type="checkbox"
                      checked={leadForm.privacy_accettata}
                      onChange={(e) => updateLeadForm('privacy_accettata', e.target.checked)}
                      className="mt-0.5 accent-[#EAB308]"
                    />
                    <span>Acconsento al trattamento dei dati per essere ricontattato da Solaris Films.</span>
                  </label>
                  {leadStatus === 'error' && (
                    <p className="text-xs text-red-300">Non sono riuscito a inviare il contatto. Puoi riprovare o usare WhatsApp.</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!canSubmitLead}
                      className="flex-1 rounded-xl px-3 py-2 text-xs font-medium text-white disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #2563EB 0%, #EAB308 100%)' }}
                    >
                      {leadStatus === 'sending' ? 'Invio...' : 'Invia al team'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLeadFormOpen(false)}
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white/60 hover:text-white"
                    >
                      Chiudi
                    </button>
                  </div>
                </form>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={settings.chatbot_placeholder || 'Scrivi un messaggio...'}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#EAB308]/50"
                  disabled={isLoading}
                  maxLength={500}
                  data-testid="chatbot-input"
                />
                <button type="button" onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="px-4 rounded-xl disabled:opacity-30 transition-all" style={{ background: 'linear-gradient(135deg, #2563EB 0%, #EAB308 100%)' }} data-testid="chatbot-send" aria-label="Invia messaggio">
                  <PaperPlaneTilt size={20} weight="bold" className="text-white" />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-white/10 px-3 py-2 text-center text-[#EAB308] hover:border-[#EAB308]/35 hover:text-[#FACC15]">
                  WhatsApp
                </a>
                <Link to="/preventivo" onClick={() => setIsOpen(false)} className="rounded-xl border border-white/10 px-3 py-2 text-center text-white/60 hover:border-white/25 hover:text-white">
                  Preventivo
                </Link>
                <button type="button" onClick={() => setIsLeadFormOpen((value) => !value)} className="col-span-2 rounded-xl bg-white/[0.04] px-3 py-2 text-white/75 hover:bg-white/[0.07] hover:text-white">
                  {isLeadFormOpen ? 'Nascondi modulo contatto' : 'Lascia contatto al team'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
