import LiveMirrorPage from '@/pages/LiveMirrorPage';
import { getCatchAllPaths, getMirrorStaticProps } from '../src/next/liveData.server';

export default LiveMirrorPage;

export const getStaticPaths = async () => ({
  paths: getCatchAllPaths(),
  fallback: false,
});

export const getStaticProps = async ({ params }) => {
  const pathname = `/${(Array.isArray(params?.slug) ? params.slug : [params?.slug].filter(Boolean)).join('/')}/`;
  return getMirrorStaticProps(pathname);
};
