import { useEffect, useState } from 'react';
import { WhatsappLogo } from '@phosphor-icons/react';
import { useLocation } from '@/next/router-shim';
import { useSettings } from '../hooks/useSettings';
import { normalizeWhatsAppNumber } from '../utils/contactLinks';

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  const settings = useSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const isFormPage = pathname.startsWith('/preventivo') || pathname.startsWith('/contatti');
  const sourceUrl = typeof window !== 'undefined' ? window.location.href : `https://solarisfilms.it${pathname}`;
  const whatsappMessage = [
    'Ciao, vorrei informazioni sulle pellicole per vetri.',
    '',
    'Fonte: sito Solaris Films',
    `Pagina: ${sourceUrl}`,
  ].join('\n');
  const phone = normalizeWhatsAppNumber(settings.whatsapp);
  const contactHref = `/api/fast-contact?to=${encodeURIComponent(phone)}&text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.innerWidth >= 768 || window.scrollY > 420);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);

    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  useEffect(() => {
    const handleChatState = (event) => {
      setIsChatOpen(Boolean(event.detail?.isOpen));
    };

    window.addEventListener('solaris-chatbot-state', handleChatState);
    return () => window.removeEventListener('solaris-chatbot-state', handleChatState);
  }, []);

  if (isFormPage || isChatOpen) return null;

  return (
    <a
      href={contactHref}
      target="_blank"
      rel="noopener noreferrer"
      className={`contact-action contact-action-wa ${isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
      data-testid="floating-contact-btn"
      aria-label="Contatto rapido"
    >
      <WhatsappLogo size={26} weight="fill" className="text-white" />
      <span className="contact-action-label">WA</span>
    </a>
  );
};

export default WhatsAppButton;
