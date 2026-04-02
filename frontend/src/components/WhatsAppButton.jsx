import { WhatsappLogo } from '@phosphor-icons/react';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/393925466518?text=Ciao%2C%20vorrei%20informazioni%20sulle%20pellicole%20per%20vetri."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all"
      data-testid="whatsapp-floating-btn"
      aria-label="Contattaci su WhatsApp"
    >
      <WhatsappLogo size={28} weight="fill" className="text-white" />
    </a>
  );
};

export default WhatsAppButton;
