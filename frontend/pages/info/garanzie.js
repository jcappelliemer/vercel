import LiveMirrorPage from '@/pages/LiveMirrorPage';
import { getMirrorStaticProps } from '../../src/next/liveData.server';

export default LiveMirrorPage;

export const getStaticProps = async () => getMirrorStaticProps('/pagina-info/garanzie/');
