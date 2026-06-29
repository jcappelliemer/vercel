import ProdottoPagina from '../../src/pages/ProdottoPagina';
import { prodottiData } from '../../src/data/siteContent';

export default ProdottoPagina;

const PRODUCT_SLUG_ALIASES = {
  'madicosb20epssr': 'madico-sb-20-e-ps-sr',
  'madicosb35epssr': 'madico-sb-35-e-ps-sr',
  'madicosg20epssr': 'madico-sg-20-e-ps-sr',
  'madicosl8epssr': 'madico-sl-8-e-ps-sr',
  'madico-rs-20-ps-sr-8-mil': 'madico-rs-20-ps-sr-8mil',
  'madico-rs-40-ps-sr-4-mil': 'madico-rs-40-ps-sr-4mil',
  'madico-rs-40-ps-sr-8-mil': 'madico-rs-40-ps-sr-8mil',
  'tecnosolarssn50tesr': 'madico-sg-20-e-ps-sr',
  'tecnosolar-ssn-50-te-sr': 'madico-sg-20-e-ps-sr',
  'ssn-50-te-sr': 'ssn-70-te-sr',
};

const canonicalProductSlug = (slug = '') => PRODUCT_SLUG_ALIASES[slug] || slug;

export async function getStaticPaths() {
  const slugs = new Set(prodottiData.map((prodotto) => prodotto.slug).filter(Boolean));

  return {
    paths: Array.from(slugs).map((slug) => ({ params: { slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const initialSlug = canonicalProductSlug(params?.slug || '');

  return {
    props: {
      initialSlug,
    },
    revalidate: 3600,
  };
}
