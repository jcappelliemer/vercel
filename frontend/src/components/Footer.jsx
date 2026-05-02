import { Link } from 'react-router-dom';
import { Phone, EnvelopeSimple, MapPin, LinkedinLogo, InstagramLogo, YoutubeLogo } from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';

const serviceLinks = [
  { name: 'Pellicole Antisolari', path: '/servizi#antisolari' },
  { name: 'Safety Shield', path: '/servizi#safety-shield' },
  { name: 'Sicurezza', path: '/servizi#sicurezza' },
  { name: 'Privacy e Design', path: '/servizi#privacy' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const settings = useSettings();
  const socialLinks = [
    { icon: LinkedinLogo, href: settings.linkedin, label: 'LinkedIn' },
    { icon: InstagramLogo, href: settings.instagram, label: 'Instagram' },
    { icon: YoutubeLogo, href: settings.youtube, label: 'YouTube' },
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-white/5" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex items-center mb-6">
              <img
                src={settings.logo_url || '/assets/solaris-logo.png'}
                alt={settings.company_name || 'Solaris Films'}
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
              {settings.footer_text}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#EAB308] hover:border-[#EAB308]/30 transition-all">
                  <item.icon size={18} weight="light" />
                </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium mb-6">Servizi</h4>
            <ul className="space-y-3">
              {serviceLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-[#94A3B8] hover:text-[#EAB308] transition-colors text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-medium mb-6">Azienda</h4>
            <ul className="space-y-3">
              {[{ name: 'Chi Siamo', path: '/chi-siamo' }, { name: 'Profilo Solaris', path: '/profilo-solaris' }, { name: 'Guida Tecnica', path: '/guida-tecnica' }, { name: 'Focus Tecnico', path: '/focus-tecnico' }, { name: 'Info e Norme', path: '/info' }, { name: 'Servizio Locale', path: '/servizio-locale' }, { name: 'Blog', path: '/blog' }, { name: 'Contatti', path: '/contatti' }].map((item, i) => (
                <li key={i}>
                  <Link to={item.path} className="text-[#94A3B8] hover:text-[#EAB308] transition-colors text-sm">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-6">Contatti</h4>
            <ul className="space-y-4">
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-[#94A3B8] hover:text-[#EAB308] transition-colors text-sm">
                  <Phone size={16} className="text-[#EAB308]" />
                  {settings.phone_display}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-[#94A3B8] hover:text-[#EAB308] transition-colors text-sm">
                  <EnvelopeSimple size={16} className="text-[#EAB308]" />
                  {settings.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-[#94A3B8] text-sm">
                  <MapPin size={16} className="text-[#EAB308] mt-0.5" />
                  <span>{settings.address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[#94A3B8]/50">© {currentYear} {settings.company_name}. P.IVA {settings.piva}. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4 text-xs text-[#94A3B8]/50">
            <Link to="/privacy-policy" className="hover:text-[#EAB308] transition-colors">Privacy Policy</Link>
            <span className="w-px h-3 bg-white/10" />
            <span>ISO 9001</span>
            <span className="w-px h-3 bg-white/10" />
            <span>MADICO USA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
