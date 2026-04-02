import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Sparkle, MapPin, Robot, ArrowRight, Spinner, ClipboardText, Check, Warning, Lightning } from '@phosphor-icons/react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API = process.env.REACT_APP_BACKEND_URL;

const tabs = [
  { id: 'orchestrate', label: 'Orchestra AI', icon: Robot, desc: 'Workflow multi-agente automatico' },
  { id: 'analyze', label: 'Analisi SEO', icon: MagnifyingGlass, desc: 'Analizza contenuti per problemi SEO' },
  { id: 'meta', label: 'Genera Meta', icon: Sparkle, desc: 'Meta title, description, keywords' },
  { id: 'local', label: 'Local SEO', icon: MapPin, desc: 'Ottimizzazione per città' },
  { id: 'content', label: 'Genera Contenuto', icon: ClipboardText, desc: 'Contenuto SEO completo' },
];

function ScoreBadge({ score }) {
  const color = score >= 70 ? 'text-green-400 bg-green-400/10' : score >= 40 ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10';
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${color}`}>{score}/100</span>;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="ml-2 text-white/40 hover:text-[#EAB308] transition-colors" title="Copia">
      {copied ? <Check size={14} /> : <ClipboardText size={14} />}
    </button>
  );
}

function ResultCard({ title, children }) {
  return (
    <div className="bg-[#111827] border border-white/10 rounded-xl p-5 mb-4">
      <h4 className="text-sm uppercase tracking-wider text-[#EAB308] font-medium mb-3">{title}</h4>
      {children}
    </div>
  );
}

export default function SEODashboard() {
  const [activeTab, setActiveTab] = useState('orchestrate');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Form states
  const [analyzeContent, setAnalyzeContent] = useState('');
  const [analyzeUrl, setAnalyzeUrl] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaType, setMetaType] = useState('prodotto');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [localCity, setLocalCity] = useState('');
  const [contentTopic, setContentTopic] = useState('');
  const [contentKeywords, setContentKeywords] = useState('');
  const [orchType, setOrchType] = useState('');
  const [orchDetails, setOrchDetails] = useState('');

  const callAPI = async (endpoint, body) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch(`${API}/api/seo/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error || data.detail) throw new Error(data.error || data.detail);
      setResult(data.result || data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (activeTab) {
      case 'analyze':
        callAPI('analyze', { content: analyzeContent, url: analyzeUrl, page_type: 'generic' });
        break;
      case 'meta':
        callAPI('generate-meta', { page_type: metaType, page_title: metaTitle, keywords: metaKeywords ? metaKeywords.split(',').map(k => k.trim()) : null });
        break;
      case 'local':
        callAPI('local', { city: localCity });
        break;
      case 'content':
        callAPI('generate-content', { topic: contentTopic, page_type: 'articolo', target_keywords: contentKeywords ? contentKeywords.split(',').map(k => k.trim()) : null });
        break;
      case 'orchestrate':
        callAPI('orchestrate', { request_type: orchType, details: orchDetails });
        break;
      default:
        break;
    }
  };

  const renderForm = () => {
    const inputClass = "w-full bg-[#0A0F1C] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-[#EAB308]/50 focus:outline-none transition-colors";
    const labelClass = "block text-sm text-[#94A3B8] mb-1.5 font-medium";

    switch (activeTab) {
      case 'analyze':
        return (
          <>
            <div>
              <label className={labelClass}>URL della pagina (opzionale)</label>
              <input type="text" value={analyzeUrl} onChange={e => setAnalyzeUrl(e.target.value)} className={inputClass} placeholder="/prodotti/antisolari" data-testid="seo-analyze-url" />
            </div>
            <div>
              <label className={labelClass}>Contenuto da analizzare</label>
              <textarea value={analyzeContent} onChange={e => setAnalyzeContent(e.target.value)} className={`${inputClass} h-32 resize-none`} placeholder="Incolla qui il testo della pagina..." data-testid="seo-analyze-content" />
            </div>
          </>
        );
      case 'meta':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Titolo pagina</label>
                <input type="text" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} className={inputClass} placeholder="Pellicole Antisolari MADICO" data-testid="seo-meta-title" />
              </div>
              <div>
                <label className={labelClass}>Tipo pagina</label>
                <select value={metaType} onChange={e => setMetaType(e.target.value)} className={inputClass} data-testid="seo-meta-type">
                  <option value="prodotto">Prodotto</option>
                  <option value="servizio">Servizio</option>
                  <option value="focus_tecnico">Focus Tecnico</option>
                  <option value="pagina_info">Pagina Informativa</option>
                  <option value="blog">Blog/Articolo</option>
                  <option value="homepage">Homepage</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Keywords target (separate da virgola)</label>
              <input type="text" value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} className={inputClass} placeholder="pellicole antisolari, risparmio energetico, MADICO" data-testid="seo-meta-keywords" />
            </div>
          </>
        );
      case 'local':
        return (
          <div>
            <label className={labelClass}>Città</label>
            <input type="text" value={localCity} onChange={e => setLocalCity(e.target.value)} className={inputClass} placeholder="Roma, Milano, Firenze..." data-testid="seo-local-city" />
          </div>
        );
      case 'content':
        return (
          <>
            <div>
              <label className={labelClass}>Argomento</label>
              <input type="text" value={contentTopic} onChange={e => setContentTopic(e.target.value)} className={inputClass} placeholder="Vantaggi delle pellicole antisolari per uffici" data-testid="seo-content-topic" />
            </div>
            <div>
              <label className={labelClass}>Keywords target (separate da virgola)</label>
              <input type="text" value={contentKeywords} onChange={e => setContentKeywords(e.target.value)} className={inputClass} placeholder="pellicole uffici, risparmio energetico, comfort termico" data-testid="seo-content-keywords" />
            </div>
          </>
        );
      case 'orchestrate':
        return (
          <>
            <div>
              <label className={labelClass}>Tipo di richiesta</label>
              <input type="text" value={orchType} onChange={e => setOrchType(e.target.value)} className={inputClass} placeholder="nuova_pagina_citta, ottimizzazione_prodotto, audit_seo..." data-testid="seo-orch-type" />
            </div>
            <div>
              <label className={labelClass}>Descrizione dettagliata</label>
              <textarea value={orchDetails} onChange={e => setOrchDetails(e.target.value)} className={`${inputClass} h-24 resize-none`} placeholder="Descrivimi cosa vuoi ottenere e l'orchestra AI pianificherà ed eseguirà il workflow..." data-testid="seo-orch-details" />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderResult = () => {
    if (!result) return null;

    // Orchestrate result
    if (activeTab === 'orchestrate' && result.plan) {
      return (
        <div className="space-y-4">
          <ResultCard title="Strategia">
            <p className="text-white/80 text-sm">{result.plan?.strategy}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-[#94A3B8]">Impatto atteso:</span>
              <span className="text-xs font-bold text-[#EAB308] uppercase">{result.plan?.expected_impact}</span>
            </div>
          </ResultCard>
          {result.agent_results?.map((ar, i) => (
            <ResultCard key={i} title={`Agente: ${ar.agent}`}>
              <p className="text-xs text-[#94A3B8] mb-2">Task: {ar.task}</p>
              <pre className="text-xs text-white/70 bg-[#0A0F1C] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(ar.result, null, 2)}
              </pre>
            </ResultCard>
          ))}
        </div>
      );
    }

    // Analyze result
    if (activeTab === 'analyze' && result.score !== undefined) {
      return (
        <div className="space-y-4">
          <ResultCard title="Punteggio SEO">
            <div className="flex items-center gap-4">
              <ScoreBadge score={result.score} />
              <span className="text-sm text-white/60">Leggibilità: {result.readability}</span>
              <span className="text-sm text-white/60">Lunghezza: {result.content_length}</span>
            </div>
          </ResultCard>
          {result.issues?.length > 0 && (
            <ResultCard title="Problemi trovati">
              <div className="space-y-2">
                {result.issues.map((issue, i) => (
                  <div key={i} className="flex items-start gap-3 bg-[#0A0F1C] rounded-lg p-3">
                    <Warning size={16} className={issue.severity === 'alta' ? 'text-red-400 mt-0.5' : issue.severity === 'media' ? 'text-yellow-400 mt-0.5' : 'text-blue-400 mt-0.5'} />
                    <div>
                      <p className="text-sm text-white/80">{issue.issue}</p>
                      <p className="text-xs text-[#EAB308] mt-1">Fix: {issue.fix}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ResultCard>
          )}
          {result.keywords_missing?.length > 0 && (
            <ResultCard title="Keywords mancanti">
              <div className="flex flex-wrap gap-2">
                {result.keywords_missing.map((kw, i) => (
                  <span key={i} className="px-2 py-1 bg-red-400/10 text-red-400 text-xs rounded-md">{kw}</span>
                ))}
              </div>
            </ResultCard>
          )}
        </div>
      );
    }

    // Meta / Local / Content result - generic JSON display
    return (
      <div className="space-y-4">
        {result.meta_title && (
          <ResultCard title="Meta Title">
            <div className="flex items-center">
              <p className="text-white font-medium">{result.meta_title}</p>
              <CopyButton text={result.meta_title} />
            </div>
            <p className="text-xs text-white/40 mt-1">{result.meta_title.length} caratteri</p>
          </ResultCard>
        )}
        {result.meta_description && (
          <ResultCard title="Meta Description">
            <div className="flex items-start">
              <p className="text-white/80 text-sm">{result.meta_description}</p>
              <CopyButton text={result.meta_description} />
            </div>
            <p className="text-xs text-white/40 mt-1">{result.meta_description.length} caratteri</p>
          </ResultCard>
        )}
        {result.h1 && (
          <ResultCard title="H1">
            <div className="flex items-center">
              <p className="text-white font-medium">{result.h1}</p>
              <CopyButton text={result.h1} />
            </div>
          </ResultCard>
        )}
        {result.keywords && (
          <ResultCard title="Keywords">
            <div className="flex flex-wrap gap-2">
              {result.keywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 bg-[#EAB308]/10 text-[#EAB308] text-xs rounded-md">{kw}</span>
              ))}
            </div>
          </ResultCard>
        )}
        {result.introduzione && (
          <ResultCard title="Introduzione">
            <p className="text-white/80 text-sm">{result.introduzione}</p>
          </ResultCard>
        )}
        {result.sezioni && (
          <ResultCard title="Sezioni Contenuto">
            {result.sezioni.map((s, i) => (
              <div key={i} className="mb-3">
                <h5 className="text-white font-medium text-sm">{s.h2}</h5>
                <p className="text-white/60 text-xs mt-1">{s.contenuto?.substring(0, 200)}...</p>
              </div>
            ))}
          </ResultCard>
        )}
        {(result.faq || result.faq_locali) && (
          <ResultCard title="FAQ Generate">
            {(result.faq || result.faq_locali).map((f, i) => (
              <div key={i} className="mb-2 bg-[#0A0F1C] rounded-lg p-3">
                <p className="text-sm text-white font-medium">{f.domanda}</p>
                <p className="text-xs text-white/60 mt-1">{f.risposta}</p>
              </div>
            ))}
          </ResultCard>
        )}
        {result.servizi_locali && (
          <ResultCard title="Servizi Locali">
            <div className="flex flex-wrap gap-2">
              {result.servizi_locali.map((s, i) => (
                <span key={i} className="px-2 py-1 bg-[#2563EB]/10 text-[#3B82F6] text-xs rounded-md">{s}</span>
              ))}
            </div>
          </ResultCard>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="seo-dashboard">
      <Header />
      <main className="pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EAB308]/20 to-[#2563EB]/20 flex items-center justify-center">
                <Lightning size={22} weight="fill" className="text-[#EAB308]" />
              </div>
              <h1 className="text-3xl font-medium text-white">SEO Agent <span className="text-gradient">Orchestra</span></h1>
            </div>
            <p className="text-[#94A3B8] max-w-xl">
              Sistema multi-agente AI per ottimizzazione SEO automatica. Analizza, genera e ottimizza contenuti per il posizionamento su Google.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8" data-testid="seo-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setResult(null); setError(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#EAB308] text-[#0A0F1C]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
                data-testid={`seo-tab-${tab.id}`}
              >
                <tab.icon size={16} weight={activeTab === tab.id ? 'fill' : 'regular'} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Panel */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#111827]/50 border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                {(() => { const Tab = tabs.find(t => t.id === activeTab); return Tab ? <Tab.icon size={20} className="text-[#EAB308]" /> : null; })()}
                <h3 className="text-lg font-medium text-white">{tabs.find(t => t.id === activeTab)?.label}</h3>
              </div>
              <p className="text-sm text-[#94A3B8] mb-6">{tabs.find(t => t.id === activeTab)?.desc}</p>

              <form onSubmit={handleSubmit} className="space-y-4" data-testid="seo-form">
                {renderForm()}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#EAB308] text-[#0A0F1C] font-bold rounded-xl hover:bg-[#D4A017] transition-all disabled:opacity-50"
                  data-testid="seo-submit"
                >
                  {loading ? (
                    <>
                      <Spinner size={18} className="animate-spin" />
                      <span>Agenti in esecuzione...</span>
                    </>
                  ) : (
                    <>
                      <Lightning size={18} weight="fill" />
                      <span>Esegui</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Result Panel */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full gap-4"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-[#EAB308]/20 border-t-[#EAB308] animate-spin" />
                      <Robot size={24} className="text-[#EAB308] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[#94A3B8] text-sm">Gli agenti AI stanno lavorando...</p>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-400/10 border border-red-400/20 rounded-xl p-5"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {renderResult()}
                  </motion.div>
                )}

                {!loading && !error && !result && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-3 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <Robot size={28} className="text-white/20" />
                    </div>
                    <p className="text-white/30 text-sm">Compila il form e premi Esegui per attivare gli agenti AI</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
