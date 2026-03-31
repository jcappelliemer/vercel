import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import SEO, { buildLocalBusinessSchema } from '../components/SEO';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, CheckCircle, Phone, WhatsappLogo } from '@phosphor-icons/react';
import { cittaData } from '../data/siteContent';

const ServizioLocalePagina = () => {
  const { city } = useParams();
  const citta = cittaData.find(c => c.slug === city);

  if (!citta) {
    return (
      <div className="min-h-screen bg-[#0A0F1C]">
        <Header />
        <main className="pt-24">
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
              <h1 className="text-4xl font-medium text-white mb-6">Pagina non trovata</h1>
              <Link to="/servizio-locale" className="btn-yellow">Tutte le sedi</Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  const vantaggi = [
    'Sopralluogo e preventivo gratuiti',
    'Installazione rapida senza interruzioni',
    'Pellicole certificate MADICO USA',
    'Garanzia fino a 10 anni',
    'Personale altamente specializzato',
    'Assistenza post-installazione',
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid={`servizio-locale-${citta.slug}`}>
      <SEO title={`Pellicole per Vetri ${citta.nome}`} description={`Installazione pellicole antisolari e di sicurezza MADICO a ${citta.nome}, ${citta.regione}. Sopralluogo e preventivo gratuiti. Solaris Films, 40 anni di esperienza.`} path={`/servizio-locale/${citta.slug}`} jsonLd={buildLocalBusinessSchema(citta)} />
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-2 text-[#EAB308] text-sm mb-4">
              <MapPin size={16} weight="fill" />
              <span className="uppercase tracking-wider font-medium">{citta.regione}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
              Pellicole per vetri
              <br />
              <span className="text-gradient">{citta.nome}</span>
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed max-w-3xl">
              Dalla progettazione del prodotto all'installazione finale, Solaris Films installa pellicole per finestre 
              a {citta.nome} e provincia. Da molti anni impieghiamo tutte le nostre energie per portare soluzioni 
              tagliate su misura per risolvere i problemi dei nostri clienti.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-3xl font-medium text-[#0A0F1C] mb-6">
                  Installiamo pellicole per vetri a {citta.nome} e in tutta la provincia
                </h2>
                <p className="text-[#475569] leading-relaxed mb-6">
                  Riteniamo fondamentale implementare l'efficienza energetica e la sicurezza delle superfici vetrate; 
                  per questo forniamo una consulenza completa per tutti i tipi di proprietà e attività commerciali, 
                  dalle case private alle imprese commerciali. Grandi istituzioni, pubbliche e private, si rivolgono 
                  quotidianamente alla nostra azienda per consulenze ed installazioni.
                </p>
                <p className="text-[#475569] leading-relaxed mb-6">
                  Installiamo solo le pellicole americane MADICO, le più performanti al mondo, per garantire la 
                  piena soddisfazione dei nostri clienti. Abbiamo più di 40 anni di esperienza nella progettazione 
                  e installazione di pellicole per vetri a {citta.nome} ed in tutta Italia.
                </p>
                <p className="text-[#475569] leading-relaxed mb-8">
                  Importanti istituzioni del territorio si sono affidate alla nostra esperienza per abbattere i costi 
                  di climatizzazione o garantire la sicurezza dei propri serramenti. Grazie alla distribuzione esclusiva 
                  per l'Italia delle pellicole MADICO U.S.A., offriamo il top dei prodotti a livello mondiale.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {vantaggi.map((v, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle size={18} weight="fill" className="text-[#EAB308] flex-shrink-0" />
                      <span className="text-sm text-[#475569]">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="card-light rounded-2xl p-8"
                >
                  <h3 className="text-xl font-medium text-[#0A0F1C] mb-4">Consulenza gratuita a {citta.nome}</h3>
                  <p className="text-[#475569] text-sm mb-6">
                    Contattaci per un sopralluogo gratuito. Ti mostreremo tutte le possibili soluzioni e calcoleremo 
                    il risparmio energetico ottenibile.
                  </p>
                  <div className="space-y-3 mb-6">
                    <a href="tel:+390000000000" className="flex items-center gap-3 text-[#0A0F1C] hover:text-[#2563EB] transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
                        <Phone size={18} weight="fill" className="text-cyan-500" />
                      </div>
                      <span className="font-medium">+39 000 000 0000</span>
                    </a>
                    <a href="https://wa.me/390000000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[#0A0F1C] hover:text-[#25D366] transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <WhatsappLogo size={18} weight="fill" className="text-[#25D366]" />
                      </div>
                      <span className="font-medium">WhatsApp</span>
                    </a>
                  </div>
                  <Link to="/preventivo" className="btn-yellow w-full justify-center">
                    Richiedi Preventivo Gratuito
                    <ArrowRight size={18} weight="bold" />
                  </Link>
                </motion.div>

                <div className="bg-[#2563EB] rounded-2xl p-6 text-white">
                  <h4 className="font-medium mb-2">Scegli la qualità</h4>
                  <p className="text-white/80 text-sm">
                    Scegli chi fa questo lavoro con passione da oltre 40 anni. 
                    Scegli un installatore certificato. Scegli Solaris Films.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-medium text-white mb-10">
              I nostri servizi a <span className="text-gradient">{citta.nome}</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { nome: 'Pellicole Antisolari', desc: 'Risparmio energetico fino al 50%', link: '/servizi#antisolari' },
                { nome: 'Safety Shield', desc: 'Protezione anti-esplosione', link: '/servizi#safety-shield' },
                { nome: 'Pellicole di Sicurezza', desc: 'Certificazione UNI EN 12600', link: '/servizi#sicurezza' },
                { nome: 'Privacy e Design', desc: 'Personalizzabili su misura', link: '/servizi#privacy' },
              ].map((s, i) => (
                <Link key={i} to={s.link} className="card-glass rounded-xl p-6 hover:border-[#EAB308]/30 transition-all group">
                  <h4 className="font-medium text-white group-hover:text-[#EAB308] transition-colors mb-2">{s.nome}</h4>
                  <p className="text-sm text-[#94A3B8]">{s.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 section-light">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl font-medium text-[#0A0F1C] mb-4">
              Hai bisogno di pellicole per vetri a {citta.nome}?
            </h2>
            <p className="text-[#64748B] text-lg mb-8">
              Contattaci per un preventivo gratuito e senza impegno.
            </p>
            <Link to="/preventivo" className="btn-primary group">
              <span>Preventivo Gratuito</span>
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

// Index page listing all cities
export const ServizioLocaleIndexPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="servizio-locale-index">
      <SEO title="Pellicole per Vetri in Tutta Italia" description="Solaris Films opera in tutta Italia con installatori certificati MADICO. Roma, Milano, Firenze, Napoli, Torino e oltre 20 sedi. Sopralluogo gratuito." path="/servizio-locale" />
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
              Pellicole per vetri
              <span className="text-gradient"> in tutta Italia</span>
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
              Operiamo in tutta Italia con installatori certificati. Trova il servizio più vicino a te.
            </p>
          </div>
        </section>

        <section className="py-20 section-light">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cittaData.map((citta, i) => (
                <motion.div key={citta.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                  <Link to={`/servizio-locale/${citta.slug}`} className="card-light rounded-xl p-5 flex items-center gap-3 group" data-testid={`city-link-${citta.slug}`}>
                    <MapPin size={18} weight="fill" className="text-[#EAB308] flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-[#0A0F1C] group-hover:text-[#2563EB] transition-colors">{citta.nome}</h3>
                      <p className="text-xs text-[#64748B]">{citta.regione}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ServizioLocalePagina;
