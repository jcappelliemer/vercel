import LiveMirrorPage from '@/pages/LiveMirrorPage';
import { getMirrorServerProps } from '../../src/next/liveData.server';

export default LiveMirrorPage;

export const getServerSideProps = async ({ params }) => {
  const pathname = `/focus-tecnico/${(Array.isArray(params?.slug) ? params.slug : [params?.slug].filter(Boolean)).join('/')}/`;
  return getMirrorServerProps(pathname);
};
