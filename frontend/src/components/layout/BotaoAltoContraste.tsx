import { Contrast } from "lucide-react";
import { useAcessibilidade } from "@/lib/useAcessibilidade";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Só o ícone — usado no header mobile, ao lado do menu. */
  compacto?: boolean;
};

export function BotaoAltoContraste({ className, compacto = false }: Props) {
  const { contraste, toggleContraste } = useAcessibilidade();

  return (
    <button
      type="button"
      onClick={toggleContraste}
      aria-pressed={contraste}
      aria-label="Alternar alto contraste"
      title="Alto contraste"
      className={cn(
        compacto
          ? "inline-flex size-10 items-center justify-center rounded-md text-paper transition hover:bg-paper/10"
          : "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide text-paper/80 uppercase transition hover:bg-paper/10 hover:text-paper",
        className,
      )}
    >
      <Contrast className={compacto ? "size-5" : "size-3.5"} aria-hidden />
      {!compacto && <span>Contraste</span>}
    </button>
  );
}
