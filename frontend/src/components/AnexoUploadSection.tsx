import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { anexoUrl, ApiError, enviarAnexoPorProtocolo } from "@/lib/api";
import { ANEXO_ACCEPT, ANEXO_DICA, TIPO_ANEXO_LABEL, validarAnexo } from "@/lib/tipoAnexo";
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
          <div className="grid gap-3 border-t pt-4 sm:grid-cols-[1fr_1fr_auto]">
            <div>
              <Label>Tipo de documento</Label>
              <Select
                value={tipoAnexo}
                onValueChange={(v) => setTipoAnexo(v as TipoAnexo)}
              >
                <SelectTrigger className="w-full">
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
            </div>
            <div>
              <Label>Arquivo</Label>
              <Input
                type="file"
                accept={ANEXO_ACCEPT}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) {
                    setArquivo(null);
                    return;
                  }
                  const erro = validarAnexo(f);
                  if (erro) {
                    toast.error(erro);
                    e.target.value = "";
                    setArquivo(null);
                    return;
                  }
                  setArquivo(f);
                }}
              />
              <p className="mt-1 text-xs text-muted-foreground">{ANEXO_DICA}</p>
            </div>
            <div className="flex items-end">
              <Button disabled={!arquivo || enviando} onClick={enviar}>
                {enviando ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
