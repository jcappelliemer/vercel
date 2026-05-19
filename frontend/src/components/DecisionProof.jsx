import { motion } from 'framer-motion';
import { Link } from '@/next/router-shim';
import { ArrowRight, Certificate, CheckCircle, ClipboardText, Medal, ShieldCheck } from '@phosphor-icons/react';
import { useSettings } from '../hooks/useSettings';

const DecisionProof = () => {
  const s = useSettings();
  const assessmentImage = '/assets/generated/home/decision-assessment.webp';
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
    <section className="py-28 relative overflow-hidden bg-[#F8FAFC]" data-testid="decision-proof-section">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#EEF2F7_0%,#FFFFFF_54%,#F8FAFC_100%)]" />
      <div className="absolute left-0 top-1/4 w-[520px] h-[520px] rounded-full bg-[#EAB308]/10 blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 lg:p-10 shadow-[0_24px_70px_rgba(15,23,42,0.10)]"
          >
            <div className="flex items-center gap-3 text-[#EAB308] text-xs font-semibold uppercase tracking-[0.16em] mb-6">
              <ClipboardText size={18} weight="light" />
              {s.decision_badge || 'Prima del preventivo'}
            </div>
            <h2 className="text-4xl lg:text-5xl font-medium text-[#0A0F1C] mb-6">
              {s.decision_title || 'Valutiamo il vetro,'}
              <span className="text-gradient"> {s.decision_highlight || 'non solo i metri quadri'}</span>
            </h2>
            <p className="text-[#475569] text-lg leading-relaxed max-w-2xl mb-8">
              {s.decision_subtitle || 'La stessa pellicola non risolve tutti i problemi. Per questo la proposta parte da contesto, rischio e obiettivo finale.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-10">
              {checks.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                  <CheckCircle size={20} weight="fill" className="text-[#EAB308] mt-0.5 flex-shrink-0" />
                  <span className="text-[#0A0F1C] font-medium leading-snug">{item}</span>
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
            <motion.figure
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative min-h-[260px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-lg"
            >
              <img
                src={assessmentImage}
                alt="Valutazione tecnica delle pellicole per vetri Solaris"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/55 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[#EAB308]">
                  Analisi del vetro
                </div>
                <div className="mt-2 text-xl font-semibold text-white">
                  Dati, esposizione e obiettivo prima della proposta.
                </div>
              </figcaption>
            </motion.figure>

            {proofs.map((proof, index) => (
              <motion.div
                key={`${proof.title}-${index}`}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-[#E2E8F0] bg-white p-6 flex items-center gap-5 shadow-sm"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#EFF6FF] to-[#FEF3C7] border border-[#DBEAFE] flex-shrink-0">
                  <proof.icon size={26} weight="light" className="text-[#EAB308]" />
                </div>
                <div>
                  <div className="text-[#0A0F1C] text-xl font-semibold">{proof.title}</div>
                  <div className="text-[#64748B] text-sm uppercase tracking-[0.14em] mt-1">{proof.text}</div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
              className="rounded-2xl border border-[#EAB308]/35 bg-[#FFFBEB] p-6 shadow-sm"
            >
              <div className="text-4xl font-bold text-gradient mb-2">{s.stat2_value || '+45k'}</div>
              <div className="text-[#0A0F1C] font-semibold">{s.stat2_label || 'Edifici trattati'}</div>
              <p className="text-[#64748B] text-sm mt-3">
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
