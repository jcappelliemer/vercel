import LiveDirectoryPage from '@/pages/LiveDirectoryPage';
import { getDirectoryStaticProps } from '../../src/next/liveData.server';

export default function ProductsDirectoryPage({ initialPages }) {
  return <LiveDirectoryPage kind="products" initialPages={initialPages} />;
}

export const getStaticProps = async () => getDirectoryStaticProps();
