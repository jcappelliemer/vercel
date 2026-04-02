import { createContext, useContext, useState, useEffect } from 'react';
import { fetchSettings } from '../data/wpApi';

const defaults = {
  company_name: 'Solaris Films',
  company_subtitle: 'Distributore esclusivo MADICO USA per l\'Italia',
  phone: '+390559107621',
  phone_display: '055 9107621',
  whatsapp: '3925466518',
  email: 'info@solarisfilms.it',
  address: 'Via G. Brodolini, 8 - Figline e Incisa Valdarno (FI)',
  piva: '02223380516',
  hero_title: 'Gli Specialisti delle Pellicole per Vetri',
  hero_subtitle: 'Distributore esclusivo MADICO USA per l\'Italia e la Spagna. Da oltre 30 anni proteggiamo, schermiamo e rendiamo sicuri i vetri di edifici commerciali, industriali e residenziali.',
  hero_badge: 'Distributore Esclusivo MADICO USA',
  hero_image: '',
  hero_cta_text: 'Richiedi Preventivo',
  hero_video_url: '',
  stat1_value: '40+',
  stat1_label: 'Anni Esperienza',
  stat2_value: '45k+',
  stat2_label: 'Edifici Trattati',
  stat3_value: '-40%',
  stat3_label: 'Bolletta Energia',
  trust1_label: 'ISO 9001',
  trust1_value: 'Certificato',
  trust2_label: 'MADICO',
  trust2_value: 'Esclusivista',
  trust3_label: 'UNI EN 12600',
  trust3_value: 'Sicurezza',
  trust4_label: 'Green',
  trust4_value: 'Eco-friendly',
  cta_title: 'Il futuro del tuo spazio inizia qui',
  cta_subtitle: 'Preventivo gratuito. Risposta in 24 ore.',
  footer_text: 'Distributore esclusivo MADICO USA per l\'Italia. 30 anni di esperienza, oltre 45.000 edifici trattati.',
  facebook: '',
  instagram: '',
  linkedin: '',
  youtube: '',
};

const SettingsContext = createContext(defaults);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaults);

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) setSettings(prev => ({ ...prev, ...data }));
    });
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};
