import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from '@phosphor-icons/react';

const Hero = () => {
  const highlights = [
    '40 anni di esperienza',
    'Garanzia fino a 10 anni',
    'Sopralluogo gratuito',
  ];

  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 overflow-hidden" data-testid="hero-section">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a56db]/10 text-[#1a56db] rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#059669] rounded-full animate-pulse" />
              Distributore Esclusivo MADICO USA
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] leading-tight mb-6">
              Il partner per l'
              <span className="text-[#1a56db]">efficientamento energetico</span> 
              {' '}sostenibile
            </h1>

            <p className="text-lg text-[#6b7280] leading-relaxed mb-8 max-w-lg">
              Aiutiamo aziende e privati a migliorare il comfort degli ambienti 
              riducendo i consumi energetici con pellicole per vetri certificate.
            </p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-4 mb-8">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#374151]">
                  <CheckCircle size={18} weight="fill" className="text-[#059669]" />
                  {item}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/preventivo"
                className="btn-primary"
                data-testid="cta-preventivo-hero"
              >
                Richiedi Preventivo Gratuito
                <ArrowRight size={18} weight="bold" />
              </Link>
              <Link 
                to="/servizi"
                className="btn-outline"
                data-testid="cta-servizi-hero"
              >
                Scopri i Servizi
              </Link>
            </div>
          </motion.div>

          {/* Image/Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.pexels.com/photos/5691531/pexels-photo-5691531.jpeg?w=800"
                alt="Installazione professionale pellicole"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 to-transparent" />
              
              {/* Stats Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="grid grid-cols-3 gap-4 text-white text-center">
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold">40+</div>
                    <div className="text-xs lg:text-sm text-white/70">Anni Esperienza</div>
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold">45k+</div>
                    <div className="text-xs lg:text-sm text-white/70">Edifici Trattati</div>
                  </div>
                  <div>
                    <div className="text-3xl lg:text-4xl font-bold">10</div>
                    <div className="text-xs lg:text-sm text-white/70">Anni Garanzia</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-[#059669] text-white px-4 py-2 rounded-lg shadow-lg">
              <div className="text-xs font-medium">Risparmio medio</div>
              <div className="text-xl font-bold">-40% bolletta</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
