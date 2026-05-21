import LiveMirrorPage from '@/pages/LiveMirrorPage';
import { getMirrorServerProps } from '../../src/next/liveData.server';

export default LiveMirrorPage;

export const getServerSideProps = async ({ params }) => {
  const slug = (Array.isArray(params?.slug) ? params.slug : [params?.slug].filter(Boolean)).join('/');
  const knowledgePath = `/lo-sapevi-che/${slug}/`;
  const knowledgeResult = getMirrorServerProps(knowledgePath);
  if (!knowledgeResult?.notFound) return knowledgeResult;

  const legacyBlogPath = `/blog/${slug}/`;
  return getMirrorServerProps(legacyBlogPath);
};
