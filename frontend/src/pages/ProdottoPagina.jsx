import { useParams, Link } from '@/next/router-shim';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO, { buildProductSchema, buildBreadcrumbSchema } from '../components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Shield, Sun, Eye, Certificate, Tag } from '@phosphor-icons/react';
import { prodottiData } from '../data/siteContent';
import { useWPData } from '../hooks/useWPData';
import { useState, useEffect } from 'react';
import { PRODUCT_VISUALS } from '../utils/assetMaps';

const EnergyBar = ({ label, value, color = '#EAB308', light = false }) => {
  const numVal = parseInt(value) || 0;
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm w-44 shrink-0 ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{label}</span>
      <div className={`flex-1 h-2.5 rounded-full overflow-hidden ${light ? 'bg-[#E2E8F0]' : 'bg-white/5'}`}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${numVal}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className={`text-sm font-medium w-12 text-right ${light ? 'text-[#0A0F1C]' : 'text-white'}`}>{value}</span>
    </div>
  );
};

const SpecCard = ({ icon: Icon, label, value, light = false }) => {
  const SafeIcon = Icon || Shield;
  return (
  <div className={`${light ? 'bg-white border border-[#E2E8F0]' : 'card-glass'} rounded-xl p-5 text-center`}>
    <SafeIcon size={24} weight="fill" className={`mx-auto mb-2 ${light ? 'text-[#2563EB]' : 'text-[#EAB308]'}`} />
    <p className={`text-xs mb-1 ${light ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>{label}</p>
    <p className={`text-lg font-medium ${light ? 'text-[#0A0F1C]' : 'text-white'}`}>{value}</p>
  </div>
  );
};

const cleanLiveText = (value = '') => {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .replace(/â€™|’/g, '\'')
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã¬/g, 'ì')
    .replace(/Ã²/g, 'ò')
    .replace(/Ã©/g, 'é')
    .replace(/\btecnosolar\b/gi, 'Solaris')
    .replace(/\bStratum\b/gi, '')
    .replace(/\bStartum\b/gi, '')
    .trim();
};

const normalizePath = (path = '/') => (path.endsWith('/') ? path : `${path}/`);
const LIVE_SITE_ORIGIN = 'https://www.solarisfilms.it';

const resolveLiveHref = (href = '') => {
  if (!href) return '';
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('//')) return `https:${href}`;
  if (href.startsWith('/')) return `${LIVE_SITE_ORIGIN}${href}`;
  return `${LIVE_SITE_ORIGIN}/${href.replace(/^\/+/, '')}`;
};

const pdfHrefFromBlock = (block = {}) => {
  if (block.href && /\.pdf($|\?)/i.test(block.href)) return block.href;
  const match = String(block.html || '').match(/href=["']([^"']+\.pdf(?:\?[^"']*)?)["']/i);
  return match?.[1] || '';
};

const extractLiveProductSections = (pageJson) => {
  const blocks = Array.isArray(pageJson?.contentBlocks) ? pageJson.contentBlocks : [];
  const takeParagraphAfterHeading = (headingText) => {
    const index = blocks.findIndex((b) => b.type === 'heading' && cleanLiveText(b.text).toLowerCase() === headingText.toLowerCase());
    if (index < 0) return '';
    const paragraph = blocks.slice(index + 1).find((b) => b.type === 'paragraph');
    return cleanLiveText(paragraph?.text || '');
  };

  const utilizzi = takeParagraphAfterHeading('Utilizzi');
  const specifiche = takeParagraphAfterHeading('Specifiche tecniche');
  const caratteristicheBlock = blocks.find(
    (b) => b.type === 'list'
      && Array.isArray(b.items)
      && b.items.length > 0
      && blocks.some((h) => h.type === 'heading' && cleanLiveText(h.text).toLowerCase() === 'caratteristiche distintive')
  );
  const caratteristiche = Array.isArray(caratteristicheBlock?.items)
    ? caratteristicheBlock.items.map((item) => cleanLiveText(item.text)).filter(Boolean).slice(0, 10)
    : [];

  return { utilizzi, specifiche, caratteristiche };
};

const buildProductFaq = (prodotto, dt) => {
  const categoria = (prodotto?.categoria || '').toLowerCase();
  const categoriaLabel = prodotto?.categoria || 'questa pellicola';
  const applicazione = prodotto?.applicazione ? ` ${prodotto.applicazione}` : '';
  const garanzia = prodotto?.garanzia ? `La garanzia indicata e ${prodotto.garanzia}.` : 'La durata dipende dal tipo di vetro, dall esposizione e dalla posa.';
  const certificazione = prodotto?.certificazione ? `Il prodotto e associato a ${prodotto.certificazione}.` : 'Valutiamo il contesto per proporre la soluzione piu adatta.';
  const uv = dt?.uvTrasmessi ? `Il dato UV trasmessi e ${dt.uvTrasmessi}, utile per ridurre l impatto dei raggi UV.` : '';
  const energia = dt?.energiaRespinta ? `Il totale energia respinta arriva a ${dt.energiaRespinta}.` : '';
  const tipoVetro = prodotto?.tipoVetro ? `Il test principale e su ${prodotto.tipoVetro}.` : '';
  const caratteristiche = Array.isArray(prodotto?.caratteristiche) ? prodotto.caratteristiche.slice(0, 2).join('; ') : '';

  const firstAnswer =
    categoria.includes('sicurezza')
      ? `E pensata per aumentare la protezione del vetro e contenere i frammenti in caso di rottura.${tipoVetro}`
      : categoria.includes('privacy')
        ? `E pensata per migliorare riservatezza e resa visiva, mantenendo coerenza con il contesto del vetro.${tipoVetro}`
        : `E pensata per controllo solare e comfort interno, riducendo calore e abbaglio sulle superfici vetrate.${tipoVetro}`;

  return [
    {
      q: `A cosa serve ${prodotto?.nome || 'questa pellicola'}?`,
      a: firstAnswer,
    },
    {
      q: `Su quali vetri si valuta l installazione di ${prodotto?.nome || 'questo prodotto'}?`,
      a: `La valutazione parte sempre dal vetro esistente e dall uso reale dello spazio.${applicazione ? ` Ambito consigliato:${applicazione}.` : ''} ${tipoVetro}`.trim(),
    },
    {
      q: `Quali prestazioni conviene leggere per scegliere ${categoriaLabel.toLowerCase()}?`,
      a: `${energia} ${uv} ${caratteristiche ? `Tra le caratteristiche principali: ${caratteristiche}.` : ''}`.trim(),
    },
    {
      q: 'Che garanzia e certificazioni sono previste?',
      a: `${garanzia} ${certificazione}`.trim(),
    },
    {
      q: 'Come si arriva alla scelta finale?',
      a: 'Si parte dall obiettivo, si verifica compatibilita del vetro e si conferma la soluzione con indicazioni chiare su posa e risultato atteso.',
    },
  ];
};

const ProductFaqSection = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);
  if (!items.length) return null;

  return (
    <section className="py-12 section-light border-y border-[#E2E8F0]" data-testid="product-faq-section">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <h2 className="text-2xl font-medium text-[#0A0F1C] mb-3">FAQ sul prodotto</h2>
        <p className="text-[#475569] mb-8">Risposte rapide per capire se questa soluzione e adatta al tuo caso.</p>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-xl overflow-hidden border border-[#E2E8F0] bg-white">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="text-[#0A0F1C] font-medium pr-4">{item.q}</span>
                <span className="text-[#64748B] text-lg leading-none">{openIndex === index ? '-' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 pt-0">
                  <div className="h-px bg-[#E2E8F0] mb-3" />
                  <p className="text-[#475569] leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProdottoPagina = () => {
  const { slug } = useParams();
  const { data: allProdotti } = useWPData('prodotti');
  const prodotto = allProdotti.find(p => p.slug === slug);
  const [liveSections, setLiveSections] = useState({ utilizzi: '', specifiche: '', caratteristiche: [] });
  const [technicalSheetUrl, setTechnicalSheetUrl] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!prodotto?.slug) return;
      try {
        const indexRes = await fetch('/wp-data/live-pages-index.json');
        if (!indexRes.ok) return;
        const indexJson = await indexRes.json();
        const targetPath = normalizePath(`/prodotti/${prodotto.slug}`);
        const entry = (indexJson?.pages || []).find((page) => normalizePath(page?.route?.newPath || '') === targetPath);
        if (!entry?.file) return;

        const pageRes = await fetch(`/wp-data/live-pages/${entry.file}`);
        if (!pageRes.ok) return;
        const pageJson = await pageRes.json();
        const extracted = extractLiveProductSections(pageJson);
        const blocks = Array.isArray(pageJson?.contentBlocks) ? pageJson.contentBlocks : [];
        const pdfHref = blocks.map(pdfHrefFromBlock).find(Boolean) || '';
        if (mounted) {
          setLiveSections(extracted);
          setTechnicalSheetUrl(resolveLiveHref(pdfHref));
        }
      } catch {
        // keep fallback content
      }
    };
    run();
    return () => { mounted = false; };
  }, [prodotto?.slug]);

  if (!prodotto) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-24">
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
              <h1 className="text-4xl font-medium text-white mb-6">Prodotto non trovato</h1>
              <Link to="/prodotti" className="btn-yellow" data-testid="back-to-products">Tutti i prodotti</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const dt = prodotto.datiTecnici;
  const hasSpecs = dt && dt.energiaSolare;
  const faqItems = buildProductFaq(prodotto, dt);
  const productVisual = PRODUCT_VISUALS[prodotto.slug] || null;

  const caratteristicheToShow = (liveSections.caratteristiche?.length ? liveSections.caratteristiche : prodotto.caratteristiche || []);
  const descrizioneHero = liveSections.utilizzi || prodotto.descrizione;
  const specificheBody = liveSections.specifiche || prodotto.specificheTecniche || '';

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`prodotto-${prodotto.slug}`}>
      <SEO title={`${prodotto.nome} — Pellicola ${prodotto.categoria}`} description={prodotto.descrizione?.substring(0, 160)} path={`/prodotti/${prodotto.slug}`} type="product" jsonLd={buildProductSchema(prodotto)} />
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="max-w-3xl">
                <Link to="/prodotti" className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#EAB308] transition-colors text-sm mb-8" data-testid="breadcrumb-prodotti">
                  <ArrowLeft size={16} />
                  Tutti i prodotti
                </Link>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-[#EAB308] text-sm font-medium uppercase tracking-wider">{prodotto.categoria}</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[#94A3B8] text-sm">{prodotto.sottocategoria}</span>
                </div>
                <div className="accent-bar w-16 mb-6" />
                <h1 className="text-4xl sm:text-5xl font-medium text-white mb-4" data-testid="product-title">{prodotto.nome}</h1>
                <p className="text-[#CBD5E1] text-lg leading-relaxed">{descrizioneHero}</p>

                <div className="flex flex-wrap gap-3 mt-6">
                  {prodotto.applicazione && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#3B82F6] text-xs font-medium">
                      <Tag size={14} /> Applicazione: {prodotto.applicazione}
                    </span>
                  )}
                  {prodotto.certificazione && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAB308]/10 border border-[#EAB308]/30 text-[#EAB308] text-xs font-medium">
                      <Certificate size={14} /> {prodotto.certificazione}
                    </span>
                  )}
                  {prodotto.garanzia && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
                      <Shield size={14} /> Garanzia {prodotto.garanzia}
                    </span>
                  )}
                </div>

                {Array.isArray(caratteristicheToShow) && caratteristicheToShow.length > 0 && (
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {caratteristicheToShow.slice(0, 4).map((item) => (
                      <div key={item} className="rounded-lg border border-white/10 bg-[#111827] p-3 text-sm text-[#CBD5E1]">
                        {item}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/preventivo" className="btn-primary group" data-testid="product-cta-preventivo-hero">
                    <span>Richiedi verifica tecnica</span>
                    <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {technicalSheetUrl ? (
                    <a
                      href={technicalSheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-secondary text-sm"
                      data-testid="product-cta-download-sheet"
                    >
                      Scarica scheda tecnica
                    </a>
                  ) : (
                    <Link to="/contatti" className="btn-secondary text-sm" data-testid="product-cta-sheet-contact">
                      Scheda tecnica su richiesta
                    </Link>
                  )}
                </div>
              </div>

              {productVisual?.src && (
                <figure className="rounded-xl overflow-hidden border border-white/10 bg-[#0F172A]">
                  <div className="aspect-[4/3] w-full">
                    <img
                      src={productVisual.src}
                      alt={productVisual.alt || prodotto.nome}
                      className="h-full w-full object-contain p-2"
                      loading="lazy"
                    />
                  </div>
                </figure>
              )}
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            {specificheBody && (
              <p className="text-[#64748B] text-base leading-relaxed">{specificheBody}</p>
            )}
          </div>
        </section>

        {/* Caratteristiche */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <h2 className="text-2xl font-medium text-white mb-3">Caratteristiche distintive</h2>
            <p className="text-[#94A3B8] mb-7">Punti chiave per capire rapidamente se la soluzione e adatta al vetro da trattare.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {caratteristicheToShow.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-4 card-glass rounded-xl"
                  data-testid={`caratteristica-${i}`}
                >
                  <CheckCircle size={20} weight="fill" className="text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <span className="text-white text-sm">{c}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dati Tecnici */}
        {hasSpecs && (
          <section className="py-16 section-light" data-testid="dati-tecnici-section">
            <div className="max-w-4xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-medium text-[#0A0F1C] mb-2">Dati tecnici</h2>
              {prodotto.tipoVetro && (
                <p className="text-[#64748B] text-sm mb-10">Testato su: {prodotto.tipoVetro}</p>
              )}

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                {dt.luceVisibile?.trasmessa && <SpecCard light icon={Eye} label="VLT" value={dt.luceVisibile.trasmessa} />}
                {dt.infrarossiRespinti && <SpecCard light icon={Sun} label="IR Respinti" value={dt.infrarossiRespinti} />}
                {dt.uvTrasmessi && <SpecCard light icon={Certificate} label="UV Trasmessi" value={dt.uvTrasmessi} />}
                {dt.energiaRespinta && <SpecCard light icon={Shield} label="Energia Respinta" value={dt.energiaRespinta} />}
              </div>

              {/* Energia Solare */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 mb-5">
                <h3 className="text-sm font-medium text-[#EAB308] uppercase tracking-wider mb-5">Energia solare totale</h3>
                <div className="space-y-3">
                  <EnergyBar light label="Trasmessa" value={dt.energiaSolare.trasmessa} color="#EF4444" />
                  <EnergyBar light label="Riflessa" value={dt.energiaSolare.riflessa} color="#3B82F6" />
                  <EnergyBar light label="Assorbita" value={dt.energiaSolare.assorbita} color="#8B5CF6" />
                </div>
              </div>

              {/* Luce Visibile */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-6 mb-5">
                <h3 className="text-sm font-medium text-[#EAB308] uppercase tracking-wider mb-5">Luce visibile</h3>
                <div className="space-y-3">
                  {dt.luceVisibile.trasmessa && <EnergyBar light label="Trasmessa" value={dt.luceVisibile.trasmessa} color="#FACC15" />}
                  {dt.luceVisibile.riflessaEsterno && <EnergyBar light label="Riflessa - Esterno" value={dt.luceVisibile.riflessaEsterno} color="#3B82F6" />}
                  {dt.luceVisibile.riflessaInterno && <EnergyBar light label="Riflessa - Interno" value={dt.luceVisibile.riflessaInterno} color="#6366F1" />}
                  {dt.luceVisibile.riduzioneAbbaglio && <EnergyBar light label="Riduzione Abbaglio" value={dt.luceVisibile.riduzioneAbbaglio} color="#10B981" />}
                </div>
              </div>

              {/* Totale Energia Respinta highlight */}
              {dt.energiaRespinta && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  className="rounded-xl p-6 text-center border border-[#EAB308]/20"
                  style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(37,99,235,0.08) 100%)' }}
                >
                  <p className="text-sm text-[#64748B] uppercase tracking-wider mb-1">Totale energia respinta</p>
                  <p className="text-5xl font-bold text-gradient-gold">{dt.energiaRespinta}</p>
                </motion.div>
              )}
            </div>
          </section>
        )}

        <ProductFaqSection items={faqItems} />

        {/* Focus Tecnico Link */}
        {prodotto.focusTecnicoSlug && (
          <section className="py-10 border-t border-white/5">
            <div className="max-w-4xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#94A3B8]">Approfondisci le caratteristiche tecniche di questa tipologia</p>
              </div>
              <Link to={`/focus-tecnico/${prodotto.focusTecnicoSlug}`} className="btn-secondary text-xs" data-testid="link-focus-tecnico">
                <span>Vai al focus tecnico</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-14 section-light">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-2xl font-medium text-[#0A0F1C] mb-4">Interessato a questo prodotto?</h2>
            <p className="text-[#64748B] mb-8">Richiedi un preventivo gratuito e senza impegno. I nostri tecnici ti consiglieranno la soluzione migliore.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/preventivo" className="btn-primary group" data-testid="cta-preventivo">
                <span>Richiedi Preventivo</span>
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contatti" className="btn-secondary text-[#0A0F1C] border-[#0A0F1C]/20 hover:border-[#EAB308]" data-testid="cta-contatti">
                Contattaci
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

// Index Page - Catalogo Prodotti
export const ProdottiIndexPagina = () => {
  const { data: allProdotti } = useWPData('prodotti');
  const categorie = ['Antisolari', 'Sicurezza', 'Privacy'];

  const getCategoriaDesc = (cat) => {
    const descs = {
      'Antisolari': 'Pellicole antisolari per il controllo della radiazione solare, risparmio energetico e protezione UV.',
      'Sicurezza': 'Pellicole di sicurezza certificate per protezione anti-sfondamento, anti-esplosione e conformita normativa.',
      'Privacy': 'Pellicole privacy e decorative per personalizzare e proteggere le superfici vetrate.',
    };
    return descs[cat] || '';
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="prodotti-index">
      <SEO title="Catalogo Prodotti — Pellicole per Vetri MADICO" description="Catalogo completo pellicole per vetri MADICO: antisolari, sicurezza, anti-esplosione SafetyShield, privacy e decorative. Schede tecniche dettagliate." path="/prodotti" />
      <Header />
      <main className="pt-24">
        <section className="py-16 lg:py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-medium text-white mb-6">
              Catalogo <span className="text-gradient-gold">Prodotti</span>
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl">Tutte le pellicole per vetri MADICO distribuite in esclusiva da Solaris Films. Schede tecniche dettagliate per ogni prodotto.</p>
          </div>
        </section>

        {categorie.map((cat, catIndex) => {
          const prodotti = allProdotti.filter(p => p.categoria === cat);
          const sottocategorie = [...new Set(prodotti.map(p => p.sottocategoria))];
          const isLight = catIndex % 2 === 0;

          return (
            <section key={cat} className={`py-16 ${isLight ? 'section-light' : ''}`} data-testid={`categoria-${cat.toLowerCase()}`}>
              <div className="max-w-7xl mx-auto px-6 md:px-12">
                <h2 className={`text-3xl font-medium mb-2 ${isLight ? 'text-[#0A0F1C]' : 'text-white'}`}>
                  Pellicole {cat}
                </h2>
                <p className={`text-base mb-10 ${isLight ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                  {getCategoriaDesc(cat)}
                </p>

                {sottocategorie.map((sub) => (
                  <div key={sub} className="mb-10">
                    <h3 className={`text-lg font-medium mb-4 ${isLight ? 'text-[#334155]' : 'text-[#EAB308]'}`}>{sub}</h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {prodotti.filter(p => p.sottocategoria === sub).map((p, i) => (
                        <motion.div key={p.slug} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                          <Link
                            to={`/prodotti/${p.slug}`}
                            className={`block h-full rounded-xl p-5 group transition-all ${isLight ? 'card-light' : 'card-glass'}`}
                            data-testid={`prodotto-link-${p.slug}`}
                          >
                            <h4 className={`font-medium mb-2 transition-colors ${isLight ? 'text-[#0A0F1C] group-hover:text-[#2563EB]' : 'text-white group-hover:text-[#EAB308]'}`}>
                              {p.nome}
                            </h4>
                            <p className={`text-sm line-clamp-2 mb-3 ${isLight ? 'text-[#64748B]' : 'text-[#94A3B8]'}`}>
                              {p.descrizione}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {p.applicazione && (
                                <span className={`text-xs px-2 py-0.5 rounded ${isLight ? 'bg-[#2563EB]/10 text-[#2563EB]' : 'bg-[#2563EB]/15 text-[#3B82F6]'}`}>
                                  {p.applicazione}
                                </span>
                              )}
                              {p.datiTecnici?.energiaRespinta && (
                                <span className={`text-xs px-2 py-0.5 rounded ${isLight ? 'bg-[#EAB308]/10 text-[#92400E]' : 'bg-[#EAB308]/15 text-[#EAB308]'}`}>
                                  Energia respinta: {p.datiTecnici.energiaRespinta}
                                </span>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-2xl font-medium text-white mb-4">Non sai quale pellicola scegliere?</h2>
            <p className="text-[#94A3B8] mb-8">I nostri tecnici specializzati ti aiuteranno a trovare la soluzione perfetta per le tue esigenze.</p>
            <Link to="/preventivo" className="btn-yellow group" data-testid="cta-preventivo-catalogo">
              <span>Richiedi un Preventivo Gratuito</span>
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ProdottoPagina;
