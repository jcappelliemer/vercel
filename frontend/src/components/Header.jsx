import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0A0F1C]/95 backdrop-blur-xl border-b border-white/5' : ''
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #2563EB 0%, #EAB308 100%)' }}
            >
              <span className="text-white font-bold text-lg relative z-10">SF</span>
            </motion.div>
            <div className="hidden sm:flex items-baseline">
              <span className="font-semibold text-xl text-white">SOLARIS</span>
              <span className="font-semibold text-xl text-gradient-gold">FILMS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm tracking-wider uppercase transition-colors ${
                  location.pathname === link.path 
                    ? 'text-[#EAB308]' 
                    : 'text-white/60 hover:text-white'
                }`}
                data-testid={`nav-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.span 
                    layoutId="nav-indicator"
                    className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#EAB308]"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link to="/preventivo" className="hidden lg:block btn-yellow text-xs" data-testid="header-cta-preventivo">
            Preventivo
          </Link>

          {/* Mobile Menu */}
          <button 
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={28} /> : <List size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#111827] border-t border-white/10"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-8 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-3 text-lg text-white/80 hover:text-[#EAB308]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/preventivo" className="btn-yellow w-full justify-center mt-4" onClick={() => setIsMobileMenuOpen(false)}>
                Preventivo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
