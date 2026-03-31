import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PreventivoPagina from "./pages/PreventivoPagina";
import ServiziPagina from "./pages/ServiziPagina";
import ChiSiamoPagina from "./pages/ChiSiamoPagina";
import ContattiPagina from "./pages/ContattiPagina";
import BlogPagina from "./pages/BlogPagina";
import GuidaTecnicaPagina from "./pages/GuidaTecnicaPagina";
import PrivacyPolicyPagina from "./pages/PrivacyPolicyPagina";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/preventivo" element={<PreventivoPagina />} />
          <Route path="/servizi" element={<ServiziPagina />} />
          <Route path="/chi-siamo" element={<ChiSiamoPagina />} />
          <Route path="/contatti" element={<ContattiPagina />} />
          <Route path="/blog" element={<BlogPagina />} />
          <Route path="/blog/:slug" element={<BlogPagina />} />
          <Route path="/guida-tecnica" element={<GuidaTecnicaPagina />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPagina />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
