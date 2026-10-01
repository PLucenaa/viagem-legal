import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";

interface InputMascaraProps
  extends Omit<ComponentProps<typeof Input>, "onChange" | "value"> {
  value: string | undefined;
  /** Recebe o valor já mascarado (compatível com o field.onChange do react-hook-form). */
  onChange: (valor: string) => void;
  mascara: (valor: string) => string;
}

/** Input que aplica uma máscara (lib/mascaras.ts) a cada digitação. */
export function InputMascara({ value, onChange, mascara, ...props }: InputMascaraProps) {
  return (
    <Input
      {...props}
      value={value ?? ""}
      onChange={(e) => onChange(mascara(e.target.value))}
    />
  );
}
