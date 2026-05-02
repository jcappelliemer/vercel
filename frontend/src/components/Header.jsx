import { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CaretDown, List, X, Phone, WhatsappLogo } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { useLivePages } from '../hooks/useLivePages';
import { normalizePath } from '../utils/liveContent';
import { buildWhatsAppHref } from '../utils/contactLinks';

const LIVE_MENU = [
  {
    name: 'Prodotti',
    href: '#',
    fallbackPath: '/prodotti',
    children: [
      {
        name: 'Pellicole Antisolari',
        href: 'https://solarisfilms.it/pellicole-per-vetri/le-pellicole-antisolari/',
        children: [
          {
            name: 'Sputtered',
            href: '/pellicole-antisolari-sputtered/',
            children: [
              {
                name: 'Madico SB 20 E PS SR',
                href: '/pellicole-per-vetri/le-pellicole-antisolari/madicosb20epssr/',
              },
              {
                name: 'Madico SB 35 E PS SR',
                href: '/pellicole-per-vetri/le-pellicole-antisolari/madicosb35epssr/',
              },
            ],
          },
          {
            name: 'Sunscape',
            href: '/pellicole-antisolari-sunscape/',
            children: [
              {
                name: 'Tecnosolar NT 20 E PS SR',
                href: '/pellicole-per-vetri/le-pellicole-antisolari/tecnosolarnt20epssr/',
              },
              {
                name: 'Madico SG 20 E PS SR',
                href: '/pellicole-per-vetri/le-pellicole-antisolari/madicosg20epssr/',
              },
              {
                name: 'Madico SL 8 E PS SR',
                href: '/pellicole-per-vetri/le-pellicole-antisolari/madicosl8epssr/',
              },
            ],
          },
          {
            name: 'Spettroselettive',
            href: '/pellicole-spettro-selettive/',
            children: [
              {
                name: 'Tecnosolar SSN 50 TE SR',
                href: '/pellicole-per-vetri/le-pellicole-antisolari/tecnosolarssn50tesr/',
              },
            ],
          },
          {
            name: 'Riflettenti',
            href: '/pellicole-riflettenti/',
            children: [
              {
                name: 'Madico RS 20 E PS SR',
                href: '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-20-e-ps-sr/',
              },
              {
                name: 'Madico RS 40 E PS SR',
                href: '/pellicole-per-vetri/le-pellicole-antisolari/madico-rs-40-e-ps-sr/',
              },
            ],
          },
        ],
      },
      {
        name: 'Pellicole di Sicurezza',
        href: 'https://solarisfilms.it/pellicole-per-vetri/pellicole-di-sicurezza/',
        children: [
          {
            name: 'Riflettenti',
            href: '#',
            children: [
              {
                name: 'Madico RS 20 PS SR 4 MIL',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-20-ps-sr-4mil/',
              },
              {
                name: 'Madico RS 20 PS SR 8 MIL',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-20-ps-sr-8-mil/',
              },
              {
                name: 'Madico RS 40 PS SR 4 MIL',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-40-ps-sr-4-mil/',
              },
              {
                name: 'Madico RS 40 PS SR 8 MIL',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-rs-40-ps-sr-8-mil/',
              },
            ],
          },
          {
            name: 'Antisfondamento',
            href: '#',
            children: [
              {
                name: 'Madico CL 400 PS SR',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-400-ps-sr/',
              },
              {
                name: 'Madico CL 400 E PS SR',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-400-e-ps-sr/',
              },
              {
                name: 'Madico CL 700 PS SR',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-700-ps-sr/',
              },
              {
                name: 'Madico CL 700 E PS SR',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-cl-700-e-ps-sr/',
              },
              {
                name: 'Madico Safetyshield 800',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-800/',
              },
              {
                name: 'Madico Safetyshield 1500',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-safetyshield-1500/',
              },
            ],
          },
          {
            name: 'Antiesplosione',
            href: '#',
            children: [
              {
                name: 'Madico Gullwing',
                href: '/pellicole-per-vetri/pellicole-di-sicurezza/madico-gullwing/',
              },
            ],
          },
        ],
      },
      {
        name: 'Pellicole Privacy & Design',
        href: '/pellicole-per-vetri/pellicole-decorative-per-vetri/',
        children: [
          {
            name: 'vetrofanie',
            href: '/pellicole-per-vetri/pellicole-decorative-per-vetri/vetrofanie/',
          },
          {
            name: 'Madico MT 200 XW',
            href: '/pellicole-per-vetri/pellicole-decorative-per-vetri/madico-mt-200-xw/',
          },
        ],
      },
    ],
  },
  {
    name: 'Richiedi preventivo',
    href: '/pellicole-per-vetri/pellicole-per-vetri/preventivo/',
    fallbackPath: '/preventivo',
  },
  {
    name: 'Focus Tecnici',
    href: '#',
    fallbackPath: '/focus-tecnico',
    children: [
      {
        name: 'Pellicole Antisolari',
        href: '/pellicole-antisolari/',
        children: [
          {
            name: 'Pellicole Antisolari Sputtered',
            href: '/pellicole-antisolari-sputtered/',
          },
          {
            name: 'Pellicole antisolari sunscape',
            href: '/pellicole-antisolari-sunscape/',
          },
          {
            name: 'Pellicole oscuranti per vetri',
            href: '/pellicole-oscuranti-per-vetri/',
          },
          {
            name: 'Pellicole riflettenti',
            href: '/pellicole-riflettenti/',
          },
          {
            name: 'Pellicole spettro selettive',
            href: '/pellicole-spettro-selettive/',
          },
        ],
      },
      {
        name: 'Pellicole di sicurezza',
        href: '/pellicole-di-sicurezza/',
        children: [
          {
            name: 'Pellicole di sicurezza neutre, la serie CL',
            href: '/pellicole-di-sicurezza-neutre-la-serie-cl/',
          },
          {
            name: 'Pellicole di sicurezza antiesplosione, la serie SafetyShield',
            href: '/pellicole-di-sicurezza-antiesplosione-la-serie-safetyshield/',
          },
          {
            name: 'Pellicole antisolari di sicurezza, la serie RS',
            href: '/pellicole-antisolari-di-sicurezza-la-serie-rs/',
          },
          {
            name: 'Pellicole antigraffiti per vetri: la serie Graffiti Free',
            href: '/pellicole-antigraffiti-per-vetri-la-serie-graffiti-free/',
          },
        ],
      },
      {
        name: 'Pellicole decorative',
        href: '/pellicole-decorative/',
        children: [
          {
            name: 'Pellicole stampabili e vetrofanie',
            href: '/pellicole-antisolari-stampabili-e-vetrofanie/',
          },
          {
            name: 'Pellicole decorative privacy',
            href: '/pellicole-decorative-privacy/',
          },
        ],
      },
      {
        name: 'Pellicole termoisolanti',
        href: '/pellicole-termoisolanti/',
      },
    ],
  },
  {
    name: 'Lo sapevi che?',
    href: '/pellicole-per-vetri/pellicole-per-vetri/lo-sapevi-che/',
    fallbackPath: '/lo-sapevi-che',
  },
  {
    name: 'Info e FAQ',
    href: '#',
    fallbackPath: '/info',
    children: [
      {
        name: 'FAQ',
        href: '/pellicole-per-vetri/pellicole-per-vetri/faq/',
      },
      {
        name: 'Norme',
        href: '/pagina-info/norme/',
      },
      {
        name: 'Norma BRC',
        href: '/pagina-info/norma-brc/',
      },
      {
        name: 'Sicurezza a norma di legge',
        href: '/pagina-info/sicurezza-a-norma-di-legge/',
      },
      {
        name: 'Testo unico',
        href: '/pagina-info/testo-unico-sulla-salute-e-sicurezza-sul-lavoro/',
      },
      {
        name: 'Sistemi filtranti Dpr. 59/09',
        href: '/pagina-info/sistemi-filtranti-dpr-59-09/',
      },
      {
        name: 'Certificazione NFRC',
        href: '/pagina-info/certificazione-nfrc/',
      },
      {
        name: 'I punti di forza',
        href: '/pagina-info/i-punti-di-forza/',
      },
      {
        name: 'Istruzione e manutenzione',
        href: '/pagina-info/istruzioni-e-manutenzione/',
      },
      {
        name: 'Glossario termini',
        href: '/pagina-info/glossario-termini/',
      },
    ],
  },
  {
    name: 'Contattaci',
    href: '/pellicole-per-vetri/contact/',
    fallbackPath: '/contatti',
  },
];

const normalizeHref = (href) => {
  if (!href || href === '#') return '';

  try {
    return normalizePath(new URL(href, 'https://www.solarisfilms.it').pathname);
  } catch {
    return normalizePath(href);
  }
};

const buildPathMap = (pages) => pages.reduce((map, page) => {
  if (page.path) map.set(normalizePath(page.path), page.route?.newPath || page.path);
  return map;
}, new Map());

const resolveMenu = (items, pathMap) => items.map((item) => {
  const livePath = normalizeHref(item.href);
  const path = item.fallbackPath || (livePath ? pathMap.get(livePath) || livePath : '#');

  return {
    ...item,
    path,
    children: item.children ? resolveMenu(item.children, pathMap) : undefined,
  };
});

const testId = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const MenuLink = ({ item, className, children, onClick, testPrefix }) => {
  if (!item.path || item.path === '#') {
    return (
      <span className={className} data-testid={testPrefix ? `${testPrefix}-${testId(item.name)}` : undefined}>
        {children}
      </span>
    );
  }

  return (
    <Link
      to={item.path}
      className={className}
      onClick={onClick}
      data-testid={testPrefix ? `${testPrefix}-${testId(item.name)}` : undefined}
    >
      {children}
    </Link>
  );
};

const DesktopRecursiveList = ({ items = [], isActiveItem, depth = 0 }) => (
  <div className={depth === 0 ? 'space-y-2' : 'mt-1 space-y-1 border-l border-white/10 pl-3'}>
    {items.map((item) => {
      const hasChildren = item.children?.length > 0;
      const active = isActiveItem(item);

      return (
        <div key={`${item.name}-${depth}`}>
          <MenuLink
            item={item}
            testPrefix="desktop-subnav"
            className={`flex items-center justify-between gap-3 rounded-lg transition-colors ${
              depth === 0 ? 'px-3 py-2.5 text-sm font-medium' : 'px-3 py-2 text-xs'
            } ${active ? 'bg-[#EAB308] text-[#0A0F1C]' : 'text-white hover:bg-[#1F2937]'}`}
          >
            <span className="leading-snug">{item.name}</span>
            {hasChildren && depth === 0 && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${active ? 'bg-[#0A0F1C] text-white' : 'bg-[#334155] text-white'}`}>
                {item.children.length}
              </span>
            )}
          </MenuLink>

          {hasChildren && (
            <DesktopRecursiveList items={item.children} isActiveItem={isActiveItem} depth={depth + 1} />
          )}
        </div>
      );
    })}
  </div>
);

const DesktopGroupedCard = ({ item, isActiveItem }) => {
  const active = isActiveItem(item);

  return (
    <div className="rounded-2xl border border-[#334155] bg-[#111827] p-4">
      <MenuLink
        item={item}
        testPrefix="desktop-subnav"
        className={`group/card block rounded-xl border px-4 py-3 transition-colors ${
          active
            ? 'border-[#EAB308] bg-[#EAB308] text-[#0A0F1C]'
          : 'border-[#334155] bg-[#0A0F1C] text-white hover:border-[#EAB308] hover:text-[#EAB308]'
        }`}
      >
        <span className="block text-sm font-semibold leading-tight">{item.name}</span>
        <span className={`mt-1 block text-xs leading-relaxed ${active ? 'text-[#0A0F1C]' : 'text-[#CBD5E1] group-hover/card:text-white'}`}>
          Apri panoramica
        </span>
      </MenuLink>

      {item.children?.length > 0 && (
        <div className="mt-3">
          <DesktopRecursiveList items={item.children} isActiveItem={isActiveItem} />
        </div>
      )}
    </div>
  );
};

const DesktopFlatLinks = ({ items, isActiveItem }) => (
  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
    {items.map((child) => {
      const active = isActiveItem(child);
      return (
        <MenuLink
          key={child.name}
          item={child}
          testPrefix="desktop-subnav"
          className={`rounded-xl border px-4 py-3 text-sm leading-snug transition-colors ${
            active
              ? 'border-[#EAB308] bg-[#EAB308] text-[#0A0F1C]'
              : 'border-[#334155] bg-[#111827] text-white hover:border-[#EAB308] hover:text-[#EAB308]'
          }`}
        >
          {child.name}
        </MenuLink>
      );
    })}
  </div>
);

const DesktopDropdown = ({ item, isActiveItem, isOpen, onMouseEnter, onMouseLeave }) => {
  const hasGroupedChildren = item.children.some((child) => child.children?.length > 0);
  const gridClass = item.children.length > 2 ? 'xl:grid-cols-3' : 'xl:grid-cols-2';

  return (
    <div
      data-testid={`desktop-dropdown-${testId(item.name)}`}
      className={`fixed left-1/2 top-20 z-[90] w-[min(72rem,calc(100vw-3rem))] -translate-x-1/2 pt-5 transition-all duration-200 lg:top-24 ${
        isOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-1'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-[#334155] bg-[#07111F] shadow-2xl shadow-black">
        <div className="grid lg:grid-cols-[280px_1fr]">
          <div className="border-b border-[#334155] bg-[#0A0F1C] p-6 lg:border-b-0 lg:border-r">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EAB308]">
              Menu Solaris
            </span>
            <h2 className="mt-4 text-2xl font-semibold leading-tight text-white">{item.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#CBD5E1]">
              Scegli un'area e poi scendi nel dettaglio tecnico senza perdere l'orientamento.
            </p>
            {item.path && item.path !== '#' && (
              <Link
                to={item.path}
                className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#EAB308] px-4 text-sm font-semibold text-[#0A0F1C] transition-colors hover:bg-[#FACC15]"
                data-testid={`desktop-overview-${testId(item.name)}`}
              >
                Vedi panoramica
              </Link>
            )}
          </div>

          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
            {hasGroupedChildren ? (
              <div className={`grid gap-4 ${gridClass}`}>
                {item.children.map((child) => (
                  <DesktopGroupedCard key={child.name} item={child} isActiveItem={isActiveItem} />
                ))}
              </div>
            ) : (
              <DesktopFlatLinks items={item.children} isActiveItem={isActiveItem} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileMenuNode = ({
  item,
  isActiveItem,
  onClose,
  openKeys,
  onToggle,
  level = 0,
  parentKey = '',
}) => {
  const hasChildren = item.children?.length > 0;
  const active = isActiveItem(item);
  const nodeKey = `${parentKey}/${testId(item.name)}`;
  const isOpen = hasChildren && (openKeys[nodeKey] || active);
  const style = level > 0 ? { paddingLeft: `${level * 0.9 + 0.5}rem` } : undefined;

  return (
    <div className={level === 0 ? 'border-b border-white/10 last:border-b-0' : ''}>
      {hasChildren ? (
        <button
          type="button"
          onClick={() => onToggle(nodeKey)}
          className={`flex w-full items-center justify-between gap-3 py-3 text-left leading-tight transition-colors ${
            level === 0 ? 'text-base font-medium' : 'text-sm'
          } ${active ? 'text-[#EAB308]' : 'text-white/75 hover:text-white'}`}
          data-testid={`mobile-toggle-${testId(item.name)}`}
          aria-expanded={isOpen}
        >
          <span style={style}>{item.name}</span>
          <CaretDown
            size={16}
            className={`shrink-0 text-white/35 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      ) : (
        <MenuLink
          item={item}
          testPrefix="mobile-nav"
          onClick={onClose}
          className={`flex w-full items-center justify-between gap-3 py-3 text-left leading-tight transition-colors ${
            level === 0 ? 'text-base font-medium' : 'text-sm'
          } ${active ? 'text-[#EAB308]' : 'text-white/75 hover:text-white'}`}
        >
          <span style={style}>{item.name}</span>
        </MenuLink>
      )}

      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden ${level === 0 ? 'pb-3' : ''}`}
          >
            {item.path && item.path !== '#' && (
              <Link
                to={item.path}
                onClick={onClose}
                className="block py-2 text-sm text-[#EAB308]/85 hover:text-[#EAB308]"
                style={level >= 0 ? { paddingLeft: `${(level + 1) * 0.9 + 0.5}rem` } : undefined}
                data-testid={`mobile-nav-${testId(item.name)}-overview`}
              >
                Panoramica
              </Link>
            )}
            {item.children.map((child) => (
              <MobileMenuNode
                key={`${item.name}-${child.name}`}
                item={child}
                isActiveItem={isActiveItem}
                onClose={onClose}
                openKeys={openKeys}
                onToggle={onToggle}
                level={level + 1}
                parentKey={nodeKey}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileKeys, setOpenMobileKeys] = useState({});
  const [openDesktopMenu, setOpenDesktopMenu] = useState(null);
  const desktopMenuCloseTimer = useRef(null);
  const location = useLocation();
  const settings = useSettings();
  const { pages } = useLivePages();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = useMemo(() => {
    const pathMap = buildPathMap(pages);
    return resolveMenu(LIVE_MENU, pathMap);
  }, [pages]);

  const isActivePath = (path) => {
    if (!path || path === '#') return false;
    const current = normalizePath(location.pathname);
    const target = normalizePath(path);
    return target === '/' ? current === '/' : current === target || current.startsWith(target);
  };

  const isActiveItem = (item) => isActivePath(item.path) || item.children?.some(isActiveItem);

  const clearDesktopMenuClose = () => {
    if (desktopMenuCloseTimer.current) {
      clearTimeout(desktopMenuCloseTimer.current);
      desktopMenuCloseTimer.current = null;
    }
  };

  const openDesktopMenuByName = (name) => {
    clearDesktopMenuClose();
    setOpenDesktopMenu(name);
  };

  const scheduleDesktopMenuClose = () => {
    clearDesktopMenuClose();
    desktopMenuCloseTimer.current = setTimeout(() => {
      setOpenDesktopMenu(null);
      desktopMenuCloseTimer.current = null;
    }, 320);
  };

  useEffect(() => {
    setOpenDesktopMenu(null);
  }, [location.pathname]);

  useEffect(() => () => clearDesktopMenuClose(), []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileKeys({});
  };

  const toggleMobileNode = (nodeKey) => {
    setOpenMobileKeys((current) => {
      if (current[nodeKey]) {
        return Object.fromEntries(
          Object.entries(current).filter(([key]) => key !== nodeKey && !key.startsWith(`${nodeKey}/`))
        );
      }

      const parts = nodeKey.split('/').filter(Boolean);
      const next = {};
      parts.reduce((prefix, part) => {
        const key = `${prefix}/${part}`;
        next[key] = true;
        return key;
      }, '');
      return next;
    });
  };

  const isHome = normalizePath(location.pathname) === '/';
  const solidHeader = isScrolled || isMobileMenuOpen || openDesktopMenu || !isHome;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        solidHeader ? 'bg-[#0A0F1C]/95 backdrop-blur-xl border-b border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.22)]' : ''
      }`}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
            {settings.logo_url ? (
              <motion.img
                whileHover={{ scale: 1.03 }}
                src={settings.logo_url}
                alt={settings.company_name || 'Solaris Films'}
                className="h-10 sm:h-12 w-auto object-contain"
                data-testid="logo-image"
              />
            ) : (
              <span className="font-semibold text-xl text-white tracking-wide">
                SOLARIS <span className="text-gradient-gold">FILMS</span>
              </span>
            )}
          </Link>

          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const active = isActiveItem(link);
              const hasChildren = link.children?.length > 0;
              const isDesktopMenuOpen = openDesktopMenu === link.name;

              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={hasChildren ? () => openDesktopMenuByName(link.name) : undefined}
                  onMouseLeave={hasChildren ? scheduleDesktopMenuClose : undefined}
                  onFocus={hasChildren ? () => openDesktopMenuByName(link.name) : undefined}
                >
                  <MenuLink
                    item={link}
                    testPrefix="nav"
                    className={`relative flex items-center gap-1.5 text-xs tracking-wider uppercase transition-colors ${
                      active || isDesktopMenuOpen ? 'text-[#EAB308]' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <span>{link.name}</span>
                    {hasChildren && <CaretDown size={13} className="text-current opacity-70" />}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#EAB308]"
                      />
                    )}
                  </MenuLink>

                  {hasChildren && (
                    <DesktopDropdown
                      item={link}
                      isActiveItem={isActiveItem}
                      isOpen={isDesktopMenuOpen}
                      onMouseEnter={() => openDesktopMenuByName(link.name)}
                      onMouseLeave={scheduleDesktopMenuClose}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden xl:flex items-center gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="w-11 h-11 rounded-xl border border-cyan-400/30 bg-cyan-400/10 flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 hover:border-cyan-400/50 transition-all"
              data-testid="header-cta-phone"
              title="Chiamaci"
            >
              <Phone size={20} weight="fill" />
            </a>
            <a
              href={buildWhatsAppHref(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all"
              data-testid="header-cta-whatsapp"
              title="WhatsApp"
            >
              <WhatsappLogo size={20} weight="fill" />
            </a>
          </div>

          <button
            className="xl:hidden p-2 text-white"
            onClick={() => {
              if (isMobileMenuOpen) {
                closeMobileMenu();
              } else {
                setIsMobileMenuOpen(true);
              }
            }}
            data-testid="mobile-menu-toggle"
            aria-label={isMobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
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
            className="xl:hidden bg-[#111827] border-t border-white/10"
            data-testid="mobile-menu"
          >
            <div className="max-h-[calc(100vh-5rem)] overflow-y-auto px-6 py-6">
              {navLinks.map((link) => (
                <MobileMenuNode
                  key={link.name}
                  item={link}
                  isActiveItem={isActiveItem}
                  onClose={closeMobileMenu}
                  openKeys={openMobileKeys}
                  onToggle={toggleMobileNode}
                />
              ))}

              <div className="flex gap-3 pt-5">
                <a
                  href={`tel:${settings.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20 transition-all"
                >
                  <Phone size={18} weight="fill" />
                  <span className="text-sm">Chiama</span>
                </a>
                <a
                  href={buildWhatsAppHref(settings.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                >
                  <WhatsappLogo size={18} weight="fill" />
                  <span className="text-sm">WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
