import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X, Phone, WhatsappLogo } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Servizi', path: '/servizi' },
    { name: 'Chi Siamo', path: '/chi-siamo' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contatti', path: '/contatti' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-header border-b border-black/5' : 'bg-transparent'
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
            <div className="w-10 h-10 bg-[#002FA7] flex items-center justify-center">
              <span className="text-white font-black text-xl">SF</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg tracking-tight text-[#0A0A0A]">SOLARIS</span>
              <span className="font-medium text-lg text-[#002FA7]">FILMS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                  location.pathname === link.path 
                    ? 'text-[#002FA7]' 
                    : 'text-[#0A0A0A] hover:text-[#002FA7]'
                }`}
                data-testid={`nav-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a 
              href="tel:+390000000000" 
              className="flex items-center gap-2 text-sm font-medium text-[#0A0A0A] hover:text-[#002FA7] transition-colors"
              data-testid="header-phone"
            >
              <Phone size={18} weight="bold" />
              <span>Chiama</span>
            </a>
            <a 
              href="https://wa.me/390000000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-medium hover:bg-[#128C7E] transition-colors"
              data-testid="header-whatsapp"
            >
              <WhatsappLogo size={18} weight="fill" />
              <span>WhatsApp</span>
            </a>
            <Link 
              to="/preventivo" 
              className="btn-primary text-sm"
              data-testid="header-cta-preventivo"
            >
              Preventivo Gratuito
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={28} /> : <List size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-[#E5E7EB]"
            data-testid="mobile-menu"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-lg font-medium text-[#0A0A0A]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <a 
                  href="https://wa.me/390000000000" 
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-medium"
                >
                  <WhatsappLogo size={20} weight="fill" />
                  WhatsApp
                </a>
                <Link 
                  to="/preventivo" 
                  className="block w-full py-3 bg-[#002FA7] text-white text-center font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Preventivo Gratuito
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
