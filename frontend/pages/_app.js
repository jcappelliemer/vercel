import '@/index.css';
import '@/App.css';

import { SettingsProvider } from '@/hooks/useSettings';
import Analytics from '@/components/Analytics';
import WhatsAppButton from '@/components/WhatsAppButton';
import ChatbotWidget from '../components/ChatbotWidget';

export default function App({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Analytics />
      <Component {...pageProps} />
      <ChatbotWidget />
      <WhatsAppButton />
    </SettingsProvider>
  );
}
