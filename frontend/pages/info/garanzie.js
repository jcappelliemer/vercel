import LiveMirrorPage from '@/pages/LiveMirrorPage';
import { findPageEntryByPath, readLiveIndex, readLivePageByFile } from '../../src/next/liveData.server';

export default LiveMirrorPage;

export const getStaticProps = async () => {
  try {
    const index = readLiveIndex();
    const entry = findPageEntryByPath(index, '/pagina-info/garanzie/')
      || findPageEntryByPath(index, '/info/garanzie/')
      || findPageEntryByPath(index, '/info/certificazione-nfrc/')
      || findPageEntryByPath(index, '/info/norme/');
    const page = readLivePageByFile(entry?.file);

    if (!entry || !page) {
      return { notFound: true };
    }

    const sanitize = (value = '') => String(value || '').replace(/pagina non trovata/gi, '').trim();
    const sanitizedPage = {
      ...page,
      title: sanitize(page?.title),
      h1: sanitize(page?.h1),
      description: sanitize(page?.description),
      text: sanitize(page?.text),
      contentBlocks: (page?.contentBlocks || []).map((block) => {
        if (!block || typeof block !== 'object') return block;
        return {
          ...block,
          text: sanitize(block.text),
          html: sanitize(block.html),
        };
      }).filter((block) => {
        const text = String(block?.text || '').trim();
        const html = String(block?.html || '').trim();
        return text || html || block?.type === 'image' || block?.type === 'cta';
      }),
    };

    return {
      props: {
        initialIndex: index,
        initialPage: sanitizedPage,
        initialPath: '/info/garanzie/',
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
