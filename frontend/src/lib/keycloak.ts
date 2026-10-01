// Login do painel interno via Keycloak próprio (authorization code + PKCE).
//
// Fluxo: /acesso-interno redireciona pro Keycloak → Keycloak volta em
// /callback-keycloak?code=... → o backend troca o code por tokens
// (POST /api/auth/keycloak) e confere se o usuário tem role do painel.
// Os tokens ficam no localStorage e são renovados pelo backend
// (POST /api/auth/keycloak/refresh) quando estão pra expirar.

const KEYCLOAK_URL = import.meta.env.VITE_KEYCLOAK_URL as string | undefined;
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM as string | undefined;
export const KEYCLOAK_CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID as
  | string
  | undefined;

// Mesmo BASE de lib/api.ts — duplicado pra lib/api.ts poder importar daqui.
const API = `${import.meta.env.VITE_API_URL ?? ""}/api`;

export const keycloakConfigurado = !!(
  KEYCLOAK_URL &&
  KEYCLOAK_REALM &&
  KEYCLOAK_CLIENT_ID
);

const OIDC = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect`;

/** Evento disparado sempre que os tokens mudam (login, renovação, logout). */
export const EVENTO_TOKENS = "auth:tokens";

const CHAVE = {
  accessToken: "kc_access_token",
  refreshToken: "kc_refresh_token",
  expiraEm: "kc_expires_at",
  idToken: "kc_id_token",
} as const;

const CHAVE_PKCE = "kc_pkce_verifier";
const CHAVE_RETORNO = "kc_return_to";

/** Renova quando faltar menos que isso pro access token expirar. */
const MARGEM_RENOVACAO_MS = 30_000;

export interface TokensKeycloak {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  idToken?: string;
}

export function callbackUri(): string {
  return `${window.location.origin}/callback-keycloak`;
}

// --- PKCE ---

function base64Url(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function gerarPkce(): Promise<{ verifier: string; challenge: string }> {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(32)));
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return { verifier, challenge: base64Url(new Uint8Array(hash)) };
}

/** Redireciona pra tela de login do Keycloak. */
export async function iniciarLogin(retornarPara = "/painel"): Promise<void> {
  const { verifier, challenge } = await gerarPkce();
  sessionStorage.setItem(CHAVE_PKCE, verifier);
  sessionStorage.setItem(CHAVE_RETORNO, retornarPara);

  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID!,
    redirect_uri: callbackUri(),
    response_type: "code",
    scope: "openid profile email",
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  window.location.assign(`${OIDC}/auth?${params}`);
}

/** Consome (lê e apaga) o verifier PKCE e a rota de retorno guardados no login. */
export function consumirDadosLogin(): {
  codeVerifier: string | null;
  retornarPara: string;
} {
  const codeVerifier = sessionStorage.getItem(CHAVE_PKCE);
  const retornarPara = sessionStorage.getItem(CHAVE_RETORNO) ?? "/painel";
  sessionStorage.removeItem(CHAVE_PKCE);
  sessionStorage.removeItem(CHAVE_RETORNO);
  return { codeVerifier, retornarPara };
}

// --- Armazenamento dos tokens ---

function notificar() {
  window.dispatchEvent(new Event(EVENTO_TOKENS));
}

export function salvarTokens(t: TokensKeycloak) {
  localStorage.setItem(CHAVE.accessToken, t.accessToken);
  localStorage.setItem(CHAVE.refreshToken, t.refreshToken);
  localStorage.setItem(CHAVE.expiraEm, String(Date.now() + t.expiresIn * 1000));
  if (t.idToken) localStorage.setItem(CHAVE.idToken, t.idToken);
  notificar();
}

export function limparTokens() {
  Object.values(CHAVE).forEach((k) => localStorage.removeItem(k));
  notificar();
}

export function lerAccessToken(): string | null {
  return localStorage.getItem(CHAVE.accessToken);
}

export function temRefreshToken(): boolean {
  return localStorage.getItem(CHAVE.refreshToken) !== null;
}

function accessTokenValido(): boolean {
  const expiraEm = Number(localStorage.getItem(CHAVE.expiraEm) ?? 0);
  return !!lerAccessToken() && expiraEm - Date.now() > MARGEM_RENOVACAO_MS;
}

// --- Chamadas ao backend ---

export async function trocarCodigo(
  code: string,
  codeVerifier: string | null,
): Promise<void> {
  const res = await fetch(`${API}/auth/keycloak`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirectUri: callbackUri(), codeVerifier }),
  });
  if (!res.ok) {
    let mensagem = "Não foi possível entrar. Tente novamente.";
    try {
      const body = await res.json();
      mensagem = body.detail ?? mensagem;
    } catch {
      // corpo não-JSON: mantém a mensagem padrão
    }
    throw new Error(mensagem);
  }
  salvarTokens(await res.json());
}

let renovacaoEmAndamento: Promise<string | null> | null = null;

/**
 * Renova os tokens com o refresh token. Chamadas simultâneas compartilham a
 * mesma requisição (o Keycloak invalida o refresh token antigo a cada uso).
 * Retorna o novo access token, ou null se a sessão acabou.
 */
export function renovarTokens(): Promise<string | null> {
  if (renovacaoEmAndamento) return renovacaoEmAndamento;

  const refreshToken = localStorage.getItem(CHAVE.refreshToken);
  if (!refreshToken) return Promise.resolve(null);

  renovacaoEmAndamento = fetch(`${API}/auth/keycloak/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      const tokens: TokensKeycloak = await res.json();
      salvarTokens(tokens);
      return tokens.accessToken;
    })
    .catch(() => {
      limparTokens();
      return null;
    })
    .finally(() => {
      renovacaoEmAndamento = null;
    });
  return renovacaoEmAndamento;
}

/** Access token pronto pra uso, renovando antes se estiver perto de expirar. */
export async function obterAccessToken(): Promise<string | null> {
  if (accessTokenValido()) return lerAccessToken();
  return renovarTokens();
}

/** Encerra a sessão local e no Keycloak (volta pra página inicial). */
export function sair() {
  const idToken = localStorage.getItem(CHAVE.idToken);
  limparTokens();
  if (!keycloakConfigurado) {
    window.location.assign("/");
    return;
  }
  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID!,
    post_logout_redirect_uri: `${window.location.origin}/`,
  });
  // Com id_token_hint o Keycloak encerra direto, sem tela de confirmação.
  if (idToken) params.set("id_token_hint", idToken);
  window.location.assign(`${OIDC}/logout?${params}`);
}

// --- Leitura do JWT (só exibição; quem valida de verdade é o backend) ---

interface JwtPayload {
  sub?: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  resource_access?: Record<string, { roles?: string[] }>;
}

export function decodificarJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const bytes = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
