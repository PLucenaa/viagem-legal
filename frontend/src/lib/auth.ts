import { createContext, useContext } from "react";

export interface UsuarioInterno {
  id: string;
  nome: string;
  email?: string;
  roles: string[];
}

export interface AuthContextValue {
  /** Tem access token (analista logado no Keycloak). */
  autenticado: boolean;
  /** Tem role ANALISTA ou ADMIN — pode usar o painel. */
  podeAcessarPainel: boolean;
  usuario: UsuarioInterno | null;
  /** true enquanto tenta recuperar a sessão com o refresh token ao abrir o app. */
  restaurandoSessao: boolean;
  sair: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}
