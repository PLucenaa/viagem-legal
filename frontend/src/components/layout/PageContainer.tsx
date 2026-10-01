import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// No celular ocupa a largura toda (só o px-4 de respiro) — 80% de uma tela
// de ~390px sobrava pouco pros formulários. A partir de sm: largura fluida
// (~80% da tela) em vez de coluna fixa estreita, com um teto
// pra não esticar demais em monitor ultrawide. Uma única largura padrão pras
// páginas de tarefa — só a listagem em tabela e a Home (marketing) fogem
// disso, com motivo.
const LARGURAS = {
  padrao: "w-full sm:w-[80%] max-w-5xl",
  tabela: "w-full sm:w-[85%] max-w-6xl",
  pagina: "w-full sm:w-[85%] max-w-7xl",
} as const;

interface PageContainerProps {
  children: ReactNode;
  /** padrao: qualquer tela de tarefa única · tabela: listagens largas ·
   * pagina: home/marketing. */
  largura?: keyof typeof LARGURAS;
  className?: string;
}

/** Padroniza o espaçamento horizontal de todas as páginas (alinhado ao header/footer). */
export function PageContainer({
  children,
  largura = "padrao",
  className,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 py-10 text-left sm:px-6",
        LARGURAS[largura],
        className,
      )}
    >
      {children}
    </div>
  );
}
