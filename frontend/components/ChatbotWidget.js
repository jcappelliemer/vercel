import { useEffect, useRef, useState } from 'react';

const CRM_ENDPOINT = 'https://crm.solarisfilms.it/api/public/chatbot/message';
const SESSION_KEY = 'solaris_chatbot_session_id';

function getSessionId() {
  if (typeof window === 'undefined') return '';
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const value = `web-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_KEY, value);
  return value;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'hello',
      direction: 'bot',
      text: 'Ciao, sono l’assistente Solaris. Posso aiutarti a orientarti su pellicole antisolari, sicurezza, privacy e vetrofanie.',
    },
  ]);
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState({ visitor_name: '', visitor_email: '', visitor_phone: '', privacy_acceptance: false });
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  const addMessage = (direction, text) => {
    setMessages((items) => [...items, { id: `${Date.now()}-${Math.random()}`, direction, text }]);
  };

  const hasContact = Boolean(contact.visitor_name || contact.visitor_email || contact.visitor_phone);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text || sending) return;
    if (hasContact && !contact.privacy_acceptance) {
      addMessage('bot', 'Per inviare dati di contatto serve accettare la privacy. Puoi comunque farmi domande senza lasciare dati personali.');
      return;
    }

    setMessage('');
    addMessage('user', text);
    setSending(true);
    try {
      const response = await fetch(CRM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
          message: text,
          session_id: sessionId || getSessionId(),
          page_path: window.location.pathname,
          page_url: window.location.href,
          visitor_name: contact.visitor_name || undefined,
          visitor_email: contact.visitor_email || undefined,
          visitor_phone: contact.visitor_phone || undefined,
          privacy_acceptance: contact.privacy_acceptance,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.detail || 'Risposta non disponibile');
      }
      addMessage('bot', payload.reply || 'Ho registrato la richiesta.');
    } catch (error) {
      addMessage('bot', 'In questo momento la chat non riesce a rispondere. Puoi usare il modulo contatti o riprovare tra poco.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="sf-chatbot">
      {!open && (
        <button className="sf-chatbot__toggle" type="button" onClick={() => setOpen(true)} aria-label="Apri chat Solaris">
          Chat
        </button>
      )}
      {open && (
        <section className="sf-chatbot__panel" aria-label="Chat Solaris">
          <header className="sf-chatbot__header">
            <div>
              <strong>Solaris Assistant</strong>
              <span>Risposte tecniche iniziali</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Chiudi chat">×</button>
          </header>

          <div className="sf-chatbot__messages" ref={listRef} role="log">
            {messages.map((item) => (
              <div key={item.id} className={`sf-chatbot__message sf-chatbot__message--${item.direction}`}>
                {item.text}
              </div>
            ))}
          </div>

          <div className="sf-chatbot__contact">
            <details>
              <summary>Lascia contatto per essere richiamato</summary>
              <input value={contact.visitor_name} onChange={(event) => setContact((data) => ({ ...data, visitor_name: event.target.value }))} placeholder="Nome" autoComplete="name" />
              <input value={contact.visitor_email} onChange={(event) => setContact((data) => ({ ...data, visitor_email: event.target.value }))} placeholder="Email" type="email" autoComplete="email" />
              <input value={contact.visitor_phone} onChange={(event) => setContact((data) => ({ ...data, visitor_phone: event.target.value }))} placeholder="Telefono" autoComplete="tel" />
              <label>
                <input type="checkbox" checked={contact.privacy_acceptance} onChange={(event) => setContact((data) => ({ ...data, privacy_acceptance: event.target.checked }))} />
                <span>Accetto la <a href="/privacy-policy" target="_blank" rel="noreferrer">privacy</a></span>
              </label>
            </details>
          </div>

          <form className="sf-chatbot__form" onSubmit={sendMessage}>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={2} placeholder="Scrivi qui la tua domanda..." required />
            <button type="submit" disabled={sending}>{sending ? '...' : 'Invia'}</button>
          </form>
        </section>
      )}
    </div>
  );
}
