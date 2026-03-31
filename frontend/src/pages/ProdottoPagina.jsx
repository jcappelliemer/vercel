import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Shield, Sun, Drop, Eye, Certificate, Tag } from '@phosphor-icons/react';
import { prodottiData } from '../data/siteContent';

const EnergyBar = ({ label, value, color = '#EAB308' }) => {
  const numVal = parseInt(value) || 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#94A3B8] w-44 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${numVal}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-sm font-medium text-white w-12 text-right">{value}</span>
    </div>
  );
};

const SpecCard = ({ icon: Icon, label, value }) => (
  <div className="card-glass rounded-xl p-5 text-center">
    <Icon size={24} weight="fill" className="text-[#EAB308] mx-auto mb-2" />
    <p className="text-xs text-[#94A3B8] mb-1">{label}</p>
    <p className="text-lg font-medium text-white">{value}</p>
  </div>
);

const ProdottoPagina = () => {
  const { slug } = useParams();
  const prodotto = prodottiData.find(p => p.slug === slug);

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

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`prodotto-${prodotto.slug}`}>
      <SEO title={`${prodotto.nome} — Pellicola ${prodotto.categoria}`} description={prodotto.descrizione?.substring(0, 160)} path={`/prodotti/${prodotto.slug}`} type="product" />
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-16 lg:py-20 border-b border-white/5">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
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
          </div>
        </section>

        {/* Description */}
        <section className="py-14">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <p className="text-[#94A3B8] text-lg leading-relaxed mb-8">{prodotto.descrizione}</p>
            {prodotto.specificheTecniche && (
              <p className="text-[#64748B] text-base leading-relaxed">{prodotto.specificheTecniche}</p>
            )}
          </div>
        </section>

        {/* Caratteristiche */}
        <section className="py-14 section-light">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <h2 className="text-2xl font-medium text-[#0A0F1C] mb-8">Caratteristiche distintive</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {prodotto.caratteristiche.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#EAB308]/40 transition-colors"
                  data-testid={`caratteristica-${i}`}
                >
                  <CheckCircle size={20} weight="fill" className="text-[#EAB308] flex-shrink-0 mt-0.5" />
                  <span className="text-[#334155] text-sm">{c}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Dati Tecnici */}
        {hasSpecs && (
          <section className="py-16" data-testid="dati-tecnici-section">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
              <h2 className="text-2xl font-medium text-white mb-2">Dati tecnici</h2>
              {prodotto.tipoVetro && (
                <p className="text-[#94A3B8] text-sm mb-10">Testato su: {prodotto.tipoVetro}</p>
              )}

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
                {dt.luceVisibile?.trasmessa && <SpecCard icon={Eye} label="VLT" value={dt.luceVisibile.trasmessa} />}
                {dt.infrarossiRespinti && <SpecCard icon={Sun} label="IR Respinti" value={dt.infrarossiRespinti} />}
                {dt.uvTrasmessi && <SpecCard icon={Drop} label="UV Trasmessi" value={dt.uvTrasmessi} />}
                {dt.energiaRespinta && <SpecCard icon={Shield} label="Energia Respinta" value={dt.energiaRespinta} />}
              </div>

              {/* Energia Solare */}
              <div className="card-glass rounded-xl p-6 mb-6">
                <h3 className="text-sm font-medium text-[#EAB308] uppercase tracking-wider mb-5">Energia Solare Totale</h3>
                <div className="space-y-3">
                  <EnergyBar label="Trasmessa" value={dt.energiaSolare.trasmessa} color="#EF4444" />
                  <EnergyBar label="Riflessa" value={dt.energiaSolare.riflessa} color="#3B82F6" />
                  <EnergyBar label="Assorbita" value={dt.energiaSolare.assorbita} color="#8B5CF6" />
                </div>
              </div>

              {/* Luce Visibile */}
              <div className="card-glass rounded-xl p-6 mb-6">
                <h3 className="text-sm font-medium text-[#EAB308] uppercase tracking-wider mb-5">Luce Visibile</h3>
                <div className="space-y-3">
                  {dt.luceVisibile.trasmessa && <EnergyBar label="Trasmessa" value={dt.luceVisibile.trasmessa} color="#FACC15" />}
                  {dt.luceVisibile.riflessaEsterno && <EnergyBar label="Riflessa - Esterno" value={dt.luceVisibile.riflessaEsterno} color="#3B82F6" />}
                  {dt.luceVisibile.riflessaInterno && <EnergyBar label="Riflessa - Interno" value={dt.luceVisibile.riflessaInterno} color="#6366F1" />}
                  {dt.luceVisibile.riduzioneAbbaglio && <EnergyBar label="Riduzione Abbaglio" value={dt.luceVisibile.riduzioneAbbaglio} color="#10B981" />}
                </div>
              </div>

              {/* Totale Energia Respinta highlight */}
              {dt.energiaRespinta && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  className="rounded-xl p-6 text-center border border-[#EAB308]/20"
                  style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.08) 0%, rgba(37,99,235,0.08) 100%)' }}
                >
                  <p className="text-sm text-[#94A3B8] uppercase tracking-wider mb-1">Totale Energia Respinta</p>
                  <p className="text-5xl font-bold text-gradient-gold">{dt.energiaRespinta}</p>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Focus Tecnico Link */}
        {prodotto.focusTecnicoSlug && (
          <section className="py-10 border-t border-white/5">
            <div className="max-w-5xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
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
        <section className="py-16 section-light">
          <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
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
          const prodotti = prodottiData.filter(p => p.categoria === cat);
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
