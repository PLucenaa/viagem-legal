import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type UsuarioInterno } from "@/lib/auth";
import {
  EVENTO_TOKENS,
  KEYCLOAK_CLIENT_ID,
  decodificarJwt,
  lerAccessToken,
  obterAccessToken,
  sair,
  temRefreshToken,
} from "@/lib/keycloak";

const ROLES_PAINEL = ["ANALISTA", "ADMIN"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(lerAccessToken);
  const [restaurandoSessao, setRestaurandoSessao] = useState(temRefreshToken);

  // Mantém o estado em sincronia com o localStorage (renovação feita pelo
  // lib/api.ts, logout, ou outra aba).
  useEffect(() => {
    const sincronizar = () => setToken(lerAccessToken());
    window.addEventListener(EVENTO_TOKENS, sincronizar);
    window.addEventListener("storage", sincronizar);
    return () => {
      window.removeEventListener(EVENTO_TOKENS, sincronizar);
      window.removeEventListener("storage", sincronizar);
    };
  }, []);

  // Ao abrir o app, garante que o token salvo ainda vale (renova se preciso).
  // Se o refresh token também expirou, os tokens são limpos e o usuário
  // aparece como deslogado.
  useEffect(() => {
    if (!temRefreshToken()) return;
    void obterAccessToken().finally(() => setRestaurandoSessao(false));
  }, []);

  const usuario = useMemo<UsuarioInterno | null>(() => {
    const payload = token ? decodificarJwt(token) : null;
    if (!payload) return null;
    const roles = KEYCLOAK_CLIENT_ID
      ? (payload.resource_access?.[KEYCLOAK_CLIENT_ID]?.roles ?? [])
      : [];
    return {
      id: payload.sub ?? "",
      nome: payload.name || payload.preferred_username || "Usuário",
      email: payload.email,
      roles,
    };
  }, [token]);

  const value = useMemo(
    () => ({
      autenticado: !!usuario,
      podeAcessarPainel:
        !!usuario && usuario.roles.some((r) => ROLES_PAINEL.includes(r)),
      usuario,
      restaurandoSessao,
      sair,
    }),
    [usuario, restaurandoSessao],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
