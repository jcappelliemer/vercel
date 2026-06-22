import LiveDirectoryPage from '@/pages/LiveDirectoryPage';
import { getDirectoryStaticProps } from '../../src/next/liveData.server';

export default function ApprofondimentiPage({ initialPages }) {
  return <LiveDirectoryPage kind="blog" initialPages={initialPages} />;
}

export const getStaticProps = async () => getDirectoryStaticProps();
