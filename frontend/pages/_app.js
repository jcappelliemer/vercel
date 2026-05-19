import '@/index.css';
import '@/App.css';

import { SettingsProvider } from '@/hooks/useSettings';

export default function App({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Component {...pageProps} />
    </SettingsProvider>
  );
}
