import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, MapPin, Tag } from '@phosphor-icons/react';

const galleryItems = [
  {
    id: 1,
    titolo: 'Palazzo Uffici — Roma',
    categoria: 'Antisolari',
    tipo: 'antisolari',
    location: 'Roma',
    descrizione: 'Pellicole antisolari MADICO su facciata in vetro continuo. Riduzione temperatura interna di 7°C.',
    image: 'https://images.unsplash.com/photo-1774099690798-c4fe300374b2?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800',
    risultato: '-7°C temperatura interna',
  },
  {
    id: 2,
    titolo: 'Centro Congressi — Bologna',
    categoria: 'Antisolari',
    tipo: 'antisolari',
    location: 'Bologna',
    descrizione: 'Installazione pellicole a riflessione solare su 2.500 mq di vetrate esposizione sud.',
    image: 'https://images.pexels.com/photos/2073623/pexels-photo-2073623.jpeg?auto=compress&cs=tinysrgb&w=800',
    risultato: '-40% costi climatizzazione',
  },
  {
    id: 3,
    titolo: 'Sede Bancaria — Firenze',
    categoria: 'Sicurezza',
    tipo: 'sicurezza',
    location: 'Firenze',
    descrizione: 'Messa in sicurezza vetrate con pellicole anti-sfondamento UNI EN 12600 classe 1B1.',
    image: 'https://images.unsplash.com/photo-1763813581032-f8adf709070f?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800',
    risultato: 'Conformità D.Lgs. 81/2008',
  },
  {
    id: 4,
    titolo: 'Ambasciata — Roma',
    categoria: 'Safety Shield',
    tipo: 'safety-shield',
    location: 'Roma',
    descrizione: 'Protezione anti-esplosione SafetyShield G2 con sistema FrameGard su tutte le vetrate perimetrali.',
    image: 'https://images.unsplash.com/photo-1763121379548-2fae8be2ab7b?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800',
    risultato: 'Certificazione GSA 3A',
  },
  {
    id: 5,
    titolo: 'Hotel 5 Stelle — Milano',
    categoria: 'Privacy',
    tipo: 'privacy',
    location: 'Milano',
    descrizione: 'Pellicole satinate decorative per suite e sale meeting. Design personalizzato su misura.',
    image: 'https://images.unsplash.com/photo-1769146109206-e87b458649a7?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800',
    risultato: 'Privacy + design esclusivo',
  },
  {
    id: 6,
    titolo: 'Laboratorio Universitario — Pisa',
    categoria: 'Antisolari',
    tipo: 'antisolari',
    location: 'Pisa',
    descrizione: 'Protezione UV 99% per laboratorio con strumentazione sensibile. Riduzione abbagliamento.',
    image: 'https://images.pexels.com/photos/358530/pexels-photo-358530.jpeg?auto=compress&cs=tinysrgb&w=800',
    risultato: 'Protezione UV 99%',
  },
  {
    id: 7,
    titolo: 'Edificio Governativo — Napoli',
    categoria: 'Safety Shield',
    tipo: 'safety-shield',
    location: 'Napoli',
    descrizione: 'SafetyShield anti-intrusione e anti-esplosione su edificio ad alto rischio. ASTM F3561.',
    image: 'https://images.unsplash.com/photo-1698591395699-f24b1e07073a?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800',
    risultato: 'Anti-intrusione certificata',
  },
  {
    id: 8,
    titolo: 'Showroom Auto — Torino',
    categoria: 'Antisolari',
    tipo: 'antisolari',
    location: 'Torino',
    descrizione: 'Pellicole antisolari con finitura neutra per protezione auto esposte e comfort clienti.',
    image: 'https://images.unsplash.com/photo-1709562880479-7eac2f158fd2?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=800',
    risultato: '-50% irraggiamento solare',
  },
];

const filters = [
  { label: 'Tutti', value: 'tutti' },
  { label: 'Antisolari', value: 'antisolari' },
  { label: 'Safety Shield', value: 'safety-shield' },
  { label: 'Sicurezza', value: 'sicurezza' },
  { label: 'Privacy', value: 'privacy' },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('tutti');
  const [selectedItem, setSelectedItem] = useState(null);

  const filtered = activeFilter === 'tutti'
    ? galleryItems
    : galleryItems.filter(item => item.tipo === activeFilter);

  const navigateLightbox = (direction) => {
    if (!selectedItem) return;
    const currentIndex = filtered.findIndex(i => i.id === selectedItem.id);
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % filtered.length
      : (currentIndex - 1 + filtered.length) % filtered.length;
    setSelectedItem(filtered[nextIndex]);
  };

  return (
    <section className="py-32 relative" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12"
        >
          <div>
            <div className="accent-bar w-16 mb-6" />
            <h2 className="text-4xl lg:text-5xl font-medium text-white">
              I nostri <span className="text-gradient">lavori</span>
            </h2>
          </div>
          <p className="text-[#94A3B8] max-w-md lg:text-right text-lg">
            Una selezione dei progetti realizzati in 40 anni di attività.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10" data-testid="gallery-filters">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeFilter === filter.value
                  ? 'bg-[#EAB308] text-[#0A0F1C]'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
              data-testid={`gallery-filter-${filter.value}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedItem(item)}
                className={`group cursor-pointer rounded-2xl overflow-hidden border border-white/5 hover:border-[#EAB308]/30 transition-all ${
                  index === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
                data-testid={`gallery-item-${item.id}`}
              >
                <div className={`relative ${index === 0 ? 'h-full min-h-[400px]' : 'h-64'}`}>
                  <img
                    src={item.image}
                    alt={item.titolo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-[#EAB308]/20 border border-[#EAB308]/30 text-[#EAB308] text-xs font-medium px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {item.categoria}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/50">
                        <MapPin size={12} />
                        {item.location}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-white group-hover:text-[#EAB308] transition-colors">
                      {item.titolo}
                    </h3>
                    <p className="text-sm text-white/60 mt-1 line-clamp-2">{item.descrizione}</p>
                    <div className="mt-3 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 w-fit">
                      <Tag size={14} className="text-[#EAB308]" />
                      <span className="text-xs text-white font-medium">{item.risultato}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            data-testid="gallery-lightbox"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] bg-[#0A0F1C] border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:flex-row"
            >
              <div className="lg:w-3/5 relative">
                <img src={selectedItem.image} alt={selectedItem.titolo} className="w-full h-64 lg:h-full object-cover" />
              </div>
              <div className="lg:w-2/5 p-8 flex flex-col justify-center">
                <span className="text-[#EAB308] text-sm font-medium uppercase tracking-wider mb-2">{selectedItem.categoria}</span>
                <h3 className="text-2xl font-medium text-white mb-2">{selectedItem.titolo}</h3>
                <div className="flex items-center gap-2 text-sm text-white/50 mb-6">
                  <MapPin size={14} />
                  {selectedItem.location}
                </div>
                <p className="text-[#94A3B8] leading-relaxed mb-6">{selectedItem.descrizione}</p>
                <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-4">
                  <span className="text-xs uppercase tracking-wider text-[#94A3B8]">Risultato</span>
                  <p className="text-lg font-medium text-[#EAB308] mt-1">{selectedItem.risultato}</p>
                </div>
              </div>

              <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all" data-testid="lightbox-close">
                <X size={20} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all" data-testid="lightbox-prev">
                <ArrowLeft size={20} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all lg:right-[calc(40%+16px)]" data-testid="lightbox-next">
                <ArrowRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
