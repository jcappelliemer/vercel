import LiveDirectoryPage from '@/pages/LiveDirectoryPage';
import { getDirectoryStaticProps } from '../../src/next/liveData.server';

export default function LocalDirectoryPage({ initialPages }) {
  return <LiveDirectoryPage kind="local" initialPages={initialPages} />;
}

export const getStaticProps = async () => getDirectoryStaticProps();
