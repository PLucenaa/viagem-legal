import { useEffect, useState } from "react";
import { contarSolicitacoes } from "@/lib/api";
import type { ContagemPainelResponse } from "@/lib/types";

const INTERVALO_MS = 60_000;

/**
 * Contagem da fila (o que pede atenção), atualizada a cada minuto e ao
 * voltar pra aba do navegador. Só consulta quando `ativo` (analista logado).
 * Falhas são silenciosas: é um indicador, não pode atrapalhar a navegação.
 */
export function useContagemPainel(ativo: boolean): ContagemPainelResponse | null {
  const [contagem, setContagem] = useState<ContagemPainelResponse | null>(null);

  useEffect(() => {
    if (!ativo) return;
    let vivo = true;
    const buscar = () =>
      contarSolicitacoes().then(
        (c) => vivo && setContagem(c),
        () => undefined,
      );
    void buscar();
    const intervalo = setInterval(() => void buscar(), INTERVALO_MS);
    const aoVoltar = () => {
      if (document.visibilityState === "visible") void buscar();
    };
    document.addEventListener("visibilitychange", aoVoltar);
    return () => {
      vivo = false;
      clearInterval(intervalo);
      document.removeEventListener("visibilitychange", aoVoltar);
    };
  }, [ativo]);

  return ativo ? contagem : null;
}
