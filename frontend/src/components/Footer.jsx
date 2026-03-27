import { Link } from 'react-router-dom';
import { Phone, EnvelopeSimple, MapPin, WhatsappLogo, LinkedinLogo, InstagramLogo, FacebookLogo, YoutubeLogo } from '@phosphor-icons/react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] text-white" data-testid="footer">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#002FA7] flex items-center justify-center">
                <span className="text-white font-black text-xl">SF</span>
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight">SOLARIS</span>
                <span className="font-medium text-lg text-[#002FA7]">FILMS</span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              Distributore esclusivo MADICO USA per Italia e Spagna. 
              40 anni di esperienza nelle pellicole per vetri professionali.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#002FA7] transition-colors" data-testid="footer-linkedin">
                <LinkedinLogo size={24} weight="fill" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#002FA7] transition-colors" data-testid="footer-instagram">
                <InstagramLogo size={24} weight="fill" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#002FA7] transition-colors" data-testid="footer-facebook">
                <FacebookLogo size={24} weight="fill" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#002FA7] transition-colors" data-testid="footer-youtube">
                <YoutubeLogo size={24} weight="fill" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Servizi</h4>
            <ul className="space-y-3">
              <li><Link to="/servizi#antisolari" className="text-white/60 hover:text-white text-sm transition-colors">Pellicole Antisolari</Link></li>
              <li><Link to="/servizi#sicurezza" className="text-white/60 hover:text-white text-sm transition-colors">Pellicole di Sicurezza</Link></li>
              <li><Link to="/servizi#privacy" className="text-white/60 hover:text-white text-sm transition-colors">Pellicole Privacy</Link></li>
              <li><Link to="/servizi#lcd-switch" className="text-white/60 hover:text-white text-sm transition-colors">Pellicole LCD Switch</Link></li>
              <li><Link to="/servizi#fotocromatiche" className="text-white/60 hover:text-white text-sm transition-colors">Pellicole Fotocromatiche</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Azienda</h4>
            <ul className="space-y-3">
              <li><Link to="/chi-siamo" className="text-white/60 hover:text-white text-sm transition-colors">Chi Siamo</Link></li>
              <li><Link to="/blog" className="text-white/60 hover:text-white text-sm transition-colors">Blog</Link></li>
              <li><Link to="/contatti" className="text-white/60 hover:text-white text-sm transition-colors">Contatti</Link></li>
              <li><Link to="/preventivo" className="text-white/60 hover:text-white text-sm transition-colors">Preventivo</Link></li>
              <li><a href="/privacy-policy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-6">Contatti</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+390000000000" className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors" data-testid="footer-phone">
                  <Phone size={20} weight="bold" className="text-[#002FA7]" />
                  +39 000 000 0000
                </a>
              </li>
              <li>
                <a href="https://wa.me/390000000000" className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors" data-testid="footer-whatsapp">
                  <WhatsappLogo size={20} weight="fill" className="text-[#25D366]" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:info@solarisfilms.it" className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors" data-testid="footer-email">
                  <EnvelopeSimple size={20} weight="bold" className="text-[#002FA7]" />
                  info@solarisfilms.it
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-white/60 text-sm">
                  <MapPin size={20} weight="bold" className="text-[#002FA7] flex-shrink-0 mt-0.5" />
                  <span>Toscana, Italia</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs">
              © {currentYear} Solaris Films. Tutti i diritti riservati. P.IVA 00000000000
            </p>
            <div className="flex items-center gap-4">
              <img 
                src="https://www.solarisfilms.it/wp-content/uploads/2025/05/iso9001logosmart.svg" 
                alt="ISO 9001"
                className="h-8 opacity-60"
              />
              <span className="text-white/40 text-xs">Distributore Esclusivo MADICO USA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
