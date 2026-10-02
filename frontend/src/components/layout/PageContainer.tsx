import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CONTAINER } from "@/lib/layout";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container de todas as páginas — mesma largura máxima e mesmo respiro
 * lateral do header e do footer (CONTAINER, em lib/layout.ts), pra o conteúdo
 * começar e terminar alinhado com a logo e o menu.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        CONTAINER,
        "py-10 text-left",
        className,
      )}
    >
      {children}
    </div>
  );
}
