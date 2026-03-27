import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBot from '../components/ChatBot';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarBlank, Tag } from '@phosphor-icons/react';

// Sample blog posts (in production these would come from API)
const samplePosts = [
  {
    id: '1',
    titolo: 'Come scegliere la pellicola antisolare giusta per il tuo edificio',
    slug: 'come-scegliere-pellicola-antisolare',
    excerpt: 'Guida completa alla scelta delle pellicole antisolari: fattori da considerare, tipologie disponibili e consigli degli esperti.',
    immagine: 'https://images.unsplash.com/photo-1761706885595-02fdd9fe91bb?w=800',
    categoria: 'Guide',
    tags: ['antisolari', 'risparmio energetico'],
    created_at: '2025-01-15',
  },
  {
    id: '2',
    titolo: 'Pellicole di sicurezza: normative e certificazioni',
    slug: 'pellicole-sicurezza-normative-certificazioni',
    excerpt: 'Tutto quello che devi sapere sulle certificazioni UNI EN 12600 e la conformità al D.Lgs. 81/2008 per le pellicole di sicurezza.',
    immagine: 'https://images.unsplash.com/photo-1674829763557-19283dbde6e5?w=800',
    categoria: 'Normative',
    tags: ['sicurezza', 'certificazioni'],
    created_at: '2025-01-10',
  },
  {
    id: '3',
    titolo: 'Le pellicole LCD Switch: il futuro delle vetrate intelligenti',
    slug: 'pellicole-lcd-switch-futuro-vetrate',
    excerpt: 'Scopri la tecnologia rivoluzionaria delle pellicole LCD che trasformano le vetrate in schermi interattivi.',
    immagine: 'https://images.pexels.com/photos/5213546/pexels-photo-5213546.jpeg?w=800',
    categoria: 'Innovazione',
    tags: ['lcd-switch', 'smart building'],
    created_at: '2025-01-05',
  },
  {
    id: '4',
    titolo: 'Risparmio energetico con le pellicole per vetri: case study',
    slug: 'risparmio-energetico-pellicole-case-study',
    excerpt: 'Analisi dettagliata del risparmio energetico ottenuto in diversi edifici grazie all\'installazione di pellicole antisolari.',
    immagine: 'https://images.unsplash.com/photo-1719437354892-f64ea7e03d4e?w=800',
    categoria: 'Case Study',
    tags: ['risparmio', 'efficienza'],
    created_at: '2024-12-20',
  },
];

const BlogPagina = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [selectedCategory, setSelectedCategory] = useState('Tutti');

  const categories = ['Tutti', ...new Set(samplePosts.map(p => p.categoria))];

  const filteredPosts = selectedCategory === 'Tutti' 
    ? posts 
    : posts.filter(p => p.categoria === selectedCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" data-testid="blog-page">
      <Header />
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-16 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#002FA7] mb-4">
                Blog
              </p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-[#0A0A0A] uppercase mb-6">
                News e<br />
                <span className="text-[#002FA7]">approfondimenti</span>
              </h1>
              <p className="text-lg text-[#0A0A0A]/70 leading-relaxed">
                Articoli, guide e novità dal mondo delle pellicole per vetri. 
                Resta aggiornato sulle ultime tecnologie e normative del settore.
              </p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white border-b border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-[#002FA7] text-white' 
                      : 'bg-[#F9FAFB] text-[#0A0A0A] hover:bg-[#E5E7EB]'
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
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border border-[#E5E7EB] group hover:border-[#002FA7] transition-colors"
                  data-testid={`blog-post-${post.id}`}
                >
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative overflow-hidden">
                      <img 
                        src={post.immagine}
                        alt={post.titolo}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-4 left-4 bg-[#002FA7] text-white text-xs font-bold uppercase px-3 py-1">
                        {post.categoria}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-[#0A0A0A]/60 mb-3">
                        <span className="flex items-center gap-1">
                          <CalendarBlank size={14} />
                          {formatDate(post.created_at)}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-[#0A0A0A] mb-3 group-hover:text-[#002FA7] transition-colors line-clamp-2">
                        {post.titolo}
                      </h2>
                      <p className="text-sm text-[#0A0A0A]/70 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-xs text-[#0A0A0A]/60 bg-[#F9FAFB] px-2 py-1">
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-2 text-[#002FA7] text-sm font-semibold uppercase tracking-wide group-hover:gap-3 transition-all">
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
                <p className="text-[#0A0A0A]/60">Nessun articolo trovato per questa categoria.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-[#0A0A0A]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Hai domande sulle pellicole per vetri?
            </h2>
            <p className="text-white/70 mb-6">
              Il nostro team è pronto a rispondere a tutte le tue domande.
            </p>
            <Link 
              to="/contatti"
              className="px-6 py-3 bg-[#002FA7] text-white font-bold uppercase tracking-wide hover:bg-[#001d6a] transition-colors inline-flex items-center gap-2"
            >
              Contattaci
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

export default BlogPagina;
