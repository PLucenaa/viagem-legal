import { Fragment, type ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface PassoTrilha {
  rotulo: string;
  to: string;
}

interface PageHeaderProps {
  titulo: ReactNode;
  descricao?: ReactNode;
  /** Nome curto da página atual, último item da trilha. */
  atual: string;
  /** Páginas entre "Início" e a atual (Início entra sempre). */
  trilha?: PassoTrilha[];
  /** Centraliza título e descrição (a trilha fica sempre à esquerda). */
  centralizado?: boolean;
  /** Algo ao lado do título, ex.: o badge de status. */
  children?: ReactNode;
  className?: string;
}

/**
 * Cabeçalho padrão das páginas: trilha de navegação (substitui os antigos
 * "← Voltar", que diziam pouco e apareciam cada um num lugar) + título +
 * descrição.
 */
export function PageHeader({
  titulo,
  descricao,
  atual,
  trilha = [],
  centralizado = false,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-8 print:hidden", className)}>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Início</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {trilha.map((passo) => (
            <Fragment key={passo.to}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={passo.to}>{passo.rotulo}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{atual}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className={cn(centralizado && "mx-auto max-w-2xl text-center")}>
        <div
          className={cn(
            "flex flex-wrap items-center gap-3",
            centralizado && "justify-center",
          )}
        >
          <h1 className="font-display text-3xl font-semibold tracking-tight text-balance">
            {titulo}
          </h1>
          {children}
        </div>
        {descricao && (
          <p
            className={cn(
              "mt-2 max-w-prose text-pretty text-muted-foreground",
              centralizado && "mx-auto",
            )}
          >
            {descricao}
          </p>
        )}
      </div>
    </header>
  );
}
