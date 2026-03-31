import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const PrivacyPolicyPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="privacy-policy-page">
      <SEO title="Privacy Policy" description="Informativa sulla privacy di Solaris Films. Trattamento dei dati personali ai sensi del GDPR." path="/privacy-policy" />
      <Header />
      <main className="pt-24">
        <section className="py-20 border-b border-white/5">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <div className="accent-bar w-16 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-medium text-white mb-6">Privacy Policy</h1>
            <p className="text-[#94A3B8]">Ultimo aggiornamento: Marzo 2026</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-12">
            {[
              {
                title: '1. Titolare del Trattamento',
                content: 'Il Titolare del trattamento dei dati personali è Solaris Films S.r.l., con sede in Toscana, Italia. Email: info@solarisfilms.it.',
              },
              {
                title: '2. Tipologie di Dati raccolti',
                content: 'I dati personali raccolti attraverso i form del sito includono: nome, cognome, email, numero di telefono, ragione sociale, città e messaggio. Non vengono raccolti dati sensibili.',
              },
              {
                title: '3. Finalità del Trattamento',
                content: 'I dati raccolti vengono utilizzati esclusivamente per: rispondere alle richieste di preventivo e contatto, fornire informazioni sui nostri servizi, inviare comunicazioni commerciali (solo con consenso esplicito).',
              },
              {
                title: '4. Base Giuridica del Trattamento',
                content: 'Il trattamento dei dati si basa sul consenso dell\'interessato e sull\'esecuzione di misure precontrattuali adottate su richiesta dell\'interessato.',
              },
              {
                title: '5. Modalità di Trattamento',
                content: 'I dati vengono trattati con strumenti informatici e/o telematici, con logiche organizzative correlate alle finalità indicate. I dati sono conservati su server sicuri con accesso limitato al personale autorizzato.',
              },
              {
                title: '6. Conservazione dei Dati',
                content: 'I dati vengono conservati per il tempo strettamente necessario al conseguimento delle finalità per cui sono stati raccolti, e comunque non oltre 24 mesi dalla raccolta.',
              },
              {
                title: '7. Diritti dell\'Interessato',
                content: 'Ai sensi degli artt. 15-22 del GDPR, l\'interessato ha diritto di: accedere ai propri dati, rettificarli, cancellarli, limitarne il trattamento, opporsi al trattamento, portabilità dei dati. Per esercitare tali diritti, contattare: info@solarisfilms.it.',
              },
              {
                title: '8. Cookie',
                content: 'Il sito utilizza cookie tecnici necessari al funzionamento e cookie analitici per migliorare l\'esperienza utente. L\'utente può gestire le preferenze sui cookie tramite le impostazioni del browser.',
              },
            ].map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-medium text-white mb-4">{section.title}</h2>
                <p className="text-[#94A3B8] leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPagina;
