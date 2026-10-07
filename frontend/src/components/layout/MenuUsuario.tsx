import { Link } from "react-router-dom";
import { LayoutList, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UsuarioInterno } from "@/lib/auth";

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

/** Nome, papel e avatar do analista no header; o "Sair" fica dentro do menu. */
export function MenuUsuario({ usuario, onSair }: { usuario: UsuarioInterno; onSair: () => void }) {
  const papel = usuario.roles.includes("ADMIN") ? "Administrador(a)" : "Analista";

  return (
    // modal={false}: é um menu de navegação; não precisa esconder a página
    // inteira do leitor de tela enquanto está aberto.
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        aria-label={`Menu de ${usuario.nome}`}
        className="flex items-center gap-3 rounded-full py-1 pr-1 pl-3 text-left transition hover:bg-paper/10"
      >
        <span className="hidden min-w-0 xl:grid">
          <span className="max-w-40 truncate text-sm font-semibold text-paper 2xl:max-w-64">{usuario.nome}</span>
          <span className="text-[11px] text-paper/65">{papel}</span>
        </span>
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-paper/30 bg-paper/15 text-sm font-semibold text-paper"
        >
          {iniciais(usuario.nome)}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="grid gap-0.5">
          <span className="truncate">{usuario.nome}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {usuario.email ?? papel}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/painel">
            <LayoutList className="size-4" aria-hidden />
            Fila de pedidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/painel?aba=aberto&minhas=1">
            <LayoutList className="size-4" aria-hidden />
            Meus pedidos
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={onSair}>
          <LogOut className="size-4" aria-hidden />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
