import LiveDirectoryPage from '@/pages/LiveDirectoryPage';
import { getDirectoryStaticProps } from '../../src/next/liveData.server';

export default function FocusDirectoryPage({ initialPages }) {
  return <LiveDirectoryPage kind="focus" initialPages={initialPages} />;
}

export const getStaticProps = async () => getDirectoryStaticProps();
