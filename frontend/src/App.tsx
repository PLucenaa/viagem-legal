import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppFooter } from "@/components/layout/AppFooter";
import { HomePage } from "@/pages/HomePage";
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
            <Route path="/solicitar" element={<SolicitarPage />} />
            <Route path="/acompanhar" element={<AcompanharPage />} />
            <Route path="/perguntas" element={<PerguntasPage />} />
          </Routes>
        </main>
        <AppFooter />
      </div>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  );
}
