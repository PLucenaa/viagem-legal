import { useId, type ComponentProps } from "react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export interface OpcaoRadio<T extends string> {
  valor: T;
  rotulo: string;
  descricao?: string;
}

interface OpcoesRadioProps<T extends string>
  extends Omit<ComponentProps<typeof RadioGroup>, "value" | "onValueChange" | "defaultValue"> {
  opcoes: readonly OpcaoRadio<T>[];
  value: T;
  onValueChange: (valor: T) => void;
}

/**
 * Radio em formato de cartões clicáveis (padrão "Choice Card" do shadcn:
 * FieldLabel envolvendo um Field) — pra escolhas curtas e mutuamente
 * exclusivas, onde ver todas as opções de uma vez ajuda mais que um select.
 * O número de colunas vem do className (ex.: "sm:grid-cols-3").
 */
export function OpcoesRadio<T extends string>({
  opcoes,
  value,
  onValueChange,
  className,
  ...props
}: OpcoesRadioProps<T>) {
  const id = useId();
  return (
    <RadioGroup
      value={value}
      onValueChange={(v) => onValueChange(v as T)}
      className={cn("grid-cols-2 gap-2", className)}
      {...props}
    >
      {opcoes.map((opcao) => {
        const itemId = `${id}-${opcao.valor}`;
        return (
          <FieldLabel
            key={opcao.valor}
            htmlFor={itemId}
            className={cn(
              "cursor-pointer bg-card transition-[color,background-color,box-shadow] hover:bg-muted/50",
              // Foco do teclado no cartão inteiro (o radio sozinho é pequeno demais pra ver).
              "has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
              // Opções sem descrição são uma linha só: cartão mais baixo.
              !opcao.descricao && "[&>*]:data-[slot=field]:px-3 [&>*]:data-[slot=field]:py-2.5",
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
              {/* O radio do Radix é um <button>: o nome vem explícito do
                  título, senão o leitor de tela anuncia só "botão de opção". */}
              <RadioGroupItem
                id={itemId}
                value={opcao.valor}
                aria-labelledby={`${itemId}-titulo`}
                aria-describedby={opcao.descricao ? `${itemId}-descricao` : undefined}
              />
            </Field>
          </FieldLabel>
        );
      })}
    </RadioGroup>
  );
}
