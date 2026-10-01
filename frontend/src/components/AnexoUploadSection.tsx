import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Campo } from "@/components/form/Campo";
import { UploadArquivo } from "@/components/form/UploadArquivo";
import { anexoUrl, ApiError, enviarAnexoPorProtocolo } from "@/lib/api";
import { TIPO_ANEXO_LABEL } from "@/lib/tipoAnexo";
import type { AnexoResponse, TipoAnexo } from "@/lib/types";

interface AnexoUploadSectionProps {
  protocolo: string;
  anexos: AnexoResponse[];
  podeEnviar: boolean;
  onEnviado: (anexos: AnexoResponse[]) => void;
}

export function AnexoUploadSection({
  protocolo,
  anexos,
  podeEnviar,
  onEnviado,
}: AnexoUploadSectionProps) {
  const [tipoAnexo, setTipoAnexo] = useState<TipoAnexo>("DOC_REQUERENTE");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    if (!arquivo) return;
    setEnviando(true);
    try {
      const atualizado = await enviarAnexoPorProtocolo(
        protocolo,
        tipoAnexo,
        arquivo,
      );
      onEnviado(atualizado.anexos);
      setArquivo(null);
      toast.success("Documento enviado.");
    } catch (e) {
      toast.error(
        e instanceof ApiError ? e.message : "Não foi possível enviar o anexo.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Documentos enviados ({anexos.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {anexos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum documento enviado ainda.
          </p>
        ) : (
          <ul className="space-y-1 text-sm">
            {anexos.map((a) => (
              <li key={a.id} className="flex justify-between gap-2">
                <a
                  href={anexoUrl(a.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  {TIPO_ANEXO_LABEL[a.tipo]} — {a.nomeArquivo}
                </a>
                <span className="text-muted-foreground">
                  {(a.tamanhoBytes / 1024).toFixed(0)} KB
                </span>
              </li>
            ))}
          </ul>
        )}

        {podeEnviar && (
          <div className="grid gap-5 border-t pt-5">
            <Campo rotulo="Tipo de documento" className="sm:max-w-sm">
              {(id) => (
                <Select
                  value={tipoAnexo}
                  onValueChange={(v) => setTipoAnexo(v as TipoAnexo)}
                >
                  <SelectTrigger id={id} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(TIPO_ANEXO_LABEL) as TipoAnexo[]).map((t) => (
                      <SelectItem key={t} value={t}>
                        {TIPO_ANEXO_LABEL[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Campo>
            <UploadArquivo
              rotulo={TIPO_ANEXO_LABEL[tipoAnexo]}
              arquivo={arquivo}
              onSelecionar={setArquivo}
              onRemover={() => setArquivo(null)}
            />
            {arquivo && (
              <Button className="justify-self-end" disabled={enviando} onClick={enviar}>
                {enviando ? "Enviando..." : "Enviar documento"}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
