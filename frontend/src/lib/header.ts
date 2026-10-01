// Dados do cabeçalho institucional (TJRR).
// O componente visual fica em components/layout/AppHeader.tsx.

export interface NavItem {
  to: string;
  label: string;
}

export const HEADER = {
  /** Título completo — só exibido em telas ≥ sm (senão quebra linha demais). */
  marcaLinha1: "Autorização de Viagem para Crianças e Adolescentes",
  marcaLinha2: "Divisão de Proteção das Varas da Infância e Juventude de Boa Vista/RR",
  /** Versão curta pra caber numa linha só no header mobile. */
  marcaCurta: "Viagem Legal",
  logoAlt: "Poder Judiciário do Estado de Roraima",
  nav: [
    { to: "/", label: "Início" },
    { to: "/triagem", label: "Preciso de autorização?" },
    { to: "/solicitar", label: "Solicitar" },
    { to: "/acompanhar", label: "Acompanhar" },
    { to: "/perguntas", label: "Perguntas" },
  ] satisfies NavItem[],
} as const;

/** Item extra exibido no menu só pra quem está logado com role do painel. */
export const NAV_PAINEL: NavItem = { to: "/painel", label: "Painel" };
