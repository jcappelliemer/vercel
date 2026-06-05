import "@/App.css";
import { useLayoutEffect } from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { SettingsProvider } from "./hooks/useSettings";
import HomePage from "./pages/HomePage";
import PreventivoPagina from "./pages/PreventivoPagina";
import ServiziPagina from "./pages/ServiziPagina";
import ChiSiamoPagina from "./pages/ChiSiamoPagina";
import ContattiPagina from "./pages/ContattiPagina";
import GuidaTecnicaPagina from "./pages/GuidaTecnicaPagina";
import PrivacyPolicyPagina from "./pages/PrivacyPolicyPagina";
import LiveMirrorPage from "./pages/LiveMirrorPage";
import LiveDirectoryPage from "./pages/LiveDirectoryPage";
import SiteMapPage from "./pages/SiteMapPage";
import PaginaInfoPagina from "./pages/PaginaInfoPagina";
import WhatsAppButton from "./components/WhatsAppButton";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (hash) {
      const targetId = hash.slice(1);
      const maxAttempts = 24;
      let attempts = 0;

      const scrollWhenReady = () => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ block: "start", behavior: "auto" });
          return;
        }
        attempts += 1;
        if (attempts < maxAttempts) {
          window.requestAnimationFrame(scrollWhenReady);
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        }
      };

      scrollWhenReady();
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, hash]);

  return null;
};

function App() {
  return (
    <div className="App">
      <SettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pellicole-per-vetri/*" element={<LiveMirrorPage />} />
          <Route path="/servizio-locale/*" element={<LiveMirrorPage />} />
          <Route path="/pagina-info/*" element={<LiveMirrorPage />} />
          <Route path="/approfondimenti/*" element={<LiveMirrorPage />} />
          <Route path="/preventivo" element={<PreventivoPagina />} />
          <Route path="/servizi" element={<ServiziPagina />} />
          <Route path="/servizi/pellicole-antisolari" element={<Navigate to="/servizi#antisolari" replace />} />
          <Route path="/servizi/pellicole-antisolari/" element={<Navigate to="/servizi#antisolari" replace />} />
          <Route path="/servizi/pellicole-sicurezza" element={<Navigate to="/servizi#sicurezza" replace />} />
          <Route path="/servizi/pellicole-sicurezza/" element={<Navigate to="/servizi#sicurezza" replace />} />
          <Route path="/servizi/pellicole-decorative" element={<Navigate to="/servizi#decorative" replace />} />
          <Route path="/servizi/pellicole-decorative/" element={<Navigate to="/servizi#decorative" replace />} />
          <Route path="/company-profile" element={<ChiSiamoPagina />} />
          <Route path="/chi-siamo" element={<Navigate to="/company-profile" replace />} />
          <Route path="/contatti" element={<ContattiPagina />} />
          <Route path="/blog" element={<LiveDirectoryPage kind="blog" />} />
          <Route path="/blog/:slug" element={<LiveMirrorPage />} />
          <Route path="/lo-sapevi-che" element={<LiveDirectoryPage kind="knowledge" />} />
          <Route path="/guida-tecnica" element={<GuidaTecnicaPagina />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPagina />} />
          <Route path="/logo-concepts" element={<Navigate to="/company-profile" replace />} />
          <Route path="/profilo-solaris" element={<Navigate to="/company-profile" replace />} />
          <Route path="/pellicole-per-vetri/profilo-solaris" element={<Navigate to="/company-profile" replace />} />
          <Route path="/pellicole-per-vetri/pellicole-per-vetri/about" element={<Navigate to="/company-profile" replace />} />
          <Route path="/servizi/:slug" element={<LiveMirrorPage />} />
          <Route path="/servizio-locale" element={<LiveDirectoryPage kind="local" />} />
          <Route path="/servizio-locale/:city" element={<LiveMirrorPage />} />
          <Route path="/info" element={<LiveDirectoryPage kind="info" />} />
          <Route path="/info/garanzie" element={<PaginaInfoPagina forcedSlug="garanzie" />} />
          <Route path="/info/garanzie/" element={<PaginaInfoPagina forcedSlug="garanzie" />} />
          <Route path="/info/certificazione-nfrc" element={<PaginaInfoPagina forcedSlug="certificazione-nfrc" />} />
          <Route path="/info/certificazione-nfrc/" element={<PaginaInfoPagina forcedSlug="certificazione-nfrc" />} />
          <Route path="/info/istruzioni-e-manutenzione" element={<PaginaInfoPagina forcedSlug="istruzioni-e-manutenzione" />} />
          <Route path="/info/istruzioni-e-manutenzione/" element={<PaginaInfoPagina forcedSlug="istruzioni-e-manutenzione" />} />
          <Route path="/pagina-info/garanzie" element={<PaginaInfoPagina forcedSlug="garanzie" />} />
          <Route path="/pagina-info/garanzie/" element={<PaginaInfoPagina forcedSlug="garanzie" />} />
          <Route path="/info/:slug" element={<LiveMirrorPage />} />
          <Route path="/faq" element={<LiveMirrorPage />} />
          <Route path="/focus-tecnico" element={<LiveDirectoryPage kind="focus" />} />
          <Route path="/focus-tecnico/:slug" element={<LiveMirrorPage />} />
          <Route path="/prodotti" element={<LiveDirectoryPage kind="products" />} />
          <Route path="/prodotti/:slug" element={<LiveMirrorPage />} />
          <Route path="/mappa-sito" element={<SiteMapPage />} />
          <Route path="*" element={<LiveMirrorPage />} />
        </Routes>
        <WhatsAppButton />
        </BrowserRouter>
      </SettingsProvider>
    </div>
  );
}

export default App;
