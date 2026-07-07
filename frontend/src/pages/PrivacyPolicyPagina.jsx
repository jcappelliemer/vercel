import { ArrowRight, CheckCircle2, FileText, Mail, Phone, ShieldCheck } from 'lucide-react';
import { Link } from '@/next/router-shim';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const privacySections = [
  {
    title: '1. Titolare del Trattamento',
    content: 'Il titolare del trattamento dei dati personali e Solaris Films S.r.l., con sede in Via G. Brodolini, 8 - Figline e Incisa Valdarno (FI), Italia. Email: info@solarisfilms.it.',
  },
  {
    title: '2. Tipologie di dati raccolti',
    content: 'Attraverso il sito vengono raccolti dati identificativi e di contatto, come nome, cognome, email, numero di telefono, ragione sociale, citta, messaggio, eventuali file allegati e dati necessari per gestire richieste di contatto, preventivo o assistenza.',
  },
  {
    title: '3. Finalita del trattamento',
    content: 'I dati raccolti tramite il sito vengono utilizzati per rispondere alle richieste di preventivo e contatto, fornire informazioni sui servizi Solaris, organizzare sopralluoghi, gestire rapporti precontrattuali e inviare comunicazioni commerciali solo quando previsto dalla legge o previo consenso.',
  },
  {
    title: '4. Base giuridica del trattamento',
    content: "Il trattamento dei dati si basa sul consenso dell'interessato, sull'esecuzione di misure precontrattuali o contrattuali adottate su richiesta dell'interessato, sull'adempimento di obblighi di legge e, ove applicabile, sul legittimo interesse del titolare alla gestione ordinata dei rapporti aziendali.",
  },
  {
    title: '5. Modalita di trattamento',
    content: 'I dati vengono trattati con strumenti informatici e telematici, con logiche organizzative correlate alle finalita indicate. Sono adottate misure tecniche e organizzative adeguate e gli accessi sono limitati al personale autorizzato o a fornitori incaricati.',
  },
  {
    title: '6. Conservazione dei dati',
    content: 'I dati vengono conservati per il tempo necessario al conseguimento delle finalita per cui sono stati raccolti, nel rispetto degli obblighi amministrativi, contabili, fiscali, contrattuali e di tutela dei diritti del titolare.',
  },
  {
    title: '7. Solaris CRM e app operatori',
    content: "Solaris Films utilizza Solaris CRM e la relativa app operatori per gestire attivita interne, lavorazioni, cantieri, presenze, note spese, documenti aziendali e comunicazioni operative. Per gli utenti abilitati possono essere trattati dati account, dati dipendente, ruolo operativo, turni e timbrature, lavorazioni assegnate, note, foto, ricevute, documenti personali o aziendali e informazioni tecniche collegate alle attivita di cantiere.",
  },
  {
    title: '8. Posizione, fotocamera e documenti nell app',
    content: "L'app operatori puo richiedere accesso alla posizione del dispositivo per registrare il luogo di timbratura o di aggiornamento di una lavorazione, e accesso a fotocamera o archivio immagini per allegare foto, documenti o ricevute. La posizione viene utilizzata per finalita operative, organizzative e di rendicontazione interna, non per tracciamento pubblicitario.",
  },
  {
    title: '9. Destinatari e fornitori',
    content: 'I dati possono essere trattati da personale Solaris autorizzato e da fornitori tecnici che supportano hosting, CRM, posta elettronica, sicurezza, manutenzione, strumenti di collaborazione, distribuzione app e servizi digitali. I fornitori agiscono secondo istruzioni del titolare e nei limiti necessari al servizio.',
  },
  {
    title: '10. Trasferimenti e sicurezza',
    content: 'Quando servizi tecnici o cloud comportano trattamenti fuori dallo Spazio Economico Europeo, Solaris adotta garanzie adeguate previste dalla normativa applicabile. Le credenziali e i documenti personali sono protetti con controlli di accesso e, ove previsto, download autenticato.',
  },
  {
    title: "11. Diritti dell'interessato",
    content: "Ai sensi degli artt. 15-22 del GDPR, l'interessato ha diritto di accedere ai propri dati, rettificarli, cancellarli, limitarne il trattamento, opporsi al trattamento e richiedere la portabilita dei dati nei casi previsti. Per esercitare tali diritti, contattare info@solarisfilms.it.",
  },
  {
    title: '12. Cookie',
    content: "Il sito utilizza cookie tecnici necessari al funzionamento e, previo consenso quando richiesto, cookie analitici o strumenti equivalenti per migliorare l'esperienza utente. L'utente puo gestire le preferenze sui cookie tramite il banner, le impostazioni del browser o gli strumenti messi a disposizione dal sito.",
  },
];

const PrivacyPolicyPagina = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1C]" data-testid="privacy-policy-page">
      <SEO
        title="Privacy Policy"
        description="Informativa sulla privacy di Solaris Films. Trattamento dei dati personali ai sensi del GDPR."
        path="/privacy-policy"
      />
      <Header />

      <main className="live-modern-shell product-detail-shell support-detail-shell privacy-policy-shell">
        <section className="product-detail-hero info-detail-hero">
          <div className="product-detail-hero-copy">
            <div className="live-modern-kicker">
              <FileText size={16} />
              <span>Informazioni legali</span>
            </div>
            <h1>Privacy Policy</h1>
            <p>
              Informativa sul trattamento dei dati personali raccolti attraverso sito, canali di contatto, Solaris CRM e app operatori.
            </p>
            <div className="product-detail-tags" aria-label="Dettagli privacy Solaris">
              <span>GDPR</span>
              <span>Trasparenza</span>
              <span>Solaris Films</span>
            </div>
            <div className="live-hero-actions">
              <Link to="/contatti" className="btn-yellow">
                Contatta Solaris
                <ArrowRight size={18} />
              </Link>
              <Link to="/preventivo" className="live-ghost-button">
                Richiedi supporto
              </Link>
            </div>
          </div>

          <aside className="support-detail-aside" aria-label="Riepilogo privacy Solaris">
            <figure className="support-detail-visual">
              <img src="/assets/services/pellicole-privacy-design.jpg" alt="Privacy Policy Solaris" loading="eager" />
              <figcaption>
                <span>Solaris Films</span>
                <p>Informazioni e supporto nel perimetro operativo Solaris.</p>
              </figcaption>
            </figure>

            <div className="knowledge-directory-hero-panel info-detail-panel">
              <div className="knowledge-directory-panel-top">
                <ShieldCheck size={24} />
                <span>Trasparenza Solaris</span>
              </div>
              <h2>Dati e contatto</h2>
              <p>La pagina resta leggibile e collegata ai canali ufficiali Solaris per ogni richiesta sui dati personali.</p>
              <div className="knowledge-directory-mini-list">
                <Link to="/contatti/">
                  <span>Contatti</span>
                  <strong>Apri</strong>
                </Link>
                <Link to="/preventivo/">
                  <span>Richiesta tecnica</span>
                  <strong>Vai</strong>
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section className="product-detail-body info-detail-body">
          <article className="live-prose product-detail-prose privacy-policy-prose">
            <div className="local-service-intro">
              <span>Ultimo aggiornamento: Luglio 2026</span>
              <h2>Informativa privacy Solaris Films</h2>
              <p>
                Questa informativa descrive in modo sintetico quali dati vengono raccolti, per quali finalita e quali diritti
                puo esercitare l'interessato.
              </p>
            </div>

            <div className="privacy-policy-sections">
              {privacySections.map((section) => (
                <section key={section.title} className="privacy-policy-section">
                  <h2>{section.title}</h2>
                  <p>{section.content}</p>
                </section>
              ))}
            </div>
          </article>

          <aside className="live-side-panel product-detail-side" aria-label="Supporto privacy Solaris Films">
            <div className="live-side-block">
              <span className="live-side-eyebrow">Privacy Solaris</span>
              <h2>Richieste sui dati personali</h2>
              <p>Per chiarimenti o esercizio dei diritti privacy, usa i canali ufficiali Solaris indicati nella pagina.</p>
            </div>
            <ul className="live-article-checklist">
              <li><CheckCircle2 size={17} /> Informativa leggibile</li>
              <li><CheckCircle2 size={17} /> Contatto privacy esplicito</li>
              <li><CheckCircle2 size={17} /> Percorso coerente con il nuovo sito</li>
            </ul>
            <div className="live-side-actions">
              <a href="mailto:info@solarisfilms.it" className="live-side-link">
                <Mail size={18} />
                <span>info@solarisfilms.it</span>
              </a>
              <a href="tel:+390559107621" className="live-side-link">
                <Phone size={18} />
                <span>055 9107621</span>
              </a>
              <Link to="/contatti" className="live-side-link">
                <ArrowRight size={18} />
                <span>Modulo contatti</span>
              </Link>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPagina;
