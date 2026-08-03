import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { HomePage } from "@/pages/HomePage";
import { TriagemPage } from "@/pages/TriagemPage";
import { ExtrajudicialPage } from "@/pages/ExtrajudicialPage";
import { PainelListaPage } from "@/pages/painel/PainelListaPage";
import { PainelDetalhePage } from "@/pages/painel/PainelDetalhePage";
import { SolicitarPage } from "@/pages/SolicitarPage";
import { AcompanharPage } from "@/pages/AcompanharPage";
import { PerguntasPage } from "@/pages/PerguntasPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-dvh flex-col">
        <AppHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/triagem" element={<TriagemPage />} />
            <Route path="/triagem/extrajudicial" element={<ExtrajudicialPage />} />
            <Route path="/solicitar" element={<SolicitarPage />} />
            <Route path="/acompanhar" element={<AcompanharPage />} />
            <Route path="/perguntas" element={<PerguntasPage />} />
            <Route path="/painel" element={<PainelListaPage />} />
            <Route path="/painel/:id" element={<PainelDetalhePage />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  );
}
