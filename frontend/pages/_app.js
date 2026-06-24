import '@/index.css';
import '@/App.css';

import { SettingsProvider } from '@/hooks/useSettings';
import Analytics from '@/components/Analytics';
import WhatsAppButton from '@/components/WhatsAppButton';
import AeoOrchestraBadge from '@/components/AeoOrchestraBadge';

export default function App({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Analytics />
      <Component {...pageProps} />
      <WhatsAppButton />
      <AeoOrchestraBadge />
    </SettingsProvider>
  );
}
