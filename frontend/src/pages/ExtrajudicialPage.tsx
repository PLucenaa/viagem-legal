import { useState } from "react";
import { useLocation } from "react-router-dom";
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
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Campo, GrupoCampo } from "@/components/form/Campo";
import { InputMascara } from "@/components/form/InputMascara";
import { OpcoesRadio } from "@/components/form/OpcoesRadio";
import { mascaraCpf, mascaraTelefone, mascaraUf } from "@/lib/mascaras";
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

const OPCOES_QUALIDADE = (Object.keys(QUALIDADE_LABEL) as TipoResponsavel[]).map(
  (q) => ({ valor: q, rotulo: QUALIDADE_LABEL[q] }),
);

const OPCOES_ACOMPANHAMENTO = [
  {
    valor: "acompanhado",
    rotulo: "Acompanhada(o) de outra pessoa",
    descricao: "Viaja com um adulto que não é o pai nem a mãe",
  },
  {
    valor: "desacompanhado",
    rotulo: "Desacompanhada(o)",
    descricao: "Viaja sozinha(o)",
  },
] as const;

const GRADE = "grid gap-x-4 gap-y-5 sm:grid-cols-2";

/** Campos de documento/endereço/contato comuns a responsável e acompanhante. */
function DadosPessoais<T extends AcompanhanteForm>({
  valor,
  onChange,
}: {
  valor: T;
  onChange: (v: T) => void;
}) {
  return (
    <>
      <Campo rotulo="CPF">
        {(id) => (
          <InputMascara
            id={id}
            value={valor.cpf}
            onChange={(cpf) => onChange({ ...valor, cpf })}
            mascara={mascaraCpf}
            inputMode="numeric"
            placeholder="000.000.000-00"
          />
        )}
      </Campo>
      <Campo rotulo="Telefone">
        {(id) => (
          <InputMascara
            id={id}
            value={valor.telefone}
            onChange={(telefone) => onChange({ ...valor, telefone })}
            mascara={mascaraTelefone}
            inputMode="tel"
            placeholder="(95) 99999-9999"
          />
        )}
      </Campo>
      <Campo rotulo="Cédula de identidade (RG)">
        {(id) => (
          <Input
            id={id}
            value={valor.cedulaIdentidade}
            onChange={(e) => onChange({ ...valor, cedulaIdentidade: e.target.value })}
          />
        )}
      </Campo>
      <Campo rotulo="Expedida por">
        {(id) => (
          <Input
            id={id}
            value={valor.expedidoPor}
            placeholder="Ex.: SSP/RR"
            onChange={(e) => onChange({ ...valor, expedidoPor: e.target.value })}
          />
        )}
      </Campo>
      <Campo rotulo="Endereço de domicílio" className="sm:col-span-2">
        {(id) => (
          <Input
            id={id}
            value={valor.endereco}
            placeholder="Rua, número, bairro"
            onChange={(e) => onChange({ ...valor, endereco: e.target.value })}
          />
        )}
      </Campo>
      <div className="grid grid-cols-[1fr_5rem] gap-x-4 sm:col-span-2 sm:grid-cols-[1fr_8rem]">
        <Campo rotulo="Cidade">
          {(id) => (
            <Input
              id={id}
              value={valor.cidade}
              onChange={(e) => onChange({ ...valor, cidade: e.target.value })}
            />
          )}
        </Campo>
        <Campo rotulo="UF">
          {(id) => (
            <InputMascara
              id={id}
              value={valor.uf}
              onChange={(uf) => onChange({ ...valor, uf })}
              mascara={mascaraUf}
              placeholder="RR"
            />
          )}
        </Campo>
      </div>
    </>
  );
}

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
    <div className="space-y-5 rounded-lg border p-4 sm:p-5">
      <p className="text-sm font-semibold">{titulo}</p>
      <div className={GRADE}>
        <Campo rotulo="Nome completo" className="sm:col-span-2">
          {(id) => (
            <Input
              id={id}
              value={valor.nomeCompleto}
              onChange={(e) => onChange({ ...valor, nomeCompleto: e.target.value })}
            />
          )}
        </Campo>
        <GrupoCampo rotulo="Qualidade" className="sm:col-span-2">
          <OpcoesRadio
            opcoes={OPCOES_QUALIDADE}
            value={valor.qualidade}
            onValueChange={(qualidade) => onChange({ ...valor, qualidade })}
            className="sm:grid-cols-4"
          />
        </GrupoCampo>
        <DadosPessoais valor={valor} onChange={onChange} />
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
    <div className={GRADE}>
      <Campo rotulo="Nome completo" className="sm:col-span-2">
        {(id) => (
          <Input
            id={id}
            value={valor.nomeCompleto}
            onChange={(e) => onChange({ ...valor, nomeCompleto: e.target.value })}
          />
        )}
      </Campo>
      <DadosPessoais valor={valor} onChange={onChange} />
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
    <PageContainer className="print:max-w-none print:px-0 print:py-0">
      <PageHeader
        trilha={[{ rotulo: "Preciso de autorização?", to: "/triagem" }]}
        atual="Documento extrajudicial"
        titulo="Autorização de viagem — documento extrajudicial"
        descricao="Preencha os dados abaixo para gerar o modelo de autorização (Resolução CNJ nº 295/2019). O documento só terá validade depois de impresso, assinado e com a firma reconhecida em cartório (por semelhança ou autenticidade)."
      />

      {modo === "form" && (
        <div className="space-y-6 print:hidden">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Como a criança/adolescente vai viajar?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OpcoesRadio
                aria-label="Como a criança/adolescente vai viajar"
                opcoes={OPCOES_ACOMPANHAMENTO}
                value={acompanhado ? "acompanhado" : "desacompanhado"}
                onValueChange={(v) => setAcompanhado(v === "acompanhado")}
                className="grid-cols-1 sm:grid-cols-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quem autoriza</CardTitle>
              <CardDescription>
                Informe os dados de quem está autorizando a viagem.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <PessoaCampos
                titulo="Responsável 1"
                valor={responsavel1}
                onChange={setResponsavel1}
              />

              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
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
            <CardContent className={GRADE}>
              <Campo rotulo="Nome completo" className="sm:col-span-2">
                {(id) => (
                  <Input
                    id={id}
                    value={menor.nomeCompleto}
                    onChange={(e) =>
                      setMenor({ ...menor, nomeCompleto: e.target.value })
                    }
                  />
                )}
              </Campo>
              <Campo rotulo="Data de nascimento">
                {(id) => (
                  <Input
                    id={id}
                    type="date"
                    value={menor.dataNascimento}
                    onChange={(e) =>
                      setMenor({ ...menor, dataNascimento: e.target.value })
                    }
                  />
                )}
              </Campo>
              <Campo rotulo="Naturalidade">
                {(id) => (
                  <Input
                    id={id}
                    value={menor.naturalidade}
                    placeholder="Ex.: Boa Vista/RR"
                    onChange={(e) =>
                      setMenor({ ...menor, naturalidade: e.target.value })
                    }
                  />
                )}
              </Campo>
              <Campo rotulo="Cédula de identidade / Certidão">
                {(id) => (
                  <Input
                    id={id}
                    value={menor.cedulaIdentidade}
                    onChange={(e) =>
                      setMenor({ ...menor, cedulaIdentidade: e.target.value })
                    }
                  />
                )}
              </Campo>
              <Campo rotulo="CPF (se houver)">
                {(id) => (
                  <InputMascara
                    id={id}
                    value={menor.cpf}
                    onChange={(cpf) => setMenor({ ...menor, cpf })}
                    mascara={mascaraCpf}
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                  />
                )}
              </Campo>
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
            <CardContent className="grid gap-x-4 gap-y-5 sm:grid-cols-3">
              <Campo rotulo="Válida até">
                {(id) => (
                  <Input
                    id={id}
                    type="date"
                    value={validoAte}
                    onChange={(e) => setValidoAte(e.target.value)}
                  />
                )}
              </Campo>
              <Campo rotulo="Local da assinatura">
                {(id) => (
                  <Input id={id} value={local} onChange={(e) => setLocal(e.target.value)} />
                )}
              </Campo>
              <Campo rotulo="Data da assinatura">
                {(id) => (
                  <Input
                    id={id}
                    type="date"
                    value={dataAssinatura}
                    onChange={(e) => setDataAssinatura(e.target.value)}
                  />
                )}
              </Campo>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setModo("previa")}>Gerar documento</Button>
          </div>
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
    </PageContainer>
  );
}
