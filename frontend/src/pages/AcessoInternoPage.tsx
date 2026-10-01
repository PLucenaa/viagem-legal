import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAuth } from "@/lib/auth";
import { iniciarLogin, keycloakConfigurado } from "@/lib/keycloak";

/** Porta de entrada do painel interno: manda o analista pro login do Keycloak. */
export function AcessoInternoPage() {
  const { autenticado, restaurandoSessao } = useAuth();
  const location = useLocation();
  const retornarPara =
    (location.state as { retornarPara?: string } | null)?.retornarPara ??
    "/painel";

  const deveRedirecionar =
    keycloakConfigurado && !autenticado && !restaurandoSessao;

  useEffect(() => {
    if (deveRedirecionar) void iniciarLogin(retornarPara);
  }, [deveRedirecionar, retornarPara]);

  if (autenticado) return <Navigate to={retornarPara} replace />;

  return (
    <PageContainer>
      <p className="text-muted-foreground">
        {keycloakConfigurado
          ? "Redirecionando para a autenticação…"
          : "Login interno indisponível: Keycloak não configurado (VITE_KEYCLOAK_*)."}
      </p>
    </PageContainer>
  );
}
