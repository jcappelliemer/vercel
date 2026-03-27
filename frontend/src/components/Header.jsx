import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { List, X } from '@phosphor-icons/react';
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass shadow-sm' 
          : 'bg-transparent'
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            <div className="relative">
              <div className="w-10 h-10 bg-[#0F172A] flex items-center justify-center group-hover:bg-[#0891B2] transition-colors">
                <span className="text-white font-semibold text-lg tracking-tight">SF</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-medium text-xl tracking-wide text-[#0F172A]">SOLARIS</span>
              <span className="font-medium text-xl tracking-wide text-[#0891B2]">FILMS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm tracking-widest uppercase transition-colors ${
                  location.pathname === link.path 
                    ? 'text-[#0891B2]' 
                    : 'text-slate-500 hover:text-[#0F172A]'
                }`}
                data-testid={`nav-${link.name.toLowerCase().replace(' ', '-')}`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.span 
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#0891B2]" 
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link 
              to="/preventivo" 
              className="btn-cyan text-xs"
              data-testid="header-cta-preventivo"
            >
              Richiedi Preventivo
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-[#0F172A]"
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
            className="lg:hidden bg-white border-t border-slate-100"
            data-testid="mobile-menu"
          >
            <div className="px-6 py-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-3 text-lg tracking-wide text-slate-600 hover:text-[#0891B2] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6">
                <Link 
                  to="/preventivo" 
                  className="btn-cyan w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Richiedi Preventivo
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
