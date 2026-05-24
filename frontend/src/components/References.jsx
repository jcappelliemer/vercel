import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

const defaultReferences = [
  { nome: 'Aeroporto di Bologna', logo: '/assets/imported/client-logos/aeroporto-bologna.webp' },
  { nome: "Banca d'Italia Roma", logo: '/assets/imported/client-logos/banca-italia-roma.webp' },
  { nome: 'Capitaneria Porto Genova', logo: '/assets/imported/client-logos/capitaneria-porto-genova.webp' },
  { nome: 'Careggi Firenze', logo: '/assets/imported/client-logos/careggi-firenze.webp' },
  { nome: 'Cassa Depositi e Prestiti', logo: '/assets/imported/client-logos/cassa-depositi-prestiti.webp' },
  { nome: 'CNR Milano', logo: '/assets/imported/client-logos/cnr-milano.webp' },
  { nome: 'Credit Agricole Ravenna', logo: '/assets/imported/client-logos/credit-agricole-ravenna.webp' },
  { nome: 'Fercam Bolzano', logo: '/assets/imported/client-logos/fercam-bolzano.webp' },
  { nome: 'H-Farm Treviso', logo: '/assets/imported/client-logos/h-farm-treviso.webp' },
  { nome: 'Hyundai Milano', logo: '/assets/imported/client-logos/hyundai-milano.webp' },
  { nome: 'Ministero Cultura Roma', logo: '/assets/imported/client-logos/ministero-cultura-roma.webp' },
  { nome: 'Ministero Difesa Roma', logo: '/assets/imported/client-logos/ministero-difesa-roma.webp' },
  { nome: 'Palazzo Pitti Firenze', logo: '/assets/imported/client-logos/palazzo-pitti-firenze.webp' },
  { nome: 'Philip Morris Bologna', logo: '/assets/imported/client-logos/philip-morris-bologna.webp' },
  { nome: 'Still Milano', logo: '/assets/imported/client-logos/still-milano.webp' },
  { nome: 'Universita di Bologna', logo: '/assets/imported/client-logos/universita-bologna.webp' },
];

const References = ({
  theme = 'dark',
  title = 'Ci hanno scelto',
  subtitle = 'Le nostre referenze piu importanti',
  sectionClassName = 'py-24 relative overflow-hidden',
}) => {
  const s = useSettings();
  const isLight = theme === 'light';

  const wpReferences = Array.isArray(s.references)
    ? s.references.map((r) => (typeof r === 'string' ? { nome: r, logo: '' } : r))
    : [];
  const hasLogosFromWp = wpReferences.some((r) => typeof r.logo === 'string' && r.logo.trim().length > 0);
  const references = hasLogosFromWp ? wpReferences : defaultReferences;

  return (
    <section className={sectionClassName} data-testid="references-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="accent-bar w-16 mx-auto mb-6" />
          <h2 className={`text-3xl lg:text-4xl font-medium mb-4 ${isLight ? 'text-[#0A0F1C]' : 'text-white'}`}>
            {title}
          </h2>
          <p className={`${isLight ? 'text-[#475569]' : 'text-[#94A3B8]'} text-lg`}>{subtitle}</p>
        </motion.div>
      </div>

      <div className="relative">
        <div className={`absolute left-0 top-0 bottom-0 w-32 z-10 ${isLight ? 'bg-gradient-to-r from-[#F8FAFC] to-transparent' : 'bg-gradient-to-r from-[#0A0F1C] to-transparent'}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-32 z-10 ${isLight ? 'bg-gradient-to-l from-[#F8FAFC] to-transparent' : 'bg-gradient-to-l from-[#0A0F1C] to-transparent'}`} />
        <motion.div
          className="flex gap-5"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
        >
          {[...references, ...references].map((ref, index) => (
            <div
              key={`${ref.nome}-${index}`}
              className={`flex-shrink-0 flex items-center gap-3 py-3 px-5 rounded-xl transition-all ${isLight ? 'border border-[#E2E8F0] bg-white hover:border-[#EAB308]/40' : 'border border-white/5 bg-[#111827]/60 hover:border-[#EAB308]/20 hover:bg-[#111827]'}`}
              data-testid={`reference-${index}`}
            >
              {ref.logo ? (
                <img
                  src={ref.logo}
                  alt={ref.nome}
                  className={`h-8 w-auto max-w-[96px] object-contain ${isLight ? 'opacity-85' : 'brightness-0 invert opacity-70'}`}
                />
              ) : null}
              <span className={`text-sm font-medium whitespace-nowrap ${isLight ? 'text-[#334155]' : 'text-white/70'}`}>
                {ref.nome}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default References;
