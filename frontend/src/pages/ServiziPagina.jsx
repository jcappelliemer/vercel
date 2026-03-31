import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, Bomb, ShieldCheck, Eye, CheckCircle } from '@phosphor-icons/react';

const services = [
  {
    id: 'antisolari',
    name: 'Pellicole Antisolari',
    subtitle: 'Controllo solare e risparmio energetico',
    description: 'Le pellicole antisolari MADICO riducono drasticamente il passaggio di calore, bloccando fino al 99% dei raggi UV e riducendo le temperature interne fino a 7-8°C. Costruite con materiali che consentono filtraggio e schermatura dai raggi solari, migliorano la resa energetica dei vostri edifici riducendo calore, abbagliamento e consumi. L\'installazione avviene quasi esclusivamente in esterno e non richiede lavori strutturali.',
    icon: Sun,
    image: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/41cd0458add26ba29df8fb0b010533e357770d6fb0f027d6a8eea3a954452d5f.png',
    benefits: ['Risparmio energetico 30-50%', 'Riduzione temperatura fino a 8°C', 'Protezione UV 99%', 'Riflessione IR fino all\'85%', 'Garanzia fino a 10 anni', 'Nessun lavoro strutturale'],
    specs: { 'Riflessione UV': '99%', 'Riflessione IR': '85%', 'Garanzia': '10 anni', 'Ammortamento': '2-3 anni' },
    finiture: ['Brunito — basso effetto specchio', 'Argento — superficie riflettente', 'Neutro — minimo impatto, alta resa', 'Grigio fumè — elegante e discreto'],
  },
  {
    id: 'safety-shield',
    name: 'Safety Shield — Anti-Esplosione',
    subtitle: 'La pellicola anti-esplosione più testata al mondo',
    description: 'SafetyShield by MADICO è il sistema di pellicole di sicurezza più rigorosamente testato al mondo. Tiene il vetro in posizione durante esplosioni, intrusioni, disastri naturali e atti di vandalismo. La nuova generazione SafetyShield G2 introduce tecnologia adesiva avanzata e costruzione in poliestere premium per prestazioni senza precedenti.',
    icon: Bomb,
    image: 'https://images.pexels.com/photos/5483051/pexels-photo-5483051.jpeg?w=800',
    benefits: ['Resistenza ad esplosioni e blast', 'Anti-intrusione certificata', 'Sistema FrameGard brevettato (500-800 lbs/ft)', 'Protezione disastri naturali', 'Installazione da partner certificati MSPP', 'Testato con cariche fino a 1.100 kg'],
    specs: { 'Standard': 'GSA 3A/3B, ASTM F1642', 'Forza adesiva': '500-800 lbs/ft', 'Anti-intrusione': 'ASTM F3561, EN 356', 'Resistenza trazione': '32.000 PSI' },
    certifications: ['ASTM F1642 — Blast Mitigation', 'ASTM F3561 — Forced Entry', 'EN 356 — Manual Attack', 'ANSI Z97.1 — Safety Glazing', 'GSA-TS01-2003 Cat. 3A/3B', 'DIN-52,290 Cat. A1'],
  },
  {
    id: 'sicurezza',
    name: 'Pellicole di Sicurezza',
    subtitle: 'Protezione certificata UNI EN 12600',
    description: 'Solaris Films installa da più di 30 anni pellicole per vetri di sicurezza che rendono le vostre superfici vetrate \'vetri di sicurezza\' secondo la norma UNI EN 12600:2004. Il loro compito è rinforzare la vetrata per permetterle di non frantumarsi anche a seguito di un urto. Tutela la sicurezza dei tuoi cari e dei tuoi dipendenti.',
    icon: ShieldCheck,
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=800',
    benefits: ['Certificazione UNI EN 12600', 'Protezione anti-sfondamento', 'Conformità D.Lgs. 81/2008', 'Protezione da schegge', 'Classe 1B1 e 2B2', 'Installazione non invasiva'],
    specs: { 'Certificazione': 'UNI EN 12600', 'Classe': '1B1 / 2B2', 'Normativa': 'D.Lgs. 81/2008', 'Spessore': '4-8 mil' },
  },
  {
    id: 'privacy',
    name: 'Pellicole Privacy e Design',
    subtitle: 'Satinate e decorative personalizzabili',
    description: 'Pellicole opacizzanti e decorative per garantire privacy mantenendo la luminosità. Disponibili in numerose varianti di disegno e colorazioni. Scegli il motivo che più ti piace e modellalo secondo i tuoi gusti: potrai esprimere la tua creatività e avere contemporaneamente discrezione per le tue superfici vetrate.',
    icon: Eye,
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=800',
    benefits: ['Privacy garantita', 'Design personalizzabile', 'Luminosità mantenuta', 'Numerose finiture e colori', 'Aspetto professionale', 'Facile manutenzione'],
    specs: { 'Finiture': '50+', 'Personalizzazione': 'Su misura', 'Trasparenza': 'Variabile', 'Applicazione': 'Interno/Esterno' },
  },
];

const ServiziPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="servizi-page">
      <SEO title="Servizi" description="Pellicole antisolari, di sicurezza, anti-esplosione SafetyShield e privacy MADICO. Solaris Films offre soluzioni professionali per ogni esigenza." path="/servizi" />
      <Header />

      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <div className="accent-bar w-16 mb-6" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                Soluzioni
                <span className="text-gradient"> professionali</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Distributore esclusivo MADICO USA. Pellicole certificate per controllo solare,
                sicurezza, anti-esplosione e privacy.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="space-y-32">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="grid lg:grid-cols-2 gap-16 items-start"
                  data-testid={`service-detail-${service.id}`}
                >
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative rounded-2xl overflow-hidden border border-white/10">
                      <img src={service.image} alt={service.name} className="w-full h-auto object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C]/60 to-transparent" />
                      <div className="absolute top-4 left-4 w-14 h-14 rounded-xl flex items-center justify-center bg-[#EAB308]/20 border border-[#EAB308]/30">
                        <service.icon size={28} weight="light" className="text-[#EAB308]" />
                      </div>
                    </div>
                  </div>

                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <span className="text-[#EAB308] text-sm font-medium uppercase tracking-wider">{service.subtitle}</span>
                    <h2 className="text-3xl lg:text-4xl font-medium text-white mt-2 mb-4">{service.name}</h2>
                    <p className="text-[#94A3B8] leading-relaxed mb-8">{service.description}</p>

                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      {service.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle size={18} weight="fill" className="text-[#EAB308] flex-shrink-0" />
                          <span className="text-sm text-white/80">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="card-glass rounded-xl p-5 mb-6">
                      <h4 className="text-xs uppercase tracking-wider font-medium text-[#94A3B8] mb-4">Specifiche Tecniche</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(service.specs).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-xs text-[#94A3B8]">{key}</span>
                            <p className="font-medium text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {service.certifications && (
                      <div className="rounded-xl p-5 mb-6 bg-[#111827] border border-white/10">
                        <h4 className="text-xs uppercase tracking-wider font-medium text-[#EAB308] mb-4">Certificazioni</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {service.certifications.map((cert, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <ShieldCheck size={14} weight="fill" className="text-[#3B82F6] flex-shrink-0" />
                              <span className="text-xs text-white/70">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {service.finiture && (
                      <div className="rounded-xl p-5 mb-6 bg-[#111827] border border-white/10">
                        <h4 className="text-xs uppercase tracking-wider font-medium text-[#94A3B8] mb-4">Finiture Disponibili</h4>
                        <ul className="space-y-2">
                          {service.finiture.map((f, i) => (
                            <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Link to="/preventivo" className="btn-yellow group" data-testid={`service-cta-${service.id}`}>
                      <span>Richiedi Preventivo</span>
                      <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/20 to-[#EAB308]/10" />
          <div className="relative max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-medium text-white mb-6">
              Non sai quale <span className="text-gradient">scegliere</span>?
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              I nostri esperti ti guideranno nella scelta della soluzione perfetta.
            </p>
            <Link to="/preventivo" className="btn-yellow group">
              <span>Consulenza Gratuita</span>
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

export default ServiziPagina;
