import { useId, type ReactNode } from "react";
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface CampoProps {
  rotulo: string;
  dica?: ReactNode;
  className?: string;
  /** Recebe o id que o controle deve usar, pra ligar o rótulo a ele. */
  children: (id: string) => ReactNode;
}

/**
 * Rótulo + controle + dica (Field do shadcn), pros formulários sem
 * react-hook-form — com ele, use FormItem/FormLabel.
 *
 *   <Campo rotulo="CPF">{(id) => <Input id={id} ... />}</Campo>
 */
export function Campo({ rotulo, dica, className, children }: CampoProps) {
  const id = useId();
  return (
    <Field className={cn("gap-2", className)}>
      <FieldLabel htmlFor={id}>{rotulo}</FieldLabel>
      {children(id)}
      {dica && <FieldDescription className="text-xs">{dica}</FieldDescription>}
    </Field>
  );
}

interface GrupoCampoProps {
  rotulo: string;
  className?: string;
  children: ReactNode;
}

/** Grupo de opções (radio) com legenda: FieldSet + FieldLegend do shadcn. */
export function GrupoCampo({ rotulo, className, children }: GrupoCampoProps) {
  return (
    <FieldSet className={className}>
      <FieldLegend variant="label" className="mb-2">
        {rotulo}
      </FieldLegend>
      {children}
    </FieldSet>
  );
}
