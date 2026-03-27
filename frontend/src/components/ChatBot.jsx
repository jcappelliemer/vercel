import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatCircleDots, X, PaperPlaneRight, Robot } from '@phosphor-icons/react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: 'Ciao! Sono l\'assistente virtuale di Solaris Films. Come posso aiutarti oggi? Posso rispondere a domande su pellicole antisolari, di sicurezza, privacy e molto altro.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { type: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        message: userMessage,
        session_id: sessionId,
      });

      setSessionId(response.data.session_id);
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: response.data.response },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Mi dispiace, si è verificato un errore. Per assistenza immediata, contattaci via WhatsApp o telefono.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#002FA7] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#001d6a] transition-colors ${
          isOpen ? 'hidden' : ''
        }`}
        data-testid="chatbot-toggle"
      >
        <ChatCircleDots size={32} weight="fill" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white shadow-2xl border border-[#E5E7EB] flex flex-col"
            style={{ height: '500px', maxHeight: 'calc(100vh - 100px)' }}
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#002FA7] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Robot size={24} weight="fill" />
                </div>
                <div>
                  <p className="font-bold text-sm">Assistente Solaris</p>
                  <p className="text-xs text-white/70">Online • Risponde subito</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
                data-testid="chatbot-close"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FAFB]">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-bubble-bot">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#002FA7] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#002FA7] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#002FA7] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#E5E7EB] bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Scrivi un messaggio..."
                  className="flex-1 px-4 py-2 border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#002FA7]"
                  disabled={isLoading}
                  data-testid="chatbot-input"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-[#002FA7] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#001d6a] transition-colors"
                  data-testid="chatbot-send"
                >
                  <PaperPlaneRight size={20} weight="fill" />
                </button>
              </div>
              <p className="text-xs text-[#0A0A0A]/40 mt-2 text-center">
                Powered by AI • Per urgenze chiama o WhatsApp
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
