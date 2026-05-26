import LiveMirrorPage from '@/pages/LiveMirrorPage';
import { getMirrorServerProps } from '../../src/next/liveData.server';

export default LiveMirrorPage;

export const getServerSideProps = async ({ params }) => {
  const rawSlug = (Array.isArray(params?.slug) ? params.slug : [params?.slug].filter(Boolean)).join('/');
  if (rawSlug === 'garanzie' || rawSlug === 'certificazione-nfrc' || rawSlug === 'garanzie-clienti') {
    return getMirrorServerProps('/pagina-info/garanzie/');
  }
  const pathname = `/info/${rawSlug}/`;
  return getMirrorServerProps(pathname);
};
