import { useId, useRef, type ComponentProps, type KeyboardEvent } from "react";
import { CircleIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface OpcaoRadio<T extends string> {
  valor: T;
  rotulo: string;
  descricao?: string;
}

interface OpcoesRadioProps<T extends string>
  extends Omit<ComponentProps<"div">, "onChange" | "defaultValue"> {
  opcoes: readonly OpcaoRadio<T>[];
  value: T;
  onValueChange: (valor: T) => void;
}

/**
 * Cartões de escolha mutuamente exclusiva.
 * Cada cartão é um stop de Tab (esquerda → direita na grade). Clique,
 * Space ou Enter seleciona. Setas também movem o foco e a escolha.
 */
export function OpcoesRadio<T extends string>({
  opcoes,
  value,
  onValueChange,
  className,
  ...props
}: OpcoesRadioProps<T>) {
  const id = useId();
  const grupoRef = useRef<HTMLDivElement>(null);

  function focarIndice(indice: number) {
    const botoes = grupoRef.current?.querySelectorAll<HTMLButtonElement>(
      "[role=radio]",
    );
    botoes?.[indice]?.focus();
  }

  function aoTecla(evento: KeyboardEvent<HTMLButtonElement>, indice: number) {
    if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
    evento.preventDefault();
    const delta = evento.key === "ArrowRight" ? 1 : -1;
    const proximo = (indice + delta + opcoes.length) % opcoes.length;
    onValueChange(opcoes[proximo].valor);
    requestAnimationFrame(() => focarIndice(proximo));
  }

  return (
    <div
      ref={grupoRef}
      role="radiogroup"
      data-slot="radio-group"
      className={cn("grid grid-cols-2 gap-2", className)}
      {...props}
    >
      {opcoes.map((opcao, indice) => {
        const itemId = `${id}-${opcao.valor}`;
        const selecionado = value === opcao.valor;
        return (
          <button
            key={opcao.valor}
            type="button"
            role="radio"
            aria-checked={selecionado}
            aria-labelledby={`${itemId}-titulo`}
            aria-describedby={
              opcao.descricao ? `${itemId}-descricao` : undefined
            }
            data-state={selecionado ? "checked" : "unchecked"}
            tabIndex={0}
            onClick={() => onValueChange(opcao.valor)}
            onKeyDown={(evento) => aoTecla(evento, indice)}
            className={cn(
              "flex w-full cursor-pointer flex-col rounded-md border bg-card text-left leading-snug transition-[color,background-color,box-shadow] hover:bg-muted/50",
              "[&>[data-slot=field]]:p-4",
              "data-[state=checked]:border-primary data-[state=checked]:bg-primary/5 dark:data-[state=checked]:bg-primary/10",
              "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              !opcao.descricao && "[&>[data-slot=field]]:px-3 [&>[data-slot=field]]:py-2.5",
            )}
          >
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle id={`${itemId}-titulo`}>{opcao.rotulo}</FieldTitle>
                {opcao.descricao && (
                  <FieldDescription id={`${itemId}-descricao`}>
                    {opcao.descricao}
                  </FieldDescription>
                )}
              </FieldContent>
              <span
                aria-hidden
                className={cn(
                  "mt-px inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-input",
                  selecionado && "border-primary",
                )}
              >
                {selecionado && (
                  <CircleIcon className="size-2.5 fill-primary text-primary" />
                )}
              </span>
            </Field>
          </button>
        );
      })}
    </div>
  );
}
