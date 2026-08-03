import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TipoResponsavel } from "@/lib/types";

interface PessoaForm {
  nomeCompleto: string;
  qualidade: TipoResponsavel;
  cedulaIdentidade: string;
  expedidoPor: string;
  cpf: string;
  endereco: string;
  cidade: string;
  uf: string;
  telefone: string;
}

interface AcompanhanteForm {
  nomeCompleto: string;
  cedulaIdentidade: string;
  expedidoPor: string;
  cpf: string;
  endereco: string;
  cidade: string;
  uf: string;
  telefone: string;
}

interface MenorForm {
  nomeCompleto: string;
  dataNascimento: string;
  naturalidade: string;
  cedulaIdentidade: string;
  cpf: string;
}

const PESSOA_VAZIA: PessoaForm = {
  nomeCompleto: "",
  qualidade: "MAE",
  cedulaIdentidade: "",
  expedidoPor: "",
  cpf: "",
  endereco: "",
  cidade: "",
  uf: "",
  telefone: "",
};

const ACOMPANHANTE_VAZIO: AcompanhanteForm = {
  nomeCompleto: "",
  cedulaIdentidade: "",
  expedidoPor: "",
  cpf: "",
  endereco: "",
  cidade: "",
  uf: "",
  telefone: "",
};

const MENOR_VAZIO: MenorForm = {
  nomeCompleto: "",
  dataNascimento: "",
  naturalidade: "",
  cedulaIdentidade: "",
  cpf: "",
};

const QUALIDADE_LABEL: Record<TipoResponsavel, string> = {
  MAE: "Mãe",
  PAI: "Pai",
  TUTOR: "Tutor(a)",
  GUARDIAO: "Guardião(ã)",
};

function formatarData(iso: string): string {
  if (!iso) return "____/____/______";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

function PessoaCampos({
  valor,
  onChange,
  titulo,
}: {
  valor: PessoaForm;
  onChange: (v: PessoaForm) => void;
  titulo: string;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-medium">{titulo}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Nome completo</Label>
          <Input
            value={valor.nomeCompleto}
            onChange={(e) => onChange({ ...valor, nomeCompleto: e.target.value })}
          />
        </div>
        <div>
          <Label>Qualidade</Label>
          <Select
            value={valor.qualidade}
            onValueChange={(v) => onChange({ ...valor, qualidade: v as TipoResponsavel })}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(QUALIDADE_LABEL) as TipoResponsavel[]).map((q) => (
                <SelectItem key={q} value={q}>
                  {QUALIDADE_LABEL[q]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>CPF</Label>
          <Input value={valor.cpf} onChange={(e) => onChange({ ...valor, cpf: e.target.value })} />
        </div>
        <div>
          <Label>Cédula de identidade (RG)</Label>
          <Input
            value={valor.cedulaIdentidade}
            onChange={(e) => onChange({ ...valor, cedulaIdentidade: e.target.value })}
          />
        </div>
        <div>
          <Label>Expedida por</Label>
          <Input
            value={valor.expedidoPor}
            onChange={(e) => onChange({ ...valor, expedidoPor: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Endereço de domicílio</Label>
          <Input
            value={valor.endereco}
            onChange={(e) => onChange({ ...valor, endereco: e.target.value })}
          />
        </div>
        <div>
          <Label>Cidade</Label>
          <Input value={valor.cidade} onChange={(e) => onChange({ ...valor, cidade: e.target.value })} />
        </div>
        <div>
          <Label>UF</Label>
          <Input value={valor.uf} onChange={(e) => onChange({ ...valor, uf: e.target.value })} />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input
            value={valor.telefone}
            onChange={(e) => onChange({ ...valor, telefone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function AcompanhanteCampos({
  valor,
  onChange,
}: {
  valor: AcompanhanteForm;
  onChange: (v: AcompanhanteForm) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-medium">Pessoa que vai acompanhar</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Nome completo</Label>
          <Input
            value={valor.nomeCompleto}
            onChange={(e) => onChange({ ...valor, nomeCompleto: e.target.value })}
          />
        </div>
        <div>
          <Label>CPF</Label>
          <Input value={valor.cpf} onChange={(e) => onChange({ ...valor, cpf: e.target.value })} />
        </div>
        <div>
          <Label>Cédula de identidade (RG)</Label>
          <Input
            value={valor.cedulaIdentidade}
            onChange={(e) => onChange({ ...valor, cedulaIdentidade: e.target.value })}
          />
        </div>
        <div>
          <Label>Expedida por</Label>
          <Input
            value={valor.expedidoPor}
            onChange={(e) => onChange({ ...valor, expedidoPor: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label>Endereço de domicílio</Label>
          <Input
            value={valor.endereco}
            onChange={(e) => onChange({ ...valor, endereco: e.target.value })}
          />
        </div>
        <div>
          <Label>Cidade</Label>
          <Input value={valor.cidade} onChange={(e) => onChange({ ...valor, cidade: e.target.value })} />
        </div>
        <div>
          <Label>UF</Label>
          <Input value={valor.uf} onChange={(e) => onChange({ ...valor, uf: e.target.value })} />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input
            value={valor.telefone}
            onChange={(e) => onChange({ ...valor, telefone: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export function ExtrajudicialPage() {
  const location = useLocation() as { state?: { acompanhado?: boolean } };

  const [acompanhado, setAcompanhado] = useState(
    location.state?.acompanhado ?? true,
  );
  const [temSegundoResponsavel, setTemSegundoResponsavel] = useState(false);
  const [responsavel1, setResponsavel1] = useState<PessoaForm>(PESSOA_VAZIA);
  const [responsavel2, setResponsavel2] = useState<PessoaForm>({
    ...PESSOA_VAZIA,
    qualidade: "PAI",
  });
  const [menor, setMenor] = useState<MenorForm>(MENOR_VAZIO);
  const [acompanhante, setAcompanhante] = useState<AcompanhanteForm>(
    ACOMPANHANTE_VAZIO,
  );
  const [validoAte, setValidoAte] = useState("");
  const [local, setLocal] = useState("Boa Vista");
  const [dataAssinatura, setDataAssinatura] = useState("");
  const [modo, setModo] = useState<"form" | "previa">("form");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-left print:max-w-none print:px-0 print:py-0">
      <header className="mb-8 print:hidden">
        <h1 className="text-3xl font-semibold tracking-tight">
          Autorização de viagem — documento extrajudicial
        </h1>
        <p className="mt-2 text-muted-foreground">
          Preencha os dados abaixo para gerar o modelo de autorização
          (Resolução CNJ nº 295/2019). O documento só terá validade depois de
          impresso, assinado e com a firma reconhecida em cartório (por
          semelhança ou autenticidade).
        </p>
        <Button asChild variant="link" className="mt-2 px-0">
          <Link to="/triagem">← Voltar para a triagem</Link>
        </Button>
      </header>

      {modo === "form" && (
        <div className="space-y-4 print:hidden">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Como a criança/adolescente vai viajar?
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button
                variant={acompanhado ? "default" : "outline"}
                onClick={() => setAcompanhado(true)}
              >
                Acompanhada(o) de outra pessoa
              </Button>
              <Button
                variant={!acompanhado ? "default" : "outline"}
                onClick={() => setAcompanhado(false)}
              >
                Desacompanhada(o)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quem autoriza</CardTitle>
              <CardDescription>
                Informe os dados de quem está autorizando a viagem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PessoaCampos
                titulo="Responsável 1"
                valor={responsavel1}
                onChange={setResponsavel1}
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={temSegundoResponsavel}
                  onChange={(e) => setTemSegundoResponsavel(e.target.checked)}
                />
                Autorização conjunta (mãe e pai assinando juntos)
              </label>

              {temSegundoResponsavel && (
                <PessoaCampos
                  titulo="Responsável 2"
                  valor={responsavel2}
                  onChange={setResponsavel2}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Criança ou adolescente
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Nome completo</Label>
                <Input
                  value={menor.nomeCompleto}
                  onChange={(e) =>
                    setMenor({ ...menor, nomeCompleto: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Data de nascimento</Label>
                <Input
                  type="date"
                  value={menor.dataNascimento}
                  onChange={(e) =>
                    setMenor({ ...menor, dataNascimento: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Naturalidade</Label>
                <Input
                  value={menor.naturalidade}
                  onChange={(e) =>
                    setMenor({ ...menor, naturalidade: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Cédula de identidade / Certidão</Label>
                <Input
                  value={menor.cedulaIdentidade}
                  onChange={(e) =>
                    setMenor({ ...menor, cedulaIdentidade: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>CPF (se houver)</Label>
                <Input
                  value={menor.cpf}
                  onChange={(e) => setMenor({ ...menor, cpf: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {acompanhado && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Acompanhante</CardTitle>
              </CardHeader>
              <CardContent>
                <AcompanhanteCampos
                  valor={acompanhante}
                  onChange={setAcompanhante}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Validade e assinatura</CardTitle>
              <CardDescription>
                Se não informar o prazo, a Resolução presume validade de 2
                anos — mas é melhor deixar explícito.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label>Válida até</Label>
                <Input
                  type="date"
                  value={validoAte}
                  onChange={(e) => setValidoAte(e.target.value)}
                />
              </div>
              <div>
                <Label>Local da assinatura</Label>
                <Input value={local} onChange={(e) => setLocal(e.target.value)} />
              </div>
              <div>
                <Label>Data da assinatura</Label>
                <Input
                  type="date"
                  value={dataAssinatura}
                  onChange={(e) => setDataAssinatura(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={() => setModo("previa")}>Gerar documento</Button>
        </div>
      )}

      {modo === "previa" && (
        <div className="space-y-4">
          <div className="flex gap-3 print:hidden">
            <Button variant="outline" onClick={() => setModo("form")}>
              Voltar e editar
            </Button>
            <Button className="gap-2" onClick={() => window.print()}>
              <Printer className="size-4" /> Imprimir / salvar PDF
            </Button>
          </div>

          <div className="rounded-lg border bg-card p-8 text-sm leading-relaxed print:border-none print:p-0 print:shadow-none">
            <p className="mb-4 rounded bg-amber-100 p-2 text-xs font-medium text-amber-900 print:hidden">
              Rascunho — este documento só tem validade depois de assinado e
              com a firma reconhecida em cartório (por semelhança ou
              autenticidade).
            </p>

            <p className="text-center font-bold">
              FORMULÁRIO DE AUTORIZAÇÃO DE VIAGEM NACIONAL
            </p>
            <p className="mb-4 text-center">
              PARA CRIANÇAS OU ADOLESCENTES — Res. nº 295/2019 - CNJ
            </p>
            <p className="mb-4">
              Válida até {validoAte ? formatarData(validoAte) : "____/____/______"}
            </p>

            <p className="mb-2">
              Eu, {responsavel1.nomeCompleto || "________________________"},
              Cédula de Identidade nº {responsavel1.cedulaIdentidade || "____"},
              expedida pela {responsavel1.expedidoPor || "____"}, CPF nº{" "}
              {responsavel1.cpf || "____"}, com endereço em{" "}
              {responsavel1.endereco || "____"}, {responsavel1.cidade || "____"}
              /{responsavel1.uf || "__"}, telefone {responsavel1.telefone || "____"}
              , na qualidade de {QUALIDADE_LABEL[responsavel1.qualidade]}
              {temSegundoResponsavel && (
                <>
                  {" "}
                  e eu, {responsavel2.nomeCompleto || "________________________"},
                  Cédula de Identidade nº {responsavel2.cedulaIdentidade || "____"},
                  expedida pela {responsavel2.expedidoPor || "____"}, CPF nº{" "}
                  {responsavel2.cpf || "____"}, com endereço em{" "}
                  {responsavel2.endereco || "____"}, {responsavel2.cidade || "____"}
                  /{responsavel2.uf || "__"}, telefone{" "}
                  {responsavel2.telefone || "____"}, na qualidade de{" "}
                  {QUALIDADE_LABEL[responsavel2.qualidade]}
                </>
              )}
              , {temSegundoResponsavel ? "AUTORIZAMOS" : "AUTORIZO"} a circular
              livremente, dentro do território nacional,{" "}
              {!acompanhado && "desacompanhada(o)"}
            </p>

            <p className="mb-2 font-medium">
              {menor.nomeCompleto || "________________________"}, nascida(o) em{" "}
              {menor.dataNascimento ? formatarData(menor.dataNascimento) : "____"},
              natural de {menor.naturalidade || "____"}, Cédula de Identidade nº{" "}
              {menor.cedulaIdentidade || "____"}
              {menor.cpf && <>, CPF nº {menor.cpf}</>}
            </p>

            {acompanhado && (
              <p className="mb-2">
                DESDE QUE ACOMPANHADA(O) DE{" "}
                {acompanhante.nomeCompleto || "________________________"},
                Cédula de Identidade nº {acompanhante.cedulaIdentidade || "____"}
                , expedida pela {acompanhante.expedidoPor || "____"}, CPF nº{" "}
                {acompanhante.cpf || "____"}, com endereço em{" "}
                {acompanhante.endereco || "____"}, {acompanhante.cidade || "____"}
                /{acompanhante.uf || "__"}, telefone{" "}
                {acompanhante.telefone || "____"}.
              </p>
            )}

            <p className="mt-8">
              {local || "______________"},{" "}
              {dataAssinatura ? formatarData(dataAssinatura) : "____/____/______"}
              .
            </p>

            <div className="mt-10 space-y-6">
              <div className="border-t pt-1 text-center">
                Assinatura — {QUALIDADE_LABEL[responsavel1.qualidade]}
              </div>
              {temSegundoResponsavel && (
                <div className="border-t pt-1 text-center">
                  Assinatura — {QUALIDADE_LABEL[responsavel2.qualidade]}
                </div>
              )}
              <p className="text-center text-xs text-muted-foreground print:text-black">
                (Reconhecer firma por semelhança ou autenticidade)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
