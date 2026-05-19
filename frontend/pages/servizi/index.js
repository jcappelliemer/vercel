import ServiziPagina from '@/pages/ServiziPagina';
import { getDirectoryStaticProps } from '../../src/next/liveData.server';

export default function ServiziRoute(props) {
  return <ServiziPagina {...props} />;
}

export const getStaticProps = async () => getDirectoryStaticProps();
