import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Link } from '@/next/router-shim';
import { ArrowRight, CheckCircle, Eye, ShieldCheck, Sun } from '@phosphor-icons/react';
import { useLivePages } from '../hooks/useLivePages';
import { getPageTitle, getServiceFamilyCards } from '../utils/serviceFamilies';

const ICON_BY_FAMILY = {
  antisolari: Sun,
  sicurezza: ShieldCheck,
  decorative: Eye,
};

const SERVICES_HERO_IMAGE = '/assets/generated/home/hero-architectural.webp';
const SERVICES_CTA_IMAGE = '/assets/generated/home/cta-consultation.webp';

const NEED_IMAGE_BY_KEY = {
  antisolari: '/assets/generated/home/need-antisolari.webp',
  sicurezza: '/assets/generated/home/need-safety-shield.webp',
  decorative: '/assets/generated/home/need-privacy-design.webp',
};

const FAMILY_DETAIL_IMAGE_BY_KEY = {
  antisolari: '/assets/generated/home/focus-performance.webp',
  sicurezza: '/assets/generated/home/premium-safety-shield.webp',
  decorative: '/assets/generated/home/need-privacy-design.webp',
};

const needCards = [
  {
    key: 'antisolari',
    title: 'Troppo caldo, sole o abbagliamento',
    description: 'Parti dalle pellicole antisolari quando il problema e comfort termico, raggi UV, luce diretta o consumi energetici.',
  },
  {
    key: 'sicurezza',
    title: 'Vetri da mettere in sicurezza',
    description: 'Parti dalle pellicole di sicurezza quando serve trattenere i frammenti, aumentare resistenza o valutare norme e rischio.',
  },
  {
    key: 'decorative',
    title: 'Privacy, design e vetrofanie',
    description: 'Parti dalle pellicole decorative quando il tema e privacy visiva, immagine coordinata, loghi o superfici vetrate da valorizzare.',
  },
];

const SERVICE_ANCHOR_ALIASES = {
  decorative: ['privacy'],
};

const serviceAnchorPath = (family) => `/servizi#${family?.key || 'antisolari'}`;

const SAFETY_SHIELD_METRICS = [
  { label: 'Spessore nominale', value: '200 μm (0,20 mm) - 375 μm (0,375 mm)' },
  { label: 'Vetro di riferimento', value: '3 mm (base) - 6 mm (test antiesplosione)' },
  { label: 'Norme dichiarate', value: 'EN 13123, EN 13124, ISO 16933, EN 356, GSA' },
  { label: 'Classi citate', value: 'ISO 16933 EXV 33C, EN 356 P2A-P3A' },
  { label: 'Trasmissione UV (max)', value: '1%' },
  { label: 'Energia solare respinta', value: '17% (schede SafetyShield 800/1500)' },
];

const ServiceFamilyCard = ({ family, index }) => {
  const Icon = ICON_BY_FAMILY[family.key] || ShieldCheck;
  const path = family.focus?.[0]?.route?.newPath || family.ctaRoute || family.page?.route?.newPath || serviceAnchorPath(family);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className="card-glass rounded-lg overflow-hidden h-full"
    >
      {family.image && (
        <figure className={`service-family-image service-family-image-card service-family-image-${family.key}`}>
          <img src={family.image} alt={family.title} loading="lazy" />
        </figure>
      )}
      <div className="p-6">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg border border-[#EAB308]/30 bg-[#EAB308]/15 text-[#EAB308]">
          <Icon size={24} weight="light" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#EAB308]">{family.eyebrow}</span>
        <h3 className="mt-3 text-2xl font-medium text-white">{family.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-[#CBD5E1]">{family.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/10 bg-[#0A0F1C] p-3">
            <strong className="block text-lg text-white">{family.products.length || '-'}</strong>
            <span className="text-xs text-[#94A3B8]">prodotti</span>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0A0F1C] p-3">
            <strong className="block text-lg text-white">{family.focus.length || '-'}</strong>
            <span className="text-xs text-[#94A3B8]">focus</span>
          </div>
        </div>

        <Link to={path} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#EAB308] hover:text-white">
          Approfondisci la soluzione
          <ArrowRight size={16} weight="bold" />
        </Link>
      </div>
    </motion.div>
  );
};

const FamilyDetail = ({ family, index }) => {
  const Icon = ICON_BY_FAMILY[family.key] || ShieldCheck;
  const path = family.ctaRoute || family.page?.route?.newPath || serviceAnchorPath(family);
  const detailImage = FAMILY_DETAIL_IMAGE_BY_KEY[family.key] || family.image;
  const visibleProducts = family.products.slice(0, 6);
  const visibleFocus = family.focus.slice(0, 4);
  const isLight = index % 2 === 0;
  const sectionClass = isLight
    ? 'scroll-mt-28 py-20 bg-[#F8FAFC] border-t border-[#E2E8F0]'
    : 'scroll-mt-28 py-20 border-t border-white/10';
  const titleClass = isLight
    ? 'mt-3 text-3xl font-medium text-[#0A0F1C] lg:text-4xl'
    : 'mt-3 text-3xl font-medium text-white lg:text-4xl';
  const headlineClass = isLight
    ? 'mt-5 text-[#334155] leading-relaxed'
    : 'mt-5 text-[#CBD5E1] leading-relaxed';
  const roleClass = isLight
    ? 'mt-4 text-sm text-[#64748B] leading-relaxed'
    : 'mt-4 text-sm text-[#94A3B8] leading-relaxed';
  const benefitClass = isLight
    ? 'flex gap-3 text-sm leading-relaxed text-[#334155]'
    : 'flex gap-3 text-sm leading-relaxed text-white/80';
  const panelClass = isLight
    ? 'rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-sm'
    : 'rounded-lg border border-white/10 bg-[#111827] p-6';
  const productLinkClass = isLight
    ? 'rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-sm text-[#0A0F1C] transition-colors hover:border-[#EAB308] hover:text-[#B45309]'
    : 'rounded-lg border border-white/10 bg-[#0A0F1C] p-4 text-sm text-white transition-colors hover:border-[#EAB308] hover:text-[#EAB308]';
  const focusLinkClass = isLight
    ? 'flex min-h-12 items-center justify-between gap-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 text-sm text-[#334155] transition-colors hover:border-[#EAB308] hover:text-[#0A0F1C]'
    : 'flex min-h-12 items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0A0F1C] px-4 text-sm text-[#CBD5E1] transition-colors hover:border-[#EAB308] hover:text-white';

  return (
    <>
    {(SERVICE_ANCHOR_ALIASES[family.key] || []).map((alias) => (
      <span key={alias} id={alias} className="block h-0 scroll-mt-28" aria-hidden="true" />
    ))}
    <section id={family.key} className={sectionClass}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-[#EAB308]/30 bg-[#EAB308]/15 text-[#EAB308]">
              <Icon size={26} weight="light" />
            </div>
            <span className="text-sm font-medium uppercase tracking-wider text-[#EAB308]">{family.eyebrow}</span>
            <h2 className={titleClass}>{family.title}</h2>
            <p className={headlineClass}>{family.headline}</p>
            <p className={roleClass}>{family.menuRole}</p>

            <div className="mt-8 grid gap-3">
              {family.benefits.map((benefit) => (
                <div key={benefit} className={benefitClass}>
                  <CheckCircle size={18} weight="fill" className="mt-1 shrink-0 text-[#EAB308]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <Link to={path} className="btn-yellow group mt-8">
              <span>Vai alla soluzione</span>
              <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <div className="grid gap-5">
            {detailImage && (
              <figure className={`services-detail-visual service-family-image service-family-image-${family.key}`}>
                <img src={detailImage} alt={`${family.title} Solaris`} loading="lazy" />
                <figcaption className="service-family-image-caption">
                  <span>{family.eyebrow}</span>
                  <p>{family.headline}</p>
                </figcaption>
              </figure>
            )}

            <div className={panelClass}>
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#EAB308]">Prodotti correlati</span>
                  <h3 className={`mt-2 text-xl font-medium ${isLight ? 'text-[#0A0F1C]' : 'text-white'}`}>Schede utili per questa esigenza</h3>
                </div>
                <Link to="/prodotti" className={`text-sm font-semibold text-[#EAB308] ${isLight ? 'hover:text-[#0A0F1C]' : 'hover:text-white'}`}>Tutti</Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {visibleProducts.map((product) => (
                  <Link
                    key={product.path}
                    to={product.route?.newPath || product.path}
                    className={productLinkClass}
                  >
                    {getPageTitle(product)}
                  </Link>
                ))}
              </div>
            </div>

            {visibleFocus.length > 0 && (
              <div className={panelClass}>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#EAB308]">Approfondimenti</span>
                <h3 className={`mt-2 text-xl font-medium ${isLight ? 'text-[#0A0F1C]' : 'text-white'}`}>Focus tecnici utili</h3>
                <div className="mt-5 grid gap-2">
                  {visibleFocus.map((focus) => (
                    <Link
                      key={focus.path}
                      to={focus.route?.newPath || focus.path}
                      className={focusLinkClass}
                    >
                      <span>{getPageTitle(focus)}</span>
                      <ArrowRight size={15} weight="bold" className="text-[#EAB308]" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

const ServiziPagina = ({ initialPages = [] }) => {
  const { pages } = useLivePages(initialPages);
  const families = getServiceFamilyCards(pages);

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="servizi-page">
      <SEO
        title="Servizi"
        description="Servizi Solaris Films: pellicole antisolari, sicurezza, privacy e design con prodotti MADICO, focus tecnici e posa professionale."
        path="/servizi"
      />
      <Header />

      <main className="pt-24">
        <section className="services-hub-hero border-b border-white/5 py-20">
          <div className="services-hub-hero-bg" aria-hidden="true">
            <img src={SERVICES_HERO_IMAGE} alt="" fetchPriority="high" />
          </div>
          <div className="services-hub-hero-inner max-w-7xl mx-auto px-6 md:px-12">
            <div className="services-hub-copy max-w-4xl">
              <div className="accent-bar mb-6 w-16" />
              <span className="text-sm font-medium uppercase tracking-wider text-[#EAB308]">Soluzioni per vetri</span>
              <h1 className="mt-4 text-4xl font-medium text-white sm:text-5xl lg:text-6xl">
                Scegli la pellicola partendo dalla funzione
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-[#94A3B8]">
                Le famiglie principali guidano la navigazione: antisolari, sicurezza e privacy/design. Da qui si entra nei prodotti, nei focus tecnici e nella richiesta di consulenza.
              </p>
            </div>

            <div className="services-hub-media" aria-label="Famiglie di servizi Solaris">
              {families.map((family) => {
                const path = family.page?.route?.newPath || serviceAnchorPath(family);
                return (
                  <Link
                    key={family.key}
                    to={path}
                    className={`services-hub-tile service-family-image service-family-image-${family.key}`}
                  >
                    <img src={family.image} alt={family.title} loading="lazy" />
                    <span>{family.menuLabel}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="services-problem-light py-16 bg-[#F8FAFC] border-y border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-sm font-medium uppercase tracking-wider text-[#B45309]">Scegli in base al problema</span>
                <h2 className="mt-2 text-3xl font-medium text-white">Trova la soluzione più adatta</h2>
              </div>
              <Link to="/preventivo" className="text-sm font-semibold text-[#EAB308] hover:text-white">
                Chiedi una verifica tecnica
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {needCards.map((need) => {
                const family = families.find((item) => item.key === need.key);
                const path = family?.page?.route?.newPath || (family ? serviceAnchorPath(family) : '/servizi');
                const image = NEED_IMAGE_BY_KEY[need.key] || family?.image;
                return (
                  <Link key={need.key} to={path} className="services-need-card rounded-lg border border-white/10 bg-[#111827] transition-colors hover:border-[#EAB308]">
                    {image && (
                      <figure className={`services-need-image service-family-image service-family-image-${need.key}`}>
                        <img src={image} alt={`${need.title} Solaris`} loading="lazy" />
                        <span>{family?.eyebrow || 'Solaris'}</span>
                      </figure>
                    )}
                    <div className="p-6">
                      {family && (() => {
                        const Icon = ICON_BY_FAMILY[family.key] || ShieldCheck;
                        return (
                          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-[#EAB308]/30 bg-[#EAB308]/15 text-[#EAB308]">
                            <Icon size={22} weight="light" />
                          </div>
                        );
                      })()}
                      <h3 className="text-xl font-medium text-white">{need.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{need.description}</p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#EAB308]">
                        Vai alla famiglia
                        <ArrowRight size={15} weight="bold" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="safety-shield" className="scroll-mt-28 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <span className="text-sm font-medium uppercase tracking-wider text-[#EAB308]">SafetyShield</span>
                <h2 className="mt-2 text-3xl font-medium text-white lg:text-4xl">SafetyShield: sicurezza antiesplosione</h2>
                <p className="mt-5 text-[#CBD5E1] leading-relaxed">
                  Se il tema è protezione da frammentazione del vetro, urti violenti o scenari a rischio, SafetyShield ha un
                  percorso dedicato. La logica resta Solaris: analisi vetro reale, rischio, telaio e posa certificata.
                </p>
                <p className="mt-4 text-sm text-[#94A3B8] leading-relaxed">
                  Qui trovi i riferimenti principali per capire in pochi secondi se il caso richiede un percorso
                  antiesplosione dedicato.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to="/focus-tecnico/safetyshield/" className="btn-yellow">
                    Sezione dedicata SafetyShield
                  </Link>
                  <Link to="/prodotti/madico-safetyshield-800/" className="btn-secondary">
                    Prodotto SafetyShield 800
                  </Link>
                  <Link to="/prodotti/madico-safetyshield-1500/" className="btn-secondary">
                    Prodotto SafetyShield 1500
                  </Link>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-[#111827] p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#EAB308]">Dati in metrica europea</span>
                <h3 className="mt-2 text-xl font-medium text-white">Riferimenti tecnici rapidi</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {SAFETY_SHIELD_METRICS.map((item) => (
                    <article key={item.label} className="rounded-lg border border-white/10 bg-[#0A0F1C] p-4">
                      <p className="text-xs uppercase tracking-wider text-[#94A3B8]">{item.label}</p>
                      <p className="mt-1 text-base font-semibold text-white">{item.value}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="mb-8">
              <span className="text-sm font-medium uppercase tracking-wider text-[#EAB308]">Percorsi Solaris</span>
              <h2 className="mt-2 text-3xl font-medium text-white">Tre modi per migliorare il vetro</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {families.map((family, index) => (
                <ServiceFamilyCard key={family.key} family={family} index={index} />
              ))}
            </div>
          </div>
        </section>

        {families.map((family, index) => (
          <FamilyDetail key={family.key} family={family} index={index} />
        ))}

        <section className="services-final-cta relative overflow-hidden py-24">
          <div className="services-final-cta-bg" aria-hidden="true">
            <img src={SERVICES_CTA_IMAGE} alt="" loading="lazy" />
          </div>
          <div className="relative max-w-4xl mx-auto px-6 text-center md:px-12">
            <h2 className="text-3xl font-medium text-white lg:text-4xl">
              Non partiamo dal prodotto, partiamo dal vetro
            </h2>
            <p className="mt-5 text-lg text-[#94A3B8]">
              Solaris valuta esposizione, vetro, obiettivo tecnico e condizioni di posa prima di proporre la pellicola corretta.
            </p>
            <Link to="/preventivo" className="btn-yellow group mt-8">
              <span>Richiedi preventivo</span>
              <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
};

export default ServiziPagina;
