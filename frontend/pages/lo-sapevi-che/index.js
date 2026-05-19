import LiveDirectoryPage from '@/pages/LiveDirectoryPage';
import { getDirectoryStaticProps } from '../../src/next/liveData.server';

export default function KnowledgePage({ initialPages }) {
  return <LiveDirectoryPage kind="knowledge" initialPages={initialPages} />;
}

export const getStaticProps = async () => getDirectoryStaticProps();
