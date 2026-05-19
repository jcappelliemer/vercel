import LiveMirrorPage from '@/pages/LiveMirrorPage';
import { getMirrorStaticProps, getPathsByRoutePrefix } from '../../src/next/liveData.server';

export default LiveMirrorPage;

export const getStaticPaths = async () => ({
  paths: getPathsByRoutePrefix('/servizio-locale/'),
  fallback: false,
});

export const getStaticProps = async ({ params }) => {
  const pathname = `/servizio-locale/${(Array.isArray(params?.slug) ? params.slug : [params?.slug].filter(Boolean)).join('/')}/`;
  return getMirrorStaticProps(pathname);
};
