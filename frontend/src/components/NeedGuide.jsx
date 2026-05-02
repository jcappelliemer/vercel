import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Buildings, Fire, ShieldCheck, SlidersHorizontal, Sparkle } from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';

const defaultNeeds = [
  {
    title: 'Ridurre caldo e consumi',
    label: 'Pellicole antisolari',
    text: 'Per vetrate esposte al sole, uffici caldi, ambienti poco confortevoli e costi di climatizzazione elevati.',
    href: '/servizi#antisolari',
    cta: 'Vai alle antisolari',
    icon: Fire,
  },
  {
    title: 'Proteggere persone e vetri',
    label: 'Safety Shield',
    text: 'Per anti-esplosione, anti-intrusione, messa in sicurezza di superfici vetrate e contesti ad alto rischio.',
    href: '/servizi#safety-shield',
    cta: 'Vai a Safety Shield',
    icon: ShieldCheck,
    featured: true,
  },
  {
    title: 'Aumentare privacy e design',
    label: 'Privacy',
    text: 'Per sale riunioni, ambienti commerciali, divisori interni e superfici da personalizzare senza opere invasive.',
    href: '/servizi#privacy',
    cta: 'Vai a privacy',
    icon: Sparkle,
  },
  {
    title: 'Non sai quale scegliere?',
    label: 'Consulenza tecnica',
    text: 'Se non sai quale pellicola scegliere, partiamo da foto, metri quadri, esposizione e obiettivo da risolvere.',
    href: '/preventivo',
    cta: 'Richiedi valutazione',
    icon: SlidersHorizontal,
  },
];

const NeedGuide = () => {
  const s = useSettings();
  const needs = defaultNeeds.map((need, index) => {
    const number = index + 1;
    return {
      ...need,
      label: s[`need${number}_label`] || need.label,
      title: s[`need${number}_title`] || need.title,
      text: s[`need${number}_text`] || need.text,
      cta: s[`need${number}_cta`] || need.cta,
    };
  });

  return (
    <section className="py-28 relative overflow-hidden" data-testid="need-guide-section">
      <div className="absolute inset-0 bg-[#0A0F1C]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EAB308]/50 to-transparent" />
      <div className="absolute right-0 top-20 w-[520px] h-[520px] rounded-full bg-[#2563EB]/10 blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-28"
          >
            <div className="accent-bar w-16 mb-6" />
            <span className="inline-flex items-center gap-2 rounded-full border border-[#EAB308]/25 bg-[#EAB308]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#EAB308] mb-6">
              <Buildings size={16} weight="light" />
              {s.need_badge || 'Percorso guidato'}
            </span>
            <h2 className="text-4xl lg:text-5xl font-medium text-white mb-6">
              {s.need_title || 'Scegli per'}
              <span className="text-gradient"> {s.need_highlight || 'esigenza'}</span>
            </h2>
            <p className="text-lg text-[#94A3B8] leading-relaxed max-w-md">
              {s.need_subtitle || 'Non serve partire dal nome tecnico della pellicola. Parti dal problema: caldo, sicurezza, privacy o dubbio tecnico.'}
            </p>
            <Link to="/preventivo" className="btn-yellow group mt-10" data-testid="need-guide-primary-cta">
              <span>{s.need_cta_text || 'Richiedi preventivo'}</span>
              <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 auto-rows-fr">
            {needs.map((need, index) => (
              <motion.div
                key={need.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="min-w-0"
              >
                <Link
                  to={need.href}
                  className={`group flex h-full min-h-[300px] flex-col rounded-2xl border p-6 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1C] ${need.featured ? 'bg-gradient-to-br from-[#1A2332] via-[#111827] to-[#0A0F1C] border-[#EAB308]/35 shadow-[0_24px_80px_rgba(234,179,8,0.12)]' : 'bg-white/[0.03] border-white/[0.08] hover:border-[#EAB308]/30 hover:bg-white/[0.05]'}`}
                  data-testid={`need-card-${index}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-8">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2563EB]/20 to-[#EAB308]/20 border border-white/10">
                      <need.icon size={26} weight="light" className="text-[#EAB308]" />
                    </div>
                    <ArrowRight size={20} weight="bold" className="text-white/35 group-hover:text-[#EAB308] group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="flex-1">
                    <span className="text-xs uppercase tracking-[0.16em] text-[#EAB308] font-semibold">
                      {need.label}
                    </span>
                    <h3 className="text-2xl lg:text-3xl text-white font-semibold mt-3 leading-tight">
                      {need.title}
                    </h3>
                    <p className="text-[#94A3B8] mt-4 leading-relaxed">
                      {need.text}
                    </p>
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#EAB308]">
                    <span>{need.cta}</span>
                    <ArrowRight size={16} weight="bold" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeedGuide;
