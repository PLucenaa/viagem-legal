import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Container de todas as páginas — mesma largura máxima e mesmo respiro
 * lateral do header e do footer (max-w-7xl + px-4/sm:px-6), pra o conteúdo
 * começar e terminar alinhado com a logo e o menu.
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-10 text-left sm:px-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
