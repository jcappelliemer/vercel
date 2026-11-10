import '@/index.css';
import '@/App.css';

import Head from 'next/head';
import { SettingsProvider } from '@/hooks/useSettings';
import Analytics from '@/components/Analytics';
import OrchestraConnector from '@/components/OrchestraConnector';
import WhatsAppButton from '@/components/WhatsAppButton';

const siteIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === '1';

export default function App({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Analytics />
      <Component {...pageProps} />
      <OrchestraConnector headOnly />
      {!siteIndexable ? (
        <Head>
          <meta key="robots" name="robots" content="noindex, nofollow" />
        </Head>
      ) : null}
      <WhatsAppButton />
    </SettingsProvider>
  );
}
