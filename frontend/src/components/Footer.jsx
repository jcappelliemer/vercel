import { Link } from 'react-router-dom';
import { Phone, EnvelopeSimple, MapPin, LinkedinLogo, InstagramLogo, FacebookLogo } from '@phosphor-icons/react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#05050A] border-t border-white/5" data-testid="footer">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-[#00E5FF]/50 flex items-center justify-center">
                <span className="text-[#00E5FF] font-semibold">SF</span>
              </div>
              <div>
                <span className="font-light text-lg text-white">SOLARIS</span>
                <span className="font-light text-lg text-[#00E5FF]">FILMS</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Distributore esclusivo MADICO USA per Italia. 
              40 anni di eccellenza nelle pellicole per vetri.
            </p>
            <div className="flex gap-3">
              {[LinkedinLogo, InstagramLogo, FacebookLogo].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 border border-white/10 flex items-center justify-center text-slate-500 hover:text-[#00E5FF] hover:border-[#00E5FF]/30 transition-all"
                >
                  <Icon size={18} weight="light" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Servizi</h4>
            <ul className="space-y-3">
              {['Pellicole Antisolari', 'Pellicole di Sicurezza', 'Pellicole Privacy', 'LCD Switch', 'Fotocromatiche'].map((item, i) => (
                <li key={i}>
                  <Link to="/servizi" className="text-sm text-slate-500 hover:text-[#00E5FF] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Azienda</h4>
            <ul className="space-y-3">
              {[
                { name: 'Chi Siamo', path: '/chi-siamo' },
                { name: 'Blog', path: '/blog' },
                { name: 'Contatti', path: '/contatti' },
                { name: 'Preventivo', path: '/preventivo' },
              ].map((item, i) => (
                <li key={i}>
                  <Link to={item.path} className="text-sm text-slate-500 hover:text-[#00E5FF] transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Contatti</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+390000000000" className="flex items-center gap-3 text-sm text-slate-500 hover:text-[#00E5FF] transition-colors">
                  <Phone size={16} weight="light" className="text-[#00E5FF]" />
                  +39 000 000 0000
                </a>
              </li>
              <li>
                <a href="mailto:info@solarisfilms.it" className="flex items-center gap-3 text-sm text-slate-500 hover:text-[#00E5FF] transition-colors">
                  <EnvelopeSimple size={16} weight="light" className="text-[#00E5FF]" />
                  info@solarisfilms.it
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-slate-500">
                  <MapPin size={16} weight="light" className="text-[#00E5FF] mt-0.5" />
                  <span>Toscana, Italia<br />Operiamo in tutta Europa</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">
              © {currentYear} Solaris Films. Tutti i diritti riservati.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-600">
              <span>ISO 9001</span>
              <span className="w-px h-4 bg-white/10" />
              <span>Distributore MADICO USA</span>
              <span className="w-px h-4 bg-white/10" />
              <span>Garanzia 10 anni</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
