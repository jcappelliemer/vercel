import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatCircle, X, PaperPlaneTilt, Robot } from '@phosphor-icons/react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ type: 'bot', text: 'Ciao! Come posso aiutarti?' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, { message: userMessage, session_id: sessionId });
      setSessionId(response.data.session_id);
      setMessages((prev) => [...prev, { type: 'bot', text: response.data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { type: 'bot', text: 'Errore. Contattaci direttamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isOpen ? 'hidden' : ''}`}
        style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)' }}
        data-testid="chatbot-toggle"
      >
        <ChatCircle size={28} weight="light" className="text-white" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 w-[400px] max-w-[calc(100vw-64px)] bg-[#131B2E] border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            style={{ height: '550px', maxHeight: 'calc(100vh-100px)' }}
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(124,58,237,0.1) 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)' }}>
                  <Robot size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium text-white text-sm">Assistente AI</p>
                  <p className="text-xs text-[#00D4FF]">Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white" data-testid="chatbot-close">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} className="w-2 h-2 rounded-full" style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)' }} />
                    ))}
                  </div>
                </div>
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00D4FF]/50"
                  disabled={isLoading}
                  data-testid="chatbot-input"
                />
                <button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-4 rounded-xl disabled:opacity-30 transition-all" style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)' }} data-testid="chatbot-send">
                  <PaperPlaneTilt size={20} weight="bold" className="text-white" />
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
