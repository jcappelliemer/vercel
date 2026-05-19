import LiveDirectoryPage from '@/pages/LiveDirectoryPage';
import { getDirectoryStaticProps } from '../../src/next/liveData.server';

export default function InfoPage({ initialPages }) {
  return <LiveDirectoryPage kind="info" initialPages={initialPages} />;
}

export const getStaticProps = async () => getDirectoryStaticProps();
