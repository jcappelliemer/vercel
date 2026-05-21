import '@/index.css';
import '@/App.css';

import { SettingsProvider } from '@/hooks/useSettings';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function App({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Component {...pageProps} />
      <WhatsAppButton />
    </SettingsProvider>
  );
}
