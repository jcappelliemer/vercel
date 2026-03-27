import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarBlank, Tag } from '@phosphor-icons/react';

const samplePosts = [
  {
    id: '1',
    titolo: 'Come scegliere la pellicola antisolare giusta per il tuo edificio',
    slug: 'come-scegliere-pellicola-antisolare',
    excerpt: 'Guida completa alla scelta delle pellicole antisolari: fattori da considerare, tipologie disponibili e consigli degli esperti.',
    immagine: 'https://static.prod-images.emergentagent.com/jobs/1429a972-4dc9-4582-a67b-766bbd84c4f7/images/41cd0458add26ba29df8fb0b010533e357770d6fb0f027d6a8eea3a954452d5f.png',
    categoria: 'Guide',
    tags: ['antisolari', 'risparmio energetico'],
    created_at: '2025-01-15',
  },
  {
    id: '2',
    titolo: 'SafetyShield G2: la nuova generazione di pellicole anti-esplosione',
    slug: 'safetyshield-g2-nuova-generazione',
    excerpt: 'MADICO lancia SafetyShield G2: la pellicola di sicurezza più forte e più testata al mondo, con adesivo proprietario e poliestere premium.',
    immagine: 'https://images.pexels.com/photos/5483051/pexels-photo-5483051.jpeg?w=800',
    categoria: 'Innovazione',
    tags: ['safety-shield', 'sicurezza', 'anti-esplosione'],
    created_at: '2025-01-10',
  },
  {
    id: '3',
    titolo: 'Pellicole di sicurezza: normative e certificazioni',
    slug: 'pellicole-sicurezza-normative-certificazioni',
    excerpt: 'Tutto quello che devi sapere sulle certificazioni UNI EN 12600 e la conformità al D.Lgs. 81/2008 per le pellicole di sicurezza.',
    immagine: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?w=800',
    categoria: 'Normative',
    tags: ['sicurezza', 'certificazioni'],
    created_at: '2025-01-05',
  },
  {
    id: '4',
    titolo: 'Risparmio energetico con le pellicole per vetri: case study',
    slug: 'risparmio-energetico-pellicole-case-study',
    excerpt: 'Analisi dettagliata del risparmio energetico ottenuto in diversi edifici grazie all\'installazione di pellicole antisolari.',
    immagine: 'https://images.pexels.com/photos/3195642/pexels-photo-3195642.jpeg?w=800',
    categoria: 'Case Study',
    tags: ['risparmio', 'efficienza'],
    created_at: '2024-12-20',
  },
];

const BlogPagina = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const categories = ['Tutti', ...new Set(samplePosts.map(p => p.categoria))];
  const filteredPosts = selectedCategory === 'Tutti' ? samplePosts : samplePosts.filter(p => p.categoria === selectedCategory);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="blog-page">
      <Header />
      
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl">
              <div className="accent-bar w-16 mb-6" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6">
                News e
                <span className="text-gradient"> approfondimenti</span>
              </h1>
              <p className="text-lg text-[#94A3B8] leading-relaxed">
                Articoli, guide e novità dal mondo delle pellicole per vetri. 
                Resta aggiornato sulle ultime tecnologie.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-6 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    selectedCategory === cat 
                      ? 'bg-[#EAB308] text-[#0A0F1C]' 
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                  data-testid={`blog-category-${cat.toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-glass rounded-2xl overflow-hidden group hover:border-[#EAB308]/30 transition-all"
                  data-testid={`blog-post-${post.id}`}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative overflow-hidden">
                      <img src={post.immagine} alt={post.titolo} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent" />
                      <span className="absolute top-4 left-4 bg-[#EAB308] text-[#0A0F1C] text-xs font-bold uppercase px-3 py-1 rounded-md">
                        {post.categoria}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-[#94A3B8] mb-3">
                        <span className="flex items-center gap-1">
                          <CalendarBlank size={14} />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <h2 className="text-lg font-medium text-white mb-3 group-hover:text-[#EAB308] transition-colors line-clamp-2">
                        {post.titolo}
                      </h2>
                      <p className="text-sm text-[#94A3B8] mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-xs text-[#94A3B8] bg-white/5 px-2 py-1 rounded">
                            <Tag size={12} />{tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 text-[#EAB308] text-sm font-medium uppercase tracking-wide group-hover:gap-3 transition-all">
                        Leggi articolo
                        <ArrowRight size={16} weight="bold" />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#94A3B8]">Nessun articolo trovato per questa categoria.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#111827]/50 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-2xl lg:text-3xl font-medium text-white mb-4">
              Hai domande sulle <span className="text-gradient">pellicole</span>?
            </h2>
            <p className="text-[#94A3B8] mb-8">Il nostro team è pronto a rispondere.</p>
            <Link to="/contatti" className="btn-yellow group">
              <span>Contattaci</span>
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

export default BlogPagina;
