import { useEffect, useRef } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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
import { AcessoInternoPage } from "@/pages/AcessoInternoPage";
import { CallbackKeycloakPage } from "@/pages/CallbackKeycloakPage";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { RotaInterna } from "@/components/auth/RotaInterna";

/**
 * Numa SPA o navegador não "carrega" a página nova: sem isso, o foco fica no
 * link clicado e o leitor de tela não percebe a troca. Leva o foco pro
 * conteúdo principal (e a rolagem pro topo) a cada mudança de rota.
 */
function FocoAoNavegar() {
  const { pathname } = useLocation();
  // Compara com a rota anterior (e não "primeira renderização"): no
  // StrictMode o efeito roda duas vezes e roubaria o foco ao abrir a página.
  const rotaAnterior = useRef(pathname);

  useEffect(() => {
    if (rotaAnterior.current === pathname) return;
    rotaAnterior.current = pathname;
    window.scrollTo(0, 0);
    document.getElementById("conteudo")?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <FocoAoNavegar />
        <a
          href="#conteudo"
          className="sr-only rounded-md bg-lavrado px-4 py-2 font-medium text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:outline-none focus:ring-[3px] focus:ring-ring/50"
        >
          Pular para o conteúdo
        </a>
        <div className="flex min-h-dvh flex-col">
          <AppHeader />
          <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/triagem" element={<TriagemPage />} />
              <Route path="/triagem/extrajudicial" element={<ExtrajudicialPage />} />
              <Route path="/solicitar" element={<SolicitarPage />} />
              <Route path="/acompanhar" element={<AcompanharPage />} />
              <Route path="/acesso-interno" element={<AcessoInternoPage />} />
              <Route path="/callback-keycloak" element={<CallbackKeycloakPage />} />
              <Route element={<RotaInterna />}>
                <Route path="/painel" element={<PainelListaPage />} />
                <Route path="/painel/:id" element={<PainelDetalhePage />} />
              </Route>
            </Routes>
          </main>
          <AppFooter />
        </div>
        <Toaster richColors position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  );
}
