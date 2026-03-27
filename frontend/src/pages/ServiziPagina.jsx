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
    image: 'https://images.unsplash.com/photo-1761706885595-02fdd9fe91bb?w=1200',
    benefits: [
      'Risparmio energetico fino al 50%',
      'Riduzione temperatura 7-8°C',
      'Protezione UV 99%',
      'Riduzione abbagliamento',
      'Garanzia 10 anni',
      'Nessun lavoro strutturale'
    ],
    specs: {
      'Riflessione UV': '99%',
      'Riflessione IR': '85%',
      'Garanzia': '10 anni',
      'Spessore': '100-175 nm'
    }
  },
  {
    id: 'sicurezza',
    name: 'Pellicole di Sicurezza',
    subtitle: 'Protezione certificata UNI EN 12600',
    description: 'Le pellicole di sicurezza trasformano qualsiasi vetro in vetro di sicurezza certificato. Proteggono da schegge, intrusioni ed esplosioni, garantendo conformità al D.Lgs. 81/2008.',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1674829763557-19283dbde6e5?w=1200',
    benefits: [
      'Certificazione UNI EN 12600',
      'Protezione anti-sfondamento',
      'Conformità D.Lgs. 81/2008',
      'Protezione antiesplosione',
      'Classe 1B1 e 2B2',
      'Installazione non invasiva'
    ],
    specs: {
      'Certificazione': 'UNI EN 12600',
      'Classe': '1B1 / 2B2',
      'Resistenza': 'Anti-sfondamento',
      'Spessore': '100-175 nm'
    }
  },
  {
    id: 'privacy',
    name: 'Pellicole Privacy e Design',
    subtitle: 'Satinate e decorative personalizzabili',
    description: 'Pellicole opacizzanti e decorative per garantire privacy mantenendo la luminosità. Disponibili in numerose varianti di disegno e colorazioni per personalizzare i vostri spazi.',
    icon: Eye,
    image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?w=1200',
    benefits: [
      'Privacy garantita',
      'Design personalizzabile',
      'Luminosità mantenuta',
      'Numerose finiture',
      'Aspetto professionale',
      'Facile manutenzione'
    ],
    specs: {
      'Finiture': '50+',
      'Personalizzazione': 'Su misura',
      'Trasparenza': 'Variabile',
      'Applicazione': 'Interno/Esterno'
    }
  },
  {
    id: 'lcd-switch',
    name: 'Pellicole LCD Switch',
    subtitle: 'Da opaca a trasparente con un click',
    description: 'Tecnologia rivoluzionaria: passa da opaca a trasparente con la pressione di un interruttore, smartphone o comando vocale. Può trasformare una vetrata in uno schermo 4K.',
    icon: Lightning,
    image: 'https://images.pexels.com/photos/5213546/pexels-photo-5213546.jpeg?w=1200',
    benefits: [
      'Controllo smartphone/vocale',
      'Proiezione 4K integrata',
      'Privacy modulabile',
      'Effetto WOW garantito',
      'Smart building ready',
      'Consumi ridotti'
    ],
    specs: {
      'Controllo': 'App/Voce/Switch',
      'Proiezione': '4K Ready',
      'Tempo switch': '<1 secondo',
      'Alimentazione': '48V DC'
    }
  },
  {
    id: 'fotocromatiche',
    name: 'Pellicole Fotocromatiche',
    subtitle: 'Si adattano automaticamente alla luce',
    description: 'Pellicole intelligenti che si scuriscono automaticamente con la luce solare, senza elettricità. Protezione adattiva che segue il ritmo del sole.',
    icon: Sparkle,
    image: 'https://images.unsplash.com/photo-1719437354892-f64ea7e03d4e?w=1200',
    benefits: [
      'Funzionamento automatico',
      'Zero elettricità',
      'Adattive alla luce',
      'Tecnologia innovativa',
      'Comfort ottimale',
      'Manutenzione zero'
    ],
    specs: {
      'Attivazione': 'UV automatica',
      'Energia': 'Zero',
      'Tempo reazione': '2-5 min',
      'Durata': '10+ anni'
    }
  },
];

const ServiziPagina = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB]" data-testid="servizi-page">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
                I Nostri Servizi
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#0A0A0A] uppercase mb-6">
                Soluzioni<br />
                <span className="text-[#002FA7]">professionali</span>
              </h1>
              <p className="text-lg text-[#0A0A0A]/70 leading-relaxed">
                Scopri la nostra gamma completa di pellicole per vetri MADICO USA. 
                Soluzioni certificate per ogni esigenza: risparmio energetico, sicurezza, privacy e design.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-24">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                  data-testid={`service-detail-${service.id}`}
                >
                  {/* Image */}
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative">
                      <img 
                        src={service.image}
                        alt={service.name}
                        className="w-full h-auto"
                      />
                      <div className="absolute top-4 left-4 bg-[#002FA7] text-white p-3">
                        <service.icon size={32} weight="bold" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-2">
                      {service.subtitle}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-[#0A0A0A] uppercase mb-4">
                      {service.name}
                    </h2>
                    <p className="text-[#0A0A0A]/70 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Benefits */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      {service.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle size={18} weight="fill" className="text-[#22C55E] flex-shrink-0" />
                          <span className="text-sm text-[#0A0A0A]">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Specs */}
                    <div className="bg-[#F9FAFB] border border-[#E5E7EB] p-4 mb-6">
                      <h4 className="text-xs uppercase tracking-wider font-bold text-[#0A0A0A]/60 mb-3">
                        Specifiche Tecniche
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(service.specs).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-xs text-[#0A0A0A]/60">{key}</span>
                            <p className="font-bold text-[#0A0A0A]">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Link 
                      to="/preventivo"
                      className="btn-primary inline-flex items-center gap-2"
                      data-testid={`service-cta-${service.id}`}
                    >
                      Richiedi Preventivo
                      <ArrowRight size={20} weight="bold" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-[#002FA7]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase mb-6">
              Non sai quale scegliere?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              I nostri esperti ti guideranno nella scelta della soluzione perfetta per le tue esigenze.
            </p>
            <Link 
              to="/preventivo"
              className="px-8 py-4 bg-white text-[#002FA7] font-bold uppercase tracking-wide hover:bg-[#F9FAFB] transition-colors inline-flex items-center gap-2"
            >
              Consulenza Gratuita
              <ArrowRight size={20} weight="bold" />
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
