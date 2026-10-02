import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/** Bloco de dados do pedido (requerente, criança, viagem…). */
export function SecaoDados({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle className="font-display text-lg">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">{children}</dl>
      </CardContent>
    </Card>
  );
}

/** Um par rótulo/valor; some quando não há valor. */
export function Dado({
  rotulo,
  valor,
  largo = false,
}: {
  rotulo: string;
  valor?: ReactNode;
  /** Ocupa as duas colunas (endereço, por exemplo). */
  largo?: boolean;
}) {
  if (valor === undefined || valor === null || valor === "") return null;
  return (
    <div className={cn("grid gap-0.5", largo && "sm:col-span-2")}>
      <dt className="text-xs text-muted-foreground">{rotulo}</dt>
      <dd className="text-sm break-words">{valor}</dd>
    </div>
  );
}
