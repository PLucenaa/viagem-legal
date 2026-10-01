import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { PageContainer } from "@/components/layout/PageContainer";

/** Protege as rotas do painel: exige login no Keycloak com role do painel. */
export function RotaInterna() {
  const { autenticado, podeAcessarPainel, restaurandoSessao } = useAuth();
  const location = useLocation();

  if (restaurandoSessao) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Verificando sua sessão…</p>
      </PageContainer>
    );
  }

  if (!autenticado) {
    return (
      <Navigate
        to="/acesso-interno"
        replace
        state={{ retornarPara: location.pathname + location.search }}
      />
    );
  }

  if (!podeAcessarPainel) {
    return (
      <PageContainer>
        <h1 className="font-display text-2xl font-semibold">Acesso negado</h1>
        <p className="mt-2 text-muted-foreground">
          Seu usuário não possui permissão de acesso ao painel interno.
        </p>
      </PageContainer>
    );
  }

  return <Outlet />;
}
