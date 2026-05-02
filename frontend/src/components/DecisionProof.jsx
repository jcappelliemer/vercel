import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Certificate, CheckCircle, ClipboardText, Medal, ShieldCheck } from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';

const DecisionProof = () => {
  const s = useSettings();
  const checks = [
    s.decision_check1 || 'Tipo di vetro e superficie',
    s.decision_check2 || 'Esposizione solare e orientamento',
    s.decision_check3 || 'Obiettivo: calore, sicurezza, privacy',
    s.decision_check4 || 'Vincoli tecnici, estetici e normativi',
  ].filter(Boolean);

  const proofs = [
    { icon: Certificate, title: s.trust1_label || 'Tutta Italia', text: s.trust1_value || 'Operativita' },
    { icon: Medal, title: s.trust2_label || 'MADICO', text: s.trust2_value || 'Esclusivista' },
    { icon: ShieldCheck, title: s.trust3_label || 'ISO 9001', text: s.trust3_value || 'Certificato' },
  ];

  return (
    <section className="py-28 relative overflow-hidden" data-testid="decision-proof-section">
      <div className="absolute inset-0 bg-[#0A0F1C]" />
      <div className="absolute left-0 top-1/4 w-[520px] h-[520px] rounded-full bg-[#EAB308]/8 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:p-10"
          >
            <div className="flex items-center gap-3 text-[#EAB308] text-xs font-semibold uppercase tracking-[0.16em] mb-6">
              <ClipboardText size={18} weight="light" />
              {s.decision_badge || 'Prima del preventivo'}
            </div>
            <h2 className="text-4xl lg:text-5xl font-medium text-white mb-6">
              {s.decision_title || 'Valutiamo il vetro,'}
              <span className="text-gradient"> {s.decision_highlight || 'non solo i metri quadri'}</span>
            </h2>
            <p className="text-[#94A3B8] text-lg leading-relaxed max-w-2xl mb-8">
              {s.decision_subtitle || 'La stessa pellicola non risolve tutti i problemi. Per questo la proposta parte da contesto, rischio e obiettivo finale.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {checks.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-[#111827]/70 p-4">
                  <CheckCircle size={20} weight="fill" className="text-[#EAB308] mt-0.5 flex-shrink-0" />
                  <span className="text-white/[0.85] font-medium leading-snug">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/preventivo" className="btn-yellow group" data-testid="decision-proof-cta">
                <span>Richiedi valutazione</span>
                <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/focus-tecnico" className="btn-secondary">
                Focus tecnici
              </Link>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {proofs.map((proof, index) => (
              <motion.div
                key={`${proof.title}-${index}`}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-[#111827]/70 p-6 flex items-center gap-5"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2563EB]/20 to-[#EAB308]/20 border border-white/10 flex-shrink-0">
                  <proof.icon size={26} weight="light" className="text-[#EAB308]" />
                </div>
                <div>
                  <div className="text-white text-xl font-semibold">{proof.title}</div>
                  <div className="text-[#94A3B8] text-sm uppercase tracking-[0.14em] mt-1">{proof.text}</div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
              className="rounded-2xl border border-[#EAB308]/25 bg-[#EAB308]/10 p-6"
            >
              <div className="text-4xl font-bold text-gradient mb-2">{s.stat2_value || '45k+'}</div>
              <div className="text-white font-semibold">{s.stat2_label || 'Edifici trattati'}</div>
              <p className="text-[#94A3B8] text-sm mt-3">
                {s.decision_stat_text || 'Esperienza su edifici direzionali, industriali, commerciali e residenziali.'}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecisionProof;
