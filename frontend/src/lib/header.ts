// Dados do cabeçalho institucional (TJRR).
// O componente visual fica em components/layout/AppHeader.tsx.

export interface NavItem {
  to: string;
  label: string;
}

export const HEADER = {
  marcaLinha1: "Autorização de Viagem para Crianças e Adolescentes",
  marcaLinha2: "Divisão de Proteção das Varas da Infância e Juventude de Boa Vista/RR",
  logoAlt: "Poder Judiciário do Estado de Roraima",
  nav: [
    { to: "/", label: "Início" },
    { to: "/solicitar", label: "Solicitar" },
    { to: "/acompanhar", label: "Acompanhar" },
    { to: "/perguntas", label: "Perguntas" },
  ] satisfies NavItem[],
} as const;
