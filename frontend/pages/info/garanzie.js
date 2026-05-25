import LiveMirrorPage from '@/pages/LiveMirrorPage';
import { getMirrorServerProps } from '../../src/next/liveData.server';

export default LiveMirrorPage;

export const getServerSideProps = async () => getMirrorServerProps('/pagina-info/garanzie/');

