import "@/App.css";
import { useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import WhatsAppButton from "./components/WhatsAppButton";

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }
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
          <Route path="/chi-siamo" element={<ChiSiamoPagina />} />
          <Route path="/contatti" element={<ContattiPagina />} />
          <Route path="/blog" element={<LiveDirectoryPage kind="blog" />} />
          <Route path="/blog/:slug" element={<LiveMirrorPage />} />
          <Route path="/lo-sapevi-che" element={<LiveDirectoryPage kind="knowledge" />} />
          <Route path="/guida-tecnica" element={<GuidaTecnicaPagina />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPagina />} />
          <Route path="/profilo-solaris" element={<LiveMirrorPage />} />
          <Route path="/servizi/:slug" element={<LiveMirrorPage />} />
          <Route path="/servizio-locale" element={<LiveDirectoryPage kind="local" />} />
          <Route path="/servizio-locale/:city" element={<LiveMirrorPage />} />
          <Route path="/info" element={<LiveDirectoryPage kind="info" />} />
          <Route path="/info/:slug" element={<LiveMirrorPage />} />
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
