import { Link } from 'react-router-dom';
import { Phone, EnvelopeSimple, MapPin, LinkedinLogo, InstagramLogo, YoutubeLogo } from '@phosphor-icons/react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)' }}>
                <span className="text-white font-bold">SF</span>
              </div>
              <div>
                <span className="font-semibold text-xl text-white">SOLARIS</span>
                <span className="font-semibold text-xl text-gradient">FILMS</span>
              </div>
            </div>
            <p className="text-[#8B9AB8] text-sm leading-relaxed mb-6">
              Distributore esclusivo MADICO USA. 40 anni di eccellenza nel settore.
            </p>
            <div className="flex gap-3">
              {[LinkedinLogo, InstagramLogo, YoutubeLogo].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8B9AB8] hover:text-[#00D4FF] hover:border-[#00D4FF]/30 transition-all">
                  <Icon size={18} weight="light" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium mb-6">Servizi</h4>
            <ul className="space-y-3">
              {['LCD Switch', 'Pellicole Antisolari', 'Sicurezza', 'Privacy', 'Fotocromatiche'].map((item, i) => (
                <li key={i}>
                  <Link to="/servizi" className="text-[#8B9AB8] hover:text-[#00D4FF] transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-medium mb-6">Azienda</h4>
            <ul className="space-y-3">
              {[{ name: 'Chi Siamo', path: '/chi-siamo' }, { name: 'Blog', path: '/blog' }, { name: 'Contatti', path: '/contatti' }, { name: 'Preventivo', path: '/preventivo' }].map((item, i) => (
                <li key={i}>
                  <Link to={item.path} className="text-[#8B9AB8] hover:text-[#00D4FF] transition-colors text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-6">Contatti</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+390000000000" className="flex items-center gap-3 text-[#8B9AB8] hover:text-[#00D4FF] transition-colors text-sm">
                  <Phone size={16} className="text-[#00D4FF]" />
                  +39 000 000 0000
                </a>
              </li>
              <li>
                <a href="mailto:info@solarisfilms.it" className="flex items-center gap-3 text-[#8B9AB8] hover:text-[#00D4FF] transition-colors text-sm">
                  <EnvelopeSimple size={16} className="text-[#00D4FF]" />
                  info@solarisfilms.it
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-[#8B9AB8] text-sm">
                  <MapPin size={16} className="text-[#00D4FF] mt-0.5" />
                  <span>Toscana, Italia</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#8B9AB8]/50">© {currentYear} Solaris Films. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4 text-xs text-[#8B9AB8]/50">
            <span>ISO 9001</span>
            <span className="w-px h-3 bg-white/10" />
            <span>MADICO USA</span>
            <span className="w-px h-3 bg-white/10" />
            <span>Garanzia 10 anni</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
