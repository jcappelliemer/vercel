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

    return {
      props: {
        initialIndex: index,
        initialPage: page,
        initialPath: '/info/garanzie/',
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};
