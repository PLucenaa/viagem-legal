import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { consumirDadosLogin, trocarCodigo } from "@/lib/keycloak";

// O StrictMode roda o effect duas vezes em dev; o code só pode ser trocado
// uma vez no Keycloak, então guardamos os já processados fora do componente.
const codigosProcessados = new Set<string>();

/** Retorno do Keycloak: troca o authorization code por tokens no backend. */
export function CallbackKeycloakPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [erroTroca, setErroTroca] = useState<string | null>(null);

  const code = searchParams.get("code");
  const erroKeycloak = searchParams.get("error");
  const erroRetorno = erroKeycloak
    ? (searchParams.get("error_description") ?? erroKeycloak)
    : !code
      ? "Código de autorização não encontrado."
      : null;
  const erro = erroRetorno ?? erroTroca;

  useEffect(() => {
    if (!code || erroKeycloak || codigosProcessados.has(code)) return;
    codigosProcessados.add(code);

    const { codeVerifier, retornarPara } = consumirDadosLogin();
    trocarCodigo(code, codeVerifier)
      .then(() => navigate(retornarPara, { replace: true }))
      .catch((e: Error) => setErroTroca(e.message));
  }, [code, erroKeycloak, navigate]);

  return (
    <PageContainer>
      {erro ? (
        <>
          <h1 className="font-display text-2xl font-semibold">
            Não foi possível entrar
          </h1>
          <p className="mt-2 text-muted-foreground">{erro}</p>
          <Button asChild className="mt-6">
            <Link to="/acesso-interno">Tentar novamente</Link>
          </Button>
        </>
      ) : (
        <p className="text-muted-foreground">Finalizando o login…</p>
      )}
    </PageContainer>
  );
}
