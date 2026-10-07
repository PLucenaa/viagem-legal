import { Link } from "react-router-dom";
import { Bell, FileCheck2, Inbox } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ContagemPainelResponse } from "@/lib/types";

/**
 * Sino do header: quantos pedidos pedem ação da equipe agora — recebidos
 * que ninguém assumiu + correções que o cidadão já respondeu.
 */
export function NotificacoesPainel({ contagem }: { contagem: ContagemPainelResponse | null }) {
  const recebidos = contagem?.porStatus.RECEBIDA ?? 0;
  const correcoes = contagem?.correcoesRecebidas ?? 0;
  const total = recebidos + correcoes;

  const descricao =
    total === 0
      ? "Notificações: nada pendente"
      : `Notificações: ${total} ${total === 1 ? "pedido pede" : "pedidos pedem"} atenção`;

  return (
    // modal={false}: é um menu de navegação; não precisa esconder a página
    // inteira do leitor de tela enquanto está aberto.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={descricao}
        className="relative inline-flex size-10 items-center justify-center rounded-full text-paper/85 transition hover:bg-paper/10 hover:text-paper"
      >
        <Bell className="size-5" aria-hidden />
        {total > 0 && (
          <span
            aria-hidden
            className="absolute top-1 right-1 flex min-w-4.5 items-center justify-center rounded-full bg-estrada px-1 text-[10px] leading-4.5 font-semibold text-paper tabular-nums ring-2 ring-ink"
          >
            {total > 9 ? "9+" : total}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Pedem atenção</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {total === 0 ? (
          <p className="px-2 py-3 text-sm text-muted-foreground">
            Nada pendente agora. Novos pedidos e correções aparecem aqui.
          </p>
        ) : (
          <>
            {recebidos > 0 && (
              <DropdownMenuItem asChild>
                <Link to="/painel?aba=recebidas" className="items-start gap-3 py-2">
                  <Inbox className="mt-0.5 size-4 text-muted-foreground" aria-hidden />
                  <span className="grid gap-0.5">
                    <span className="font-medium">
                      {recebidos === 1 ? "1 pedido novo" : `${recebidos} pedidos novos`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Recebidos e ainda sem responsável
                    </span>
                  </span>
                </Link>
              </DropdownMenuItem>
            )}
            {correcoes > 0 && (
              <DropdownMenuItem asChild>
                <Link to="/painel?aba=correcao" className="items-start gap-3 py-2">
                  <FileCheck2 className="mt-0.5 size-4 text-rio" aria-hidden />
                  <span className="grid gap-0.5">
                    <span className="font-medium">
                      {correcoes === 1 ? "1 correção recebida" : `${correcoes} correções recebidas`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      O cidadão enviou o que faltava
                    </span>
                  </span>
                </Link>
              </DropdownMenuItem>
            )}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/painel">Abrir a fila</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
