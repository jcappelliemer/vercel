import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sun, ShieldCheck, Eye, Lightning, Sparkle, CheckCircle } from '@phosphor-icons/react';

const services = [
  {
    id: 'antisolari',
    name: 'Pellicole Antisolari',
    subtitle: 'Controllo solare e risparmio energetico',
    description: 'Le pellicole antisolari MADICO riducono drasticamente il passaggio di calore, bloccando fino al 99% dei raggi UV e riducendo le temperature interne fino a 7-8°C. Soluzione ideale per uffici, abitazioni e edifici commerciali.',
    icon: Sun,
    image: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/41cd0458add26ba29df8fb0b010533e357770d6fb0f027d6a8eea3a954452d5f.png',
    benefits: ['Risparmio energetico fino al 50%', 'Riduzione temperatura 7-8°C', 'Protezione UV 99%', 'Riduzione abbagliamento', 'Garanzia 10 anni', 'Nessun lavoro strutturale'],
    specs: { 'Riflessione UV': '99%', 'Riflessione IR': '85%', 'Garanzia': '10 anni', 'Spessore': '100-175 nm' },
  },
  {
    id: 'sicurezza',
    name: 'Pellicole di Sicurezza',
    subtitle: 'Protezione certificata UNI EN 12600',
    description: 'Le pellicole di sicurezza trasformano qualsiasi vetro in vetro di sicurezza certificato. Proteggono da schegge, intrusioni ed esplosioni, garantendo conformità al D.Lgs. 81/2008.',
    icon: ShieldCheck,
    image: 'https://images.pexels.com/photos/5483051/pexels-photo-5483051.jpeg?w=800',
    benefits: ['Certificazione UNI EN 12600', 'Protezione anti-sfondamento', 'Conformità D.Lgs. 81/2008', 'Protezione antiesplosione', 'Classe 1B1 e 2B2', 'Installazione non invasiva'],
    specs: { 'Certificazione': 'UNI EN 12600', 'Classe': '1B1 / 2B2', 'Resistenza': 'Anti-sfondamento', 'Spessore': '100-175 nm' },
  },
  {
    id: 'privacy',
    name: 'Pellicole Privacy e Design',
    subtitle: 'Satinate e decorative personalizzabili',
    description: 'Pellicole opacizzanti e decorative per garantire privacy mantenendo la luminosità. Disponibili in numerose varianti di disegno e colorazioni per personalizzare i vostri spazi.',
    icon: Eye,
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=800',
    benefits: ['Privacy garantita', 'Design personalizzabile', 'Luminosità mantenuta', 'Numerose finiture', 'Aspetto professionale', 'Facile manutenzione'],
    specs: { 'Finiture': '50+', 'Personalizzazione': 'Su misura', 'Trasparenza': 'Variabile', 'Applicazione': 'Interno/Esterno' },
  },
  {
    id: 'lcd-switch',
    name: 'Pellicole LCD Switch',
    subtitle: 'Da opaca a trasparente con un click',
    description: 'Tecnologia rivoluzionaria: passa da opaca a trasparente con la pressione di un interruttore, smartphone o comando vocale. Può trasformare una vetrata in uno schermo 4K.',
    icon: Lightning,
    image: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/e8649b92ae1cac102c10dcb549bc56fc73e517786dc90eeef30de1c82db1c77f.png',
    benefits: ['Controllo smartphone/vocale', 'Proiezione 4K integrata', 'Privacy modulabile', 'Effetto WOW garantito', 'Smart building ready', 'Consumi ridotti'],
    specs: { 'Controllo': 'App/Voce/Switch', 'Proiezione': '4K Ready', 'Tempo switch': '<1 secondo', 'Alimentazione': '48V DC' },
  },
  {
    id: 'fotocromatiche',
    name: 'Pellicole Fotocromatiche',
    subtitle: 'Si adattano automaticamente alla luce',
    description: 'Pellicole intelligenti che si scuriscono automaticamente con la luce solare, senza elettricità. Protezione adattiva che segue il ritmo del sole.',
    icon: Sparkle,
    image: 'https://images.pexels.com/photos/3195642/pexels-photo-3195642.jpeg?w=800',
    benefits: ['Funzionamento automatico', 'Zero elettricità', 'Adattive alla luce', 'Tecnologia innovativa', 'Comfort ottimale', 'Manutenzione zero'],
    specs: { 'Attivazione': 'UV automatica', 'Energia': 'Zero', 'Tempo reazione': '2-5 min', 'Durata': '10+ anni' },
  },
];

const ServiziPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="servizi-page">
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
                Scopri la nostra gamma completa di pellicole per vetri MADICO USA. 
                Soluzioni certificate per ogni esigenza.
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
                  className={`grid lg:grid-cols-2 gap-16 items-center`}
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

                    <div className="card-glass rounded-xl p-5 mb-8">
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
