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
import ProfiloSolarisPagina from "./pages/ProfiloSolarisPagina";
import ServizioLocalePagina, { ServizioLocaleIndexPagina } from "./pages/ServizioLocalePagina";
import PaginaInfoPagina, { PaginaInfoIndexPagina } from "./pages/PaginaInfoPagina";
import FocusTecnicoPagina, { FocusTecnicoIndexPagina } from "./pages/FocusTecnicoPagina";
import ProdottoPagina, { ProdottiIndexPagina } from "./pages/ProdottoPagina";

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
          <Route path="/profilo-solaris" element={<ProfiloSolarisPagina />} />
          <Route path="/servizio-locale" element={<ServizioLocaleIndexPagina />} />
          <Route path="/servizio-locale/:city" element={<ServizioLocalePagina />} />
          <Route path="/info" element={<PaginaInfoIndexPagina />} />
          <Route path="/info/:slug" element={<PaginaInfoPagina />} />
          <Route path="/focus-tecnico" element={<FocusTecnicoIndexPagina />} />
          <Route path="/focus-tecnico/:slug" element={<FocusTecnicoPagina />} />
          <Route path="/prodotti" element={<ProdottiIndexPagina />} />
          <Route path="/prodotti/:slug" element={<ProdottoPagina />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
