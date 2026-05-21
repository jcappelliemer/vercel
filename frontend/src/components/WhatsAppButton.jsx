import { WhatsappLogo } from '@phosphor-icons/react';
import { useLocation } from '@/next/router-shim';
import { useSettings } from '../hooks/useSettings';
import { normalizeWhatsAppNumber } from '../utils/contactLinks';

const WhatsAppButton = () => {
  const { pathname } = useLocation();
  const settings = useSettings();
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

  if (isFormPage) return null;

  return (
    <a
      href={contactHref}
      target="_blank"
      rel="noopener noreferrer"
      className="contact-action contact-action-wa opacity-100 scale-100 pointer-events-auto"
      data-testid="floating-contact-btn"
      aria-label="Contatto rapido"
    >
      <WhatsappLogo size={26} weight="fill" className="text-white" />
      <span className="contact-action-label">WA</span>
    </a>
  );
};

export default WhatsAppButton;
