import { useId, useRef, useState, type DragEvent } from "react";
import { FileCheck2, Paperclip, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ANEXO_ACCEPT, ANEXO_DICA, validarAnexo } from "@/lib/tipoAnexo";
import { cn } from "@/lib/utils";

interface UploadArquivoProps {
  /** O que deve ser anexado (ex.: "Foto/cópia do documento do menor"). */
  rotulo: string;
  /** Arquivo já escolhido; null mostra a área de envio. */
  arquivo: File | null;
  onSelecionar: (arquivo: File) => void;
  /** Sem isso, o cartão do arquivo escolhido não mostra o botão "Remover". */
  onRemover?: () => void;
  className?: string;
}

function formatarTamanho(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

/**
 * Área de envio de arquivo (estado vazio do shadcn): aceita clicar em
 * "Escolher arquivo" ou arrastar e soltar. O <input type="file"> fica
 * escondido e fora do Tab — quem recebe o foco é o botão, que abre o seletor.
 */
export function UploadArquivo({
  rotulo,
  arquivo,
  onSelecionar,
  onRemover,
  className,
}: UploadArquivoProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [arrastando, setArrastando] = useState(false);

  function receber(f: File | undefined) {
    if (!f) return;
    const erro = validarAnexo(f);
    if (erro) {
      toast.error(erro);
      return;
    }
    onSelecionar(f);
  }

  function aoSoltar(e: DragEvent) {
    e.preventDefault();
    setArrastando(false);
    receber(e.dataTransfer.files?.[0]);
  }

  const input = (
    <input
      ref={inputRef}
      id={`${id}-input`}
      type="file"
      accept={ANEXO_ACCEPT}
      className="sr-only"
      tabIndex={-1}
      aria-labelledby={`${id}-titulo`}
      onChange={(e) => {
        receber(e.target.files?.[0]);
        // Permite escolher o mesmo arquivo de novo depois de remover.
        e.target.value = "";
      }}
    />
  );

  if (arquivo) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 p-3",
          className,
        )}
      >
        <FileCheck2 className="size-5 shrink-0 text-primary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p id={`${id}-titulo`} className="text-xs text-muted-foreground">
            {rotulo}
          </p>
          <p className="truncate text-sm font-medium" title={arquivo.name}>
            {arquivo.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatarTamanho(arquivo.size)}
          </p>
        </div>
        {input}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Trocar arquivo: ${rotulo}`}
          onClick={() => inputRef.current?.click()}
        >
          Trocar
        </Button>
        {onRemover && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label={`Remover arquivo: ${rotulo}`}
            onClick={onRemover}
          >
            Remover
          </Button>
        )}
      </div>
    );
  }

  return (
    <Empty
      className={cn(
        "gap-4 border border-input bg-card/60 p-5 transition-colors md:p-6",
        arrastando && "border-primary bg-primary/5",
        className,
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setArrastando(true);
      }}
      onDragLeave={() => setArrastando(false)}
      onDrop={aoSoltar}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Upload aria-hidden />
        </EmptyMedia>
        <EmptyTitle id={`${id}-titulo`} className="text-base">
          {rotulo}
        </EmptyTitle>
        <EmptyDescription>
          Arraste o arquivo para cá ou escolha no seu dispositivo.
          <br />
          {ANEXO_DICA}.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {input}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label={`Escolher arquivo: ${rotulo}`}
          onClick={() => inputRef.current?.click()}
        >
          <Paperclip className="size-4" aria-hidden />
          Escolher arquivo
        </Button>
      </EmptyContent>
    </Empty>
  );
}
